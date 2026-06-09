# Liatrio Component and Visual Recipes

Use these recipes for generated UI, static HTML, decks, audits, and implementation guidance. They are derived from curated design-system previews and source notes, but they are **recipes, not production components**.

## Production-component caveat

- The local design-system preview HTML demonstrates visual treatments and token usage. It is not a React, Vue, Web Component, or package API.
- `_ds_bundle.js` exports no reusable JS component API. Do not tell users to import components from it.
- Prefer tokenized implementation in the target project's native stack. Copy only the design intent, relevant tokens, and accessibility behavior.

## Shared recipe foundations

- Use Space Grotesk for all brand-facing display, body, and UI text.
- Start from `#1A1F23` dark canvas and `#1E2327` elevated panels unless the task explicitly asks for a light editorial break.
- Use borders before shadows: `1px solid #2A3036`; strong/hover border `#3A4046` or green-tinted border for active states.
- Keep copy sentence case except small tracked eyebrow labels or source labels.
- Confirm keyboard focus and contrast before handoff.

## Dark hero sections

**Use for:** marketing page hero, product landing surface, static/offline branded page, deck title slide.

**Structure:**

- Canvas: `--dark-bg` / `#1A1F23`.
- Optional fixed hexagon texture at 4-8% opacity.
- A single green circuit-trace detail or botanical Liatris image as focal motif.
- Headline in Space Grotesk 56-60px, 600-700, `letter-spacing: -0.02em`, `text-wrap: pretty`.
- Lead copy 17-20px, muted foreground (`#CCCCCC`), max width around 680-760px.
- Primary CTA and secondary text/link in a tight row.

**Avoid:** generic black backgrounds, rainbow gradients, warm photography, centered walls of text, emoji, exclamation marks.

## Flat card grids

**Use for:** pillars, services, capabilities, case-study cards, proof summaries.

**Recipe:**

```css
.card {
  background: #1E2327;
  border: 1px solid #2A3036;
  border-radius: 12px;
  padding: 20px 24px;
}
.card[data-active="true"] {
  border-color: rgba(137, 223, 0, 0.4);
  box-shadow: 0 0 0 1px rgba(137, 223, 0, 0.18) inset;
}
```

- Add small uppercase eyebrow labels only when they help scanning (`letter-spacing: 0.14em`, 11-13px).
- Use one accent per card group: green for Build, violet for Strategy, lime for Enablement.
- Use `→` sparingly for inline navigation.
- Do not add card drop shadows in inline grids.

## Primary buttons

The source bundle contains both capsule guidance and `liatrio.ai` captured square uppercase buttons. Match the user task context:

### Square primary button, current site-style recipe

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #89DF00;
  color: #1A1F23;
  border: 0;
  padding: 16px 32px;
  font-family: "Space Grotesk", sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

- Use for site-like hero CTAs, cards, and high-signal actions.
- Hover can reduce opacity to about 90% or add a green glow.
- Press can use `transform: scale(0.98)`.

### Outlined secondary button

```css
.btn-outline {
  background: rgba(137, 223, 0, 0.10);
  color: #89DF00;
  border: 1px solid rgba(137, 223, 0, 0.40);
  padding: 10px 24px;
  font-size: 14px;
}
```

- Use sentence case for secondary labels such as `See how we work`.
- Always include visible focus state; do not rely only on hover.

## Badges and pills

**Use for:** pillar labels, status tags, technical metadata, filter chips.

- Pill badges: `border-radius: 999px`, translucent green/violet/lime background, 1px tinted border, 12-13px Space Grotesk.
- Square eyebrow chips from the current previews: bright lime/green/violet fill, black or dark text, 4x10px padding, 11px, weight 700, uppercase, `letter-spacing: 0.05em`.
- Status colors are semantic: lagoon for info, orange for warning, hot red for error. Pair color with a word or icon.

## Square chips

**Use for:** blog/category tags, case-study labels, short deck labels.

```css
.chip {
  display: inline-block;
  padding: 4px 10px;
  font-family: "Space Grotesk", sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #89DF00;
  color: #1A1F23;
}
```

- Use square chips for site-like editorial/category cards.
- Keep labels short: `BLOG`, `CASE STUDY`, `PILOT`, `STRATEGY`.

## Clipped-notch cards

**Use for:** featured resources, editorial promos, deck callouts, distinctive site-like blocks.

```css
.notch-card {
  background: #C6F135;
  color: #000;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
  padding: 36px 28px;
}
```

- Use one 20px bottom-right notch as a signature shape; do not notch every container on a page.
- For dark variants, use `#1E2327` background with lime text or icon.
- Confirm text contrast when using lime/violet fills.

## Forms

**Use for:** contact forms, pilot intake, filters, settings panels.

```css
input, textarea, select {
  background: #1E2327;
  border: 1px solid #2A3036;
  border-radius: 8px;
  padding: 12px 14px;
  color: #FFFFFF;
  font-family: "Space Grotesk", sans-serif;
  font-size: 14px;
}
input:focus, textarea:focus, select:focus {
  border-color: #89DF00;
  box-shadow: 0 0 0 3px rgba(137, 223, 0, 0.15);
}
```

- Labels can be 11px uppercase tracked labels when compact scanning is useful.
- Error: hot red border and text; include human-readable error copy.
- Checkbox: green square or standard native control styled accessibly; preserve keyboard operation.
- Example data in reusable artifacts should be generic, such as `John Doe`, `john@example.com`, or `Acme Co.`.

## Gradient dividers

**Use for:** section breaks, deck footers, active tabs, proof summaries.

- Preferred token: `--grad-divider`, a violet-to-lime hairline.
- Keep height to 1-2px for most UI, 4px only for expressive editorial moments.
- Do not use the divider as a thick rainbow band.

## Circuit dividers

**Use for:** dark section transitions, hero-to-content bridges, technical emphasis.

- Use a transparent host over dark surfaces with thin lime/green traces and small pulsing nodes.
- Static variant: simple SVG with strokes around 1.2px and green/lime color. Animation is optional.
- In context, a divider can overlap adjacent sections by about 40px to bridge `#1A1F23` and `#1E2327` surfaces.
- Keep opacity restrained; it should feel like signal detail, not a neon wallpaper.

## Venn diagrams

**Use for:** explaining Build, Strategy, Enablement and their intersections.

- The recurring three-pillar Venn is an infographic motif and section-break device.
- Suggested mapping: Build = bright green `#89DF00`, Strategy = violet `#C068F9`, Enablement = lime `#C6F135`.
- Label the three circles clearly; the concept matters more than decoration.
- Always provide alt text or nearby text explaining the three circles.
- Avoid using the Venn as a tiny icon or generic background pattern.

## Botanical and circuit compositions

**Use for:** branded heroes, deck covers, social cards, high-touch marketing surfaces.

Layering recipe:

1. Solid graphite base (`#1A1F23` or `#111111`).
2. Low-opacity hexagon/circuit texture, large scale.
3. Bright-green trace detail on one region, not everywhere.
4. Liatris botanical image or flame mark as the organic focal point.
5. Protection gradient over imagery when text overlays it.

**Avoid:** generic flowers, warm stock photography, full-opacity busy textures, and green logo marks on green backgrounds.

## Audit checklist for generated components

- Space Grotesk is present and DM Sans is absent or explicitly legacy-only.
- Surface uses dark-first graphite tokens unless a light editorial break is justified.
- Accent color has a role and there is no rainbow decoration.
- Interactive states include hover, press, and focus behavior.
- Text contrast meets WCAG targets.
- Copy uses sentence case, no emoji, and no exclamation marks.
- Recipe is implemented in target stack; no claim that preview HTML or `_ds_bundle.js` is a production component API.
