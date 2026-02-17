---
name: liatrio-brand-guidelines
description: Applies Liatrio brand guidelines to UI and visual design work, brand audits, and asset selection. Use when the user asks for Liatrio styling, logo usage, color/typography decisions, component polish, or visual brand compliance checks.
metadata:
  compatibility: Requires markdown and image file reading support, plus optional network access to verify live Liatrio brand sources.
---

# Liatrio Brand Guidelines

## When to Use

Use this skill when the user asks for any of the following:

- Liatrio UI styling, branding, or visual polish
- brand compliance or brand audit feedback
- logo variant selection for light/dark backgrounds
- typography, color, spacing, or component-level brand decisions
- updates to brand-facing docs, design specs, or screenshots

## Quick Start

When the user needs Liatrio-branded UI or a brand audit:

1. Load visual baseline first:
   `assets/liatrio-brand-guidelines-consolidated.png`
2. Load detailed written reference when precision matters:
   `references/liatrio-brand-guidelines.md`
3. Use live source for current site behavior and assets:
   `https://www.liatrio.com/brand` and `https://www.liatrio.com/brand-data.json`
4. Apply typography, color, logo, spacing, and accessibility rules.
5. Validate contrast and background-specific logo choices.

## Source Priority and Conflict Resolution

If sources disagree, use this order:

1. `https://www.liatrio.com/brand-data.json` (live structured source)
2. `references/liatrio-brand-guidelines.md` (local detailed reference)
3. `assets/liatrio-brand-guidelines-consolidated.png` (visual snapshot)
4. `https://www.liatrio.com/brand` (rendered page content)

When conflicts appear, call out the mismatch explicitly in your response.

## Reference Loading Strategy

Use progressive disclosure to keep work fast and accurate:

- Start with the PNG snapshot for quick visual direction.
- Read the markdown guide for exact values (hex, RGB/CMYK, download URLs, written rules).
- Use the live JSON/page when you need to confirm current production behavior.

Load markdown immediately when the task includes:

- exact token values or color tables
- logo download links or file variant selection
- formal documentation updates
- compliance/audit deliverables

## Core Rules

### Typography

- Typeface: DM Sans for all text.
- Weights: Bold/Semibold for headlines; Regular/Medium for body and UI.
- Size targets: H1 48-60px, H2 36-40px, H3 28-32px, Body 16-18px.

### Colors

Primary colors:

- Primary Green: `#24AE1D` (hero color, primary actions)
- Bright Green: `#89DF00` (sparingly for highlights)
- Grey 800: `#111111` (primary text on light backgrounds)
- White: `#FFFFFF` (light backgrounds)

Secondary / accent colors:

- Grey 700: `#1E1E1E`
- Grey 100: `#EEEEEE`
- Lagoon: `#00C1DB`
- Dark Blue: `#003D5C`
- Deep Sea: `#006989`
- Hot Red: `#E63946` (alerts)
- Flame Orange: `#F77F00`

Backgrounds:

- Dark mode primary: `#1A1F23`
- Dark mode secondary: `#1E2327`

Usage notes:

- Primary Green is the hero color.
- Bright Green is for small accents only.
- Keep strong contrast: use Grey 800 on light backgrounds and white on dark.

### Logo usage

- Maintain clear space around the logo equal to the height of the "L" in Liatrio.
- Never distort, rotate, or recolor the logo.
- Pick the correct variant by background brightness:
  - Light backgrounds: Main logo or Black logo.
  - Dark backgrounds: Reverse Color or Reverse White logo.
- Logomark: avoid green backgrounds; use the square logomark when even padding is required.

### Accessibility

- Contrast ratios: 4.5:1 for normal text, 3:1 for large text.
- Do not rely on color alone to convey information.
- Provide alt text for all logos and images.

## UI Styling Defaults

Use these defaults unless the user requests otherwise:

- Spacing rhythm: multiples of 4px (4, 8, 12, 16, 24, 32, 48, 64).
- Border radius scale: 0, 6px, 10px, 14px, 20px, 28px, 999px (full).
- Shadows: soft, dark-mode friendly; avoid harsh drop shadows.

## Component and Layout Guidance

Apply brand-consistent patterns that match the Brand page system:

- Buttons: use Primary Green for key CTA actions; use destructive red only for destructive actions.
- Alerts/messages: success/information/error must use both color and text semantics.
- Inputs/cards: keep clean contrast, restrained borders, and subtle elevation.
- Spacing rhythm: preserve 4px increments across padding, gaps, and vertical flow.

## Output Format

For brand audits or recommendations, use this concise structure:

```markdown
## Brand Audit

- Scope: [screens/files/components reviewed]
- Compliant: [what matches Liatrio standards]
- Issues: [specific mismatches]
- Fixes: [exact changes with tokens/variants]
- Verification: [contrast/logo/background checks performed]
```

For direct implementation tasks, provide the exact token or asset selection in-line
and avoid unnecessary narrative.

## Verification Loop

Before finalizing, run this loop:

1. Draft recommendation or implementation choices.
2. Check against `references/liatrio-brand-guidelines.md` for exact values.
3. Confirm visual intent against
   `assets/liatrio-brand-guidelines-consolidated.png`.
4. Verify accessibility constraints (contrast and non-color-only semantics).
5. Return only validated guidance.

## Workflow Checklist

- [ ] Confirm light or dark background context.
- [ ] Apply DM Sans and typography sizes.
- [ ] Choose Primary Green for key actions.
- [ ] Use Bright Green only as a highlight.
- [ ] Verify contrast ratios and add alt text.
- [ ] Use correct logo variant and clear space rules.
- [ ] Confirm outputs align with the PNG visual snapshot.
- [ ] If precision is required, verify against the markdown guide values.
- [ ] If sources conflict, apply the source-priority order and note the conflict.

## References

- `assets/liatrio-brand-guidelines-consolidated.png`
- `references/liatrio-brand-guidelines.md`
- `https://liatrio.com/brand`
- `https://www.liatrio.com/brand-data.json`
