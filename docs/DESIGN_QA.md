# Design Accuracy Gate

Primary design spec: `canonical_design.md`

Run this before signoff on any migrated slide:

```bash
npm run validate:design
```

## What It Enforces
- Migrated slide components must pull content/data from `lib/data/slides/*`.
- No hardcoded hex colors in slide TSX files.
- No inline styles except `objectPosition` for image framing.
- Shared layout primitives are used for consistency (`SectionHeader`, `SourceLine`, card components).
- Standard text hierarchy classes are present on non-title slides:
  - `section-label`
  - `slide-title`
  - `slide-subtitle`
  - `source-line`
- Slide 2 must keep semantic-channel coloring (`semanticColor` and `semanticPanelClass`).
- Chart slides must consume theme tokens.

## Why This Matters
- Prevents visual drift across slides.
- Keeps typography/spacing/channel logic systematic.
- Makes it safe to refactor data and styling without silent regressions.
