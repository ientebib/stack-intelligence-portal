# React Migration Plan

## Objective
Move from a single static HTML deck to a maintainable Next.js app without losing any slide content.

## Ground Rules
- `output/InvestmentThesis.html` remains the source of truth until parity is complete.
- The Next.js `/deck` route points to the exact legacy deck during transition.
- No copy changes during parity pass.
- A dedicated React preview is available at `/deck-react`.

## Current Baseline
- Slides: 61
- Chart instances: 46
- Inline style attributes: 761

## Migration Phases
1. Scaffold complete (this commit)
2. Architecture foundation:
   - `components/deck/DeckPlayer.tsx` for navigation, keyboard controls, progress, section nav
   - `components/deck/slideRegistry.tsx` as single source of slide order
   - `lib/theme.ts` + `lib/themeCssVariables.ts` for centralized theme tokens
3. Slide-by-slide 1:1 JSX migration by section
4. Chart wrappers + `chartDefaults.ts` adoption
5. Legacy HTML retirement after parity checks pass

## Architecture Controls
- Reorder slides: edit `components/deck/slideRegistry.tsx`
- Add/delete slides: update `components/deck/slideRegistry.tsx` and slide files in `components/slides/`
- Change colors/fonts/spacing: edit `lib/theme.ts`
- Change slide content/chart values: edit `lib/data/slides/*` (no hardcoded values in slide components)
- Change section navigation bands: edit `components/deck/slideRegistry.tsx`
- Enable React deck on `/deck`: set `NEXT_PUBLIC_DECK_MODE=react`
- Design-language rules reference: `canonical_design.md`
- Data-layer status reference: `docs/DATA_LAYER.md`

## Initial Commands
- `npm install`
- `npm run sync:legacy`
- `npm run manifest:slides`
- `npm run validate:design`
- `npm run dev`
