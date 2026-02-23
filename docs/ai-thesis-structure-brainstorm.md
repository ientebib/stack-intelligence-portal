# AI Thesis Structure — Open Questions

## Current State

The framework tracks macro theses, each containing falsifiable hypotheses monitored by KPIs. Hypotheses connect across theses via dependency edges (`requires`, `amplifies`, `conditional_on`).

The fiscal thesis (T-001) is relatively stable. The AI side needs restructuring.

## Three Candidate AI Theses

1. **Capabilities** — AI keeps getting smarter
2. **Autonomy** — AI agents operate more independently, replacing human-in-the-loop workflows
3. **Buildout** — AI demands massive physical infrastructure (power, semiconductors, data centers)

A fourth thesis, **AI-Driven Sociopolitical Feedback & Fiscal Ratchet**, sits downstream — displacement triggers fiscal expansion that feeds back into the macro regime.

## Open Structural Questions

### Is autonomy a separate thesis or a sub-capability?

Autonomy (multi-step task completion, delegation over collaboration) could be framed as:
- A distinct thesis that can diverge from general capability (agents stay unreliable even as models get smarter, or agents get reliable through scaffolding without smarter base models)
- A hypothesis under capabilities (autonomy is just one benchmark of capability — it rises and falls with model quality)

The distinction matters because a separate thesis means you're making a separate bet that could independently be right or wrong.

### Where does cost deflation belong?

Inference getting cheaper has multiple drivers:
- Hardware improvements and scale economies (buildout-side)
- Algorithmic efficiency, distillation, quantization (capability-side)
- Competition between providers (market structure)

It doesn't cleanly sit under one thesis. Options:
- Hypothesis under buildout (cost is an infrastructure output)
- Hypothesis under capabilities (efficiency is a research output)
- Bridge hypothesis connecting both (tracked with KPIs, edges to both theses)
- Its own thesis (AI gets cheaper as a macro-level claim)

### What connects the theses?

Theses are designed to be independent bets — each could be true or false on its own. But they obviously interact. The framework handles this at the hypothesis level: hypotheses under different theses connect via dependency edges.

Examples of cross-thesis relationships:
- Scaling laws (buildout) driving capability improvements (capabilities)
- Capability thresholds enabling agent reliability (capabilities → autonomy, if separate)
- Automation breadth (autonomy or capabilities) driving labor displacement (sociopolitical)
- Grid constraints (buildout) amplifying inflation (fiscal)
- Jevons paradox: efficiency gains (capabilities) driving more total compute demand (buildout)

The question is whether the hypothesis-level edges are sufficient to capture these relationships, or whether something is lost by keeping the theses formally independent.

### Are three AI theses enough?

The three cover:
- The technology itself (capabilities)
- The application mode (autonomy)
- The physical substrate (buildout)

Possible gaps:
- Market structure / concentration (who captures value — 3 players or 300?)
- Adoption velocity (how fast the economy absorbs this, distinct from whether the tech works)
- Regulatory / safety constraints (could slow everything regardless of technical progress)

These might be hypotheses under existing theses rather than standalone theses. Or they might not.
