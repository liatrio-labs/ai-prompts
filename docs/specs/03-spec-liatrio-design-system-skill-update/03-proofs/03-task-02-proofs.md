# Task 02 Proofs - Progressive-disclosure design-system references

## Task Summary

Task 2.0 adds focused Liatrio design-system references under `skills/liatrio-brand-guidelines/references/` without expanding the always-loaded `SKILL.md` or copying wholesale ZIP contents. The new files convert reusable guidance from the local design-system bundle into progressive-disclosure references for tokens, typography, visual posture, recipes, asset selection, accessibility, and known conflicts.

## What This Task Proves

- `liatrio-design-system.md` exists and documents provenance, trust level, source priority, tokens, Space Grotesk typography, motion, copy, logo rules, accessibility, and caveats.
- `liatrio-component-recipes.md` exists and documents tokenized recipes for dark heroes, flat card grids, buttons, badges/pills, square chips, clipped-notch cards, forms, gradient dividers, circuit dividers, Venn diagrams, and botanical/circuit compositions.
- `liatrio-asset-index.md` exists and maps planned/current curated assets to use cases, background guidance, avoidance guidance, provenance notes, and exclusions.
- The legacy consolidated `liatrio-brand-guidelines.md` now points readers to the new progressive-disclosure references.
- The references explicitly distinguish recipes from production components and state `_ds_bundle.js` exports no reusable JS component API.
- Skill validation still passes after adding the reference files.

## Evidence Summary

- Filesystem proof confirms all three new reference files are present next to the existing legacy reference.
- Markdown excerpts show token, typography, component recipe, asset, and conflict guidance without embedding full manifests or preview HTML.
- Text scan proof confirms `_ds_bundle.js`, DM Sans, `liatrio.com`, and excluded directories are mentioned only as caveats, legacy context, or exclusions.
- `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` returned `Skill is valid!`.

## Artifact: Reference files exist

**What it proves:** The progressive-disclosure reference files required by Task 2.0 were created under the skill's `references/` directory.

**Why it matters:** The skill can route users to detailed design-system guidance without turning `SKILL.md` into a monolithic prompt.

**Command:**

~~~bash
find skills/liatrio-brand-guidelines/references -maxdepth 1 -type f | sort
~~~

**Result summary:** The listing includes the three new references plus the existing legacy consolidated brand reference.

~~~text
skills/liatrio-brand-guidelines/references/liatrio-asset-index.md
skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md
skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md
skills/liatrio-brand-guidelines/references/liatrio-design-system.md
~~~

## Artifact: Markdown excerpts demonstrate concise reusable guidance

**What it proves:** The new references contain reviewer-usable guidance for source priority, typography, conflicts, component recipes, and assets without dumping full source files from the bundle.

**Why it matters:** Task 2.0 is specifically about progressive disclosure: enough detail for agents to use the design system correctly, but no wholesale ZIP or manifest duplication.

**Command:**

~~~bash
python - <<'PY'
from pathlib import Path
files=[
'skills/liatrio-brand-guidelines/references/liatrio-design-system.md',
'skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md',
'skills/liatrio-brand-guidelines/references/liatrio-asset-index.md',
]
terms=['Token quick reference','Typography','Known conflicts','Dark hero sections','Primary buttons','Clipped-notch cards','Token and font assets','Explicit exclusions']
for f in files:
    print(f'--- {f} ---')
    text=Path(f).read_text().splitlines()
    for term in terms:
        for i,line in enumerate(text,1):
            if term.lower() in line.lower():
                start=max(1,i); end=min(len(text),i+5)
                print(f'[{term}] lines {start}-{end}')
                for j in range(start,end+1): print(f'{j}: {text[j-1]}')
                break
PY
~~~

**Result summary:** The excerpts show task-critical headings and content in each reference. The first `Token quick reference` match also demonstrates source-priority guidance that routes to local token CSS and `liatrio.ai` while marking legacy `liatrio.com` as conflict evidence only.

~~~text
--- skills/liatrio-brand-guidelines/references/liatrio-design-system.md ---
[Token quick reference] lines 11-16
11:   2. Local token CSS once curated into `assets/colors_and_type.css`; until then, use this reference's token quick reference.
12:   3. Live scripted brand data from `https://www.liatrio.ai/brand-data.json` when a task explicitly requires live verification.
13:   4. Legacy `liatrio.com` references only as historical conflict evidence, never as current canonical or scripted fallback guidance.
14: - **Do not copy wholesale:** do not embed raw bundle manifests, full preview HTML, web-capture payloads, uploads, scratch files, scraps, or generated bundles in user artifacts or proof notes.
15:
16: ## Visual posture
[Typography] lines 51-56
51: ## Typography
52:
53: Space Grotesk is the current canonical typeface for brand-facing generated artifacts.
54:
55: - **Font:** `"Space Grotesk", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
56: - **Weights:** 300 for large quotes/editorial body, 400 for paragraphs, 500 for buttons/eyebrows/table headers, 600 for H2/H3/display, 700 for H1 only.
[Known conflicts] lines 111-116
111: ## Known conflicts and caveats
112:
113: - The design-system bundle says no production codebase or Figma source was attached; do not claim production parity.
114: - Preview HTML contains useful recipes and raw capture values, but it is not a reusable component library.
115: - `_ds_bundle.js` initializes a namespace for previews and exports no reusable JS component API. Do not instruct agents to import components from it.
116: - Older deck/body-font guidance may mention DM Sans; current brand-facing artifacts should use Space Grotesk unless a specific current source says otherwise.
--- skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md ---
[Dark hero sections] lines 19-24
19: ## Dark hero sections
20:
21: **Use for:** marketing page hero, product landing surface, static/offline branded page, deck title slide.
22:
23: **Structure:**
24:
[Primary buttons] lines 58-63
58: ## Primary buttons
59:
60: The source bundle contains both capsule guidance and `liatrio.ai` captured square uppercase buttons. Match the user task context:
61:
62: ### Square primary button, current site-style recipe
63:
[Clipped-notch cards] lines 129-134
129: ## Clipped-notch cards
130:
131: **Use for:** featured resources, editorial promos, deck callouts, distinctive site-like blocks.
132:
133: ```css
134: .notch-card {
--- skills/liatrio-brand-guidelines/references/liatrio-asset-index.md ---
[Token and font assets] lines 12-17
12: ## Token and font assets
13:
14: | Asset | Planned/current skill path | Use case | Notes |
15: | --- | --- | --- | --- |
16: | Colors and type CSS | `assets/colors_and_type.css` | Local token source for static HTML, audits, and deterministic checks | Copy from source bundle in asset-curation task; use semantic roles rather than dumping every variable into prompts. |
17: | Space Grotesk variable font | `assets/fonts/SpaceGrotesk-VariableFont_wght.ttf` | Offline/static artifacts, decks, UI mockups | Canonical current typeface. Use `font-display: swap`; do not call Google Fonts for offline artifacts. |
[Explicit exclusions] lines 88-93
88: ## Explicit exclusions
89:
90: Do not copy or depend on these as skill assets:
91:
92: - The original ZIP file.
93: - Source `uploads/`, `scratch/`, or `scraps/` directories.
~~~

## Artifact: Caveat, conflict, and exclusion scan

**What it proves:** Known conflict terms and excluded source-bundle paths are present only as legacy/provenance caveats, production-component disclaimers, or explicit exclusions.

**Why it matters:** Task 2.0 requires the references to distinguish recipes from production components, avoid stale canonical guidance, and avoid unnecessary ZIP/raw-source copying.

**Command:**

~~~bash
rg -n "_ds_bundle\.js|production components|reusable JS component API|secrets|uploads/|scratch/|scraps/|DM Sans|liatrio\.com" \
  skills/liatrio-brand-guidelines/references/liatrio-design-system.md \
  skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md \
  skills/liatrio-brand-guidelines/references/liatrio-asset-index.md \
  skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md
~~~

**Result summary:** Matches are intentional: legacy `liatrio.com` URLs are marked provenance-only, DM Sans is legacy/noncanonical, `_ds_bundle.js` is documented as non-API, and `uploads/`, `scratch/`, and `scraps/` are exclusions.

~~~text
skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md:43:- Legacy URL retained for provenance only: `https://www.liatrio.com/brand-logos/logo_Liatrio.svg`
skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md:129:Legacy note: This older consolidated source uses DM Sans throughout. For new
skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md:134:### DM Sans (legacy/noncanonical)
skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md:378:- Legacy provenance only: `https://www.liatrio.com/brand-data.json`
skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md:3:Use these recipes for generated UI, static HTML, decks, audits, and implementation guidance. They are derived from curated design-system previews and source notes, but they are **recipes, not production components**.
skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md:8:- `_ds_bundle.js` exports no reusable JS component API. Do not tell users to import components from it.
skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md:214:- Space Grotesk is present and DM Sans is absent or explicitly legacy-only.
skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md:220:- Recipe is implemented in target stack; no claim that preview HTML or `_ds_bundle.js` is a production component API.
skills/liatrio-brand-guidelines/references/liatrio-asset-index.md:10:- Do not use `_ds_bundle.js` as an asset source or component API; it exports no reusable JS components.
skills/liatrio-brand-guidelines/references/liatrio-asset-index.md:93:- Source `uploads/`, `scratch/`, or `scraps/` directories.
skills/liatrio-brand-guidelines/references/liatrio-asset-index.md:95:- `_ds_bundle.js` as a component API.
skills/liatrio-brand-guidelines/references/liatrio-asset-index.md:96:- Legacy `liatrio.com` assets as active fallback sources.
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:8:- **Source anchor:** the bundle describes itself as anchored to Liatrio Brand Guidelines v2026-04-14. No production codebase or Figma source was attached, so treat previews as design recipes, not pixel-perfect production components.
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:13:  4. Legacy `liatrio.com` references only as historical conflict evidence, never as current canonical or scripted fallback guidance.
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:60:- **Conflict:** DM Sans appears in older brand material. Treat it as legacy/noncanonical unless a user-provided current source explicitly requires it.
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:115:- `_ds_bundle.js` initializes a namespace for previews and exports no reusable JS component API. Do not instruct agents to import components from it.
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:116:- Older deck/body-font guidance may mention DM Sans; current brand-facing artifacts should use Space Grotesk unless a specific current source says otherwise.
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:118:- Do not use legacy `liatrio.com` URLs as active fallback sources. Use them only for provenance/conflict review when necessary.
~~~

## Artifact: Skill validation

**What it proves:** Adding the references did not break the skill package structure or metadata validation.

**Why it matters:** The updated skill remains usable by repository tooling after progressive-disclosure references are added.

**Command:**

~~~bash
uv run scripts/quick_validate.py skills/liatrio-brand-guidelines
~~~

**Result summary:** The validator succeeded.

~~~text
Skill is valid!
~~~

## Artifact: Security-oriented text scan

**What it proves:** The new references do not contain obvious secret values; matches are generic prose about tokens or exclusions rather than credentials.

**Why it matters:** Proof and reference artifacts are committed, so obvious credential-like content must be avoided.

**Command:**

~~~bash
rg -n "(?i)(api[_-]?key|token|secret|password|oauth|bearer)" \
  skills/liatrio-brand-guidelines/references/liatrio-design-system.md \
  skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md \
  skills/liatrio-brand-guidelines/references/liatrio-asset-index.md || true
~~~

**Result summary:** Matches are the word `token` in design-token context plus an exclusion note for credential/OAuth artifacts; no secret values are present.

~~~text
skills/liatrio-brand-guidelines/references/liatrio-asset-index.md:12:## Token and font assets
skills/liatrio-brand-guidelines/references/liatrio-asset-index.md:16:| Colors and type CSS | `assets/colors_and_type.css` | Local token source for static HTML, audits, and deterministic checks | Copy from source bundle in asset-curation task; use semantic roles rather than dumping every variable into prompts. |
skills/liatrio-brand-guidelines/references/liatrio-asset-index.md:97:- Any credential, token, OAuth artifact, or private user upload.
skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md:7:- The local design-system preview HTML demonstrates visual treatments and token usage. It is not a React, Vue, Web Component, or package API.
skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md:9:- Prefer tokenized implementation in the target project's native stack. Copy only the design intent, relevant tokens, and accessibility behavior.
skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md:175:- Preferred token: `--grad-divider`, a violet-to-lime hairline.
skills/liatrio-brand-guidelines/references/liatrio-component-recipes.md:215:- Surface uses dark-first graphite tokens unless a light editorial break is justified.
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:11:  2. Local token CSS once curated into `assets/colors_and_type.css`; until then, use this reference's token quick reference.
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:26:## Token quick reference
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:28:Prefer semantic tokens and named roles. Use raw hex only when implementing a standalone artifact without the token CSS available.
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:30:| Role | Token / value | Use |
skills/liatrio-brand-guidelines/references/liatrio-design-system.md:59:- **Mono:** reserve `ui-monospace`, JetBrains Mono, SF Mono, Menlo, Consolas, or equivalent for code, version tags, technical labels, and token names.
~~~

## Reviewer Conclusion

Task 2.0 is complete. The skill now has focused progressive-disclosure references for the current Liatrio design system, component/visual recipes, and asset-selection guidance; legacy conflicts are routed clearly; production-component caveats are explicit; excluded raw bundle content remains excluded; and skill validation passes.
