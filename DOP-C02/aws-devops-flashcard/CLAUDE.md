# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Svelte 5 flashcard app for the AWS Certified DevOps Engineer (DOP-C02) exam. Built with Vite.

## Commands

```bash
npm run dev        # Vite dev server (--host enabled)
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

No tests or linting configured.

## Architecture

```
src/
├── main.js                  Entry point — mounts App to #app
├── App.svelte               Screen router (menu / play / results)
├── app.css                  Global styles (flat terminal aesthetic)
├── components/
│   ├── MenuScreen.svelte    Domain selection
│   ├── PlayScreen.svelte    Card flip + mark
│   └── ResultsScreen.svelte Session summary
├── data/
│   ├── cards.js             CARDS array (243 cards)
│   └── domains.js           DOMAIN_COLORS, DOMAIN_NAMES
└── lib/
    ├── state.svelte.js      FlashState class ($state runes)
    └── utils.js             shuffle()
```

### State (`src/lib/state.svelte.js`)

`FlashState` class using Svelte 5 `$state()` runes. Exported singleton: `flash`.

Key state: `screen` ('menu'|'play'|'results'), `selectedDomains` (Set), `deck`, `idx`, `flipped`, `known[]`, `learning[]`, `animDir`, `isAnimating`.

Key computed getters: `card`, `colors`, `progress`, `pct`, `cardCount`.

Key methods: `toggleDomain(d)`, `selectAll()`, `deselectAll()`, `startGame(cards?)`, `mark(type)`, `reStudy()`, `restart()`.

### Data Structures

- `CARDS`: `{ domain: 1-6, cat: string, q: string, a: string }` — 243 cards
- `DOMAIN_COLORS`: `{ accent: string }` per domain — used for card borders, badge borders, label text
- `DOMAIN_NAMES`: human-readable domain labels

### Styling

Flat terminal aesthetic via `src/app.css`:
- `#222225` background, `#62c4ff` primary accent, `border-radius: 0` everywhere
- `#22c55e` green (Got It), `#ff3c74` red-pink (Still Learning)
- System fonts — no external font imports
- No gradients or glow effects
- Scoped `<style>` blocks in each component for layout; global classes in app.css for shared elements

## Adding Flashcards

Append to the `CARDS` array in `src/data/cards.js`:
```js
{ domain: 1, cat: "Category Name", q: "Question?", a: "Answer." }
```
Domain must be 1–6.

## Keyboard Shortcuts (Play Mode)

- **Space / Enter**: Flip card
- **Right Arrow**: Mark "Got It" (only when flipped)
- **Left Arrow**: Mark "Still Learning" (only when flipped)
