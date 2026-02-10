# Codex Process: React Migration

This is the operational process for Codex work in this repo.  
Goal: migrate safely, keep full content parity, and avoid regressions.

## 1. Non-Negotiables

- No content loss from the legacy source deck.
- Data-first architecture: slide values live in `lib/data/slides/*`, not hardcoded in slide components.
- Append-only behavior for shared registries/types unless explicitly asked otherwise.
- Validate after every migration batch.
- Subtitle case rule: `.slide-subtitle` is sentence case (no forced ALL CAPS).
- Never use CSS Modules for slides in this repo (`*.module.css`).
- Slide-specific CSS must be in `app/globals.css` with a unique prefix.
- Section divider slides must not use `SectionHeader`; render divider content directly.
- Numbering contract: `components/slides/NN-*`, `lib/data/slides/slideNN.ts`, `slideRegistry` key `NN`, and `reactDatasetSources[NN]` must match exactly.
- Manifest shift contract: deck slide `NN >= 3` maps to `legacy slide NN - 1` because deck slide 2 is the inserted Leadership slide.

## 2. Preflight (Before Editing)

1. Confirm branch and local state:
   - `git status --short --branch`
2. Ensure dependencies are installed:
   - `npm install`
3. Ensure legacy source is synced:
   - `npm run sync:legacy`
4. Verify migration manifest is current:
   - `npm run manifest:slides`

## 3. Slide Migration Workflow (One-by-One)

1. Identify target slide in legacy source (`public/InvestmentThesis.html`) and manifest (`migration/slide_manifest.json`).
2. Extract data from `datasets/*.csv` first. If unavailable, extract from legacy chart arrays.
3. Add/extend types in `lib/data/types.ts` (append only).
4. Create structured data file `lib/data/slides/slideNN.ts`.
5. Create presentational component `components/slides/NN-*.tsx`:
   - Use `SectionHeader` and `SourceLine`.
   - Use theme tokens from `@/lib/theme`.
   - Use chart wrappers from `@/components/charts/*`.
6. Wire slide and data (append only):
   - `lib/data/slides/index.ts`
   - `components/deck/slideRegistry.tsx`
   - `lib/data/registry.ts`

## 4. Validation Gate (Required)

Run after each migration batch:

1. `npm run typecheck`
2. `npm run validate:design`
3. `npm run build`

If any check fails, fix before moving to the next slide batch.

## 5. Runtime QA (Manual)

1. Start dev server:
   - `npm run dev`
2. Open:
   - `/deck` (should resolve to React mode unless env forces legacy)
   - `/deck-react` (direct React deck route)
3. Check:
   - Arrow key navigation works consistently.
   - Slide order is correct (no missing leadership/waterfall/migrated slides).
   - Subtitle styling is sentence case.
   - Chart colors follow canonical ordering semantics for series.

## 6. Handoff Format

Every handoff summary must include:

1. Files changed
2. Slides migrated (by deck number and title)
3. Data sources used (CSV or legacy extraction)
4. Validation results (`typecheck`, `validate:design`, `build`)
5. Known risks or remaining slides
