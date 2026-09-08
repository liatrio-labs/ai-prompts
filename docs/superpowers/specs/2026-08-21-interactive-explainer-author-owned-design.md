# Author-owned Liatrio interactive explainer design

## Decision

Replace the abandoned `feat/liatrio-interactive-explainer` approach with a new branch rooted at `feat/explain-with-diff-html`.

The replacement preserves self-contained Liatrio typography and the proven quiz/runtime safeguards, while returning explanatory composition to each artifact author. It does not build on the Liatrio branch's fixed visual shell or its required explanation-body primitives.

## Root cause

The current Liatrio branch made its large shared template the dominant presentation layer. A direct artifact comparison showed that the pre-upgrade long-context explainer had topic-specific CSS for a decision block, metric grid, causal flow, comparison state, warnings, and source grid. Its upgraded counterpart rebuilt the page on the canonical shell and retained mostly generic panels, tables, and callouts.

The regression is not the embedded Space Grotesk font. It is the template-first authoring model that made content-local visual composition optional in practice.

## Scope-governor packet

```text
Original ask:
Restore the varied, visually engaging learning artifacts produced before the Liatrio explainer update without losing offline Liatrio typography or robust quiz behavior.

Value hypothesis:
A lightweight branded shell plus author-owned content CSS will let explainers express the source's teaching needs while preserving self-contained runtime and accessibility guarantees.

Current thin slice:
Create a clean replacement branch from feat/explain-with-diff-html. Add the embedded Space Grotesk font, Liatrio baseline tokens, and only the retained font/quiz accessibility artifact checks. Update the skill to require author-owned explanatory composition rather than canonical template composition. Prove the model with one regenerated long-context fixture/artifact.

Non-goals:
Do not migrate historical artifacts. Do not modify, rebase, or add corrective commits to feat/liatrio-interactive-explainer. Do not add required visual recipes, required explanation-body classes, a visual scoring system, a new UI runtime, screenshots, or a generalized CSS parser.

Observable proof:
A newly generated self-contained explainer uses embedded Space Grotesk and the hardened accessible quiz, includes source-specific content-local CSS/classes beyond the shell, passes validators and browser smoke checks, and is visually compared against the accepted pre-upgrade long-context artifact.

Safety boundary:
This slice mutates only a new local feature branch/worktree and skill files. It uses no credentials, publishing, upstream push, or repository-history rewrite.

Stop condition:
Stop after the replacement branch has a working artifact proof, focused tests, repository quality gates, and one bounded read-only review. Do not automatically open a PR or retire the old branch.

Tripwires:
More than five implementation tasks; a second remediation cycle; any new runtime dependency; required visual-layout rules; a validator that requires explanation-body CSS classes; or a second independent assurance regime.

Human decisions:
- Use a new branch based on feat/explain-with-diff-html.
- Preserve fully embedded offline Space Grotesk.
- Preserve quiz/runtime hardening.
- Preserve only artifact checks for offline/font and quiz accessibility; do not retain named explanation-body primitive requirements.
```

## Architecture

### Shared shell responsibilities

`references/explainer-template.html` provides only:

- the document shell, static header, table-of-contents slot, and quiz mount;
- the embedded offline Space Grotesk data font;
- compact Liatrio baseline tokens and accessible default typography, link, and focus styles;
- the JSON-driven quiz renderer, Reset, and Randomize behavior; and
- no required explanatory card, flow, table, or diagram class.

The base styles must not dictate the visual composition of `{{EXPLANATION_CONTENT}}`.

### Author responsibilities

An explainer author owns its explanatory composition. The author writes content-local `<style>` and semantic classes inside `{{EXPLANATION_CONTENT}}` when they improve teaching. A topic may therefore use a decision panel, sequence, comparison, timeline, data display, causal model, source grid, or a different visual structure without a shared template primitive.

The skill documents the pre-upgrade long-context artifact as the reference implementation for this boundary: branded, offline, and accessible, but visibly authored around the subject rather than the template.

### Validation responsibilities

`validate_questions.py` remains the question-data owner.

`validate_artifact.py` continues checking the standalone contract: no unreplaced tokens or external runtime resources, valid heading/TOC structure, inline CSS and executable runtime, exactly one quiz-data element, and required quiz controls.

The replacement extends it only to verify:

1. browser-effective embedded Space Grotesk in an inline data-font `@font-face` rule;
2. initial and selected `aria-pressed` answer state; and
3. a live feedback region linked from each answer through `aria-describedby`.

It must not require `.table-scroll`, `.code-scroll`, `.explainer-flow`, or any other explanation-body class.

## Acceptance criteria

- The replacement starts from `feat/explain-with-diff-html`; the existing Liatrio branch is untouched.
- Generated artifacts use offline embedded Space Grotesk with no remote font/runtime dependency.
- The template preserves slots and the JSON quiz API, including Reset and Randomize.
- The explanatory body accepts author-defined inline CSS and arbitrary semantic classes.
- A body with no template-specific explanatory class passes artifact validation.
- A missing embedded Space Grotesk font or missing required quiz accessibility behavior fails validation.
- The regression proof artifact uses author-owned content CSS and is visually reviewed at desktop and 390px against `/tmp/2026-08-20_23-40-16_explanation-long-context-reliability.html`.
- Focused tests, skill validation, documentation-drift check, `node --check`, and browser smoke checks pass.

## Dispositions

| Item | Disposition | Reason |
| --- | --- | --- |
| Embedded Space Grotesk | Current-slice blocker | Required Liatrio offline visual identity. |
| Quiz runtime/accessibility hardening | Current-slice blocker | Preserves working accessible interaction already proven valuable. |
| Base artifact validator | Current-slice blocker | Protects the standalone artifact promise. |
| Font/quiz accessibility validator additions | Current-slice blocker | Validates retained requirements without controlling composition. |
| Named CSS primitive checks | Cleanup | Removed because they create the regression. |
| Visual recipe reference | Later-slice candidate | Not needed to prove author-owned composition and risks reintroducing a prescribed grammar. |
| Historical artifact migration | Speculative / YAGNI | Does not prove the replacement skill works. |
| PR creation, push, or old-branch retirement | Product decision | Outside the local replacement proof. |
