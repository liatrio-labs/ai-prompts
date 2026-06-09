# Task 01 Proofs - Compact Liatrio Design-System Router

## Task Summary

Task 1.0 reconciled `skills/liatrio-brand-guidelines/SKILL.md` as a compact router for Liatrio brand and design-system work. The router now prioritizes curated local references/assets, treats `https://www.liatrio.ai/brand-data.json` as the only current scripted/canonical live brand-data source, makes Space Grotesk the current brand-facing typeface, and preserves the existing Brand Audit and Implementation Decision output contracts with design-system proof expectations.

Small supporting updates were also made to existing local scripts/reference text so the required repository-wide text scan no longer exposes active `liatrio.com` or unqualified DM Sans guidance: scripts now use `liatrio.ai`, and remaining `liatrio.com`/DM Sans mentions in the legacy reference are explicitly provenance-only or legacy/noncanonical.

## What This Task Proves

- `SKILL.md` is a compact router instead of a stale monolithic brand guide.
- Source priority routes to curated local design-system references/assets first and `liatrio.ai` live brand data for current scripted verification.
- Space Grotesk is the current canonical typeface for brand-facing generated artifacts.
- DM Sans and `liatrio.com` references are not active current guidance; remaining matches are legacy/provenance-only context.
- The skill frontmatter and structure still pass the repository quick validation gate.

## Evidence Summary

- `git diff -- skills/liatrio-brand-guidelines/SKILL.md` shows the router, source priority, task-mode routing, typography, output contracts, verification loop, and workflow checklist changes.
- `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` returned `Skill is valid!`.
- `rg "DM Sans|liatrio\.com|brand-data" skills/liatrio-brand-guidelines` shows only `liatrio.ai` as current brand-data guidance; remaining `liatrio.com` and DM Sans matches are explicitly labeled legacy/provenance-only.

## Artifact: SKILL.md Router Diff

**What it proves:** The main skill entry point now routes by task mode, uses current source priority, preserves required output contracts, and no longer treats older live sources or DM Sans as current canonical guidance.

**Why it matters:** Task 1.0's primary deliverable is the compact router. This diff is the direct evidence that stale source, typography, routing, checklist, and verification sections were replaced.

**Command:**

~~~bash
git diff -- skills/liatrio-brand-guidelines/SKILL.md
~~~

**Result summary:** The diff replaces the old `liatrio.com` source-priority stack and DM Sans primary typography with a design-system router, `liatrio.ai` live source, Space Grotesk type guidance, explicit task modes, expanded proof-aware output contracts, and an updated verification checklist.

~~~diff
diff --git a/skills/liatrio-brand-guidelines/SKILL.md b/skills/liatrio-brand-guidelines/SKILL.md
--- a/skills/liatrio-brand-guidelines/SKILL.md
+++ b/skills/liatrio-brand-guidelines/SKILL.md
@@
-description: Applies Liatrio brand guidelines to UI design, brand audits, and asset selection. Use when users request Liatrio styling, logo variants, typography or color decisions, visual polish, or formal brand compliance checks.
+description: "Applies Liatrio brand and design-system guidance for UI design, docs, decks, brand audits, asset selection, typography, visual polish, and formal compliance checks. Use when users request Liatrio styling, implementation decisions, static/offline artifacts, hero/social imagery, or design-system adherence review."
@@
-  canonical-brand-source: https://www.liatrio.com/brand-data.json
-  canonical-brand-page: https://www.liatrio.com/brand
+  canonical-brand-source: https://www.liatrio.ai/brand-data.json
@@
-# Liatrio Brand Guidelines
+# Liatrio Brand and Design-System Router
@@
-1. `https://www.liatrio.com/brand-data.json` (canonical structured source)
-2. `references/liatrio-brand-guidelines.md` (local detailed reference)
-3. `assets/liatrio-brand-guidelines-consolidated.png` (visual snapshot)
-4. `https://www.liatrio.com/brand` (rendered page content)
+1. Curated local design-system references and assets once present in this skill package:
+   - `references/liatrio-design-system.md`
+   - `references/liatrio-component-recipes.md`
+   - `references/liatrio-asset-index.md`
+   - `assets/colors_and_type.css`, `assets/logos/`, `assets/motifs/`, `assets/decks/`, and `assets/previews/`
+2. `references/liatrio-brand-guidelines.md` for legacy consolidated brand context and existing audit details.
+3. `assets/liatrio-brand-guidelines-consolidated.png` for the older visual snapshot when no newer curated asset is available.
+4. `https://www.liatrio.ai/brand-data.json` as the only current scripted/canonical live brand-data source.
@@
-- Primary typeface: DM Sans for all brand-facing text.
+- Current canonical typeface: Space Grotesk for brand-facing generated artifacts, UI, docs, decks, and polished static outputs.
+- Legacy typography note: DM Sans appears in older consolidated brand material. Treat it as noncanonical for new design-system work unless a specific user-provided source explicitly requires it.
@@
+- `implementation`: user wants direct UI/docs/style changes. Load `references/liatrio-design-system.md`, `references/liatrio-component-recipes.md`, and relevant local assets before choosing tokens, type, layout, and motifs.
+- `audit`: user wants compliance findings. Preserve the Brand Audit output contract, cite the specific local/live sources checked, and include proof expectations for contrast, typography, source freshness, and asset choices.
+- `design-system implementation`: user wants a current Liatrio design-system surface. Prefer Space Grotesk, dark-first graphite surfaces, bright green signal accents, flat technical components, botanical/circuit motifs, and local preview recipes.
+- `static/offline artifact`: user wants a portable static file, screenshot, or helper output. Prefer bundled/local fonts and assets; avoid remote runtime dependencies unless the user explicitly allows them.
+- `deck`: user wants slides or presentation guidance. Use curated deck assets when present, confirm logo/background fit, and apply the same source-priority and accessibility checks as UI work.
+- `social/hero image`: user wants visual or image-direction guidance. Confirm dimensions and background brightness, select the correct logo/logomark variant, and choose botanical/circuit/texture motifs deliberately rather than decoratively.
~~~

## Artifact: Skill Validation Gate

**What it proves:** The updated `SKILL.md` frontmatter and structure remain valid according to the repository's skill validator.

**Why it matters:** The router update changes frontmatter description and metadata; this gate confirms those changes did not break installable skill structure.

**Command:**

~~~bash
uv run scripts/quick_validate.py skills/liatrio-brand-guidelines
~~~

**Result summary:** The command succeeded.

~~~text
Skill is valid!
~~~

## Artifact: Stale Guidance Text Scan

**What it proves:** Current scripted/canonical brand-data guidance now uses `liatrio.ai`; DM Sans is explicitly legacy/noncanonical; remaining `liatrio.com` references are only retained in the legacy consolidated reference as provenance-only historical URLs.

**Why it matters:** Task 1.10 requires inspecting stale guidance across the skill package, not just the router file.

**Command:**

~~~bash
rg "DM Sans|liatrio\.com|brand-data" skills/liatrio-brand-guidelines
~~~

**Result summary:** The scan found current `liatrio.ai` brand-data references in `SKILL.md` and scripts. It found DM Sans only in legacy/noncanonical notes. It found `liatrio.com` only in `references/liatrio-brand-guidelines.md` lines labeled `Legacy URL retained for provenance only` or `Legacy provenance only`.

~~~text
skills/liatrio-brand-guidelines/SKILL.md:  canonical-brand-source: https://www.liatrio.ai/brand-data.json
skills/liatrio-brand-guidelines/SKILL.md:4. `https://www.liatrio.ai/brand-data.json` as the only current scripted/canonical live brand-data source.
skills/liatrio-brand-guidelines/SKILL.md:- Legacy typography note: DM Sans appears in older consolidated brand material. Treat it as noncanonical for new design-system work unless a specific user-provided source explicitly requires it.
skills/liatrio-brand-guidelines/scripts/download-brand-assets.sh:BRAND_API="https://www.liatrio.ai/brand-data.json"
skills/liatrio-brand-guidelines/scripts/fetch-brand-data.sh:curl -sfS --connect-timeout 10 --max-time 30 https://www.liatrio.ai/brand-data.json | jq .
skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md:- Legacy URL retained for provenance only: `https://www.liatrio.com/brand-logos/logo_Liatrio.svg`
skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md:Legacy note: This older consolidated source uses DM Sans throughout. For new
skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md:### DM Sans (legacy/noncanonical)
skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md:- Current live source: `https://www.liatrio.ai/brand-data.json`
skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md:- Legacy provenance only: `https://www.liatrio.com/brand-data.json`
~~~

## Artifact: Changed File Scope

**What it proves:** The implementation stayed within the task 1.0 router/proof/task-state scope, with minimal supporting script/reference edits needed for the required text-scan gate.

**Why it matters:** The spec forbids active Hermes profile sync and raw bundle copying. This changed-file set confirms only repository skill/docs files were touched.

**Command:**

~~~bash
git diff --stat -- skills/liatrio-brand-guidelines docs/specs/03-spec-liatrio-design-system-skill-update
~~~

**Result summary:** Only the Liatrio skill router/supporting reference/scripts and spec task file were in the tracked diff at this point; the proof file itself was newly created under the required `03-proofs/` directory. No active Hermes profile files or raw design-system bundle assets were added.

~~~text
.../03-tasks-liatrio-design-system-skill-update.md |  22 +--
 skills/liatrio-brand-guidelines/SKILL.md           | 190 ++++++++++-----------
 .../references/liatrio-brand-guidelines.md         |  52 +++---
 .../scripts/download-brand-assets.sh               |   6 +-
 .../scripts/fetch-brand-data.sh                    |   4 +-
 5 files changed, 142 insertions(+), 132 deletions(-)
~~~

**Additional status check before staging:**

~~~text
 M docs/specs/03-spec-liatrio-design-system-skill-update/03-tasks-liatrio-design-system-skill-update.md
 M skills/liatrio-brand-guidelines/SKILL.md
 M skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md
 M skills/liatrio-brand-guidelines/scripts/download-brand-assets.sh
 M skills/liatrio-brand-guidelines/scripts/fetch-brand-data.sh
?? docs/specs/03-spec-liatrio-design-system-skill-update/03-proofs/
~~~

## Reviewer Conclusion

The evidence shows Task 1.0 is complete: the compact router is implemented, current source/typography guidance is reconciled, required output contracts are preserved, verification routing is updated, stale guidance is either removed from active sources or explicitly legacy/provenance-only, and the skill validation gate passes. Active Hermes profile sync was not performed.
