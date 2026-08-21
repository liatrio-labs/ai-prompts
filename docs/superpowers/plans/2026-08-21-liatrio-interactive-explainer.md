# Liatrio Interactive Explainer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give self-contained interactive explainers a reliable Liatrio visual baseline, accessible quiz state, responsive content primitives, and optional teaching recipes without constraining freeform explanation content.

**Architecture:** Keep `references/explainer-template.html` as the only shared runtime. It embeds the offline font, Liatrio tokens, responsive primitive CSS, and quiz renderer. The validator proves only shared structural infrastructure; authors retain complete freedom inside `{{EXPLANATION_CONTENT}}`. One generated fixture provides the end-to-end proof rather than introducing a new component/runtime subsystem.

**Tech Stack:** standalone HTML/CSS/JavaScript, Python standard library `unittest`/`HTMLParser`, `node --check`, Playwright CLI, `uv` script runner.

**Spec:** `docs/superpowers/specs/2026-08-21-liatrio-interactive-explainer-design.md`

## Global Constraints

- Outputs remain one self-contained HTML file: no remote runtime resources, remote fonts, or external assets.
- Preserve the existing template slots, freeform article region, JSON quiz schema, Reset, and Randomize behavior.
- Preserve `validate_questions.py` as the owner of question-content validation.
- Apply Liatrio dark-first tokens: `#1A1F23` canvas and `#1E2327` elevated surface; Space Grotesk is the brand typeface.
- Treat optional recipes as teaching aids selected only when they clarify source material; never require an explanation layout or a motif.
- Do not migrate historical artifacts, add a UI runtime, or change quiz progression.

---

## File Structure

| Path | Role |
| --- | --- |
| `skills/interactive-explainer-html/references/explainer-template.html` | Shared self-contained shell, embedded Space Grotesk, Liatrio base CSS, responsive primitives, and accessible quiz renderer. |
| `skills/interactive-explainer-html/references/explainer-visual-recipes.md` | Optional semantic markup/CSS recipes and selection guidance. |
| `skills/interactive-explainer-html/scripts/validate_artifact.py` | Structural validation of self-contained output and new shared shell requirements. |
| `skills/interactive-explainer-html/SKILL.md` | Authoring instructions and required validation steps. |
| `skills/interactive-explainer-html/tests/test_template_contract.py` | Static template contract tests. |
| `skills/interactive-explainer-html/tests/test_validate_artifact.py` | Validator acceptance/rejection tests. |
| `skills/interactive-explainer-html/tests/fixtures/liatrio-explainer-fixture.html` | Fully substituted representative artifact exercising the template, content primitives, recipes, and valid quiz data. |

## Task 1: Lock the revised structural contract in tests

**Files:**

- Modify: `skills/interactive-explainer-html/tests/test_template_contract.py`
- Modify: `skills/interactive-explainer-html/tests/test_validate_artifact.py`
- Create: `skills/interactive-explainer-html/tests/fixtures/liatrio-explainer-fixture.html`

**Interfaces:**

- Consumes: the existing template slot names and `validate_artifact.py` CLI.
- Produces: deterministic red tests for the required Liatrio shell hooks, quiz accessibility hooks, and fixture shape used by later implementation tasks.

- [ ] **Step 1: Add failing template-contract assertions for named shared hooks**

Add tests that require the template to include all of the following literal, implementation-owned hooks:

```python
for hook in (
    "@font-face",
    "font-family: \"Space Grotesk\"",
    "--dark-bg: #1A1F23",
    "--dark-bg-2: #1E2327",
    ".table-scroll",
    ".code-scroll",
    ".explainer-flow",
    "aria-pressed",
    "aria-describedby",
    "focus-visible",
):
    with self.subTest(hook=hook):
        self.assertIn(hook, self.source)
```

Also assert the template continues to expose `{{EXPLANATION_CONTENT}}`, the named quiz JSON script, both action controls, delegated click handling, and the data-URI favicon.

- [ ] **Step 2: Run the template contract test to verify it fails**

Run:

```bash
python -m unittest skills/interactive-explainer-html/tests/test_template_contract.py -v
```

Expected: failure identifying the missing Liatrio/responsive/accessibility hooks.

- [ ] **Step 3: Add failing artifact-validator tests for shared requirements**

Extend `valid_artifact()` or add focused HTML builders so tests require:

- an embedded `data:font/…` font source and a Space Grotesk rule;
- the named `.table-scroll`, `.code-scroll`, and `.explainer-flow` shared CSS hooks;
- `aria-pressed` on an answer button and a stable feedback description relationship;
- continued acceptance of a fully substituted canonical template.

Add rejection tests whose artifact differs by one missing requirement and asserts the actionable error message, for example:

```python
result = self.run_validator(self.valid_artifact().replace('aria-pressed="false"', ""))
self.assertEqual(result.returncode, 1)
self.assertIn("aria-pressed", result.stderr)
```

- [ ] **Step 4: Run the validator tests to verify they fail**

Run:

```bash
python -m unittest skills/interactive-explainer-html/tests/test_validate_artifact.py -v
```

Expected: failures until the validator recognizes the new shell contract.

- [ ] **Step 5: Create the representative fixture as an acceptance input**

Create `tests/fixtures/liatrio-explainer-fixture.html` by substituting every canonical template token. Its freeform article must include:

```html
<section id="model">
  <h2>Model</h2>
  <aside class="invariant-callout">A stated invariant.</aside>
  <div class="table-scroll"><table>…</table></div>
  <div class="code-scroll"><pre>key = "value"</pre></div>
  <ol class="explainer-flow"><li>Collect evidence</li><li>Validate it</li></ol>
</section>
```

Use a five-question JSON payload that already satisfies `validate_questions.py`: exactly four answers and one correct answer per question.

- [ ] **Step 6: Commit the red-test/fixture boundary**

```bash
git add skills/interactive-explainer-html/tests
git commit -m "test(explainer): define Liatrio template contract"
```

## Task 2: Implement the Liatrio offline shell and accessible quiz renderer

**Files:**

- Modify: `skills/interactive-explainer-html/references/explainer-template.html`
- Source input: `/home/damien/.hermes/skills/liatrio-brand-guidelines/assets/fonts/SpaceGrotesk-VariableFont_wght.ttf`

**Interfaces:**

- Consumes: the test-owned required hooks from Task 1 and the existing `{{TITLE}}`, `{{SUBTITLE}}`, `{{METADATA}}`, `{{TABLE_OF_CONTENTS}}`, `{{EXPLANATION_CONTENT}}`, and `{{QUIZ_JSON}}` slots.
- Produces: an offline visual shell and renderer that satisfy Task 1 without altering the quiz JSON schema.

- [ ] **Step 1: Embed the approved local Space Grotesk asset as a data URI**

Read the existing local asset only from:

```text
/home/damien/.hermes/skills/liatrio-brand-guidelines/assets/fonts/SpaceGrotesk-VariableFont_wght.ttf
```

Encode it into the template’s own `<style>` block as a WOFF2 or TrueType data URI and declare it with `@font-face`. Do not add a filesystem/font URL, Google Fonts request, or runtime `<link>`.

Use:

```css
@font-face {
  font-family: "Space Grotesk";
  src: url("data:font/ttf;base64,…") format("truetype");
  font-weight: 300 700;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 2: Replace the generic token layer with Liatrio roles**

Define and consume these shared roles in the template CSS:

```css
:root {
  --dark-bg: #1A1F23;
  --dark-bg-2: #1E2327;
  --border: #2A3036;
  --border-strong: #3A4046;
  --primary-green: #24AE1D;
  --bright-green: #89DF00;
  --fg: #FFFFFF;
  --fg-muted: #CCCCCC;
  --danger: #E63946;
}
```

Use Space Grotesk for all brand-facing UI and a monospace stack only for literal code/source content. Keep the header and quiz controls structurally unchanged. Use borders before shadows and a 6px radius only on quiz controls.

- [ ] **Step 3: Implement the responsive content primitive CSS**

Add named classes owned by the template:

```css
.table-scroll { overflow-x: auto; overscroll-behavior-inline: contain; }
.table-scroll > table { min-width: max-content; }
.code-scroll { overflow-x: auto; }
.code-scroll > pre { min-width: max-content; white-space: pre; }
.explainer-flow { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); }
@media (max-width: 600px) { .explainer-flow { grid-template-columns: 1fr; } }
```

Keep bare `pre` safe with existing `white-space: pre-wrap`; authors use `.code-scroll > pre` only when preserving long literal lines matters.

Make mobile ToC links full-width block targets with at least 44px effective height. Keep metadata compact enough that the first explanation section begins in the first viewport on a 390px screen.

- [ ] **Step 4: Upgrade rendered quiz semantics without changing JSON**

In `createAnswerButton`, set `aria-pressed="false"` through `button.setAttribute("aria-pressed", "false")`. In `render`, create feedback before the answers, assign it a stable `id` and `role="status"`, and set each answer's `aria-describedby` with `button.setAttribute("aria-describedby", feedback.id)`. Feedback text begins with `Correct.` or `Not quite.` before the authored explanation.

On click, set every answer in that question to `aria-pressed="false"`; set only the selected answer to `aria-pressed="true"`; continue clearing visual state and feedback on Reset and Randomize.

Use a visible focus ring:

```css
button:focus-visible {
  outline: 2px solid var(--bright-green);
  outline-offset: 2px;
}
```

- [ ] **Step 5: Run deterministic test suite to verify green**

Run:

```bash
python -m unittest discover -s skills/interactive-explainer-html/tests -v
```

Expected: all question, artifact, and template contract tests pass.

- [ ] **Step 6: Commit the shell and renderer**

```bash
git add skills/interactive-explainer-html/references/explainer-template.html \
  skills/interactive-explainer-html/tests
git commit -m "feat(explainer): add Liatrio template foundation"
```

## Task 3: Enforce the shared structural contract in the artifact validator

**Files:**

- Modify: `skills/interactive-explainer-html/scripts/validate_artifact.py`
- Modify: `skills/interactive-explainer-html/tests/test_validate_artifact.py`
- Modify: `skills/interactive-explainer-html/tests/fixtures/liatrio-explainer-fixture.html`

**Interfaces:**

- Consumes: stable CSS/ARIA hooks implemented in Task 2.
- Produces: actionable validator output for shared shell drift without parsing or policing freeform author content.

- [ ] **Step 1: Add failing tests for validator error specificity**

Add subtests that remove one shared requirement from `liatrio-explainer-fixture.html` at a time and assert that validation fails with the matching requirement name:

```python
cases = {
    "embedded font": ("data:font/", "embedded Space Grotesk font"),
    "table primitive": (".table-scroll", "table-scroll primitive"),
    "quiz pressed state": ("aria-pressed", "aria-pressed"),
}
```

Keep the existing tests that accept ordinary self-contained artifacts; do not make a generic standalone HTML page masquerade as the canonical Liatrio template.

- [ ] **Step 2: Run the focused validator test to verify it fails**

Run:

```bash
python -m unittest skills/interactive-explainer-html/tests/test_validate_artifact.py -v
```

Expected: new tests fail because `ArtifactInspector` does not yet collect the required CSS/ARIA signals.

- [ ] **Step 3: Collect only shared infrastructure signals in `ArtifactInspector`**

Extend the parser to collect style text plus the executable-script source needed to prove:

- an inline `@font-face` with a `data:font/` source and `Space Grotesk` declaration;
- `.table-scroll`, `.code-scroll`, and `.explainer-flow` class definitions in the inline style text;
- the renderer explicitly sets `aria-pressed` to false at creation and updates it on selection;
- the renderer assigns a feedback `id`/`role` and wires `aria-describedby` from each answer to that feedback element.

Add one small helper for each evidence class, returning `True`/`False`; keep `validate()` as the aggregation point for human-readable errors. Static artifact validation proves the renderer contract by its explicit emitted JavaScript hooks; browser acceptance in Task 5 proves the resulting live DOM state. Do not try to validate arbitrary recipe usage or infer computed browser layout from Python.

- [ ] **Step 4: Pass the fixture through both validators**

Run:

```bash
python skills/interactive-explainer-html/scripts/validate_questions.py \
  skills/interactive-explainer-html/tests/fixtures/liatrio-explainer-fixture.html
python skills/interactive-explainer-html/scripts/validate_artifact.py \
  skills/interactive-explainer-html/tests/fixtures/liatrio-explainer-fixture.html
```

Expected: valid quiz count and `artifact structure valid`.

- [ ] **Step 5: Run the full focused test suite**

Run:

```bash
python -m unittest discover -s skills/interactive-explainer-html/tests -v
```

Expected: PASS.

- [ ] **Step 6: Commit validator enforcement**

```bash
git add skills/interactive-explainer-html/scripts/validate_artifact.py \
  skills/interactive-explainer-html/tests
git commit -m "feat(explainer): validate Liatrio shared shell"
```

## Task 4: Document optional teaching recipes and the revised author workflow

**Files:**

- Create: `skills/interactive-explainer-html/references/explainer-visual-recipes.md`
- Modify: `skills/interactive-explainer-html/SKILL.md`
- Modify: `README.md`
- Modify: `skills/interactive-explainer-html/agents/openai.yaml` if generated metadata changes

**Interfaces:**

- Consumes: Task 2’s stable CSS classes and Task 3’s deterministic validation limits.
- Produces: agent-facing guidance that promotes consistent output without prescribing freeform content.

- [ ] **Step 1: Add a failing documentation-contract test**

In `test_template_contract.py`, add a test that reads the new recipe reference and asserts each semantic recipe heading exists:

```python
for heading in (
    "Decision / invariant callout",
    "Source / evidence boundary",
    "Process / handoff flow",
    "Before / after comparison",
    "Constraint matrix",
    "Limit or evidence card",
):
    with self.subTest(heading=heading):
        self.assertIn(heading, recipes)
```

Also assert `SKILL.md` points authors to `references/explainer-visual-recipes.md` and says recipes are optional.

- [ ] **Step 2: Run the documentation-contract test to verify it fails**

Run:

```bash
python -m unittest skills/interactive-explainer-html/tests/test_template_contract.py -v
```

Expected: missing recipe-reference failures.

- [ ] **Step 3: Write the recipe reference**

For each of the six approved recipes, provide:

- its teaching purpose and when to use it;
- minimal semantic HTML class names/markup;
- relevant template token roles rather than a new color palette;
- mobile behavior;
- accessibility notes; and
- a short explicit warning against decorative or obligatory use.

Document `.table-scroll`, `.code-scroll`, and `.explainer-flow` as optional responsive primitives authors apply only when their source content needs them.

- [ ] **Step 4: Update `SKILL.md` authoring and validation instructions**

Under composition, require the Liatrio visual foundation from the template while retaining a freeform `{{EXPLANATION_CONTENT}}` body. Direct authors to the recipe reference only when a recipe clarifies the source material.

Under browser smoke validation, add these checks:

- a 390px test where long table/code/flow content is contained by the correct primitive;
- visible bright-green focus;
- `aria-pressed` selection state and linked feedback;
- no external runtime dependencies.

Keep the existing prohibition on saved screenshots, QA findings JSON, and report-server startup.

- [ ] **Step 5: Refresh skill metadata and documentation inventory**

Run:

```bash
uv run scripts/generate_openai_yaml.py skills/interactive-explainer-html
python scripts/check_docs_drift.py
```

If the metadata generator produces no content changes, preserve the existing file. If it changes `agents/openai.yaml`, inspect and stage it with this task.

- [ ] **Step 6: Run skill/package validation**

Run:

```bash
uv run scripts/quick_validate.py skills/interactive-explainer-html
python -m unittest discover -s skills/interactive-explainer-html/tests -v
```

Expected: both commands pass.

- [ ] **Step 7: Commit the author-facing guidance**

```bash
git add skills/interactive-explainer-html README.md
# Include agents/openai.yaml only when Task 4 changed it.
git status --short skills/interactive-explainer-html/agents/openai.yaml
git commit -m "docs(explainer): add Liatrio visual recipes"
```

## Task 5: Prove the generated artifact end-to-end

**Files:**

- Modify if needed: `skills/interactive-explainer-html/tests/fixtures/liatrio-explainer-fixture.html`
- No production behavior additions.

**Interfaces:**

- Consumes: final template, validators, recipe reference, and fixture from Tasks 1–4.
- Produces: the spec’s single observable proof and final verification record.

- [ ] **Step 1: Validate the fixture content and structure**

Run:

```bash
python skills/interactive-explainer-html/scripts/validate_questions.py \
  skills/interactive-explainer-html/tests/fixtures/liatrio-explainer-fixture.html
python skills/interactive-explainer-html/scripts/validate_artifact.py \
  skills/interactive-explainer-html/tests/fixtures/liatrio-explainer-fixture.html
```

Expected: valid quiz and artifact structure.

- [ ] **Step 2: Extract and parse emitted JavaScript**

Run:

```bash
python - <<'PY' skills/interactive-explainer-html/tests/fixtures/liatrio-explainer-fixture.html /tmp/liatrio-explainer-fixture.js
from pathlib import Path
import re
import sys
html = Path(sys.argv[1]).read_text(encoding="utf-8")
scripts = re.findall(r"<script(?![^>]*application/json)[^>]*>(.*?)</script>", html, re.S | re.I)
Path(sys.argv[2]).write_text("\n".join(scripts), encoding="utf-8")
PY
node --check /tmp/liatrio-explainer-fixture.js
```

Expected: exit code 0.

- [ ] **Step 3: Run browser acceptance at desktop and 390px**

Serve the fixture from a temporary local server. In a task-scoped Playwright session, verify:

- the page reports no console errors;
- the first answer exposes `aria-pressed="false"`, then `"true"` after keyboard activation;
- correct feedback begins with `Correct.` and wrong feedback begins with `Not quite.`;
- Reset restores the initial order and clears visible feedback;
- Randomize clears feedback and changes question/answer presentation;
- the document does not horizontally overflow at 390px; and
- table/code horizontal overflow is contained by `.table-scroll`/`.code-scroll`, while `.explainer-flow` is single-column at 390px.

Close the Playwright session and stop the temporary server. Do not save screenshots, QA report JSON, or browser report-server artifacts.

- [ ] **Step 4: Run repository gates**

Run:

```bash
python -m unittest discover -s skills/interactive-explainer-html/tests -v
uv run scripts/quick_validate.py skills/interactive-explainer-html
python scripts/check_docs_drift.py
pre-commit run
```

Expected: all gates pass.

- [ ] **Step 5: Inspect final scope and commit proof-only corrections if needed**

Run:

```bash
git status --short
git diff --check
git diff -- skills/interactive-explainer-html
```

If a correction is required to satisfy the established contract, add it to the smallest related commit. Do not add motif variants, new quiz modes, artifact migrations, or another validation regime.

- [ ] **Step 6: Commit final fixture or validation-only changes if they exist**

```bash
git add skills/interactive-explainer-html/tests/fixtures
git commit -m "test(explainer): prove Liatrio artifact contract"
```

Skip this commit only when Task 1’s fixture commit already contains the final proof fixture unchanged.

## Plan self-review

- **Spec coverage:** Tasks 1–5 cover the Liatrio offline shell, optional recipes, responsive primitives, accessible quiz state, deterministic validators, a representative fixture, browser proof, and repository gates.
- **Out-of-scope protection:** No task adds a runtime dependency, fixed explanation layout, historical-artifact migration, second quiz mode, or broad component library.
- **Type/interface consistency:** `validate_questions.py` remains unchanged as the JSON-content authority; `validate_artifact.py` owns shared infrastructure signals; the template owns renderer behavior; the fixture proves their integration.
- **Placeholder scan:** no unfilled implementation placeholders remain.
