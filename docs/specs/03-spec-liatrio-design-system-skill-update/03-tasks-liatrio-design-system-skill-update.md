# 03-tasks-liatrio-design-system-skill-update.md

## Standards Evidence Table

| Source File | Read | Standards Extracted | Conflicts |
| --- | --- | --- | --- |
| `AGENTS.md` | yes | Use `uv run` from repository root for skill scripts; update `SKILL.md` and resources before regenerating metadata; run `python scripts/check_docs_drift.py` when skill inventory changes. | none |
| `README.md` | yes | Skills live under `skills/`; `liatrio-brand-guidelines` is cataloged as Liatrio visual brand standards and UI compliance guidance; skill authoring helpers include `quick_validate.py`, `init_skill.py`, and `generate_openai_yaml.py`. | none |
| `CONTRIBUTING.md` | yes | Skills use `skills/<skill-name>/` with `SKILL.md`; keep frontmatter `name` and `description` valid and non-empty; run `pre-commit run --all-files` and `python scripts/check_docs_drift.py`. | none |
| `docs/development.md` | yes | Validate skills with `uv run scripts/quick_validate.py`; refresh `agents/openai.yaml` with `uv run scripts/generate_openai_yaml.py`; use `pre-commit run --all-files` and PR-template quality gates. | none |
| `.github/pull_request_template.md` | yes | PR evidence should include why, what changed, testing performed, hooks run, docs updated, and conventional commit compliance. | none |
| `.pre-commit-config.yaml` | yes | Hooks include docs drift check, YAML/TOML hygiene, end-of-file/trailing whitespace checks, markdownlint-fix, commitlint, and gitleaks with redaction. | none |
| `pyproject.toml` | not found | No Python project metadata discovered at repository root. | none |

## Relevant Files

| File | Why It Is Relevant |
| --- | --- |
| `skills/liatrio-brand-guidelines/SKILL.md` | Main skill entry point; must become the compact router for brand, design-system, implementation, audit, deck, static/offline, and asset-selection workflows. |
| `skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md` | Existing detailed local reference that may need preservation, conflict notes, or legacy guidance cleanup. |
| `skills/liatrio-brand-guidelines/references/liatrio-design-system.md` | New progressive-disclosure design-system reference summarizing provenance, tokens, typography, visual posture, motion, copy, logo rules, accessibility, and conflicts. |
| `skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md` | New component and visual recipe reference derived from preview HTML without treating previews as production components. |
| `skills/liatrio-brand-guidelines/references/liatrio-asset-index.md` | New curated asset map with usage guidance, avoidance guidance, background guidance, and provenance notes. |
| `skills/liatrio-brand-guidelines/assets/colors_and_type.css` | Local token CSS source copied from the design-system bundle for generated artifacts and deterministic checks. |
| `skills/liatrio-brand-guidelines/assets/fonts/SpaceGrotesk-VariableFont_wght.ttf` | Canonical bundled Space Grotesk font for local/offline artifacts. |
| `skills/liatrio-brand-guidelines/assets/logos/` | Curated logo and logomark variants for light/dark background guidance. |
| `skills/liatrio-brand-guidelines/assets/motifs/` | Curated botanical, circuit, texture, and Venn assets from the design-system bundle. |
| `skills/liatrio-brand-guidelines/assets/decks/` | Curated deck template asset location for slide/deck guidance. |
| `skills/liatrio-brand-guidelines/assets/previews/` | Curated preview HTML reference artifacts copied from the design-system bundle for local inspection. |
| `skills/liatrio-brand-guidelines/scripts/fetch-brand-data.sh` | Existing live brand-data script that must switch to `liatrio.ai` only or be updated/removed if stale. |
| `skills/liatrio-brand-guidelines/scripts/download-brand-assets.sh` | Existing asset refresh script that must stop depending on `liatrio.com` scripted fallback behavior. |
| `skills/liatrio-brand-guidelines/scripts/check-liatrio-design-adherence.py` | New local deterministic adherence checker for token, font, copy, and structure checks. |
| `skills/liatrio-brand-guidelines/examples/evals/` | Planned location for representative prompts/assertions or review artifacts for dark HTML, audits, deck selection, and static/offline restyling. |
| `skills/liatrio-brand-guidelines/agents/openai.yaml` | Generated skill metadata that may need refreshing after `SKILL.md` metadata changes. |
| `README.md` | Skills catalog may need a description update if `liatrio-brand-guidelines` metadata changes. |
| `docs/development.md` | Development guidance may need updates only if validation workflow or helper-script usage changes. |
| `temp/Liatrio Design System/README.md` | Source bundle context and provenance for reference writing; should not be copied wholesale into the skill. |
| `temp/Liatrio Design System/SKILL.md` | Source bundle skill text to mine for useful guidance while preserving repository contracts. |
| `temp/Liatrio Design System/colors_and_type.css` | Source token CSS for curated local asset copy. |
| `temp/Liatrio Design System/_ds_manifest.json` | Source manifest for asset inventory and provenance cross-checks. |
| `temp/Liatrio Design System/_adherence.oxlintrc.json` | Source design-token enforcement material to adapt for the v1 local checker if practical. |
| `temp/Liatrio Design System/assets/` | Source curated design-system assets for logos, motifs, Venn, backgrounds, and deck template. |
| `temp/Liatrio Design System/fonts/SpaceGrotesk-VariableFont_wght.ttf` | Source canonical font file for local/offline artifacts. |
| `temp/Liatrio Design System/preview/` | Source preview HTML files for selected local references and markdown recipe extraction. |
| `docs/specs/03-spec-liatrio-design-system-skill-update/03-spec-liatrio-design-system-skill-update.md` | Source-of-truth spec for validating implementation scope and non-goals. |
| `docs/specs/03-spec-liatrio-design-system-skill-update/03-tasks-liatrio-design-system-skill-update.md` | Execution blueprint for implementation and proof collection. |
| `docs/specs/03-spec-liatrio-design-system-skill-update/03-audit-liatrio-design-system-skill-update.md` | Planning audit report that gates implementation readiness. |

### Notes

- This repository is primarily Markdown, shell, and Python helper scripts; validate with repository helper scripts and pre-commit rather than adding a new test framework.
- Do not copy the full design-system ZIP, `uploads/`, `scratch/`, `scraps/`, `_ds_bundle.js`, or wholesale uncurated directories into the skill.
- Keep `SKILL.md` compact; move detailed token, asset, and component guidance into references/assets/scripts.
- Use generic placeholders such as John Doe in reusable examples.
- Active Hermes profile sync is explicitly out of scope unless separately approved after repository validation.

## Tasks

### [x] 1.0 Reconcile `SKILL.md` as the Compact Design-System Router

#### 1.0 Proof Artifact(s)

- Diff: `git diff -- skills/liatrio-brand-guidelines/SKILL.md` demonstrates the router now prioritizes curated local design-system resources and `https://www.liatrio.ai/brand-data.json` without scripted/canonical `liatrio.com` fallback guidance.
- CLI: `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` returns success and demonstrates the updated skill metadata and structure remain valid.
- Text scan: `rg "DM Sans|liatrio\.com|brand-data" skills/liatrio-brand-guidelines` demonstrates DM Sans and `liatrio.com` references are absent or explicitly legacy-only while `liatrio.ai` is the current live source.

#### 1.0 Tasks

- [x] 1.1 Read `skills/liatrio-brand-guidelines/SKILL.md` and identify stale canonical-source, typography, reference-routing, workflow-checklist, and verification-loop sections to preserve or replace.
- [x] 1.2 Compare the repository skill with the active local design guidance already captured in the spec and avoid copying `/home/damien/.hermes/skills/...` directly into this repository.
- [x] 1.3 Update `SKILL.md` frontmatter so `description` remains a valid YAML string and mentions Liatrio brand plus design-system use cases for UI, docs, decks, audits, assets, typography, visual polish, and compliance checks.
- [x] 1.4 Replace the source-priority section with curated local references/assets first and `https://www.liatrio.ai/brand-data.json` as the only current scripted/canonical live brand-data source.
- [x] 1.5 Mark DM Sans as legacy/noncanonical where needed and make Space Grotesk the current canonical typeface for brand-facing generated artifacts.
- [x] 1.6 Add task-mode routing in `SKILL.md` for implementation, audit, design-system implementation, static/offline artifact, deck, and social/hero image workflows.
- [x] 1.7 Preserve the existing Brand Audit and Implementation Decision output contracts while expanding them only enough to reference design-system sources and proof expectations.
- [x] 1.8 Update the verification loop and workflow checklist so agents load targeted references, confirm asset choices, check accessibility, and report live-source verification status.
- [x] 1.9 Run `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` and fix any frontmatter or structure issues introduced by the router update.
- [x] 1.10 Run `rg "DM Sans|liatrio\.com|brand-data" skills/liatrio-brand-guidelines` and inspect results to confirm stale guidance is removed or explicitly legacy-only.

### [x] 2.0 Add Progressive-Disclosure Design-System References

#### 2.0 Proof Artifact(s)

- Filesystem: `find skills/liatrio-brand-guidelines/references -maxdepth 1 -type f | sort` shows `liatrio-design-system.md`, `liatrio-component-recipes.md`, and `liatrio-asset-index.md` are present.
- Markdown review: excerpts from the new references demonstrate token, typography, visual posture, component recipe, asset usage, and known-conflict guidance without duplicating the full ZIP contents.
- CLI: `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` returns success after reference additions and demonstrates references do not break skill validation.

#### 2.0 Tasks

- [x] 2.1 Read `temp/Liatrio Design System/README.md`, `SKILL.md`, `colors_and_type.css`, `_ds_manifest.json`, and representative `preview/*.html` files to extract only reusable guidance.
- [x] 2.2 Create `skills/liatrio-brand-guidelines/references/liatrio-design-system.md` with provenance, trust level, source priority, visual posture, token quick reference, Space Grotesk typography, spacing, radii, elevation, motion, copy rules, logo rules, accessibility, and known conflicts.
- [x] 2.3 Create `skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md` with tokenized recipes for dark hero sections, flat card grids, primary buttons, badges/pills, square chips, clipped-notch cards, forms, gradient dividers, circuit dividers, Venn diagrams, and botanical/circuit compositions.
- [x] 2.4 Create `skills/liatrio-brand-guidelines/references/liatrio-asset-index.md` mapping curated assets to use cases, light/dark background guidance, avoidance guidance, provenance, and notes.
- [x] 2.5 Update `references/liatrio-brand-guidelines.md` only where needed to remove stale conflicts or point readers to the new design-system references.
- [x] 2.6 Ensure all references distinguish design recipes from production components and explicitly state that `_ds_bundle.js` exports no reusable JS component API.
- [x] 2.7 Ensure references do not include secrets, raw web-capture payloads, or unnecessary full token/manifest dumps from the ZIP.
- [x] 2.8 Run `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` after adding references and fix any validation issues.

### [ ] 3.0 Curate Design-System Assets and Preview HTML

#### 3.0 Proof Artifact(s)

- Filesystem: `find skills/liatrio-brand-guidelines/assets -maxdepth 3 -type f | sort` shows curated token CSS, Space Grotesk font, logos/logomarks, botanical/circuit/texture/Venn/deck assets, and selected preview HTML reference artifacts.
- Git diff: `git diff --stat -- skills/liatrio-brand-guidelines` demonstrates curated asset additions while excluding the full ZIP, `uploads/`, `scratch/`, `scraps/`, `_ds_bundle.js`, and wholesale uncurated bundle directories.
- CLI: `uv run scripts/generate_openai_yaml.py skills/liatrio-brand-guidelines` returns success and demonstrates generated agent metadata remains refreshable.
- CLI: `python scripts/check_docs_drift.py` returns success and demonstrates repository docs remain synchronized after metadata/catalog changes.

#### 3.0 Tasks

- [ ] 3.1 Create the required asset subdirectories under `skills/liatrio-brand-guidelines/assets/`, including `fonts/`, `logos/`, `motifs/`, `decks/`, and `previews/` as needed.
- [ ] 3.2 Copy `temp/Liatrio Design System/colors_and_type.css` into `skills/liatrio-brand-guidelines/assets/colors_and_type.css`.
- [ ] 3.3 Copy `temp/Liatrio Design System/fonts/SpaceGrotesk-VariableFont_wght.ttf` into `skills/liatrio-brand-guidelines/assets/fonts/`.
- [ ] 3.4 Copy selected logo and logomark assets from `temp/Liatrio Design System/assets/` into `skills/liatrio-brand-guidelines/assets/logos/` with names preserved or normalized consistently.
- [ ] 3.5 Copy selected botanical, circuit, texture, Venn, and background assets from `temp/Liatrio Design System/assets/` into `skills/liatrio-brand-guidelines/assets/motifs/`.
- [ ] 3.6 Copy the curated deck template from `temp/Liatrio Design System/assets/Liatrio-Deck-Template.pptx` into `skills/liatrio-brand-guidelines/assets/decks/` if file size and repository policy allow it.
- [ ] 3.7 Copy selected `temp/Liatrio Design System/preview/*.html` files and supporting `_card.css` into `skills/liatrio-brand-guidelines/assets/previews/` as local reference artifacts.
- [ ] 3.8 Do not copy `temp/Liatrio Design System/uploads/`, `scratch/`, `scraps/`, `_ds_bundle.js`, raw web-capture JSON, or the original ZIP into the skill.
- [ ] 3.9 Update `liatrio-asset-index.md` with the final curated asset file list after copying assets.
- [ ] 3.10 Run `uv run scripts/generate_openai_yaml.py skills/liatrio-brand-guidelines` if `SKILL.md` metadata changed, then inspect the resulting `skills/liatrio-brand-guidelines/agents/openai.yaml` diff.
- [ ] 3.11 Run `python scripts/check_docs_drift.py` and update `README.md` or related docs only if the drift check reports required catalog changes.
- [ ] 3.12 Run `find skills/liatrio-brand-guidelines/assets -maxdepth 3 -type f | sort` and `git diff --stat -- skills/liatrio-brand-guidelines` to confirm curated-only asset inclusion.

### [ ] 4.0 Add Local v1 Adherence Checker and Representative Evals

#### 4.0 Proof Artifact(s)

- CLI: `python skills/liatrio-brand-guidelines/scripts/check-liatrio-design-adherence.py <representative-artifact>` returns structured JSON for common token, font, copy, and structure checks without network access.
- Eval artifact: a committed prompt/review artifact documents representative prompts for dark HTML generation, brand/design-system audit, deck asset selection, and static/offline helper restyling with objective assertions.
- CLI: `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` returns success after adding scripts and eval/reference material.

#### 4.0 Tasks

- [ ] 4.1 Inspect `_adherence.oxlintrc.json` and `colors_and_type.css` to identify deterministic checks that can be implemented locally without adding external service dependencies.
- [ ] 4.2 Create `skills/liatrio-brand-guidelines/scripts/check-liatrio-design-adherence.py` using Python standard library where practical.
- [ ] 4.3 Implement structured JSON output with at least `status`, `checked_file`, `findings`, `warnings`, and `summary` fields.
- [ ] 4.4 Add checks for canonical Space Grotesk usage, stale DM Sans usage, expected dark-first surface tokens, approved green tokens, `liatrio.ai` source references, emoji/exclamation-mark copy issues, and missing audit/verification structure where applicable.
- [ ] 4.5 Ensure the checker runs only against local files and does not send artifact content to external services.
- [ ] 4.6 Add a minimal representative artifact under an examples/proof location if needed so the checker can be demonstrated without relying on uncommitted user files.
- [ ] 4.7 Create or update representative eval/review artifacts under `skills/liatrio-brand-guidelines/examples/evals/` for dark HTML artifact generation, brand/design-system audit, deck asset selection, and static/offline helper restyling.
- [ ] 4.8 Document objective assertions for each representative eval, including Space Grotesk, dark-first surfaces, token/asset guidance, no emoji/exclamation marks in marketing/product UI, correct audit output structure, and offline/local asset expectations.
- [ ] 4.9 Run the adherence checker against the representative artifact and save or document the command output path for validation.
- [ ] 4.10 Run `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` and fix any validation issues caused by scripts or examples.

### [ ] 5.0 Run Repository Quality Gates and Capture Final Implementation Proof

#### 5.0 Proof Artifact(s)

- CLI: `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` returns success and demonstrates final skill validity.
- CLI: `python scripts/check_docs_drift.py` returns success and demonstrates documentation/catalog drift is resolved.
- CLI: `pre-commit run --all-files` returns success, or a documented blocker includes root-cause details and identifies unrelated pre-existing failures if present.
- Review note: final proof summary maps completed work back to all four demoable units, non-goals, and security constraints, including confirmation that active Hermes profile sync was not performed.

#### 5.0 Tasks

- [ ] 5.1 Run `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` and fix any skill validation failures.
- [ ] 5.2 Run `python scripts/check_docs_drift.py` and fix any documentation drift reported by the script.
- [ ] 5.3 Run `pre-commit run --all-files` and fix failures without bypassing hooks.
- [ ] 5.4 Run `rg "liatrio\.com|DM Sans|uploads/|scratch/|scraps/|_ds_bundle\.js" skills/liatrio-brand-guidelines` and verify any matches are explicitly legacy-only or explanatory, not active guidance or copied raw bundle content.
- [ ] 5.5 Run `git status --short` and inspect the changed file set to confirm no raw ZIP, upload, scratch, scrap, credential, or active-profile files were added.
- [ ] 5.6 Capture a final proof summary in the implementation response or a local proof note that maps each completed parent task to its proof artifacts and spec demoable unit.
- [ ] 5.7 Confirm active Hermes profile sync was not performed and note that sync remains a separate explicit approval step after repository validation.
