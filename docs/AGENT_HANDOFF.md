# Agent Handoff: React Deck Migration

## Goal
Migrate a 61-slide legacy HTML presentation into a maintainable Next.js/React deck without losing content, while enforcing a strict and reusable design system.

## Non-Negotiables
- Do not lose slide content from `output/InvestmentThesis.html`.
- Keep migration 1:1 first; polish after parity.
- Use centralized tokens/components, not per-slide ad hoc styling.
- Enforce semantic color consistency within each slide and for intentionally persistent concepts.
- Subtitles are sentence case; do not force all-caps on `.slide-subtitle`.
- Follow `docs/CODEX_PROCESS.md` for the required migration/validation sequence.
- Never use slide CSS Modules (`*.module.css`); use prefixed classes in `app/globals.css`.
- Section divider slides must not use `SectionHeader`; render custom divider blocks directly.
- Keep numbering aligned: `components/slides/NN-*`, `lib/data/slides/slideNN.ts`, `slideRegistry` key `NN`, and `reactDatasetSources[NN]` must all match.
- Manifest shift rule: deck slide `NN >= 3` maps to `legacy NN - 1` because slide 2 is inserted leadership.

## Current State
- Branch: `react-migration`
- Framework: Next.js 15 + React 19
- Legacy deck still available at `/InvestmentThesis.html`
- `/deck` route redirects based on env:
  - `NEXT_PUBLIC_DECK_MODE=legacy` -> `/InvestmentThesis.html`
  - `NEXT_PUBLIC_DECK_MODE=react` -> `/deck-react`
- Migrated slides: 1–4
- Pending slides: 5–61 (placeholders generated from manifest)

## Main User Feedback To Fix
- Keyboard navigation currently unreliable/broken on React deck.
- Vertical spacing is inconsistent; too much dead space on content slides.
- Title/subtitle sizing and body sizing do not feel proportionally aligned.
- Slide 4 card/table content clipping and density issues must be resolved.
- Design must look intentionally premium and systematic, not random.

## Architecture Already In Place
- Deck shell/player:
  - `components/deck/ReactDeck.tsx`
  - `components/deck/DeckPlayer.tsx`
  - `components/deck/slideRegistry.tsx`
- Slide files:
  - `components/slides/01-title.tsx`
  - `components/slides/02-capital-split.tsx`
  - `components/slides/03-capital-waterfall.tsx`
  - `components/slides/04-nnn-opportunities.tsx`
- Theme + chart system:
  - `lib/theme.ts`
  - `lib/themeCssVariables.ts`
  - `lib/chartDefaults.ts`
  - `lib/semanticChannels.ts`
  - `app/globals.css`
- Migration support:
  - `migration/slide_manifest.json`
  - `scripts/build_slide_manifest.py`
  - `scripts/sync_legacy_deck.sh`
  - `MIGRATION.md`
  - `canonical_design.md`
- Source design language reference:
  - `canonical_design.md`

## Design Rules Source of Truth
- Primary design tokens and semantic rules come from `canonical_design.md` and are implemented in:
  - `lib/theme.ts`
- Any semantic/channel mapping must follow `canonical_design.md` (do not define duplicate rules in other docs).

## Immediate Technical Tasks
1. Fix keyboard navigation in `components/deck/DeckPlayer.tsx`.
2. Normalize global typography/spacing rhythm in `app/globals.css` so slide hierarchy is coherent.
3. Remove dead space and fit content cleanly into viewport for slides 2 and 4.
4. Preserve semantic color mapping in slide elements, charts, legends, and labels.
5. Keep all changes token-driven (no hardcoded one-off values unless justified).

## Known Hotspots
- Keyboard handling and focus lifecycle:
  - `components/deck/DeckPlayer.tsx`
- Slide 2 layout density/table rhythm:
  - `components/slides/02-capital-split.tsx`
  - `app/globals.css` (`.split-overview-*`, `.thesis-*`)
- Slide 4 card/table/process-row fit:
  - `components/slides/04-nnn-opportunities.tsx`
  - `app/globals.css` (`.nnn-*`)

## Definition of Done
- Arrow keys and space consistently move between slides on `/deck-react`.
- Fullscreen toggle still works.
- No clipping on migrated slides at typical laptop viewport sizes.
- Type hierarchy feels coherent:
  - Title > subtitle > body > table meta/source
- Semantic color usage is consistent and intentional.
- `npm run lint`, `npm run typecheck`, and `npm run build` all pass.

## Run/Check Commands
- `npm install`
- `npm run sync:legacy`
- `NEXT_PUBLIC_DECK_MODE=react npm run dev`
- Open `http://localhost:3000/deck` (or 3001 if 3000 is busy)
- `npm run lint`
- `npm run typecheck`
- `npm run build`
