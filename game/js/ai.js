// Opponent AI for TIDECALL DUEL: heuristic scoring, never random.
// Lethal first, then damage value, then heal when hurt, shield when threatened,
// draw and mana as setup, tide-forcing cards when they set up a big next turn.

import { CARD_BY_ID, TIDE_EFFECT } from './cards.js';
import { canPlay, effectiveValue, currentTide } from './rules.js';

function scoreCard(state, cardId) {
  const card = CARD_BY_ID[cardId];
  const me = state.enemy, foe = state.player;
  let score = 0;
  for (const eff of card.effects) {
    if (eff.type === 'damage') {
      const v = effectiveValue(state, card, eff);
      score += v * 3;
      if (v >= foe.life + foe.shield) score += 1000; // lethal
      else if (foe.life <= 5) score += 8; // press a low-life player
    } else if (eff.type === 'heal') {
      const v = effectiveValue(state, card, eff);
      const missing = me.maxLife - me.life;
      score += Math.min(v, missing) * (me.life <= 8 ? 4 : 1.5);
    } else if (eff.type === 'shield') {
      const v = effectiveValue(state, card, eff);
      score += v * (foe.life <= 6 ? 0.5 : 2); // shield matters when the player can hit back
    } else if (eff.type === 'draw') score += eff.n * 2;
    else if (eff.type === 'mana') score += eff.n * 2.5;
    else if (eff.type === 'tide') {
      // Forcing a tide that boosts my next hand is worth a little.
      const next = TIDE_EFFECT[eff.to];
      const boostedInHand = me.hand.filter((id) => CARD_BY_ID[id].arch === next.boost).length;
      score += 2 + boostedInHand * 2;
    }
  }
  // Prefer cheaper cards when scores tie, so mana is spent efficiently.
  score -= card.cost * 0.4;
  // Do not waste a big tide shift on turn 1.
  if (currentTide(state) === 'Flood' && card.effects.some((e) => e.type === 'tide' && e.to === 'Flood')) score -= 3;
  return score;
}

// Pick the best playable card index in the enemy hand, or -1.
export function chooseCard(state) {
  const me = state.enemy;
  let best = -1, bestScore = 2; // only play cards worth at least 2 points
  for (let i = 0; i < me.hand.length; i++) {
    const id = me.hand[i];
    if (!canPlay(state, me, id)) continue;
    const s = scoreCard(state, id);
    if (s > bestScore) { bestScore = s; best = i; }
  }
  return best;
}
