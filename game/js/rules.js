// Rules for TIDECALL DUEL: tide modifiers, card resolution, win/lose checks.

import { CARD_BY_ID, TIDES, TIDE_EFFECT } from './cards.js';
import { drawCards } from './state.js';

export function currentTide(state) {
  return TIDES[state.tideIndex];
}

// +2 when the card's archetype is boosted, -1 when weakened, else 0.
export function tideModifier(state, card) {
  const eff = TIDE_EFFECT[currentTide(state)];
  if (eff.boost === card.arch) return 2;
  if (eff.weaken === card.arch) return -1;
  return 0;
}

// Effective numeric value of a damage/heal/shield effect under the tide.
export function effectiveValue(state, card, effect) {
  if (effect.type !== 'damage' && effect.type !== 'heal' && effect.type !== 'shield') return effect.n;
  const v = effect.n + tideModifier(state, card);
  return Math.max(0, v);
}

export function canPlay(state, side, cardId) {
  const card = CARD_BY_ID[cardId];
  return card && side.mana >= card.cost;
}

export function dealDamage(state, target, amount) {
  if (amount <= 0) return 0;
  let left = amount;
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, left);
    target.shield -= absorbed;
    left -= absorbed;
  }
  target.life = Math.max(0, target.life - left);
  return left; // life damage actually dealt
}

// Apply a played card's effects. Returns a summary for animation/sound.
export function resolveCard(state, caster, target, cardId) {
  const card = CARD_BY_ID[cardId];
  const summary = { card, damage: 0, heal: 0, shield: 0, draw: 0, mana: 0, tideTo: null };
  for (const eff of card.effects) {
    if (eff.type === 'damage') summary.damage += dealDamage(state, target, effectiveValue(state, card, eff));
    else if (eff.type === 'heal') {
      const v = effectiveValue(state, card, eff);
      caster.life = Math.min(caster.maxLife, caster.life + v);
      summary.heal += v;
    } else if (eff.type === 'shield') {
      const v = effectiveValue(state, card, eff);
      caster.shield += v;
      summary.shield += v;
    } else if (eff.type === 'draw') {
      summary.draw += eff.n;
    } else if (eff.type === 'mana') {
      caster.mana += eff.n;
      summary.mana += eff.n;
    } else if (eff.type === 'tide') {
      summary.tideTo = eff.to;
    }
  }
  return summary;
}

// Play a card from a side's hand (index). Returns the summary or null.
export function playCard(state, side, target, handIndex) {
  const cardId = side.hand[handIndex];
  if (!cardId || !canPlay(state, side, cardId)) return null;
  const card = CARD_BY_ID[cardId];
  side.mana -= card.cost;
  side.hand.splice(handIndex, 1);
  side.discard.push(cardId);
  const summary = resolveCard(state, side, target, cardId);
  if (summary.draw > 0) drawCards(state, side, summary.draw);
  if (summary.tideTo) state.tideForced = summary.tideTo;
  state.lastPlayed = { cardId, by: side === state.player ? 'player' : 'enemy' };
  return summary;
}

export function checkWinner(state) {
  if (state.enemy.life <= 0) return 'player';
  if (state.player.life <= 0) return 'enemy';
  return null;
}

// Advance the tide at the end of a full round.
export function advanceTide(state) {
  if (state.tideForced) {
    state.tideIndex = TIDES.indexOf(state.tideForced);
    state.tideForced = null;
  } else {
    state.tideIndex = (state.tideIndex + 1) % TIDES.length;
  }
  state.turn += 1;
}
