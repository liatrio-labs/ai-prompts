# Delegated explainer reviewer

Use this reference after deterministic checks complete when the harness supports isolated subagents.

## When to delegate

Dispatch one conditional, read-only reviewer when an explainer has a process, pipeline, dependency, or decision flow; substantial custom HTML/CSS; source-grounded factual claims; or is one of several artifacts delivered together. Skip the reviewer for a trivial single artifact unless the user requests extra scrutiny.

## Reviewer input

Provide:

- the immutable artifact path;
- `SKILL.md` and `references/explainer-template.html` paths;
- a short source-boundary statement and completed deterministic-check results; and
- the exact review scope below.

## Boundaries

The reviewer may read the artifact and supplied contract files only. It must not create, edit, rename, delete, or move files; access credentials or protected sources; regenerate the artifact; or repeat browser smoke checks.

The parent verifies the expected artifact still exists after review. If the reviewer reports an edit or the parent observes unexpected file-state changes, treat the review as invalid and inspect the state before proceeding.

## Review scope

Audit what deterministic validation cannot reliably establish:

- the source boundary is clear and claims stay within it;
- the explanation gives a usable mental model, causal walkthrough, relevant limits, and proof;
- the quiz tests understanding rather than trivia;
- `<pre>` contains literal code or configuration, not an explanatory flowchart; and
- process, dependency, and decision flows do not use box-drawing or ASCII diagrams.

## Required response

```text
Verdict: pass | revise
Findings:
- severity: blocker | important | suggestion
  rule: <skill/template rule>
  evidence: <section or exact visible text>
  rationale: <why it conflicts or is weak>
  smallest_fix: <specific revision>
Strengths:
- <up to three aspects to preserve>
```

Report `Findings: none` plainly when no issue is found. Do not invent polish work.

## Parent follow-up

Fix blocker and important findings, then rerun the deterministic validators. Re-review only once, and only when the revision materially changes the narrative, diagram, or quiz semantics. If delegation is unavailable, deliver with the deterministic results and say the independent qualitative review was unavailable.
