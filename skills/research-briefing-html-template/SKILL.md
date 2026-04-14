---
name: research-briefing-html-template
description: "Create or refactor standalone HTML research briefings that turn arbitrary research findings into a polished, decision-ready report with this repository's dark-mode briefing format. Use this whenever the user wants research results, audits, investigations, competitive analysis, risk reviews, or multi-source findings reformatted into a branded HTML briefing with executive summary, inline citation chips, tooltip previews, references table, PDF-friendly letter-page layout, and polished interaction details."
license: Apache-2.0
metadata:
  owner: liatrio
  compatibility: Designed for coding agents that can edit HTML/CSS/JS and read markdown references. Browser verification is strongly preferred.
---

# Research Briefing HTML Template

## Overview

Use this skill to transform raw research into a polished standalone HTML briefing that matches the briefing format captured in `assets/report-template-example.html` and can start from the reusable scaffold in `assets/report-template-starter.html`.

This skill is for presentation shaping, not for doing the research itself. First make sure the findings and source set are already good enough to brief. Then use this skill to normalize the content into a consistent report structure, preserve citations, and produce a browser-shareable HTML artifact with strong reading UX.

## When to Use

Reach for this skill when the user asks for any of the following:

- turn research notes into a clean HTML report
- produce an executive briefing from multi-source findings
- convert a risk review, security investigation, vendor assessment, repo audit, or architecture analysis into a polished standalone page
- reformat an existing markdown or rough HTML report into this dark-mode briefing style
- preserve citations and references while improving layout, readability, and interaction quality
- make a report suitable for both browser sharing and PDF export on US letter paper

Do not use this skill when the primary task is conducting the research itself, scraping sources, or writing a simple one-off note with no need for the full briefing format.

## Canonical Template Assets

Treat these bundled files as the source of truth for the target format:

- `assets/report-template-example.html`
  - Canonical example of the desired layout, visual hierarchy, interactions, and print behavior.
- `assets/report-template-starter.html`
  - Generic placeholder starter that preserves the layout and behaviors while swapping topic-specific copy for reusable placeholders.
- `assets/logo_Liatrio_reverse-preferred.svg`
  - Default dark-background Liatrio logo asset when Liatrio branding is desired.
- `references/template-sections.md`
  - Section-by-section explanation of what each briefing area is doing and how to map arbitrary research into it.
- `references/content-mapping-worksheet.md`
  - Compact worksheet for planning the transformation from raw research into the briefing template.
- `references/example-mapping.md`
  - One concrete example of mapping a real research topic into the template structure and theme choice.
- `references/interaction-contract.md`
  - Required behavior for citation chips, tooltips, references table, back-to-top behavior, and theme selection.

When the user asks for “this exact format” or wants iterative tweaks, compare your work directly against `assets/report-template-example.html` rather than improvising a new page structure.

## Input Contract

Before writing or refactoring the HTML, gather or infer these inputs:

1. Briefing topic / title
2. Intended audience
   - internal review
   - leadership briefing
   - technical peer review
   - client-facing draft
3. Source findings
   - conclusions
   - risks
   - recommendations
   - recent changes / timeline items if applicable
4. Citation inventory
   - source title
   - source URL when available
   - short description / why it matters
5. Theme / branding choice
   - `Liatrio` by default in this repository
   - `Dracula` for a neutral dark theme
   - `Minimal` for a light report style
6. Whether the report is:
   - a fresh artifact
   - a refactor of an existing HTML page
   - a content migration from markdown or notes into the template

If citations are messy, duplicated, or inconsistently numbered, normalize them before final output.

## Workflow

### 1. Normalize the research first

Before touching layout, reduce the input into a concise briefing model:

- title
- subtitle / briefing purpose
- 3-5 top summary points
- major analytical sections
- decision guidance / recommendation section
- ordered references list

When the source material does not naturally contain all template sections, adapt the section names while preserving the same reading rhythm:

- top framing
- summary
- evidence / interpretation blocks
- risk or decision block
- timeline / change log if useful
- final guidance
- references

### 2. Choose the right starting asset

Use these defaults:

- start from `assets/report-template-starter.html` when creating a new report from arbitrary findings
- inspect `assets/report-template-example.html` when matching the exact visual rhythm or validating whether the result still feels like the approved report format

Theme defaults in the starter template:

- `Liatrio` — default theme and default choice for work in this repository
- `Dracula` — dark alternative for users who want a more neutral non-Liatrio dark palette
- `Minimal` — light theme for more conventional report delivery

Unless the user says otherwise, keep the starter on the Liatrio theme in this repository.

### 3. Preserve the template’s reading experience

The target output should feel like the example, not just contain the same facts.

Keep these characteristics:

- standalone HTML file with inline CSS and JS
- dark mode by default
- polished but practical presentation, not dashboard clutter
- max width tuned for letter-sized PDF export and browser reading
- strong section hierarchy with clear panels/cards
- citations embedded close to claims
- references consolidated at the bottom in a consistent table
- subtle interactive enhancements that help navigation without becoming noisy

### 3. Keep the interaction model intact

When the report includes citations, preserve this interaction pattern:

- inline citations render as compact chips, not plain text links
- citation chips are hover/focus triggers only
- tooltip previews summarize the cited source
- tooltip actions include:
  - `Open source` for the external source URL in a new tab
  - `Show Reference` for in-page navigation to the reference row
- `Show Reference` should smoothly scroll to the reference row and briefly flash/highlight it
- references should be listed in a table with:
  - number
  - title + summary/details
  - right-aligned source URL (truncated visually when long)
- a back-to-top button should appear after scrolling and remain unobtrusive

If you modify tooltip or citation styling, do not regress these behaviors.

### 4. Adapt the content, not the structure

If a section from the example is too specific to the original Octo STS topic, rename it while keeping its function.

Examples:

- `What the Approval Screen Is Telling You` → `What the Evidence Actually Shows`
- `Recent Changes Worth Knowing About` → `Recent Changes`, `Timeline`, or `What Changed`
- `Decision Guidance` → `Recommended Action`, `Decision Framing`, or `Next Steps`

The goal is structural parity, not literal copying of headings.

### 5. Keep the page print-friendly

The final HTML should remain friendly to browser print/PDF export:

- US letter page sizing assumptions
- avoid overly wide layouts
- avoid sticky UI chrome inside the print area
- keep references readable when printed
- avoid interactions that are required for understanding the content

### 6. Verify in a browser

Whenever possible, verify the finished page in a browser.

Check at minimum:

- the page loads without broken JS
- citation chips open the expected tooltip
- tooltip placement is sensible near the trigger
- moving from one citation to the next does not visibly flash the tooltip at the old position
- `Show Reference` scrolls and flashes the right row
- long reference URLs truncate cleanly
- the back-to-top button appears only after scrolling
- the favicon updates with theme changes
- light-theme pills/tags are high-contrast enough to read comfortably
- table-header text remains readable in every theme
- no obvious empty-space or cramped-rail layout problems exist

## Output Contract

Unless the user explicitly asks otherwise, produce a standalone HTML page that satisfies all of the following:

- a clear H1 briefing title
- concise subtitle/purpose text
- top summary framing or executive summary
- evidence/risk/decision sections tailored to the topic
- inline citation chips attached to claims
- bottom references table with normalized numbering
- polished dark-mode presentation
- browser-shareable and letter-print-friendly layout

## Content Mapping Guidance

Use `references/template-sections.md` when deciding how to map arbitrary research into the template.

Default section mapping pattern:

1. Hero / framing
2. Executive Summary
3. Key evidence interpretation block
4. Risk / sensitivity / implications block
5. Important findings or anomalies
6. Recent changes / timeline block if applicable
7. Decision Guidance / recommendation block
8. References

If the source material is short, compress the number of sections but keep the same narrative flow.

## Constraints and Guardrails

- Do not invent sources.
- Do not silently drop citations tied to major claims.
- Do not reintroduce plain inline citation links if the chip/tooltip system is already in use.
- Do not add decorative filler just to balance columns.
- Prefer full-width sections over cramped side rails when content density makes the rail hard to read.
- Preserve user-requested wording changes and UX refinements when iterating on an existing briefing.

## Recommended Working Sequence

1. Read `references/template-sections.md`
2. Read `references/interaction-contract.md`
3. Read `references/content-mapping-worksheet.md`
4. Read `references/example-mapping.md`
5. Inspect `assets/report-template-example.html`
6. Start from `assets/report-template-starter.html` unless the task is a pure parity refactor
7. Draft the content mapping for the new topic
8. Implement or refactor the HTML
9. Verify in browser, test theme switching, and fix spacing/interaction issues

## References

- `assets/report-template-example.html`
- `assets/report-template-starter.html`
- `assets/logo_Liatrio_reverse-preferred.svg`
- `references/template-sections.md`
- `references/content-mapping-worksheet.md`
- `references/example-mapping.md`
- `references/interaction-contract.md`
