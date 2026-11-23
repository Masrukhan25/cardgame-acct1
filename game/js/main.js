// Bootstrap and turn flow for TIDECALL DUEL.
// Owns the game state, wires rendering, input, AI turns and sounds.
// Demo hooks (screenshots only): ?screen=title|table|win|loss&seed=N.
// Test hook (invisible, for automated playtests): window.TIDECALL.

import { newGame, startPlayerTurn, startEnemyTurn } from './state.js';
import { CARD_BY_ID } from './cards.js';
import { playCard, checkWinner, advanceTide, currentTide } from './rules.js';
import { chooseCard } from './ai.js';
import { render, showHowTo, floatText, shake } from './render.js';
import { bindKeyboard } from './input.js';
import { sfx, setMuted } from './audio.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let state = newGame();
let tutorialShown = false;

function pushLog(text) {
  state.log.push(text);
  if (state.log.length > 4) state.log.shift();
}

function afterPlay(summary, by) {
  const who = by === 'player' ? 'You' : 'Marin';
  const card = summary.card;
  if (summary.damage > 0) {
    const target = by === 'player' ? 'enemy' : 'player';
    floatText(`-${summary.damage}`, target === 'enemy' ? 'dmg-enemy' : 'dmg-player');
    if (summary.damage >= 5) { shake(); sfx.bigHit(); } else sfx.damage();
    if (by === 'player') state.stats.damageDealt += summary.damage;
    else state.stats.damageTaken += summary.damage;
    pushLog(`${who} played ${card.name} — ${summary.damage} damage!`);
  }
  if (summary.heal > 0) { floatText(`+${summary.heal}`, by === 'player' ? 'heal-player' : 'heal-enemy'); sfx.heal(); pushLog(`${who} played ${card.name} — healed ${summary.heal}.`); }
  if (summary.shield > 0) { sfx.shield(); pushLog(`${who} played ${card.name} — shield ${summary.shield}.`); }
  if (summary.tideTo) pushLog(`${who} called the ${summary.tideTo}!`);
  if (summary.draw > 0 || summary.mana > 0) sfx.draw();
  state.stats.cardsPlayed += 1;
  const winner = checkWinner(state);
  if (winner) return endGame(winner);
  render(state, ui);
  return false;
}

function endGame(winner) {
  state.winner = winner;
  state.screen = winner === 'player' ? 'win' : 'loss';
  if (winner === 'player') sfx.win(); else sfx.lose();
  render(state, ui);
  return true;
}

async function runEnemyTurn() {
  state.aiBusy = true;
  startEnemyTurn(state);
  render(state, ui);
  await sleep(650);
  let plays = 0;
  for (;;) {
    if (plays >= 2) break; // Marin plays at most 2 cards a turn: fair pace, readable turns
    const idx = chooseCard(state);
    if (idx < 0) break;
    plays += 1;
    const summary = playCard(state, state.enemy, state.player, idx);
    if (!summary) break;
    sfx.play();
    if (afterPlay(summary, 'enemy')) return;
    await sleep(650);
  }
  advanceTide(state);
  pushLog(`The tide turns to ${currentTide(state)}.`);
  sfx.turn();
  state.aiBusy = false;
  startPlayerTurn(state);
  render(state, ui);
}

const ui = {
  start() {
    state.screen = 'table';
    sfx.click();
    startPlayerTurn(state);
    render(state, ui);
    if (!tutorialShown) { tutorialShown = true; showHowTo(); }
  },
  restart() {
    state = newGame(state.seed);
    state.screen = 'table';
    sfx.click();
    startPlayerTurn(state);
    render(state, ui);
  },
  toMenu() {
    state = newGame(state.seed);
    sfx.click();
    render(state, ui);
  },
  selectCard(i) {
    if (state.screen !== 'table' || state.active !== 'player' || state.aiBusy) return;
    if (state.selected === i) { this.confirmSelected(); return; }
    state.selected = i;
    sfx.click();
    render(state, ui);
  },
  confirmSelected() {
    if (state.screen !== 'table' || state.selected < 0 || state.active !== 'player' || state.aiBusy) return;
    const idx = state.selected;
    state.selected = -1;
    const summary = playCard(state, state.player, state.enemy, idx);
    if (!summary) { render(state, ui); return; }
    sfx.play();
    if (afterPlay(summary, 'player')) return;
    render(state, ui);
  },
  endTurn() {
    if (state.screen !== 'table' || state.active !== 'player' || state.aiBusy) return;
    sfx.click();
    void runEnemyTurn();
  },
  showHowTo() { sfx.click(); showHowTo(); },
  toggleMute() {
    state.muted = !state.muted;
    setMuted(state.muted);
    render(state, ui);
  },
};

function setupDemoScreen() {
  const q = new URLSearchParams(location.search);
  const screen = q.get('screen');
  if (!screen) return;
  const seed = Number(q.get('seed') || 20261123);
  if (screen === 'title') { state.screen = 'title'; return; }
  if (screen === 'table') {
    // Deterministic mid-game state: turn 6, close fight, rich board.
    state = newGame(seed);
    state.screen = 'table';
    state.turn = 6;
    state.tideIndex = 2; // Surge
    state.player.life = 14; state.enemy.life = 11;
    state.player.shield = 4; state.enemy.shield = 0;
    state.player.mana = 6; state.player.manaMax = 6;
    state.enemy.mana = 5; state.enemy.manaMax = 6;
    state.player.hand = ['tide-07', 'storm-04', 'deep-06', 'tide-04', 'storm-09', 'deep-08'];
    state.enemy.hand = ['tide-01', 'storm-02', 'deep-03', 'tide-05'];
    state.player.deck = Array.from({ length: 12 }, (_, i) => CARD_BY_ID[Object.keys(CARD_BY_ID)[i]].id);
    state.player.discard = ['tide-01', 'storm-02', 'deep-04'];
    state.lastPlayed = { cardId: 'storm-03', by: 'enemy' };
    state.log = ['Marin played Thunderhead — 7 damage!', 'The tide turns to Surge.'];
    state.stats = { damageDealt: 9, damageTaken: 6, cardsPlayed: 7, turns: 6 };
    startPlayerTurnShim();
    return;
  }
  if (screen === 'win' || screen === 'loss') {
    state = newGame(seed);
    state.screen = screen;
    state.player.life = screen === 'win' ? 9 : 0;
    state.enemy.life = screen === 'win' ? 0 : 13;
    state.stats = { damageDealt: screen === 'win' ? 24 : 11, damageTaken: 11, cardsPlayed: 14, turns: 9 };
  }
  function startPlayerTurnShim() {
    // Table demo already has its mana set; just mark the turn active.
    state.active = 'player';
    state.selected = 1;
  }
}

// Invisible test hook for automated playtests (no on-screen debug text).
window.TIDECALL = {
  get state() { return state; },
  playCard(i) { state.selected = i; ui.confirmSelected(); },
  endTurn() { ui.endTurn(); },
  setLife(p, o) { state.player.life = p; state.enemy.life = o; render(state, ui); },
  newGame() { ui.restart(); },
};

bindKeyboard(() => state, ui);
setupDemoScreen();
render(state, ui);
