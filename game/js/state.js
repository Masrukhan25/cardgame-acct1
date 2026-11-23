// Game state for TIDECALL DUEL: decks, hands, life, mana, tide, turn.
// Seeded RNG (mulberry32) so demo/table setups are reproducible.

import { CARDS } from './cards.js';

export function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffledDeck(rng) {
  const ids = CARDS.map((c) => c.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

export function newSide(rng) {
  return {
    life: 30, maxLife: 30, shield: 0,
    mana: 1, manaMax: 1,
    deck: shuffledDeck(rng), hand: [], discard: [],
  };
}

export function newGame(seed = 20261123) {
  const rng = makeRng(seed);
  const state = {
    seed,
    screen: 'title', // title | table | win | loss
    turn: 1,
    tideIndex: 0, // 0 Flood, 1 Ebb, 2 Surge
    tideForced: null, // a card can force the next tide
    player: newSide(rng),
    enemy: newSide(rng),
    active: 'player', // whose turn it is
    selected: -1, // selected card index in player hand
    log: [],
    stats: { damageDealt: 0, damageTaken: 0, cardsPlayed: 0, turns: 0 },
    lastPlayed: null, // {cardId, by} shown in the middle of the table
    winner: null,
    muted: false,
    aiBusy: false,
  };
  drawCards(state, state.player, 3);
  drawCards(state, state.enemy, 3);
  return state;
}

export function drawCards(state, side, n) {
  for (let i = 0; i < n; i++) {
    if (side.hand.length >= 7) return; // hand cap
    if (side.deck.length === 0) {
      if (side.discard.length === 0) return;
      side.deck = side.discard.splice(0);
      // reshuffle discard into deck (simple shuffle, order does not matter here)
      for (let j = side.deck.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [side.deck[j], side.deck[k]] = [side.deck[k], side.deck[j]];
      }
    }
    side.hand.push(side.deck.pop());
  }
}

export function startPlayerTurn(state) {
  const p = state.player;
  p.manaMax = Math.min(10, p.manaMax + 1);
  p.mana = p.manaMax;
  drawCards(state, p, 1);
  state.active = 'player';
  state.selected = -1;
  state.stats.turns = state.turn;
}

export function startEnemyTurn(state) {
  const e = state.enemy;
  e.manaMax = Math.min(10, e.manaMax + 1);
  e.mana = e.manaMax;
  drawCards(state, e, 1);
  state.active = 'enemy';
}
