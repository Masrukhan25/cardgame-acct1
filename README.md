[![make.fun](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/Masrukhan25/cardgame-acct1/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/Masrukhan25/cardgame-acct1/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826)

# TIDECALL DUEL

A spell duel on a shifting tide. You and Marin, the rival Tidecaller, each have 30 life and a deck of 30 spells in three archetypes — **Tide**, **Storm**, **Deep**. Mana grows +1 every turn (max 10); you draw a card each turn and play spells from your hand.

The hook: a shared **tidal track** cycles Flood → Ebb → Surge every round. Flood boosts Tide cards +2 and weakens Storm −1, Ebb boosts Deep +2 and weakens Tide −1, Surge boosts Storm +2 and weakens Deep −1. The same card is strong one turn and weak the next — timing a play matters as much as the play itself. Some cards can even force the next tide.

## How to run

Serve `game/` with any static server and open it in desktop Chrome:

```sh
python3 -m http.server 8080 --directory game
```

No build step, no network requests, no fonts or images from outside — everything is inline SVG and CSS. Or run the entry program to produce the graded output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Rules

- **Goal:** reduce Marin to 0 life. You both start at 30 life.
- **Each turn:** +1 max mana (up to 10), refill mana, draw a card (hand max 7).
- **Playing cards:** click a card to select it, click again (or press Enter) to play. A card costs mana; damage hits life (shield absorbs first), heal restores life, shield blocks hits, draw and mana set up later turns.
- **The tide:** shifts at the end of every round. Tide-forcing cards set the next tide.
- **Opponent:** Marin plays by heuristic — lethal first, then damage value, heal when hurt, shield when threatened.
- **Controls:** mouse — hover to enlarge a card, click to play. Keys — 1–7 select, Enter play, Esc menu, R restart, M mute.
- **Screens:** title → table → win or loss, with a how-to-play panel on first start.

## Structure

- `game/index.html` — page shell
- `game/css/style.css` — deep-sea art direction, card frames, animations
- `game/js/cards.js` — the 30 spells and tide table
- `game/js/state.js` — decks, hands, life, mana, turn setup
- `game/js/rules.js` — tide modifiers, effect resolution, win/lose
- `game/js/ai.js` — Marin's heuristic
- `game/js/render.js` — title, table, win/loss screens, floating damage, shake
- `game/js/input.js` — keyboard controls
- `game/js/audio.js` — WebAudio-synthesized sounds (no audio files)
- `game/js/main.js` — bootstrap, turn flow, demo screens (`?screen=title|table|win|loss`)

Demo screens for screenshots only: `?screen=table&seed=20261123` jumps to a fixed mid-game state; the default load is the normal title screen.
