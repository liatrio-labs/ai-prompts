# Liatrio Asset Index

This index maps the curated Liatrio design-system assets committed under `skills/liatrio-brand-guidelines/assets/` to expected use cases. It is intentionally a curated asset map, not a full source-bundle manifest.

## Scope and provenance

- Source bundle inspected: `temp/Liatrio Design System/README.md`, `_ds_manifest.json`, preview cards, and `assets/` listing.
- Curated local files now live under `skills/liatrio-brand-guidelines/assets/` and are the preferred offline/static sources for generated artifacts.
- This file intentionally omits raw web-capture payloads, uploads, scratch files, scraps, original ZIPs, and generated bundles.
- Do not use `_ds_bundle.js` as an asset source or component API; it exports no reusable JS components.

## Final curated file list

```text
assets/colors_and_type.css
assets/fonts/SpaceGrotesk-VariableFont_wght.ttf
assets/liatrio-brand-guidelines-consolidated.png
assets/logos/logo_Liatrio_full-color.png
assets/logos/logo_Liatrio_reverse-color.png
assets/logos/logo_Liatrio_reverse.png
assets/logos/logo_Liatrio_reverse_preferred.png
assets/logos/logo_Liatrio_stacked.png
assets/logos/logo_Liatrio_stacked_reverse-preferred.png
assets/logos/logomark_Liatrio.png
assets/motifs/circuit-divider.svg
assets/motifs/circuit-traces.png
assets/motifs/liatris-digital.png
assets/motifs/venn-diagram.png
assets/previews/_card.css
assets/previews/brand-circuit-divider.html
assets/previews/brand-gradient-divider.html
assets/previews/brand-imagery.html
assets/previews/brand-logo.html
assets/previews/brand-textures.html
assets/previews/brand-venn.html
assets/previews/colors-brand.html
assets/previews/colors-greys.html
assets/previews/colors-semantic.html
assets/previews/components-badges.html
assets/previews/components-buttons.html
assets/previews/components-cards.html
assets/previews/components-chips-notch.html
assets/previews/components-forms.html
assets/previews/spacing-elevation.html
assets/previews/spacing-radii.html
assets/previews/type-body.html
assets/previews/type-display.html
assets/previews/type-weights.html
```

## Token and font assets

| Asset | Current skill path | Use case | Notes |
| --- | --- | --- | --- |
| Colors and type CSS | `assets/colors_and_type.css` | Local token source for static HTML, audits, and deterministic checks | Copied from the design-system bundle; use semantic roles rather than dumping every variable into prompts. |
| Space Grotesk variable font | `assets/fonts/SpaceGrotesk-VariableFont_wght.ttf` | Offline/static artifacts, decks, UI mockups | Canonical current typeface. Use `font-display: swap`; do not call Google Fonts for offline artifacts. |

## Logos and marks

| Asset | Current skill path | Best background | Use | Avoid |
| --- | --- | --- | --- | --- |
| `logo_Liatrio_full-color.png` | `assets/logos/logo_Liatrio_full-color.png` | Light | Primary horizontal logo for light surfaces | Do not place on dark background if reverse-color is available. |
| `logo_Liatrio_reverse-color.png` | `assets/logos/logo_Liatrio_reverse-color.png` | Dark | Primary horizontal logo for dark graphite surfaces | Do not recolor or add effects. |
| `logo_Liatrio_reverse.png` | `assets/logos/logo_Liatrio_reverse.png` | Dark/alternate | Alternate reverse mark for cases that need the non-color reverse treatment | Prefer `reverse-color` primary unless a task requires alternate reverse mark. |
| `logo_Liatrio_reverse_preferred.png` | `assets/logos/logo_Liatrio_reverse_preferred.png` | Dark/alternate | Preferred alternate reverse mark when a layout calls for it | Keep clear space; avoid over textured zones. |
| `logo_Liatrio_stacked.png` | `assets/logos/logo_Liatrio_stacked.png` | Light | Secondary square/near-square placements | Do not use as primary nav/header lockup. |
| `logo_Liatrio_stacked_reverse-preferred.png` | `assets/logos/logo_Liatrio_stacked_reverse-preferred.png` | Dark | Secondary square/near-square placements on dark | Keep clear space; avoid over textured zones. |
| `logomark_Liatrio.png` | `assets/logos/logomark_Liatrio.png` | Light or dark depending treatment | Favicon, app icon, deck corner, product loader, expressive flame moment | Never place standard logomark on a green background; never distort, rotate, or recolor. |

Logo rules:

- Keep clear space equal to the height of the `L` in `liatrio`.
- Use horizontal logo variants as primary brand identifiers.
- Treat stacked variants as secondary.
- Always provide logo alt text unless decorative and redundant with adjacent text.

## Motif, background, and infographic assets

| Asset | Current skill path | Best background | Use case | Avoidance guidance |
| --- | --- | --- | --- | --- |
| `liatris-digital.png` | `assets/motifs/liatris-digital.png` | Dark with protection gradient | Signature botanical counterpoint in heroes, social cards, deck covers | Do not shrink below meaningful motif size; not an icon. |
| `circuit-traces.png` | `assets/motifs/circuit-traces.png` | Dark | Low-opacity technical texture, panel detail | Do not use full opacity or make it compete with text. |
| `circuit-divider.svg` | `assets/motifs/circuit-divider.svg` | Dark section transition | Technical section divider, bridge between surfaces | Avoid neon wallpaper effect; keep opacity/strokes restrained. |
| `venn-diagram.png` | `assets/motifs/venn-diagram.png` | Dark or light with sufficient contrast | Build · Strategy · Enablement infographic, deck section marker | Do not use as tiny decorative icon; label/explain it. |
| `liatrio-brand-guidelines-consolidated.png` | `assets/liatrio-brand-guidelines-consolidated.png` | Reference-only | Existing consolidated visual reference for audit or comparison context | Do not treat as a source bundle replacement or production asset. |

## Large source assets excluded by repository policy

The source bundle also includes `liatris-violet.png` (~2.3 MB), `liatrio-bg01.png` (~1.3 MB), and `liatrio-bg08.png` (~584 KB). They are not committed because the repository large-file hook blocks added files over 500 KB. Prefer the curated smaller `liatris-digital.png`, `circuit-traces.png`, `circuit-divider.svg`, and `venn-diagram.png` assets in this skill, or request an approved external/storage path for larger editorial imagery.

## Deck and presentation assets

| Asset | Current skill path | Use case | Notes |
| --- | --- | --- | --- |
| `Liatrio-Deck-Template.pptx` | Not committed | Canonical deck starting point when obtained from source bundle or approved external storage | Excluded from this commit because the repository pre-commit large-file policy blocks files over 500 KB; the source template is approximately 4.2 MB. Document this as an asset curation gap rather than copying it into the skill package. |

## Preview reference artifacts

| Source preview | Current skill path | What it teaches |
| --- | --- | --- |
| `_card.css` | `assets/previews/_card.css` | Shared local preview-card CSS dependency |
| `preview/colors-brand.html` | `assets/previews/colors-brand.html` | Brand greens, violet/lime accents, flame gradient |
| `preview/colors-greys.html` | `assets/previews/colors-greys.html` | Graphite and neutral ramp guidance |
| `preview/colors-semantic.html` | `assets/previews/colors-semantic.html` | Foreground hierarchy, surfaces, border roles |
| `preview/type-display.html`, `type-body.html`, `type-weights.html` | `assets/previews/` | Space Grotesk scale, weights, body readability |
| `preview/spacing-radii.html`, `spacing-elevation.html` | `assets/previews/` | Radius, elevation, and depth posture |
| `preview/components-buttons.html` | `assets/previews/components-buttons.html` | Square primary, outlined, foreground, icon button recipes |
| `preview/components-cards.html` | `assets/previews/components-cards.html` | Flat dark card and active card treatment |
| `preview/components-badges.html` | `assets/previews/components-badges.html` | Pill/status label recipes |
| `preview/components-chips-notch.html` | `assets/previews/components-chips-notch.html` | Square chips and clipped-notch card shape |
| `preview/components-forms.html` | `assets/previews/components-forms.html` | Input, textarea, focus, error, checkbox states |
| `preview/brand-gradient-divider.html` | `assets/previews/brand-gradient-divider.html` | Violet-to-lime hairline divider |
| `preview/brand-circuit-divider.html` | `assets/previews/brand-circuit-divider.html` | Circuit trace divider and restrained animation |
| `preview/brand-venn.html` | `assets/previews/brand-venn.html` | Three-pillar Venn usage |
| `preview/brand-imagery.html`, `brand-textures.html`, `brand-logo.html` | `assets/previews/` | Asset treatment, motif layering, logo variant rules |

Preview guidance:

- Preview files are local inspection aids and recipe evidence.
- Do not embed entire preview files into always-loaded prompts.
- Do not claim the previews are production code or exported components.

## Asset-selection workflow

1. Identify the artifact type: UI, static HTML, deck, social/hero image, audit, or implementation guidance.
2. Choose one primary brand signal: logo, botanical focal image, Venn diagram, circuit texture, or gradient divider.
3. Confirm background compatibility: full-color logo on light, reverse-color logo on dark, dark overlay/protection gradient for type over imagery.
4. Check accessibility: contrast targets, alt text, no color-only status semantics.
5. For offline/static artifacts, copy curated local assets into the output bundle and avoid unapproved remote fonts/images.
6. Report any missing local asset as a curation gap rather than linking to legacy sources by default.

## Explicit exclusions

Do not copy or depend on these as skill assets:

- The original ZIP file.
- Source `uploads/`, `scratch/`, or `scraps/` directories.
- Raw web-capture JSON or unnecessary full manifest dumps.
- `_ds_bundle.js` as a component API.
- Legacy `liatrio.com` assets as active fallback sources.
- Any credential, token, OAuth artifact, or private user upload.
