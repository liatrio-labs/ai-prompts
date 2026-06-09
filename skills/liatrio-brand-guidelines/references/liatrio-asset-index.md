# Liatrio Asset Index

This index maps curated Liatrio design-system assets to expected use cases. It also records assets that are known in the source bundle but may not be copied into the skill until Task 3.0 curates physical files.

## Scope and provenance

- Source bundle inspected: `temp/Liatrio Design System/README.md`, `_ds_manifest.json`, preview cards, and `assets/` listing.
- This file is guidance-first. It is not a full manifest dump and intentionally omits raw web-capture payloads, uploads, scratch files, scraps, and generated bundles.
- Use curated local files under `skills/liatrio-brand-guidelines/assets/` once present. If an asset listed here is not yet present in the skill package, treat the path as a planned curated destination, not proof that the file has already been copied.
- Do not use `_ds_bundle.js` as an asset source or component API; it exports no reusable JS components.

## Token and font assets

| Asset | Planned/current skill path | Use case | Notes |
| --- | --- | --- | --- |
| Colors and type CSS | `assets/colors_and_type.css` | Local token source for static HTML, audits, and deterministic checks | Copy from source bundle in asset-curation task; use semantic roles rather than dumping every variable into prompts. |
| Space Grotesk variable font | `assets/fonts/SpaceGrotesk-VariableFont_wght.ttf` | Offline/static artifacts, decks, UI mockups | Canonical current typeface. Use `font-display: swap`; do not call Google Fonts for offline artifacts. |

## Logos and marks

| Asset | Planned/current skill path | Best background | Use | Avoid |
| --- | --- | --- | --- | --- |
| `logo_Liatrio_full-color.png` | `assets/logos/logo_Liatrio_full-color.png` | Light | Primary horizontal logo for light surfaces | Do not place on dark background if reverse-color is available. |
| `logo_Liatrio_reverse-color.png` | `assets/logos/logo_Liatrio_reverse-color.png` | Dark | Primary horizontal logo for dark graphite surfaces | Do not recolor or add effects. |
| `logo_Liatrio_stacked.png` | `assets/logos/logo_Liatrio_stacked.png` | Light | Secondary square/near-square placements | Do not use as primary nav/header lockup. |
| `logo_Liatrio_stacked_reverse-preferred.png` | `assets/logos/logo_Liatrio_stacked_reverse-preferred.png` | Dark | Secondary square/near-square placements on dark | Keep clear space; avoid over textured zones. |
| `logomark_Liatrio.png` | `assets/logos/logomark_Liatrio.png` | Light or dark depending treatment | Favicon, app icon, deck corner, product loader, expressive flame moment | Never place standard logomark on a green background; never distort, rotate, or recolor. |
| `logo_Liatrio_reverse.png`, `logo_Liatrio_reverse_preferred.png` | `assets/logos/` if curated | Dark/alternate | Alternate reverse marks when explicitly needed | Prefer `reverse-color` primary unless a task requires alternate reverse mark. |

Logo rules:

- Keep clear space equal to the height of the `L` in `liatrio`.
- Use horizontal logo variants as primary brand identifiers.
- Treat stacked variants as secondary.
- Always provide logo alt text unless decorative and redundant with adjacent text.

## Motif, background, and infographic assets

| Asset | Planned/current skill path | Best background | Use case | Avoidance guidance |
| --- | --- | --- | --- | --- |
| `liatris-digital.png` | `assets/motifs/liatris-digital.png` | Dark with protection gradient | Signature botanical counterpoint in heroes, social cards, deck covers | Do not shrink below meaningful motif size; not an icon. |
| `liatris-violet.png` | `assets/motifs/liatris-violet.png` | Dark or restrained editorial surface | Saturated botanical focal image, violet-accent composition | Do not pair with too many other accents. |
| `circuit-traces.png` | `assets/motifs/circuit-traces.png` | Dark | Low-opacity technical texture, panel detail | Do not use full opacity or make it compete with text. |
| `circuit-divider.svg` | `assets/motifs/circuit-divider.svg` | Dark section transition | Technical section divider, bridge between surfaces | Avoid neon wallpaper effect; keep opacity/strokes restrained. |
| `venn-diagram.png` | `assets/motifs/venn-diagram.png` | Dark or light with sufficient contrast | Build · Strategy · Enablement infographic, deck section marker | Do not use as tiny decorative icon; label/explain it. |
| `liatrio-bg01.png` | `assets/motifs/liatrio-bg01.png` | Light editorial break or cover | Lime field/gradient editorial background | Do not use as the default product surface. |
| `liatrio-bg08.png` | `assets/motifs/liatrio-bg08.png` | Light editorial break or cover | Violet/lime cloud background | Avoid broad decorative use; one expressive moment per artifact. |
| `floating-nodes.svg`, `hexagons.svg`, `TracesAndNodes.png` | Curate if present in source bundle | Dark | Subtle technical texture and node pattern | Use only if curated; do not invent paths if absent. |

## Deck and presentation assets

| Asset | Planned/current skill path | Use case | Notes |
| --- | --- | --- | --- |
| `Liatrio-Deck-Template.pptx` | `assets/decks/Liatrio-Deck-Template.pptx` if size/policy allow | Canonical deck starting point with dark and light modes | Edit in PowerPoint, Keynote, or Google Slides. Do not rebuild the deck from preview HTML unless explicitly asked. |

## Preview reference artifacts

| Source preview | Planned/current skill path | What it teaches |
| --- | --- | --- |
| `preview/colors-brand.html` | `assets/previews/colors-brand.html` | Brand greens, violet/lime accents, flame gradient |
| `preview/colors-semantic.html` | `assets/previews/colors-semantic.html` | Foreground hierarchy, surfaces, border roles |
| `preview/type-display.html`, `type-body.html`, `type-weights.html` | `assets/previews/` | Space Grotesk scale, weights, body readability |
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
