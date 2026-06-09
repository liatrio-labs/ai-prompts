# Liatrio Design System Reference

Use this reference when a task needs current Liatrio design-system direction beyond the compact router in `../SKILL.md`. Keep `SKILL.md` compact; load this file only for UI, static artifact, deck, audit, or brand-polish work that needs design-system detail.

## Provenance, trust level, and source priority

- **Trust level:** high for current Liatrio visual direction because it is derived from the local `temp/Liatrio Design System/` bundle and its bundled `colors_and_type.css`, preview cards, manifest, README, and skill notes.
- **Source anchor:** the bundle describes itself as anchored to Liatrio Brand Guidelines v2026-04-14. No production codebase or Figma source was attached, so treat previews as design recipes, not pixel-perfect production components.
- **Current source priority:**
  1. Curated local skill references and assets in `skills/liatrio-brand-guidelines/`.
  2. Local token CSS once curated into `assets/colors_and_type.css`; until then, use this reference's token quick reference.
  3. Live scripted brand data from `https://www.liatrio.ai/brand-data.json` when a task explicitly requires live verification.
  4. Legacy `liatrio.com` references only as historical conflict evidence, never as current canonical or scripted fallback guidance.
- **Do not copy wholesale:** do not embed raw bundle manifests, full preview HTML, web-capture payloads, uploads, scratch files, scraps, or generated bundles in user artifacts or proof notes.

## Visual posture

Liatrio is **dark-first, high-contrast, technical-but-organic**. The signature look is a cool graphite surface with precise technical UI structure, bright green signal accents, and botanical/circuit texture as the organic counterpoint.

- Default canvas: `#1A1F23` (`--dark-bg`).
- Elevated/card surface: `#1E2327` (`--dark-bg-2`).
- Structure: flat technical surfaces, hairline borders, compact labels, strong grid rhythm, and very restrained shadows.
- Signature motif: dark base + low-opacity hex/circuit texture + green trace detail + Liatris/botanical imagery or the three-pillar Venn diagram.
- Light surfaces are allowed for editorial breaks, printable assets, product screenshots, and deck pages, but they should not replace the dark-first default.

## Token quick reference

Prefer semantic tokens and named roles. Use raw hex only when implementing a standalone artifact without the token CSS available.

| Role | Token / value | Use |
| --- | --- | --- |
| Dark canvas | `--dark-bg` / `#1A1F23` | Default page, hero, product surface background |
| Dark elevated | `--dark-bg-2` / `#1E2327` | Cards, panels, form fields, section contrast |
| Primary green | `--primary-green` / `#24AE1D` | Hero brand moments, primary focus, important brand accents |
| Bright green | `--bright-green` / `#89DF00` | Highlights, active borders, links, callouts, trace details |
| Lime | `--lime` / `#C6F135` | Venn/enablement accents, square chips, editorial counterpoint |
| Violet | `--violet` / `#C068F9` | Strategy accent, one-per-surface editorial counterpoint |
| Lagoon | `--lagoon` / `#00C1DB` | Info states, secondary data visuals |
| Hot red | `--hot-red` / `#E63946` | Error/alert only |
| Flame orange | `--flame-orange` / `#F77F00` | Warning/energy state only |
| Foreground | white, `#CCCCCC`, `#999999`, `#666666` | Five-level foreground hierarchy instead of opacity stacks |
| Border | `#2A3036`; strong `#3A4046` | Hairline structure before shadows |

Rules of thumb:

- Use one expressive accent per surface. Do not decorate with the full palette.
- Bright green is a signal/highlight, not a default page fill.
- Reserve lagoon, red, and orange for semantic states.
- Avoid warm, grainy, generic stock-photo treatments.

## Typography

Space Grotesk is the current canonical typeface for brand-facing generated artifacts.

- **Font:** `"Space Grotesk", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- **Weights:** 300 for large quotes/editorial body, 400 for paragraphs, 500 for buttons/eyebrows/table headers, 600 for H2/H3/display, 700 for H1 only.
- **Scale:** display 60px; H1 48-60px; H2 36-40px; H3 28-32px; H4 22px; body 16-18px; small 14px; micro 12px; eyebrow 13px with `0.14em` tracking.
- **Tracking:** use `-0.02em` for large headlines; default tracking for body; uppercase only for very small technical eyebrows/chips.
- **Mono:** reserve `ui-monospace`, JetBrains Mono, SF Mono, Menlo, Consolas, or equivalent for code, version tags, technical labels, and token names.
- **Conflict:** DM Sans appears in older brand material. Treat it as legacy/noncanonical unless a user-provided current source explicitly requires it.

## Spacing, radii, layout, and elevation

- **Spacing:** 4px base scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Component padding clusters at 16/24/32. Section padding clusters at 64/96/128.
- **Radii:** `--r-1` 4px for inputs/code chips, `--r-2` 8px for small controls, `--r-3` 12px for cards, `--r-4` 16px for large surfaces, `--r-5` 24px for hero panels, `--r-pill` 999px for pill labels or capsule CTAs when the specific recipe calls for capsules.
- **Current preview caveat:** some `liatrio.ai` captures use square uppercase buttons and square chips. Prefer the relevant recipe in `liatrio-component-recipes.md` over generic capsule assumptions.
- **Grid:** 12 columns, desktop gutters around 80px, mobile gutters around 24px, max content width around 1280px, editorial reading width around 720px.
- **Elevation:** use borders first on dark surfaces. Shadows are for floating UI such as menus, modals, and toasts. Use green glow only for active/focused brand moments.

## Motion and interaction

- Default easing: `cubic-bezier(0.22, 1, 0.36, 1)` for confident ease-out movement.
- Durations: 120ms micro/hover, 200ms state changes, 320ms panel/modal, 600ms page-level reveals.
- Avoid bounces and springy overshoots.
- Fades enter from below with 8-16px translate-Y; avoid sideways entrances.
- Hover: green elements gain a subtle glow/outline and can translate `Y(-1px)`; dark surfaces can lighten about 6%.
- Press: scale to about `0.98` and remove glow.
- Focus: visible 2px bright-green outline with 2px offset or equivalent high-contrast focus ring.

## Copy rules

- Voice: confident, technical, low-fluff, senior-engineer-with-strategy posture.
- Person: default to `we` for Liatrio and `you` or `your team` for the reader. Avoid `I` in brand work and avoid `the client` in client-facing copy.
- Casing: sentence case for headlines, buttons, and navigation. Title Case only for proper names. ALL CAPS only for very small tracked labels.
- Punctuation: no exclamation marks in marketing/product UI. Em dashes are acceptable. Use Oxford commas.
- Numbers: numerals for 2 and above; spell out one.
- Prefer: ship, build, scale, engineering team, enablement, pilot, rollout, AI-first, teach your team.
- Avoid: leverage, synergize, resources, overused `upskilling`, vague `implementation`, default `AI-powered`, and `train your people` when `teach your team` is clearer.
- Emoji: not in marketing copy or product UI; never as an icon substitute.

## Logo and motif rules

- Horizontal full-color logo is primary on light backgrounds.
- Horizontal reverse-color logo is primary on dark backgrounds.
- Stacked variants are secondary for square or near-square placements.
- Flame logomark can be used as favicon/app icon/deck corner/loader, but never place the standard logomark on a green background.
- Maintain clear space equal to the height of the `L` in `liatrio`.
- Never distort, rotate, recolor, stretch, or add effects to logo files.
- The three-pillar Venn represents Build, Strategy, and Enablement. Use it as a section/infographic motif, not as tiny decorative noise.
- Botanical Liatris imagery is a large-format motif; do not shrink it to icon size.

## Accessibility and review checks

- Normal text contrast target: at least 4.5:1.
- Large text and non-text UI target: at least 3:1.
- Do not rely on color alone for status; include label, icon, position, or text.
- Provide alt text for images and logos. Decorative textures should be hidden from assistive tech.
- Ensure keyboard focus is visible on every interactive element.
- Confirm body copy remains legible on botanical or gradient imagery by using protection gradients or dark overlays.

## Known conflicts and caveats

- The design-system bundle says no production codebase or Figma source was attached; do not claim production parity.
- Preview HTML contains useful recipes and raw capture values, but it is not a reusable component library.
- `_ds_bundle.js` initializes a namespace for previews and exports no reusable JS component API. Do not instruct agents to import components from it.
- Older deck/body-font guidance may mention DM Sans; current brand-facing artifacts should use Space Grotesk unless a specific current source says otherwise.
- Lucide appears as a practical icon-set substitution in source notes; confirm with production sources if icon fidelity is a hard requirement.
- Do not use legacy `liatrio.com` URLs as active fallback sources. Use them only for provenance/conflict review when necessary.
