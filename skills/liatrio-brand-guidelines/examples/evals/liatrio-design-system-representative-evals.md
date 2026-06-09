# Liatrio Design-System Representative Evals

These representative evals are lightweight prompt/review artifacts for humans or agents validating the updated `liatrio-brand-guidelines` skill. They are objective by design: each prompt includes assertions that can be checked manually and by the local v1 adherence checker where an output artifact is available.

## Eval 1: Dark HTML artifact generation

### Prompt

> Create a single-file dark-first Liatrio landing-page hero for a platform engineering service. Use only bundled/local Liatrio skill assets and references. The output should be static HTML suitable for offline review.

### Objective assertions

- Uses Space Grotesk through `assets/colors_and_type.css` or an equivalent local `@font-face` reference to the bundled Space Grotesk font.
- Uses dark-first surfaces with `--bg`, `--surface`, `--dark-bg`, `--dark-bg-2`, `#1A1F23`, or `#1E2327`.
- Uses approved green accents through `--primary-green`, `--bright-green`, `--accent`, `--accent-bright`, `#24AE1D`, or `#89DF00`.
- Avoids DM Sans, emoji, and exclamation marks in visible marketing/product UI copy.
- Includes a `main` landmark and a non-empty `title`.
- References bundled/local assets for fonts, CSS, logos, or motifs; no unapproved external runtime font/image requests.
- Notes `https://www.liatrio.ai/brand-data.json` only as the current live provenance source if a live source is mentioned.

### Representative artifact

- `representative-dark-html-artifact.html`

### Suggested deterministic check

```bash
python skills/liatrio-brand-guidelines/scripts/check-liatrio-design-adherence.py \
  skills/liatrio-brand-guidelines/examples/evals/representative-dark-html-artifact.html --pretty
```

## Eval 2: Brand/design-system audit

### Prompt

> Audit the provided Liatrio UI mockup or HTML artifact against the current Liatrio brand and design-system skill. Preserve the skill's Brand Audit output contract and include concrete remediation guidance.

### Objective assertions

- Output includes an audit-oriented structure with `Executive Summary`, `Findings`, and `Recommendations` or equivalent implementation decisions.
- Evaluates Space Grotesk usage and flags DM Sans as legacy/noncanonical unless explicitly required by a source.
- Evaluates dark-first surfaces, approved green usage, tokenized spacing/type/radius, motif/logo use, and accessibility posture.
- Flags emoji and exclamation marks in marketing/product UI copy.
- Distinguishes current curated local references/assets and `https://www.liatrio.ai/brand-data.json` from legacy `liatrio.com` references.
- Provides objective pass/warn/fail evidence rather than subjective style commentary only.

## Eval 3: Deck asset selection

### Prompt

> Recommend Liatrio deck assets and layout guidance for a technical executive-readout deck. Use the curated local asset index and avoid assuming uncommitted raw bundle or upload assets exist.

### Objective assertions

- Chooses logo variants appropriate for dark or light slide backgrounds and explains why.
- Uses botanical/circuit/texture/Venn motifs only where they support the technical story.
- Uses Space Grotesk and current token guidance for typography, green accents, and restrained violet/lime counterpoints.
- Avoids committing or relying on the blocked large PowerPoint template; if mentioned, treats it as evaluated context rather than a committed asset.
- Avoids emoji and exclamation marks in slide/product UI copy.
- References `references/liatrio-asset-index.md` and curated assets under `assets/`, not `uploads/`, `scratch/`, `scraps/`, or `_ds_bundle.js`.

## Eval 4: Static/offline helper restyling

### Prompt

> Restyle an existing static helper page so it reads as a Liatrio-branded offline artifact. Keep it self-contained and avoid external runtime dependencies.

### Objective assertions

- Uses local token CSS and bundled Space Grotesk or embeds equivalent local CSS copied from `assets/colors_and_type.css`.
- Uses local image/logo/motif references only, or documents why imagery is omitted for offline portability.
- Uses dark-first surfaces, approved green accents, hairline borders, compact labels, and flat technical cards where appropriate.
- Does not add Google Fonts, remote logo URLs, CDN CSS, or external image requests.
- Avoids DM Sans, emoji, exclamation marks, and broad rainbow decoration.
- Includes a verification note describing local/offline behavior and the adherence checker result if an HTML artifact is produced.
