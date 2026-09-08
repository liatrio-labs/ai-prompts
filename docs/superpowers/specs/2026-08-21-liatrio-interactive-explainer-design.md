# Liatrio interactive explainer design

## Status

Approved design for planning. This document does not authorize implementation until it receives user review.

## Problem

The existing `interactive-explainer-html` template reliably produces standalone teaching artifacts with a freeform explanation body and a validated JSON quiz. Its visual foundation is generic dark technical documentation rather than recognizably Liatrio, and the shared template leaves recurring responsive and accessibility risks:

- mobile tables, code blocks, and flows can exceed the viewport;
- quiz selection and feedback are visually represented but lack programmatic state relationships;
- each author must rediscover useful explanatory layouts without a small, content-sensitive vocabulary.

## Outcome

A generated explainer has a consistent, offline Liatrio visual baseline while retaining author freedom to shape the explanation around source material. The static title/header, provenance metadata, table of contents, freeform article slot, JSON quiz, Reset, and Randomize remain the stable contract.

## Thin slice

Update the existing `skills/interactive-explainer-html/` package with:

1. A Liatrio-styled, self-contained template foundation.
2. Optional semantic visual recipes for explanation content.
3. Accessible shared quiz state and feedback markup.
4. Explicit responsive primitives for tables, code, and flows.
5. One fixture/eval that demonstrates and validates the contract.

## Non-goals

- Redesigning or rewriting existing generated explainers.
- Creating a React, Web Component, or general-purpose component library.
- Adding remote runtime dependencies or loading remote fonts/assets.
- Requiring a fixed explanation section sequence, diagrams, cards, or motifs.
- Changing the quiz JSON schema or moving to a one-question-at-a-time experience.
- Creating a new standalone design-system skill.

## Architecture

### Stable shell

`references/explainer-template.html` continues to own the only universal structure:

```text
header
  eyebrow
  title
  subtitle
  optional metadata/source boundary
  table of contents

freeform article slot

quiz
  validated JSON payload
  shared renderer
  reset/randomize controls
```

The `{{EXPLANATION_CONTENT}}` slot remains unconstrained except for semantic, valid HTML and normal responsive containment.

### Liatrio visual foundation

The template embeds the bundled Space Grotesk font and uses a dark-first token set:

- canvas `#1A1F23`;
- elevated surface `#1E2327`;
- hairline borders before shadows;
- Primary/Bright Green as a signal hierarchy rather than decorative fills;
- semantic color only for semantic state;
- 6px-radius controls for in-app quiz chrome;
- visible 2px bright-green focus ring with an offset.

One restrained technical/botanical treatment may be selected by an author only when it helps teach the topic. It is never mandatory.

### Optional visual recipes

`references/explainer-visual-recipes.md` documents semantic HTML/CSS recipes rather than imports or a runtime API. An author uses a recipe only when it clarifies source content:

| Recipe | Teaches |
| --- | --- |
| Decision / invariant callout | A rule that must hold. |
| Source / evidence boundary | Evidence, derivation, and non-claims. |
| Process / handoff flow | A sequence across actors or layers. |
| Before / after comparison | Changed behavior or a resolved failure mode. |
| Constraint matrix | Conditions that must be evaluated together. |
| Limit or evidence card | A non-goal, measured result, or proof point. |

Each recipe specifies semantics, token usage, mobile reflow behavior, and accessibility expectations. It must not prescribe a page layout or force use of a recipe.

### Responsive content primitives

The template establishes named wrappers that freeform authors can use:

- a table wrapper that permits contained horizontal scrolling where a table cannot faithfully collapse;
- a code wrapper that defaults to preserved formatting and horizontal scrolling only when wrapping would change meaning;
- a flow wrapper that becomes a vertical sequence at the small-screen breakpoint.

The artifact validator verifies that the shared primitives exist. It does not require arbitrary author markup to use any one primitive.

### Accessible quiz renderer

The quiz JSON remains unchanged. The renderer establishes:

- labelled answer groups per question;
- `aria-pressed` selection state on answer buttons;
- feedback linked to its question via `aria-describedby` or an equivalent stable relationship;
- textual correct/incorrect feedback in addition to color;
- original Reset and Randomize behavior, including clearing feedback.

## Files and responsibilities

| Path | Responsibility |
| --- | --- |
| `skills/interactive-explainer-html/references/explainer-template.html` | Offline Liatrio shell, responsive primitives, quiz renderer, accessible states. |
| `skills/interactive-explainer-html/references/explainer-visual-recipes.md` | Optional explanation recipes and selection guidance. |
| `skills/interactive-explainer-html/SKILL.md` | Authoring flow, Liatrio baseline, optional-recipe rule, and acceptance checks. |
| `skills/interactive-explainer-html/scripts/validate_artifact.py` | Deterministic validation of stable shell infrastructure only. |
| `skills/interactive-explainer-html/tests/fixtures/` | One representative fixture combining a table, code block, flow, optional recipes, and validated quiz. |

## Error handling

- Invalid quiz JSON continues to fail through `validate_questions.py` before artifact delivery.
- Missing stable shell hooks, unresolved template tokens, external runtime dependencies, or missing accessible quiz infrastructure fail artifact validation with actionable messages.
- Responsive acceptance focuses on measurable overflow of the document and shared primitive behavior. It does not try to infer subjective content quality from arbitrary freeform markup.

## Validation

The implementation must prove:

1. Existing quiz JSON validation still accepts a valid payload and rejects contract violations.
2. A representative generated fixture passes `validate_artifact.py`.
3. Embedded runtime JavaScript passes `node --check` after extraction from the produced artifact.
4. A browser smoke check confirms no console errors, correct and incorrect feedback, Reset, Randomize, visible focus, exposed answer selection, and 390px responsive handling for table/code/flow examples.
5. Repository skill validation and documentation-drift checks remain green.

## Acceptance proof

A single self-contained fixture explainer, generated from the revised template, demonstrates a freeform explanation that selects only useful recipes and remains readable and interactive on desktop and a 390px viewport.

## Stop condition

Stop after the revised skill package and the one proof fixture validate. Defer additional motif variants, a broader component catalog, new quiz modes, batch evals, and migration of historic explainers to later slices.
