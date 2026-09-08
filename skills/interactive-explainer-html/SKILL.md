---
name: interactive-explainer-html
description: "Create a self-contained interactive HTML explainer that teaches grounded source material—such as a code change, system, concept, process, incident, decision, or document—through a freeform narrative and a validated quiz. Use this whenever the user needs a rich, teachable HTML artifact rather than a brief summary or status report."
---

# Interactive HTML Explainer

Create a long-form, self-contained HTML artifact that helps a reader understand a grounded topic and then verify that understanding. The explainer’s job is teaching: it should develop a mental model, not merely restate source material.

## First response

State the source boundary you will explain and the artifact destination. Default to:

```text
${TMPDIR:-/tmp}/YYYY-MM-DD_HH-MM-SS_explanation-<slug>.html
```

Do not create a permanent home-directory folder. Use another destination only when the user asks for one.

## Source and evidence pass

Before drafting, inspect the relevant source material. A code-change explainer normally needs the diff/stat, relevant surrounding implementation, and the validation evidence. Other explainers can use documents, data, logs, user-provided material, or source pages.

For a code-change explainer, read `references/code-change-source-resolution.md` before inspection. It defines explicit diff selection, empty-diff handling, evidence-isolated delegated authorship, and credential-safe excerpts. Do not use it for non-code topics.

Record briefly:

- the topic and reader outcome;
- the source boundary;
- the core invariant, trade-off, or causal chain to teach; and
- which details are evidence versus interpretation.

Do not invent behavior or fill missing source context with plausible claims. Ask when the missing context changes the explanation materially.

## Compose the explainer

Start from the shell for its slots, offline font, and quiz runtime. Treat `{{EXPLANATION_CONTENT}}` as author-owned: add content-local `<style>` and semantic classes when the source needs a distinct visual teaching composition. Do not constrain the body to template classes or a fixed component grammar.

The shell carries the offline runtime and a deliberately broader Liatrio palette; it is not a license to make every artifact green. Use the colors by role: Primary Green for a key brand moment, Bright Green for signals and highlights, Violet or Lime as one editorial counterpoint per surface, and Lagoon for informational metadata or data detail. Keep Hot Red and Flame Orange semantic-only. The first source-specific teaching visual should use a source-appropriate composition and color role rather than repeating the shell unchanged.

The shell provides the document title, subtitle, optional metadata, responsive chapter navigation, quiz mount, renderer, Reset and Randomize controls, and embedded JSON contract.

Replace these template slots:

```text
{{TITLE}}
{{SUBTITLE}}
{{METADATA}}
{{TABLE_OF_CONTENTS}}
{{EXPLANATION_CONTENT}}
{{QUIZ_JSON}}
```

The explanatory body is intentionally freeform. Select the structure and visual vocabulary that teaches this topic best. Use coherent section headings and populate `{{TABLE_OF_CONTENTS}}` with an `<ol>` of links to those section IDs. Include `#quiz` as the final link, labeled “Check your understanding.” The shell renders this list as wrapping chapter navigation: sticky on desktop and tablet, expanding to full page width while pinned, and static on narrow mobile screens. While pinned, it also reveals a utility row with a Back to top control below a divider; mobile keeps the corner button instead. Keep link labels complete and concise enough to scan; do not abbreviate them merely to force one row. Do not force every explanation into the same diagram or layout.

Chapter numbers are a shell contract, not an authoring choice. Write unnumbered TOC labels. Do not add a Back to top item to that list; the template already provides it. Use one top-level `<section id="...">` with a single `h2` per TOC entry, in the same order as the list, then the quiz. Do not prefix labels or headings with `1.` — the template CSS adds sequential numbers to the nav, each section heading, and the quiz heading. Short nav labels may differ from the full `h2` as long as the order matches, so “section 4” in the nav is section 4 in the body.

The shell leaves every chapter unhighlighted at the page top and until a section reaches the reading line below the sticky nav (near the viewport top on mobile). Preserve this no-current-section state instead of defaulting to chapter one. Do not force the final chapter active merely because the document is at its bottom; that skips short preceding sections. The final quiz section has a viewport-aware minimum height so its heading can reach the same reading line, with blank space only when its content is short. This minimum is disabled for print. The compact nav retains complete labels, stable columns when pinned, and larger mobile touch targets.

Keyboard navigation is shell-owned: Left/Right move between sections while reading; with a chapter link focused, all four arrows navigate in chapter order and Home/End jump to the first/last chapter. Left from chapter one returns to the page top and focuses the title; Right from the top enters chapter one. Forward navigation stops at the last chapter rather than wrapping. Reading shortcuts focus the destination heading; nav shortcuts keep focus on the destination link except when returning to the page top. Up/Down, Page Up/Page Down, and Home/End retain normal scrolling outside the nav. Inputs, quiz controls, author-owned widgets, text selections, and modified shortcuts keep their native behavior. Do not add competing document-wide key handlers in the explanation body.

For most topics, include:

1. **Background** — a skippable beginner model, followed by the narrower context that matters here.
2. **Intuition** — the central idea using concrete toy data or a small scenario.
3. **Walkthrough** — group source changes, decisions, or system steps in causal order.
4. **Boundaries and proof** — important constraints, edge cases, trade-offs, and validation where relevant.

Use HTML/CSS diagrams, structured lists, code blocks, and callouts when they improve understanding. Do not use ASCII or box-drawing diagrams. Use `<pre>` only for literal code or configuration; its style must keep `white-space: pre` or `pre-wrap` so source formatting survives. Explain a process, dependency, or decision flow with semantic HTML/CSS or inline SVG instead. A grid that mixes nodes and arrow glyphs needs one explicit column per child; extra children wrap onto a new row and leave the connectors floating.

## Language and teaching

Write so the reader can form a working mental model, not merely recognize the topic's vocabulary. Keep the authorial voice and visual structure appropriate to the subject; these are teaching principles, not a required prose formula.

- Begin each section with its simplest accurate point, then develop the evidence and mechanics.
- When causality matters, make it visible: describe the problem or missing distinction, the reasonable but wrong consequence, and how the change or decision resolves it.
- Pair abstract claims with source-near examples, before/after states, toy data, or a small scenario when they make the behavior easier to recognize.
- Preserve the source's ubiquitous language. Introduce specialized terms only when they carry a necessary distinction, and define them at first use with ordinary language.
- Keep levels distinct: identify whether a statement describes a goal, mechanism, policy, enforcement action, system state, or one event.
- State relevant non-goals and limits when their omission could invite overgeneralization.
- After drafting, re-pitch the opening and each section transition: a knowledgeable reader who is new to this topic should be able to say why this section follows the previous one.

Avoid synonym-heavy paraphrase, generic AI phrasing, and unexplained jargon. Do not simplify away a distinction that the source needs to remain true.

## Quiz JSON contract

Embed a JSON object in the template’s existing named script element. The renderer owns quiz markup and interaction; author only the JSON.

```json
{
  "questions": [
    {
      "id": "stable-question-id",
      "prompt": "What is the core invariant?",
      "answers": [
        { "text": "A plausible but incorrect option", "correct": false },
        { "text": "The correct option", "correct": true },
        { "text": "Another plausible distractor", "correct": false },
        { "text": "A final plausible distractor", "correct": false }
      ],
      "correct_explanation": "Why this answer is correct.",
      "wrong_explanation": "Why the other answer is not correct and what to revisit."
    }
  ]
}
```

Choose the smallest question count that genuinely tests comprehension:

- **5–6 questions:** narrow topic or one central invariant;
- **7–10 questions:** multiple interacting concepts or a multi-file feature;
- **11–15 questions:** architectural, cross-cutting, or safety-sensitive material.

Every question must have exactly four answers and exactly one correct answer. Keep questions medium difficulty: they should reward understanding rather than trivia or gotchas. Wrong-answer explanations must teach the missing concept, not merely say “try again.”

Treat answer length as part of quiz fairness. A correct answer that is uniquely longer than every distractor becomes a visual giveaway, even when its content is sound. Write concise, equally plausible options with comparable specificity; include at least one distractor that is as long as or longer than the correct answer. The validator rejects a question whose correct answer is uniquely longest.

The renderer presents one question at a time. Progress and navigation use `#quiz-progress`, `#quiz-progress-bar`, `#quiz-prev`, and `#quiz-next`. The template randomizes question order and each question’s answers independently. **Reset** and **Randomize** both start a fresh shuffled run and clear feedback. Finishing the last question reveals `#quiz-complete` between the instructions and the control buttons, including the percent score.

## Validate before delivery

These explainers are internal, normally single-reader teaching artifacts. Optimize for quick, deterministic feedback rather than publication-grade assurance. Set `SKILL_DIR` to the directory containing this `SKILL.md`. Run every validator using that absolute skill path; do not assume the calling workspace has a `scripts/` directory.

1. Put the quiz JSON in a separate temporary `.json` file while authoring.
2. Validate the JSON:

   ```bash
   uv run "$SKILL_DIR/scripts/validate_questions.py" /path/to/quiz.json
   ```

3. Convert the validated JSON to safe script-data before replacing `{{QUIZ_JSON}}`. Escape every literal `<` as `\u003c`; this preserves the parsed JSON value while preventing source-derived text such as `</script>` from closing the data element.

   ```bash
   python - /path/to/quiz.json <<'PY'
   import json
   import sys

   payload = json.dumps(json.load(open(sys.argv[1], encoding="utf-8")), ensure_ascii=False)
   print(payload.replace("<", "\\u003c"))
   PY
   ```

   Use that output for `{{QUIZ_JSON}}`, then validate the generated artifact:

   ```bash
   uv run "$SKILL_DIR/scripts/validate_questions.py" /path/to/explainer.html
   ```

4. Validate standalone artifact structure:

   ```bash
   uv run "$SKILL_DIR/scripts/validate_artifact.py" /path/to/explainer.html
   ```

   This checks the self-contained shell, chapter-navigation targets, quiz infrastructure, and unreplaced template tokens. It complements rather than replaces the quiz validator.

5. Extract the emitted JavaScript and check it, rather than relying on the host/template source alone:

   ```bash
   python - <<'PY' /path/to/explainer.html /tmp/explainer.js
   from pathlib import Path
   import re
   import sys

   html = Path(sys.argv[1]).read_text(encoding="utf-8")
   scripts = re.findall(r"<script(?![^>]*application/json)[^>]*>(.*?)</script>", html, re.S | re.I)
   Path(sys.argv[2]).write_text("\n".join(scripts), encoding="utf-8")
   PY
   node --check /tmp/explainer.js
   ```

Do not run a browser smoke test or dispatch an independent reviewer for a normal explainer. If the body includes a connector diagram, look at it once at content width and confirm the nodes and arrows stayed on the intended row. The deterministic checks above remain the delivery gate; this glance is only for that layout failure, not a general visual QA pass.

After the quiz validator passes, do not begin additional quiz-fairness rewrite rounds unless a concrete comprehension defect is identified. The validator is the bounded guardrail for answer-length cues; subjective preference alone is not a reason to reopen it.
