# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-file React 19 flashcard app for the AWS Certified DevOps Engineer (DOP-C02) exam. Built with Vite and `vite-plugin-singlefile` to produce a single HTML output.

All flashcard data and UI live in `aws_devops_flashcards.jsx`. Entry point is `src/main.jsx`.

## Commands

```bash
npm run dev        # Vite dev server (--host enabled)
npm run build      # Production build → single HTML file in dist/
npm run preview    # Preview production build
```

No tests or linting configured.

## Architecture

One default-exported `App` component with three modes controlled by `mode` state:

- **"menu"** — Domain selection screen (checkboxes for 6 domains, card count per domain)
- **"play"** — Flashcard review with 3D flip animation, slide transitions, keyboard shortcuts
- **"results"** — Session summary with percentage, re-study missed cards option

### Key Data Structures

- `CARDS` array: Each card is `{ domain: 1-6, cat: string, q: string, a: string }`
- `DOMAIN_COLORS`: Color scheme per domain `{ bg, accent, light }`
- `DOMAIN_NAMES`: Human-readable domain labels

### State

All local React hooks — no external state management. Key state: `mode`, `selectedDomains` (Set), `deck` (shuffled cards), `idx`, `flipped`, `known[]`, `learning[]`, `animDir`, `isAnimating`.

### Styling

All inline CSS + embedded `<style>` blocks with Google Fonts (DM Sans, Space Mono). Dark theme with domain-specific color coding. No external CSS files.

## Adding Flashcards

Append to the `CARDS` array:
```js
{ domain: 1, cat: "Category Name", q: "Question?", a: "Answer." }
```
Domain must be 1–6. The `cat` field appears in the domain badge during play.

## Keyboard Shortcuts (Play Mode)

- **Space / Enter**: Flip card
- **Right Arrow**: Mark "Got It" (only when flipped)
- **Left Arrow**: Mark "Still Learning" (only when flipped)
