// Card data for TIDECALL DUEL: 30 distinct spells in 3 archetypes.
// Each card: id, name, archetype (tide|storm|deep), cost, rarity, effects.
// Effect types: damage, heal, shield, draw, mana, tide (force next tide).
// The tide modifier (+2 boosted / -1 weakened) applies to damage, heal, shield.

export const ARCHETYPES = {
  tide: { label: 'Tide', color: '#38bdf8', dark: '#075985', glow: 'rgba(56,189,248,0.45)' },
  storm: { label: 'Storm', color: '#fbbf24', dark: '#78350f', glow: 'rgba(251,191,36,0.45)' },
  deep: { label: 'Deep', color: '#34d399', dark: '#064e3b', glow: 'rgba(52,211,153,0.45)' },
};

export const TIDES = ['Flood', 'Ebb', 'Surge'];
// Which archetype each tide boosts (+) and weakens (-).
export const TIDE_EFFECT = {
  Flood: { boost: 'tide', weaken: 'storm' },
  Ebb: { boost: 'deep', weaken: 'tide' },
  Surge: { boost: 'storm', weaken: 'deep' },
};

export const CARDS = [
  // ---- Tide (blue) ----
  { id: 'tide-01', name: 'Tidal Slap', arch: 'tide', cost: 1, rarity: 'common', effects: [{ type: 'damage', n: 2 }], text: 'Deal 2 damage.' },
  { id: 'tide-02', name: 'Undertow', arch: 'tide', cost: 2, rarity: 'common', effects: [{ type: 'damage', n: 3 }], text: 'Deal 3 damage.' },
  { id: 'tide-03', name: 'Moonwell', arch: 'tide', cost: 2, rarity: 'common', effects: [{ type: 'heal', n: 4 }], text: 'Restore 4 life.' },
  { id: 'tide-04', name: 'High Water', arch: 'tide', cost: 3, rarity: 'rare', effects: [{ type: 'damage', n: 5 }], text: 'Deal 5 damage.' },
  { id: 'tide-05', name: 'Salt Spray', arch: 'tide', cost: 1, rarity: 'common', effects: [{ type: 'damage', n: 1 }, { type: 'draw', n: 1 }], text: 'Deal 1 damage. Draw a card.' },
  { id: 'tide-06', name: 'Breaker Wall', arch: 'tide', cost: 2, rarity: 'common', effects: [{ type: 'shield', n: 5 }], text: 'Gain 5 shield.' },
  { id: 'tide-07', name: 'Floodcaller', arch: 'tide', cost: 4, rarity: 'rare', effects: [{ type: 'damage', n: 6 }, { type: 'tide', to: 'Flood' }], text: 'Deal 6 damage. Call the Flood.' },
  { id: 'tide-08', name: 'Driftwood', arch: 'tide', cost: 1, rarity: 'common', effects: [{ type: 'mana', n: 2 }], text: 'Gain 2 mana.' },
  { id: 'tide-09', name: 'Riptide', arch: 'tide', cost: 3, rarity: 'rare', effects: [{ type: 'damage', n: 4 }, { type: 'draw', n: 1 }], text: 'Deal 4 damage. Draw a card.' },
  { id: 'tide-10', name: 'Tsunami', arch: 'tide', cost: 6, rarity: 'epic', effects: [{ type: 'damage', n: 9 }], text: 'Deal 9 damage.' },
  // ---- Storm (gold) ----
  { id: 'storm-01', name: 'Spark Jolt', arch: 'storm', cost: 1, rarity: 'common', effects: [{ type: 'damage', n: 2 }], text: 'Deal 2 damage.' },
  { id: 'storm-02', name: 'Gale Cut', arch: 'storm', cost: 2, rarity: 'common', effects: [{ type: 'damage', n: 3 }], text: 'Deal 3 damage.' },
  { id: 'storm-03', name: 'Thunderhead', arch: 'storm', cost: 3, rarity: 'rare', effects: [{ type: 'damage', n: 5 }], text: 'Deal 5 damage.' },
  { id: 'storm-04', name: 'Chain Lightning', arch: 'storm', cost: 4, rarity: 'rare', effects: [{ type: 'damage', n: 4 }, { type: 'draw', n: 1 }], text: 'Deal 4 damage. Draw a card.' },
  { id: 'storm-05', name: 'Storm Surge', arch: 'storm', cost: 2, rarity: 'common', effects: [{ type: 'damage', n: 2 }, { type: 'tide', to: 'Surge' }], text: 'Deal 2 damage. Call the Surge.' },
  { id: 'storm-06', name: 'Eye of Storm', arch: 'storm', cost: 2, rarity: 'common', effects: [{ type: 'shield', n: 4 }, { type: 'draw', n: 1 }], text: 'Gain 4 shield. Draw a card.' },
  { id: 'storm-07', name: 'Tempest', arch: 'storm', cost: 5, rarity: 'epic', effects: [{ type: 'damage', n: 8 }], text: 'Deal 8 damage.' },
  { id: 'storm-08', name: 'Static Charge', arch: 'storm', cost: 1, rarity: 'common', effects: [{ type: 'mana', n: 2 }], text: 'Gain 2 mana.' },
  { id: 'storm-09', name: 'Rainmend', arch: 'storm', cost: 2, rarity: 'common', effects: [{ type: 'heal', n: 5 }], text: 'Restore 5 life.' },
  { id: 'storm-10', name: 'Skyfall', arch: 'storm', cost: 6, rarity: 'epic', effects: [{ type: 'damage', n: 7 }, { type: 'shield', n: 3 }], text: 'Deal 7 damage. Gain 3 shield.' },
  // ---- Deep (green) ----
  { id: 'deep-01', name: 'Kelp Snare', arch: 'deep', cost: 1, rarity: 'common', effects: [{ type: 'damage', n: 2 }], text: 'Deal 2 damage.' },
  { id: 'deep-02', name: 'Abyssal Bite', arch: 'deep', cost: 2, rarity: 'common', effects: [{ type: 'damage', n: 3 }], text: 'Deal 3 damage.' },
  { id: 'deep-03', name: 'Coral Mend', arch: 'deep', cost: 2, rarity: 'common', effects: [{ type: 'heal', n: 4 }], text: 'Restore 4 life.' },
  { id: 'deep-04', name: 'Ink Cloud', arch: 'deep', cost: 2, rarity: 'common', effects: [{ type: 'shield', n: 5 }], text: 'Gain 5 shield.' },
  { id: 'deep-05', name: 'Pressure Crush', arch: 'deep', cost: 3, rarity: 'rare', effects: [{ type: 'damage', n: 5 }], text: 'Deal 5 damage.' },
  { id: 'deep-06', name: 'Leviathan', arch: 'deep', cost: 5, rarity: 'epic', effects: [{ type: 'damage', n: 8 }], text: 'Deal 8 damage.' },
  { id: 'deep-07', name: 'Trench Call', arch: 'deep', cost: 3, rarity: 'rare', effects: [{ type: 'damage', n: 3 }, { type: 'tide', to: 'Ebb' }], text: 'Deal 3 damage. Call the Ebb.' },
  { id: 'deep-08', name: 'Biolume', arch: 'deep', cost: 1, rarity: 'common', effects: [{ type: 'draw', n: 2 }], text: 'Draw 2 cards.' },
  { id: 'deep-09', name: 'Deep Current', arch: 'deep', cost: 2, rarity: 'common', effects: [{ type: 'mana', n: 2 }, { type: 'draw', n: 1 }], text: 'Gain 2 mana. Draw a card.' },
  { id: 'deep-10', name: "Kraken's Grasp", arch: 'deep', cost: 6, rarity: 'epic', effects: [{ type: 'damage', n: 9 }, { type: 'heal', n: 3 }], text: 'Deal 9 damage. Restore 3 life.' },
];

export const CARD_BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));

// Inline SVG icons per archetype (drawn in code, no image files).
export function archIcon(arch, size = 22) {
  if (arch === 'tide') return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M3 9c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round"/><path d="M3 15c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/></svg>`;
  if (arch === 'storm') return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M13 2 5 13h5l-1 9 8-11h-5l1-9z" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/></svg>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M12 3c3 4 6 6.5 6 10a6 6 0 1 1-12 0c0-3.5 3-6 6-10z" fill="#34d399" stroke="#059669" stroke-width="1"/><circle cx="9.5" cy="12" r="1.4" fill="#064e3b"/><circle cx="14.5" cy="12" r="1.4" fill="#064e3b"/></svg>`;
}
