# Research Playbook for Skills Best Practices

## Purpose

Define when and how to refresh skill guidance using current external sources while preserving a stable vendor-neutral baseline.

## When to Trigger Fresh Research

Run updated research when any of these occur:

1. New model/runtime rollout or major vendor feature updates
2. Skill audit failures caused by outdated assumptions
3. User request for "latest best practices"
4. Migration to a new agent platform
5. Security/process incident tied to skill behavior

## Source Priority Order

Use this strict priority order:

1. Official vendor documentation (primary)
2. Official vendor SDK/API references
3. Vendor-maintained examples/cookbooks
4. Reputable ecosystem material (secondary, clearly labeled)

Do not use community commentary as primary evidence when official docs exist.

## Required Vendors for Cross-Check

For broad best-practice updates, check:

- OpenAI
- Anthropic
- Vercel
- GitHub
- Google

If one vendor has no first-class "skill" primitive, map to closest official modular agent capability and note terminology differences.

## Research Procedure

1. Define research question in one sentence.
2. Gather official docs from each vendor.
3. Extract only operational guidance:
   - packaging,
   - triggers,
   - safety/guardrails,
   - tool invocation,
   - evaluation/testing.
4. Build a comparison matrix.
5. Resolve conflicts with neutral-first policy:
   - preserve neutral baseline,
   - move vendor-specific behavior to adapters.
6. Update references/templates/checklists.
7. Record date and source list in the output report.

## Conflict Resolution Rules

When vendor guidance differs:

1. Prefer guidance shared by multiple vendors.
2. If unique vendor behavior exists, keep it in `vendor-adapters.md`.
3. Do not break neutral output contract to satisfy one vendor.
4. Explicitly document trade-offs.

## Citation Requirements in Generated Outputs

Every research-backed recommendation must include:

- source URL,
- source type (`official-doc`, `official-sdk`, `official-example`, `secondary`),
- short rationale sentence.

Example:

```text
[official-doc] https://developers.openai.com/codex/skills/ - Defines skill bundles and best-practice trigger guidance.
```

## Freshness and Review Cadence

- lightweight review: monthly
- full cross-vendor refresh: quarterly
- immediate refresh: after major platform changelog events

## Definition of Done for Research Update

- all five vendor sections reviewed or explicitly marked not applicable
- neutral baseline unchanged or improved
- adapter guidance updated where needed
- templates/checklists updated to reflect new findings
- output includes updated citation list and change summary
