# 03-spec-liatrio-design-system-skill-update.md

## Introduction/Overview

The `liatrio-brand-guidelines` skill currently provides Liatrio brand guidance, audit formats, asset-selection rules, and verification loops, but the repository version is stale relative to the active local skill and the newly provided `Liatrio Design System.zip` bundle. This feature updates the existing skill so agents can use the new design system as a curated source for Liatrio-branded UI, documentation, decks, static artifacts, and compliance audits without bloating the always-loaded skill prompt.

The primary goal is to turn the design-system bundle into a maintainable skill update: keep `SKILL.md` as a compact router, add detailed references for design-system usage and component recipes, curate only high-value assets into the skill package, preserve existing brand-audit behavior, and validate the updated skill through repository quality gates and representative proof artifacts.

## Goals

- Update `skills/liatrio-brand-guidelines` to reflect the current Liatrio design system, including Space Grotesk, dark-first visual posture, `liatrio.ai` source priority, and curated token/asset guidance.
- Preserve the existing skill's mature behavior for brand audits, implementation decisions, source-conflict handling, and verification loops.
- Convert the design-system ZIP into progressive-disclosure resources under `references/` and `assets/` instead of copying the full bundle or embedding full token catalogs in `SKILL.md`.
- Add proof-ready validation paths for skill structure, documentation drift, asset curation, and representative design-system usage.
- Avoid routing ambiguity by improving the existing `liatrio-brand-guidelines` skill rather than introducing a competing Liatrio design-system skill.

## User Stories

- **As a Liatrio AI Enablement engineer**, I want the Liatrio brand skill to use the design team's current design system so that agents produce UI, docs, decks, and audits that match the real brand direction instead of stale guidance.
- **As an agent using the skill**, I want a compact router plus targeted references so that I can load only the design-system detail needed for the current task and avoid wasting context on irrelevant assets or token catalogs.
- **As a reviewer of generated Liatrio artifacts**, I want proof artifacts and audit criteria that check typography, tokens, dark-first surfaces, motif usage, copy tone, asset selection, and accessibility so that design compliance is observable instead of subjective.
- **As a skill maintainer**, I want curated assets, provenance notes, validation commands, and repository metadata kept in sync so that the skill remains installable, portable, and easy to update.

## Demoable Units of Work

### Unit 1: Existing Skill Reconciliation and Router Update

**Purpose:** Bring the repository skill up to the active guidance baseline and make `SKILL.md` a compact router for brand, design-system, deck, static/offline, and audit workflows.

**Functional Requirements:**

- The system shall update `skills/liatrio-brand-guidelines/SKILL.md` so the frontmatter description mentions Liatrio brand and design-system usage, including UI design, brand audits, decks, docs, asset selection, typography, visual polish, and formal compliance checks.
- The system shall preserve the existing brand audit and implementation decision output contracts while adding design-system routing guidance.
- The system shall update source priority to prefer curated local design-system references/assets and `https://www.liatrio.ai/brand-data.json`; older `liatrio.com` sources shall not remain scripted or canonical fallbacks.
- The system shall treat Space Grotesk as the current canonical typeface and identify DM Sans guidance as legacy or noncanonical unless a specific source explicitly requires it.
- The system shall route agents to targeted references based on task mode, including implementation, audit, design-system implementation, static/offline artifact, deck, and social/hero image work.

**Proof Artifacts:**

- Git diff: `skills/liatrio-brand-guidelines/SKILL.md` diff demonstrates the router, source priority, typography, and output contract changes.
- CLI: `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` returns success and demonstrates the skill remains structurally valid.
- Text scan: search output demonstrates stale unqualified DM Sans and `liatrio.com` canonical/fallback references have been removed or explicitly marked as legacy-only context.

### Unit 2: Curated Design-System References

**Purpose:** Convert the design-system bundle findings into concise, agent-readable references that preserve progressive disclosure and avoid prompt bloat.

**Functional Requirements:**

- The system shall create `references/liatrio-design-system.md` summarizing provenance, trust level, visual posture, token quick reference, typography, spacing, radius, elevation, motion, copy rules, logo rules, and known conflicts.
- The system shall create `references/liatrio-component-recipes.md` summarizing component and visual recipes from the preview HTML, including dark hero sections, flat card grids, primary button family, badges/pills, square chips, clipped-notch cards, forms, gradient dividers, circuit dividers, Venn diagrams, and botanical/circuit compositions.
- The system shall create `references/liatrio-asset-index.md` mapping curated local assets to usage guidance, avoidance guidance, light/dark background guidance, and notes.
- The system shall keep detailed design-system content in reference files rather than expanding `SKILL.md` into a monolithic prompt.
- The system shall document non-blocking caveats, including preview HTML raw values, absence of exported JS components, and conflicts between older deck/body-font guidance and current Space Grotesk rules.

**Proof Artifacts:**

- Filesystem: created reference files under `skills/liatrio-brand-guidelines/references/` demonstrate progressive-disclosure resource structure.
- Markdown review: reference snippets demonstrate token, component, asset, and conflict guidance without duplicating the entire ZIP content.
- CLI: `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` returns success after adding references.

### Unit 3: Curated Assets and Metadata

**Purpose:** Add the high-value CSS, font, logo, imagery, motif, and deck assets from the design-system bundle while excluding raw uploads, scratch files, and unneeded generated artifacts.

**Functional Requirements:**

- The system shall copy `colors_and_type.css` into `skills/liatrio-brand-guidelines/assets/` as the local token CSS source for generated artifacts.
- The system shall copy the Space Grotesk variable font into `skills/liatrio-brand-guidelines/assets/fonts/`.
- The system shall copy selected logo, logomark, botanical, circuit, texture, Venn, and deck template assets from `temp/Liatrio Design System/assets/` into `skills/liatrio-brand-guidelines/assets/`.
- The system shall copy curated preview HTML files into the skill as local reference artifacts, alongside markdown recipes, while still excluding the full ZIP, `uploads/`, `scratch/`, `scraps/`, `_ds_bundle.js`, and wholesale uncurated bundle directories.
- The system shall refresh `agents/openai.yaml` and repository docs if metadata or catalog entries change.

**Proof Artifacts:**

- Filesystem: asset listing demonstrates only curated files were copied into the skill package, including selected preview HTML reference artifacts.
- Git diff: asset additions demonstrate the ZIP was not committed wholesale and scratch/upload directories are absent.
- CLI: `uv run scripts/generate_openai_yaml.py skills/liatrio-brand-guidelines` runs successfully and demonstrates metadata can be regenerated.
- CLI: `python scripts/check_docs_drift.py` returns success and demonstrates repository docs remain in sync.

### Unit 4: Validation, Evaluation, and Adherence Checks

**Purpose:** Prove the updated skill is valid, useful, and ready for task planning without silently introducing stale guidance or unvalidated compliance claims.

**Functional Requirements:**

- The system shall run repository validation commands after skill updates, including `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` and `python scripts/check_docs_drift.py`.
- The system shall run `pre-commit run --all-files` before final implementation completion unless blocked by environment or unrelated pre-existing failures.
- The system shall stage or document representative eval prompts for at least dark HTML artifact generation, brand/design-system audit, deck asset selection, and static/offline helper restyling.
- The system shall define objective assertions for representative evals, including Space Grotesk usage, dark-first surfaces, token/asset guidance, absence of emoji/exclamation marks in marketing/product UI copy, and correct audit output structure.
- The system shall add a v1 `scripts/check-liatrio-design-adherence.py` checker that performs local deterministic checks for common token, font, copy, and structure violations and returns structured JSON suitable for review.

**Proof Artifacts:**

- CLI: `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` returns success.
- CLI: `python scripts/check_docs_drift.py` returns success.
- CLI: `pre-commit run --all-files` returns success or a documented blocker with root-cause details.
- Eval artifact: eval prompt file or review notes demonstrate representative prompts and assertions for updated skill behavior.
- CLI: `python skills/liatrio-brand-guidelines/scripts/check-liatrio-design-adherence.py <artifact>` returns structured JSON for a representative artifact and demonstrates the v1 adherence checker runs locally.

## Non-Goals (Out of Scope)

1. **Creating a separate competing Liatrio design-system skill**: The update shall improve the existing `liatrio-brand-guidelines` skill rather than adding an overlapping skill that would create routing ambiguity.
2. **Replacing the existing skill wholesale with the ZIP's `SKILL.md`**: The ZIP's skill file is useful source material but does not match this repository's validation constraints or existing audit contracts.
3. **Building a production UI component library**: The design-system bundle exposes tokens, assets, and preview recipes, but no reusable JS component API; this feature will not create React/Vue/Web Component packages.
4. **Committing raw bundle contents uncurated**: The implementation shall not commit the full ZIP, raw uploads, scratch files, scraps, or generated preview/slides directories wholesale; curated preview HTML reference artifacts are in scope.
5. **Guaranteeing pixel-perfect Figma parity**: The bundle is treated as a design-team-provided local system and agent reference, not a verified Figma or production-code export with pixel-perfect component contracts.
6. **Automatically overwriting the active Hermes profile skill**: Repository changes shall not directly mutate `/home/damien/.hermes/skills/...` unless explicitly approved after validation.

## Design Considerations

The updated skill should encode the new Liatrio visual direction clearly enough for agents to reproduce it in downstream artifacts:

- Dark-first graphite surfaces: `#1A1F23` canvas and `#1E2327` elevated cards.
- Bright green signal accents, especially `#89DF00`, with `#24AE1D` as primary brand green.
- Space Grotesk as the canonical brand typeface, with mono fonts reserved for code, specs, and technical labels.
- Botanical plus circuit-trace layering as the signature motif: dark base, low-opacity texture, thin green circuit marks, and Liatris imagery.
- Restrained violet/lime counterpoints, not broad rainbow decoration.
- Flat, technical component posture: hairline borders, compact labels, restrained shadows, focused green outlines, clipped-notch cards, square chips, and structured card grids.
- Copy posture: confident, technical, low-fluff, sentence case, no emoji, and no exclamation marks in marketing/product UI.
- Accessibility: normal text contrast target of 4.5:1, large text target of 3:1, non-color-only status semantics, focus states, and logo alt text.

## Repository Standards

Implementation should follow existing repository standards and conventions:

- Skills live under `skills/<skill-name>/` with `SKILL.md` as the required entry point.
- Skill resources should use conventional folders: `references/`, `assets/`, and `scripts/`.
- `SKILL.md` frontmatter must include valid `name` and string `description`; unsupported frontmatter keys should be avoided.
- If a frontmatter description contains a colon, the description must be quoted to preserve YAML validity.
- Use `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` to validate the skill package.
- Use `uv run scripts/generate_openai_yaml.py skills/liatrio-brand-guidelines` when metadata changes require refreshing `agents/openai.yaml`.
- Use `python scripts/check_docs_drift.py` when skill inventory, names, descriptions, additions, removals, or catalog text may affect README drift.
- Follow Conventional Commit style if commits are created.
- Do not bypass pre-commit hooks; fix hook failures or report blockers.
- Keep examples and reusable docs generic where applicable, using placeholders such as John Doe when person names are needed.

## Technical Considerations

The implementation should follow current agent-skill and design-token best practices discovered during the planning research:

- Treat the skill as a context-management artifact: keep `SKILL.md` concise and route to references/assets only when needed.
- Put bulky guidance in progressive-disclosure references instead of loading full token catalogs, preview HTML, or bundle manifests into the main skill body.
- Prefer machine-readable or deterministic resources for repeatable checks where practical, such as token CSS, asset indexes, and the v1 adherence checker.
- Prefer semantic/component token guidance over raw hex or raw spacing guidance when generating implementation instructions.
- Treat preview HTML as recipe evidence and local reference material, not production source code; bundle selected preview files while converting raw values into tokenized guidance when documenting recipes.
- Treat `_ds_bundle.js` as nonessential because it only initializes a namespace and exports no reusable components.
- Treat `_adherence.oxlintrc.json` as useful design-token enforcement source material for the v1 local adherence checker when it can be adapted without introducing external-service dependencies.
- Preserve local/offline artifact guidance: generated static artifacts should avoid external runtime fonts/images unless explicitly allowed.
- Current best-practice sources used for this spec include OpenAI Codex Skills, Anthropic Agent Skills, Agent Skills specification guidance, W3C Design Tokens, Figma design tokens, Material Design tokens, and USWDS accessibility guidance.

## Security Considerations

- No credentials, API keys, OAuth tokens, or secrets should be added to the skill package.
- Proof artifacts must not commit sensitive local paths outside the repository except when documenting source paths in implementation notes; active profile sync should require explicit approval.
- The extracted ZIP may include generated or raw files; implementation should curate assets intentionally and avoid committing unexpected user uploads, scratch files, or redundant artifacts.
- If scripts fetch live brand data, they should use `https://www.liatrio.ai/brand-data.json`, print source URLs and failure details, and avoid credentials.
- The v1 adherence checker should operate on local files and should not send artifact content to external services.
- Static/offline artifact guidance should avoid unapproved external resource requests such as Google Fonts, external logo URLs, or remote image links when offline behavior is required.

## Success Metrics

1. **Skill validation passes**: `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` completes successfully after all updates.
2. **Documentation drift check passes**: `python scripts/check_docs_drift.py` completes successfully after metadata and documentation changes.
3. **Curated asset set is present**: the skill contains the selected token CSS, Space Grotesk font, logo/logomark, botanical, circuit, texture, Venn, deck assets, and curated preview HTML reference artifacts without committing the full ZIP or raw upload/scratch directories.
4. **Progressive-disclosure references exist**: `references/liatrio-design-system.md`, `references/liatrio-component-recipes.md`, and `references/liatrio-asset-index.md` are present and referenced from `SKILL.md`.
5. **Stale guidance is resolved**: unqualified DM Sans and `liatrio.com` canonical or scripted fallback references are removed or marked legacy-only rather than current primary guidance.
6. **Representative evals are ready or run**: at least three representative prompts and objective assertions are staged or executed for human review.
7. **Adherence checker exists**: the v1 local adherence checker runs against at least one representative artifact and returns structured JSON.

## Open Questions

No open questions at this time. The answered decisions are now captured in the requirements: active Hermes profile sync remains a separate explicit approval step, the v1 adherence checker is in scope, curated preview HTML files are bundled as local references, and `liatrio.ai` is the only current scripted/canonical live brand-data source.
