# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

Study materials and apps for the AWS Certified DevOps Engineer – Professional (DOP-C02) exam. Two independent Svelte 5 + Vite apps plus source Markdown notes.

```
DOP-C02/
├── domain-material/            Markdown study notes (source of truth for card/question content)
├── aws-devops-flashcard/       Flashcard app (flip cards, Got It / Still Learning)
└── dop-quiz/                   Multiple-choice quiz app (per-service selection, missed-question requeue)
```

The two apps are separate npm projects — there is no root `package.json` or workspace config. `cd` into the app directory before running commands.

## Commands

Both apps use the same Vite scripts:

```bash
npm install
npm run dev        # dev server (flashcard uses --host; quiz does not)
npm run build      # production build → dist/
npm run preview    # preview production build
```

No tests, linting, or typechecking are configured in either app.

## Architecture (shared patterns)

Both apps follow the same shape:

- **Router**: `App.svelte` switches between `menu` / `play`|`quiz` / `results` screens based on a single `screen` field on a state singleton.
- **State**: a class in `src/lib/state.svelte.js` using Svelte 5 `$state()` runes. Exported as a singleton (`flash` / `quiz`). Components mutate the singleton directly; getters compute derived values (progress, counts, current item).
- **Data**: plain JS arrays in `src/data/` (`cards.js`, `questions.js`, `services.js`, `domains.js`). Content is keyed by `domain: 1–6` matching the DOP-C02 exam domains defined in `domains.js`.
- **Styling**: flat terminal aesthetic — dark background, accent-per-domain color, `border-radius: 0`, system fonts, no gradients. Shared classes live in `src/app.css`; per-component layout in scoped `<style>` blocks.

### Flashcard app specifics (`aws-devops-flashcard/`)

- Cards shape: `{ domain: 1–6, cat: string, q: string, a: string }` in `src/data/cards.js`.
- `FlashState` tracks `selectedDomains`, `deck`, `idx`, `flipped`, `known[]`, `learning[]`, plus animation flags.
- Keyboard (play mode): Space/Enter flip; Right = Got It (after flip); Left = Still Learning (after flip).
- App-level docs in `aws-devops-flashcard/CLAUDE.md` — keep it in sync when changing state/data shape.

### Quiz app specifics (`dop-quiz/`)

- Selection is **per-service**, not per-domain: `selectedServices` is the source of truth; `selectedDomains` is a derived getter that returns domains whose services are all selected. `toggleDomain` selects/deselects that domain's full service list.
- Question shape: `{ domain, service, q, options[], explanation }`. **Convention: `options[0]` is always the correct answer** (shuffled at render time). A question may override with `correctAnswer: <index>`.
- `state.svelte.js` precomputes `servicesByDomain`, `questionCounts`, `domainQuestionCounts` at module load and calls `validateQuestions(...)` — invalid data throws at import.
- Missed questions are collected during a round; `requeueMissed()` starts a new round with just those.
- `services.js` is the canonical service list and must stay aligned with the `service` field on questions (validation enforces this).

## Adding/editing content

- Flashcards → append to `CARDS` in `DOP-C02/aws-devops-flashcard/src/data/cards.js` with `domain` 1–6.
- Quiz questions → append to `QUESTIONS` in `DOP-C02/dop-quiz/src/data/questions.js`; put the correct answer at `options[0]`; `service` must exist in `services.js`.
- Source material for both lives in `DOP-C02/domain-material/*.md` — consult these when authoring new questions/cards to keep wording consistent with study notes.
