// Rendering for TIDECALL DUEL: DOM only, no canvas. One 1440x900 stage, scaled
// to fit the window. Screens: title, table, win, loss + how-to overlay.
// Floating damage numbers and screen shake live here too.

import { CARD_BY_ID, ARCHETYPES, TIDES, TIDE_EFFECT, archIcon } from './cards.js';
import { currentTide, tideModifier, effectiveValue } from './rules.js';

const STAGE_W = 1440, STAGE_H = 900;

export function fitStage() {
  const stage = document.getElementById('stage');
  if (!stage) return;
  const s = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
}

function mainEffect(card) {
  return card.effects.find((e) => e.type === 'damage' || e.type === 'heal' || e.type === 'shield') || null;
}

function powerText(state, card) {
  const eff = mainEffect(card);
  if (!eff) return '<span class="star">★</span><span class="ptype">SPELL</span>';
  const v = effectiveValue(state, card, eff);
  const tag = eff.type === 'damage' ? 'DMG' : eff.type === 'heal' ? 'HEAL' : 'SHD';
  return `${v}<span class="ptype">${tag}</span>`;
}

export function cardEl(state, cardId, opts = {}) {
  const card = CARD_BY_ID[cardId];
  const arch = ARCHETYPES[card.arch];
  const mod = tideModifier(state, card);
  const el = document.createElement('div');
  el.className = `card arch-${card.arch} rarity-${card.rarity}` + (opts.selected ? ' selected' : '') + (opts.playable === false ? ' unplayable' : '') + (opts.mini ? ' mini' : '');
  el.dataset.cardId = cardId;
  const tideNote = mod > 0 ? `<div class="tide-note up">Tide +${mod}</div>` : mod < 0 ? `<div class="tide-note down">Tide ${mod}</div>` : '';
  el.innerHTML = `
    <div class="cost">${card.cost}</div>
    <div class="cname">${card.name}</div>
    <div class="cicon">${archIcon(card.arch, opts.mini ? 26 : 40)}</div>
    <div class="carch">${arch.label.toUpperCase()}</div>
    <div class="ctext">${card.text}</div>
    <div class="cpower">${powerText(state, card)}</div>
    ${tideNote}`;
  if (opts.onClick) el.addEventListener('click', () => opts.onClick());
  return el;
}

function lifeBar(side, label, cls) {
  const pct = Math.max(0, (side.life / side.maxLife) * 100);
  const shield = side.shield > 0 ? `<span class="shield-tag">SHD ${side.shield}</span>` : '';
  return `<div class="life-wrap ${cls}">
    <div class="life-name">${label} ${shield}</div>
    <div class="life-bar"><div class="life-fill" style="width:${pct}%"></div></div>
    <div class="life-num">${side.life} / ${side.maxLife}</div>
  </div>`;
}

function manaRow(side) {
  let dots = '';
  for (let i = 0; i < 10; i++) dots += `<span class="mana-dot${i < side.mana ? ' on' : ''}${i < side.manaMax ? '' : ' locked'}"></span>`;
  return `<div class="mana-row">${dots}<span class="mana-num">${side.mana} / ${side.manaMax} mana</span></div>`;
}

function tideTrack(state) {
  const cur = currentTide(state);
  return `<div class="tide-track">${TIDES.map((t) => {
    const eff = TIDE_EFFECT[t];
    const active = t === cur ? ' active' : '';
    const icon = t === 'Flood' ? 'tide' : t === 'Ebb' ? 'deep' : 'storm';
    return `<div class="tide-seg${active}">
      <div class="tide-icon">${archIcon(icon, 54)}</div>
      <div class="tide-name">${t.toUpperCase()}${t === cur ? ' ●' : ''}</div>
      <div class="tide-rule">${ARCHETYPES[eff.boost].label} +2 · ${ARCHETYPES[eff.weaken].label} −1</div>
    </div>`;
  }).join('')}</div>`;
}

function renderTable(state, ui) {
  const app = document.getElementById('app');
  const enemyBacks = state.enemy.hand.map(() => '<div class="card-back"><svg width="34" height="20" viewBox="0 0 34 20" fill="none"><path d="M2 7c4-4 7-4 11 0s7 4 11 0 6-4 8 0" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round"/><path d="M2 14c4-4 7-4 11 0s7 4 11 0 6-4 8 0" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/></svg></div>').join('');
  const last = state.lastPlayed ? CARD_BY_ID[state.lastPlayed.cardId] : null;
  const logLine = state.log.slice(-3).map((l) => `<div class="log-line">${l}</div>`).join('') || 'The tide is rising. Play a card or end your turn.';
  const turnBanner = state.active === 'player'
    ? '<div class="turn-banner yours">YOUR TURN — play a card, then end your turn</div>'
    : '<div class="turn-banner theirs">MARIN IS THINKING…</div>';
  app.innerHTML = `
  <div id="stage">
    <div class="table-bg"></div>
    <div class="top-row">
      <div class="side-panel enemy-panel">
        <div class="avatar enemy-avatar">M</div>
        <div class="side-info">${lifeBar(state.enemy, 'MARIN · Tidecaller', 'enemy')}${manaRow(state.enemy)}</div>
      </div>
      <div class="enemy-hand">${enemyBacks}</div>
      <div class="side-panel deck-panel">
        <div class="pile deck-pile"><div class="pile-count">${state.player.deck.length}</div><div class="pile-label">DECK</div></div>
        <div class="pile discard-pile"><div class="pile-count">${state.player.discard.length}</div><div class="pile-label">DISCARD</div></div>
      </div>
    </div>
    ${turnBanner}
    <div class="mid-row">
      ${tideTrack(state)}
      <div class="center-stage">
        ${last ? `<div class="last-label">${state.lastPlayed.by === 'player' ? 'YOU PLAYED' : 'MARIN PLAYED'}</div><div class="last-card" id="lastCard"></div>` : '<div class="last-label">NO CARD PLAYED YET</div><div class="last-empty">The tide waits for no one.</div>'}
      </div>
      <div class="log-box"><div class="log-title">TIDE LOG</div>${logLine}</div>
    </div>
    <div class="bottom-row">
      <div class="side-panel player-panel">
        <div class="avatar player-avatar">Y</div>
        <div class="side-info">${lifeBar(state.player, 'YOU · Tidecaller', 'player')}${manaRow(state.player)}</div>
      </div>
      <div class="player-hand" id="playerHand"></div>
      <div class="controls">
        <button class="btn primary" id="endTurnBtn" ${state.active !== 'player' || state.aiBusy ? 'disabled' : ''}>End Turn</button>
        <button class="btn" id="howBtn">How to play</button>
        <button class="btn" id="muteBtn">${state.muted ? 'Sound: Off' : 'Sound: On'}</button>
        <button class="btn" id="menuBtn">Menu</button>
      </div>
    </div>
    <div class="float-layer" id="floatLayer"></div>
    <div class="overlay" id="overlay" hidden></div>
  </div>`;
  const handEl = document.getElementById('playerHand');
  state.player.hand.forEach((cardId, i) => {
    const card = CARD_BY_ID[cardId];
    const playable = state.active === 'player' && !state.aiBusy && state.player.mana >= card.cost;
    handEl.appendChild(cardEl(state, cardId, {
      selected: state.selected === i, playable,
      onClick: () => ui.selectCard(i),
    }));
  });
  if (last) document.getElementById('lastCard').appendChild(cardEl(state, last.id, { mini: true }));
  document.getElementById('endTurnBtn').addEventListener('click', () => ui.endTurn());
  document.getElementById('howBtn').addEventListener('click', () => ui.showHowTo());
  document.getElementById('muteBtn').addEventListener('click', () => ui.toggleMute());
  document.getElementById('menuBtn').addEventListener('click', () => ui.toMenu());
  fitStage();
}

function renderTitle(state, ui) {
  const app = document.getElementById('app');
  app.innerHTML = `
  <div id="stage" class="title-stage">
    <div class="title-bg"></div>
    <div class="title-wave"><svg width="420" height="46" viewBox="0 0 420 46" fill="none"><path d="M6 14c20-12 34-12 54 0s34 12 54 0 34-12 54 0 34 12 54 0 34-12 54 0 34 12 54 0 34-12 54 0" stroke="#7dd3fc" stroke-width="3" stroke-linecap="round" opacity="0.7"/><path d="M6 34c20-12 34-12 54 0s34 12 54 0 34-12 54 0 34 12 54 0 34-12 54 0 34 12 54 0 34-12 54 0" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" opacity="0.5"/></svg></div>
    <h1 class="wordmark">TIDECALL<br><span>DUEL</span></h1>
    <p class="tagline">The sea chooses the strong.<br>The tide chooses the moment.</p>
    <div class="title-btns">
      <button class="btn big primary" id="startBtn">▶ &nbsp;Start Duel</button>
      <button class="btn big" id="howBtn">How to play</button>
    </div>
    <p class="title-foot">30 spells · 3 tides · 30 life · one duel against Marin</p>
    <div class="overlay" id="overlay" hidden></div>
  </div>`;
  document.getElementById('startBtn').addEventListener('click', () => ui.start());
  document.getElementById('howBtn').addEventListener('click', () => ui.showHowTo());
  fitStage();
}

function renderEnd(state, ui, won) {
  const app = document.getElementById('app');
  const s = state.stats;
  app.innerHTML = `
  <div id="stage" class="${won ? 'win-stage' : 'loss-stage'}">
    <div class="end-bg"></div>
    <h1 class="end-title">${won ? 'THE TIDE IS YOURS' : 'SWALLOWED BY THE DEEP'}</h1>
    <p class="end-sub">${won ? 'Marin sinks beneath the waves. The sea sings your name.' : 'Marin claims the tide… this time. The deep keeps its secrets.'}</p>
    <div class="end-stats">
      <div class="stat"><div class="stat-num">${s.turns}</div><div class="stat-label">TURNS</div></div>
      <div class="stat"><div class="stat-num">${s.damageDealt}</div><div class="stat-label">DAMAGE DEALT</div></div>
      <div class="stat"><div class="stat-num">${s.cardsPlayed}</div><div class="stat-label">CARDS PLAYED</div></div>
      <div class="stat"><div class="stat-num">${state.player.life} ♥</div><div class="stat-label">LIFE LEFT</div></div>
    </div>
    <div class="title-btns">
      <button class="btn big primary" id="againBtn">↻ &nbsp;Play Again</button>
      <button class="btn big" id="menuBtn">Menu</button>
    </div>
    <div class="overlay" id="overlay" hidden></div>
  </div>`;
  document.getElementById('againBtn').addEventListener('click', () => ui.restart());
  document.getElementById('menuBtn').addEventListener('click', () => ui.toMenu());
  fitStage();
}

export function showHowTo() {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;
  overlay.hidden = false;
  overlay.innerHTML = `
  <div class="howto">
    <h2>HOW TO PLAY</h2>
    <p><b>Goal:</b> reduce Marin to 0 life. You both start at 30 life.</p>
    <p><b>Each turn:</b> gain +1 max mana (up to 10), refill mana, draw a card. Click a card to play it, then End Turn.</p>
    <p><b>The tide:</b> Flood boosts Tide +2 / weakens Storm −1 · Ebb boosts Deep +2 / weakens Tide −1 · Surge boosts Storm +2 / weakens Deep −1. The tide shifts every round — time your big spells.</p>
    <p><b>Cards:</b> damage hits life (shield blocks first), heal restores life, shield absorbs hits, draw and mana set up your next turns.</p>
    <p><b>Controls:</b> mouse — hover to enlarge, click to play · keys — 1–7 select, Enter play, Esc menu, R restart, M mute.</p>
    <button class="btn primary" id="closeHow">Got it</button>
  </div>`;
  document.getElementById('closeHow').addEventListener('click', () => { overlay.hidden = true; overlay.innerHTML = ''; });
}

export function render(state, ui) {
  if (state.screen === 'title') renderTitle(state, ui);
  else if (state.screen === 'table') renderTable(state, ui);
  else renderEnd(state, ui, state.screen === 'win');
}

export function floatText(text, cls = '') {
  const layer = document.getElementById('floatLayer');
  if (!layer) return;
  const el = document.createElement('div');
  el.className = `float-num ${cls}`;
  el.textContent = text;
  el.style.left = `${46 + Math.random() * 8}%`;
  el.style.top = '42%';
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

export function shake() {
  const stage = document.getElementById('stage');
  if (!stage) return;
  stage.classList.remove('shake');
  void stage.offsetWidth;
  stage.classList.add('shake');
  setTimeout(() => stage.classList.remove('shake'), 500);
}
