---
name: liatrio-brand-guidelines
description: "Applies Liatrio brand and design-system guidance for UI design, docs, decks, brand audits, asset selection, typography, visual polish, and formal compliance checks. Use when users request Liatrio styling, implementation decisions, static/offline artifacts, hero/social imagery, or design-system adherence review."
license: Apache-2.0
metadata:
  owner: liatrio
  compatibility: Designed for skills-compatible coding agents with markdown reading. Optional network access improves accuracy by verifying the current live brand-data source.
  canonical-brand-source: https://www.liatrio.ai/brand-data.json
---

# Liatrio Brand and Design-System Router

## When to Use

Use this skill when the user asks for any of the following:

- Liatrio-branded UI implementation, static HTML, documentation, decks, screenshots, or social/hero imagery.
- Brand audits, compliance reviews, accessibility checks, and corrective design-system recommendations.
- Logo, logomark, motif, preview, typography, color, spacing, component, or asset-selection decisions.
- Visual polish for existing artifacts that should match the current Liatrio design system.
- Resolving stale or conflicting Liatrio brand guidance in code, docs, slides, or generated assets.

## Source Priority and Conflict Resolution

If sources disagree, use this order:

1. Curated local design-system references and assets once present in this skill package:
   - `references/liatrio-design-system.md`
   - `references/liatrio-component-recipes.md`
   - `references/liatrio-asset-index.md`
   - `assets/colors_and_type.css`, `assets/logos/`, `assets/motifs/`, `assets/decks/`, and `assets/previews/`
2. `references/liatrio-brand-guidelines.md` for legacy consolidated brand context and existing audit details.
3. `assets/liatrio-brand-guidelines-consolidated.png` for the older visual snapshot when no newer curated asset is available.
4. `https://www.liatrio.ai/brand-data.json` as the only current scripted/canonical live brand-data source.

When conflicts appear, call out the mismatch explicitly. Treat current design-system sources and `liatrio.ai` live data as authoritative for new work. Older brand-page, legacy URL, and stale typography guidance may be useful only as historical context and must not become current canonical guidance.

If network access is unavailable, proceed with local references/assets and explicitly state that live verification was not performed.

## Task-Mode Routing

Start by identifying the request mode, then load only the targeted references and assets needed for that mode.

- `implementation`: user wants direct UI/docs/style changes. Load `references/liatrio-design-system.md`, `references/liatrio-component-recipes.md`, and relevant local assets before choosing tokens, type, layout, and motifs.
- `audit`: user wants compliance findings. Preserve the Brand Audit output contract, cite the specific local/live sources checked, and include proof expectations for contrast, typography, source freshness, and asset choices.
- `design-system implementation`: user wants a current Liatrio design-system surface. Prefer Space Grotesk, dark-first graphite surfaces, bright green signal accents, flat technical components, botanical/circuit motifs, and local preview recipes.
- `static/offline artifact`: user wants a portable static file, screenshot, or helper output. Prefer bundled/local fonts and assets; avoid remote runtime dependencies unless the user explicitly allows them.
- `deck`: user wants slides or presentation guidance. Use curated deck assets when present, confirm logo/background fit, and apply the same source-priority and accessibility checks as UI work.
- `social/hero image`: user wants visual or image-direction guidance. Confirm dimensions and background brightness, select the correct logo/logomark variant, and choose botanical/circuit/texture motifs deliberately rather than decoratively.

## Quick Start Workflow

1. Determine task mode from the routing list above.
2. Confirm output surface, audience, dimensions, background brightness, and whether offline/local-only behavior is required.
3. Load targeted local references/assets instead of expanding this router into a full token catalog.
4. If precision or freshness matters and network is allowed, verify live data with `bash scripts/fetch-brand-data.sh` and record whether the current `liatrio.ai` source was checked.
5. Apply brand/design-system rules, confirm asset choices, run accessibility checks, and use the verification loop before final output.

## Core Rules

### Typography

- Current canonical typeface: Space Grotesk for brand-facing generated artifacts, UI, docs, decks, and polished static outputs.
- Use the local Space Grotesk font asset when offline behavior is required and the asset is available.
- Legacy typography note: DM Sans appears in older consolidated brand material. Treat it as noncanonical for new design-system work unless a specific user-provided source explicitly requires it.
- Use bold/semibold weights for headlines and hero text; use regular/medium weights for body and UI text.
- Keep type hierarchy deliberate: large confident headlines, compact technical labels, and readable body copy.

### Colors and Visual Posture

- Dark-first base: `#1A1F23` canvas and `#1E2327` elevated cards.
- Primary brand green: `#24AE1D` for key actions and brand moments.
- Bright signal green: `#89DF00` for restrained highlights, data accents, and focus states.
- Prefer hairline borders, flat technical cards, structured grids, focused green outlines, and restrained shadows.
- Use violet/lime counterpoints sparingly; avoid broad rainbow decoration.
- For full token details, load the design-system reference and local token CSS when present.

### Logo, Asset, and Motif Usage

- Maintain clear space around the logo equal to the height of the `L` in Liatrio.
- Never distort, rotate, recolor, or place logos on low-contrast backgrounds.
- Choose logo/logomark variants by background brightness and confirm the exact asset path used.
- Use botanical plus circuit-trace layering as a signature motif only when it supports the content hierarchy.
- For decks, hero/social images, and static artifacts, document which local assets were selected and why.

### Copy and Accessibility

- Use confident, technical, low-fluff copy in sentence case.
- Avoid emoji and exclamation marks in marketing/product UI copy unless the user explicitly asks for a different tone.
- Meet contrast targets: 4.5:1 for normal text and 3:1 for large text.
- Do not rely on color alone to convey status; include text, icon, or structural semantics.
- Provide alt text for logos, motifs, and meaningful imagery.

## Output Contracts

### Brand Audit Format

Use this exact structure for brand/design-system audits:

```markdown
## Brand Audit

- Scope: [screens/files/components reviewed]
- Compliant: [what matches Liatrio standards]
- Issues: [specific mismatches with source references]
- Fixes: [exact token, typography, layout, copy, and asset substitutions]
- Verification: [contrast/logo/background/type/source checks performed]
- Source Validation: [local references/assets checked and live liatrio.ai JSON checked or not checked]
```

### Implementation Decision Format

Use this exact structure for direct implementation tasks:

```markdown
## Implementation Decision

- Context: [surface + light/dark + component/page]
- Token Choices: [exact color/type/spacing/radius/elevation values]
- Asset Choices: [exact logo/logomark/motif/deck/preview asset paths]
- Rationale: [1-3 bullets tied to brand/design-system rules]
- Verification: [contrast + typography + variant + source/conflict checks]
```

## Verification Loop

Before finalizing, run this loop:

1. Draft the recommendation, audit, or implementation choices.
2. Load the targeted local reference(s) for the task mode and compare exact token, type, component, and asset choices.
3. Confirm Space Grotesk is used for current brand-facing generated artifacts; if legacy DM Sans appears, label it as historical or user-required.
4. If freshness matters and network access is available, run `bash scripts/fetch-brand-data.sh` and report whether the `liatrio.ai` live source was verified.
5. Confirm selected logo, logomark, motif, deck, or preview assets match background brightness, hierarchy, and offline requirements.
6. Verify accessibility constraints: contrast, focus states, alt text, and non-color-only semantics.
7. Report any source conflicts, missing assets, or inability to verify live data.

## Workflow Checklist

- [ ] Identify task mode: implementation, audit, design-system implementation, static/offline artifact, deck, or social/hero image.
- [ ] Confirm surface, background context, audience, dimensions, and offline/runtime constraints.
- [ ] Load only the targeted local references/assets needed for the mode.
- [ ] Apply Space Grotesk for current brand-facing artifacts unless a source explicitly requires otherwise.
- [ ] Choose dark-first surfaces, Primary Green for key actions, and Bright Green only as a signal highlight.
- [ ] Select logo/logomark/motif/deck assets by exact path and explain the choice.
- [ ] Verify contrast ratios, focus states, non-color-only semantics, and alt text.
- [ ] Check copy for technical tone, sentence case, no emoji, and no unnecessary exclamation marks.
- [ ] If precision or freshness is required, verify current live data through `liatrio.ai` brand data.
- [ ] State whether live verification was performed and note any conflicts or legacy-only guidance.

## Optional Maintenance Scripts

- `scripts/fetch-brand-data.sh`
  - Reads and prints current structured data from `https://www.liatrio.ai/brand-data.json`.
- `scripts/download-brand-assets.sh`
  - Downloads logo files referenced by current live JSON into `assets/logos/` when refreshing bundled logo assets.
  - Do not add scripted fallback behavior to older brand URLs.

## References

- `references/liatrio-design-system.md` (targeted current design-system details; added in the reference phase)
- `references/liatrio-component-recipes.md` (implementation recipes; added in the reference phase)
- `references/liatrio-asset-index.md` (asset usage and avoidance guidance; added in the asset phase)
- `references/liatrio-brand-guidelines.md` (legacy consolidated reference and existing brand context)
- `assets/colors_and_type.css` (local token CSS when present)
- `assets/logos/`, `assets/motifs/`, `assets/decks/`, `assets/previews/` (curated local assets when present)
- `assets/liatrio-brand-guidelines-consolidated.png` (older visual snapshot)
- `https://www.liatrio.ai/brand-data.json`
