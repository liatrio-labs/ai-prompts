# Interaction Contract

This file captures the UX behaviors that define the current research briefing format.

## Citation Chips

Requirements:

- inline citation markers render as styled chips, not normal text links
- chip text is compact numeric source notation (for example `1`, `2`, `11`)
- chips are hover/focus triggers for the tooltip
- chips should not navigate directly when clicked like normal anchors

## Citation Tooltip

Requirements:

- opens near the hovered/focused citation chip
- should be centered horizontally beneath the trigger when space allows
- repositions to remain inside the viewport
- shows:
  - source title
  - short descriptive note / metadata
  - `Open source`
  - `Show Reference`

Behavior:

- `Open source` opens the external source in a new tab
- `Show Reference` stays in-page
- tooltip should remain open when moving from chip to tooltip
- tooltip should hide on blur / mouseleave with a short delay
- when moving from one citation chip to another, the tooltip must not visibly flash at the old chip position before it repositions
- the safe pattern is: hide/offscreen the shared tooltip first, then reposition it, then reveal it at the new location

## Show Reference Behavior

When the user activates `Show Reference`:

- do not open a new tab
- smoothly scroll the target reference row into view
- briefly flash/highlight that row to draw the eye
- keep the effect subtle, not distracting

## References Table

Requirements:

- references live at the bottom of the page
- use a consistent table layout with columns for:
  - number
  - reference detail block
  - URL
- long URLs truncate visually with ellipsis instead of wrapping across multiple lines
- detail column should remain more readable than the URL column
- numbering should be normalized and sequential even if input labels are messy

## Theme Selection

The generic starter template includes a built-in theme selector.

Required options:

- `Liatrio` (default)
- `Dracula`
- `Minimal`

Behavior:

- the selected theme updates the CSS variable palette without changing report structure
- the selector should remember the last chosen theme in browser storage when practical
- theme switching must not break citation chips, tooltips, references table, or print readability
- the favicon should track the active theme so the page still feels coherent when shared or pinned in a browser tab
- light-theme tags/pills need explicit high-contrast overrides; soft pastel-on-pastel defaults are not sufficient
- table-header ink should use an explicit theme-aware color rather than inheriting generic body text color

## Back to Top

Requirements:

- hidden near the top of the page
- appears after the user scrolls down
- positioned unobtrusively at the viewport edge
- smooth-scrolls to the top when activated

## Print / PDF Expectations

Interactions should enhance browser reading but the printed document must remain understandable without them.

That means:

- citations and references still make sense without hover behavior
- references remain fully listed in a readable bottom section
- nothing essential is trapped behind interaction-only UI

## Regression Checklist

When editing the briefing template, re-check all of the following:

- tooltip opens from citation chips
- tooltip remains aligned with the trigger after scrolling
- tooltip centers under the trigger rather than anchoring from a corner
- moving from citation 1 to citation 2 does not flash the tooltip at citation 1's old position
- `Show Reference` scrolls to the correct row
- row flash animation still runs
- reference URLs truncate cleanly
- back-to-top button appears and disappears at the right times
- favicon updates across theme changes
- light-theme pills are actually readable, not just aesthetically color-matched
- table-header text remains readable in every theme
- printed layout remains readable on letter-sized pages
