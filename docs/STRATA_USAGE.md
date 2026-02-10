# Design Source of Truth

Use `canonical_design.md` as the authoritative design guideline, with active operational overrides documented in `docs/CODEX_PROCESS.md`.

This file is intentionally a pointer to avoid duplicated rules and contradictions across docs.

## Implementation Mapping
- Design specification: `canonical_design.md`
- Theme tokens: `lib/theme.ts`
- CSS variable bridge: `lib/themeCssVariables.ts`
- Global styling: `app/globals.css`
- Chart defaults: `lib/chartDefaults.ts`
- Semantic concept mapping: `lib/semanticChannels.ts`

## Enforcement
- Run `npm run validate:design` to enforce migrated-slide design consistency.
