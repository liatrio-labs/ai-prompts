# Task 03 Proofs - Curated Design-System Assets and Preview HTML

## Task Summary

This task curates the Liatrio design-system asset bundle into the repository skill package without copying raw upload, scratch, scrap, generated bundle, raw web-capture, oversized blocked files, or ZIP artifacts. It adds local token CSS, Space Grotesk, logo/logomark variants, selected motifs, and selected preview HTML reference cards for offline/static use and reviewer inspection.

## What This Task Proves

- The skill now contains curated local assets under conventional `assets/` subdirectories.
- The final asset index documents the committed asset list, usage guidance, exclusions, and large-file policy decisions.
- Repository metadata can still be regenerated and docs remain synchronized after asset curation.
- Forbidden source-bundle paths and generated/raw artifacts were not copied into the skill package.

## Evidence Summary

- `find skills/liatrio-brand-guidelines/assets -maxdepth 3 -type f | sort` shows token CSS, the Space Grotesk font, logos/logomarks, smaller motif assets, existing consolidated reference image, and selected previews.
- `uv run scripts/generate_openai_yaml.py skills/liatrio-brand-guidelines` completed with `[OK] Created agents/openai.yaml`; inspection showed no metadata diff.
- `python scripts/check_docs_drift.py` passed with the canonical skill catalog unchanged.
- `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` passed as an additional skill-structure quality gate.
- A forbidden-artifact scan returned no copied `uploads`, `scratch`, `scraps`, `_ds_bundle.js`, ZIP, or raw web-capture JSON paths in the skill.
- The repository large-file hook blocked the 4.2 MB deck template and three large imagery files; those were removed and documented as curation gaps in `liatrio-asset-index.md`.

## Artifact: Curated asset filesystem listing

**What it proves:** The expected curated token, font, logo, smaller motif, and preview assets exist in the skill package.

**Why it matters:** Unit 3 requires local/offline assets while explicitly avoiding wholesale source-bundle copying.

**Command:**

```bash
find skills/liatrio-brand-guidelines/assets -maxdepth 3 -type f | sort
```

**Result summary:** The listing includes the curated CSS, Space Grotesk font, logo family, selected motif assets, and preview cards. The pre-existing consolidated PNG remains present as a reference asset. The deck template and large imagery are intentionally absent due repository large-file policy.

```text
skills/liatrio-brand-guidelines/assets/colors_and_type.css
skills/liatrio-brand-guidelines/assets/fonts/SpaceGrotesk-VariableFont_wght.ttf
skills/liatrio-brand-guidelines/assets/liatrio-brand-guidelines-consolidated.png
skills/liatrio-brand-guidelines/assets/logos/logo_Liatrio_full-color.png
skills/liatrio-brand-guidelines/assets/logos/logo_Liatrio_reverse-color.png
skills/liatrio-brand-guidelines/assets/logos/logo_Liatrio_reverse.png
skills/liatrio-brand-guidelines/assets/logos/logo_Liatrio_reverse_preferred.png
skills/liatrio-brand-guidelines/assets/logos/logo_Liatrio_stacked.png
skills/liatrio-brand-guidelines/assets/logos/logo_Liatrio_stacked_reverse-preferred.png
skills/liatrio-brand-guidelines/assets/logos/logomark_Liatrio.png
skills/liatrio-brand-guidelines/assets/motifs/circuit-divider.svg
skills/liatrio-brand-guidelines/assets/motifs/circuit-traces.png
skills/liatrio-brand-guidelines/assets/motifs/liatris-digital.png
skills/liatrio-brand-guidelines/assets/motifs/venn-diagram.png
skills/liatrio-brand-guidelines/assets/previews/brand-circuit-divider.html
skills/liatrio-brand-guidelines/assets/previews/brand-gradient-divider.html
skills/liatrio-brand-guidelines/assets/previews/brand-imagery.html
skills/liatrio-brand-guidelines/assets/previews/brand-logo.html
skills/liatrio-brand-guidelines/assets/previews/brand-textures.html
skills/liatrio-brand-guidelines/assets/previews/brand-venn.html
skills/liatrio-brand-guidelines/assets/previews/_card.css
skills/liatrio-brand-guidelines/assets/previews/colors-brand.html
skills/liatrio-brand-guidelines/assets/previews/colors-greys.html
skills/liatrio-brand-guidelines/assets/previews/colors-semantic.html
skills/liatrio-brand-guidelines/assets/previews/components-badges.html
skills/liatrio-brand-guidelines/assets/previews/components-buttons.html
skills/liatrio-brand-guidelines/assets/previews/components-cards.html
skills/liatrio-brand-guidelines/assets/previews/components-chips-notch.html
skills/liatrio-brand-guidelines/assets/previews/components-forms.html
skills/liatrio-brand-guidelines/assets/previews/spacing-elevation.html
skills/liatrio-brand-guidelines/assets/previews/spacing-radii.html
skills/liatrio-brand-guidelines/assets/previews/type-body.html
skills/liatrio-brand-guidelines/assets/previews/type-display.html
skills/liatrio-brand-guidelines/assets/previews/type-weights.html
```

## Artifact: Curated-only exclusion scan

**What it proves:** The copied skill tree does not contain the explicitly forbidden source-bundle directories or generated/raw artifacts.

**Why it matters:** The spec non-goals prohibit committing uncurated raw uploads, scratch/scrap files, generated bundles, raw web captures, or ZIPs.

**Command:**

```bash
find skills/liatrio-brand-guidelines \
  -path '*uploads*' -o -path '*scratch*' -o -path '*scraps*' \
  -o -name '_ds_bundle.js' -o -name '*.zip' -o -name '*web-capture*.json' | sort
```

**Result summary:** The command returned no paths.

```text

```

## Artifact: Large-file policy decision

**What it proves:** Oversized source-bundle assets were evaluated, blocked by repository policy, removed, and documented instead of bypassing hooks.

**Why it matters:** Task 3.6 allowed copying the deck template only if file size and repository policy allowed it; repository policy did not.

**Observed pre-commit blocker:**

```text
check for added large files......................................................Failed
- hook id: check-added-large-files
- exit code: 1

skills/liatrio-brand-guidelines/assets/decks/Liatrio-Deck-Template.pptx (4262 KB) exceeds 500 KB.
skills/liatrio-brand-guidelines/assets/motifs/liatris-violet.png (2323 KB) exceeds 500 KB.
skills/liatrio-brand-guidelines/assets/motifs/liatrio-bg01.png (1230 KB) exceeds 500 KB.
skills/liatrio-brand-guidelines/assets/motifs/liatrio-bg08.png (582 KB) exceeds 500 KB.
```

**Result summary:** The deck template and three large imagery files were removed from the commit and documented in the asset index as curation gaps requiring approved external/storage handling if needed later.

## Artifact: Metadata regeneration

**What it proves:** The skill metadata remains refreshable after asset curation.

**Why it matters:** Repository standards require `agents/openai.yaml` to be regeneratable when skill metadata or inventory changes are relevant.

**Command:**

```bash
uv run scripts/generate_openai_yaml.py skills/liatrio-brand-guidelines
```

**Result summary:** Metadata generation succeeded. A follow-up diff check for `skills/liatrio-brand-guidelines/agents/openai.yaml` showed no content changes.

```text
[OK] Created agents/openai.yaml
```

## Artifact: Documentation drift check

**What it proves:** The repository skill catalog remains synchronized after the curated asset additions.

**Why it matters:** Documentation drift must remain clean when skill inventory or metadata could affect catalog output.

**Command:**

```bash
python scripts/check_docs_drift.py
```

**Result summary:** The drift check passed and reported the canonical skill catalog.

```text
Documentation drift check passed.
Canonical skills: branch-surgery-pr-split, browser-qa, create-mermaid-diagrams, create-pull-request, git-commit-conventional, liatrio-brand-guidelines, liatrio-dns, mastra-api, tilt-dev, uv-usage
```

## Artifact: Skill validation quality gate

**What it proves:** The updated skill package remains structurally valid after adding references and assets.

**Why it matters:** Asset additions should not break skill packaging or repository skill validation.

**Command:**

```bash
uv run scripts/quick_validate.py skills/liatrio-brand-guidelines
```

**Result summary:** The skill validator passed.

```text
Skill is valid!
```

## Artifact: Git diff/stat scope

**What it proves:** The changed skill package is limited to curated asset additions and the asset-index update.

**Why it matters:** Reviewers need a concise change-scope view confirming no wholesale source bundle directories were copied.

**Command:**

```bash
git diff --cached --stat -- skills/liatrio-brand-guidelines
```

**Result summary after staging:** The staged skill diff shows the curated CSS, font, logo, motif, and preview additions that are included in the Task 3.0 commit.

```text
.../assets/colors_and_type.css                     | 193 +++++++++++++++++++++
.../fonts/SpaceGrotesk-VariableFont_wght.ttf       | Bin 0 -> 134112 bytes
.../assets/logos/logo_Liatrio_full-color.png       | Bin 0 -> 33284 bytes
.../assets/logos/logo_Liatrio_reverse-color.png    | Bin 0 -> 33279 bytes
.../assets/logos/logo_Liatrio_reverse.png          | Bin 0 -> 33279 bytes
.../logos/logo_Liatrio_reverse_preferred.png       | Bin 0 -> 33279 bytes
.../assets/logos/logo_Liatrio_stacked.png          | Bin 0 -> 49567 bytes
.../logo_Liatrio_stacked_reverse-preferred.png     | Bin 0 -> 49618 bytes
.../assets/logos/logomark_Liatrio.png              | Bin 0 -> 11031 bytes
.../assets/motifs/circuit-divider.svg              |   1 +
.../assets/motifs/circuit-traces.png               | Bin 0 -> 41377 bytes
.../assets/motifs/liatris-digital.png              | Bin 0 -> 152085 bytes
.../assets/motifs/venn-diagram.png                 | Bin 0 -> 26745 bytes
.../assets/previews/_card.css                      |  74 ++++++++
.../assets/previews/brand-circuit-divider.html     | 177 +++++++++++++++++++
.../assets/previews/brand-gradient-divider.html    | 113 ++++++++++++
.../assets/previews/brand-imagery.html             |  30 ++++
.../assets/previews/brand-logo.html                |  71 ++++++++
.../assets/previews/brand-textures.html            |  54 ++++++
.../assets/previews/brand-venn.html                |  48 +++++
.../assets/previews/colors-brand.html              |  53 ++++++
.../assets/previews/colors-greys.html              |  31 ++++
.../assets/previews/colors-semantic.html           |  42 +++++
.../assets/previews/components-badges.html         |  42 +++++
.../assets/previews/components-buttons.html        |  79 +++++++++
.../assets/previews/components-cards.html          |  36 ++++
.../assets/previews/components-chips-notch.html    |  75 ++++++++
.../assets/previews/components-forms.html          |  31 ++++
.../assets/previews/spacing-elevation.html         |  29 ++++
.../assets/previews/spacing-radii.html             |  27 +++
.../assets/previews/type-body.html                 |  23 +++
.../assets/previews/type-display.html              |  18 ++
.../assets/previews/type-weights.html              |  32 ++++
.../references/liatrio-asset-index.md              |  74 ++++++--
34 files changed, 1338 insertions(+), 15 deletions(-)
```

## Reviewer Conclusion

The curated design-system assets and preview references are present, indexed, validated, and constrained to the approved skill package paths. The required metadata and docs quality gates passed, and the explicit forbidden-artifact scan confirms the raw ZIP, upload/scratch/scrap directories, `_ds_bundle.js`, and raw web-capture JSON were not copied into the skill. Oversized deck/background imagery was not committed because the repository large-file hook blocks those files.
