# Data Layer Status

## Current Source of Truth
- Legacy baseline: `output/InvestmentThesis.html`
- React structured data (migrated slides): `lib/data/slides/*.ts`
- Data migration registry: `lib/data/registry.ts`

## What Is Structured Right Now
- Slide 1: `lib/data/slides/slide01.ts`
- Slide 2: `lib/data/slides/slide02.ts`
- Slide 3: `lib/data/slides/slide03.ts`
- Slide 4: `lib/data/slides/slide04.ts`

These files now contain the content and chart values that the React components render.

## What Is Still Legacy
- Slides 5–61 are still rendered as pending placeholders in React.
- Their data remains in the legacy HTML source (`output/InvestmentThesis.html`).

## Existing Raw Dataset Files
- Raw research/series files are in `datasets/` (CSV plus one JS data file).
- These are not yet wired into migrated slide components by parser/adapters.

## Rule Going Forward
- Do not hardcode business values inside `components/slides/*`.
- Put content/chart values in `lib/data/slides/*` (or CSV adapters for larger series).
- Keep slide components presentational only.
