# Copy/Paste Prompt for Another Agent

You are taking over a live React migration in this repo. Work only in this codebase and do not redesign from scratch.

## Core Objective
Migrate a legacy 61-slide HTML investment deck into a Next.js/React architecture with strict design consistency, while preserving content and improving maintainability.

## Hard Constraints
- No content loss from `output/InvestmentThesis.html`.
- Keep migration parity first, polish second.
- Use centralized theme tokens and reusable components; avoid one-off hardcoded styles.
- Follow `canonical_design.md` for semantic color mapping and component rules.
- Subtitles are sentence case; do not force all-caps on `.slide-subtitle`.
- Never use slide CSS Modules (`*.module.css`); use prefixed classes in `app/globals.css`.
- Section divider slides must not use `SectionHeader`; render custom divider content directly.
- Keep numbering aligned: `components/slides/NN-*`, `lib/data/slides/slideNN.ts`, `slideRegistry` key `NN`, and `reactDatasetSources[NN]` must always match.
- Remember the manifest shift: deck slide `NN >= 3` corresponds to `legacy NN - 1` (deck slide 2 is inserted leadership).

## Files You Must Read First
- `docs/CODEX_PROCESS.md`
- `docs/AGENT_HANDOFF.md`
- `canonical_design.md`
- `MIGRATION.md`
- `components/deck/DeckPlayer.tsx`
- `components/deck/slideRegistry.tsx`
- `app/globals.css`
- `lib/theme.ts`
- `lib/semanticChannels.ts`
- `components/slides/02-capital-split.tsx`
- `components/slides/04-nnn-opportunities.tsx`

## Current Problems To Solve First
1. Keyboard navigation is unreliable/broken in React deck.
2. Typography hierarchy and spacing feel off (titles/subtitles/body/table scales not harmonized).
3. Excess dead space on slide 2.
4. Slide 4 cards/tables/process row need better fit and clarity.

## Required Fixes
1. Fix keyboard behavior in `components/deck/DeckPlayer.tsx`:
   - Arrow left/right/up/down and space must navigate reliably.
   - Ignore keystrokes when focus is in input/textarea/select/contenteditable.
   - Keep fullscreen shortcut working.
2. Improve spacing and type rhythm in `app/globals.css`:
   - Reduce dead zones.
   - Ensure proportional hierarchy from title -> subtitle -> body -> metadata.
3. Refine slides 2 and 4 layout density:
   - No clipping.
   - Better visual balance.
   - Keep semantic channel accents.
4. Keep architecture scalable:
   - Token-driven values.
   - Reusable class patterns.
   - No regressions to chart wrappers/themes.

## Validation Checklist
- `NEXT_PUBLIC_DECK_MODE=react npm run dev`
- Test keyboard nav on `/deck-react`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Verify no regressions on slides 1–4.

## Existing Architecture (Do Not Replace)
- Deck shell/registry:
  - `components/deck/ReactDeck.tsx`
  - `components/deck/DeckPlayer.tsx`
  - `components/deck/slideRegistry.tsx`
- Migrated slides:
  - `components/slides/01-title.tsx`
  - `components/slides/02-capital-split.tsx`
  - `components/slides/03-capital-waterfall.tsx`
  - `components/slides/04-nnn-opportunities.tsx`
- Theme system:
  - `lib/theme.ts`
  - `lib/themeCssVariables.ts`
  - `lib/chartDefaults.ts`
  - `lib/semanticChannels.ts`
  - `app/globals.css`

When done, summarize:
- files changed
- exact spacing/type decisions
- keyboard fix details
- before/after behavior on slide 2 and slide 4
