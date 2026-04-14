# Template Sections

Use this file to map arbitrary source material into the briefing/report template preserved in `assets/report-template-example.html` and the reusable scaffold in `assets/report-template-starter.html`.

## Section Functions

### 1. Hero / Framing

Purpose:

- tell the reader what the report is about
- establish why it matters or what kind of material follows
- present 3-4 top-level summary cards if useful

Inputs that belong here:

- topic title
- one-sentence subtitle or report purpose
- headline takeaways
- optional orientation cards or context markers

### 2. Executive Summary / Overview

Purpose:

- give the reader the high-level answer quickly
- explain the central framing before the details

Good content for this section:

- the core summary
- the most important nuance or caveat
- one short “bottom line” callout when useful

### 3. Evidence Interpretation Block

Purpose:

- translate raw source evidence into a clear analytical reading
- show how the visible facts map to the larger explanation

Examples:

- what an approval screen implies
- what logs actually show
- what a code path is doing
- what a benchmark means in practice
- what changed between two versions

### 4. Comparison / Status / Confidence Block

Purpose:

- communicate trust level, status, confidence, risk, or sensitivity
- give readers a quick structured read on the most important dimensions

Examples:

- confidence snapshot
- comparison cards
- status summary
- governance sensitivity
- operational blast radius

### 5. Why It Matters / Deeper Context

Purpose:

- explain why the evidence matters beyond the raw finding
- connect the result to user impact, implementation details, governance, or broader context

Use this when the topic needs interpretation rather than just summary.

### 6. Most Important Finding / Key Pattern / Anomaly

Purpose:

- spotlight the one finding, pattern, or anomaly that most changes the reader’s understanding
- create a strong narrative pivot in the middle of the document

This section is especially useful when one issue outweighs the rest.

### 7. Recent Changes / Timeline

Purpose:

- show how the current state evolved
- make it easy to see what changed recently versus what is older background

Use this section when chronology materially affects interpretation.

### 8. Optional Follow-Up / Guidance / Next Steps

Purpose:

- capture action-oriented guidance when the material calls for it
- summarize open questions, validation steps, or suggested follow-up work

Typical sub-parts:

- follow-up checks
- conditions to verify
- optional recommendations
- next steps or unresolved questions

Do not force this section into every report. Use it only when the source material benefits from explicit guidance.

### 9. References

Purpose:

- consolidate all sources in one place
- preserve source traceability without interrupting the reading flow

Preferred format:

- 3-column table
  - number
  - title and descriptive note
  - right-aligned source URL

## Mapping Rules

- Keep the same section order unless the user has a strong reason to change it.
- Rename topic-specific headings when needed, but preserve section function.
- If the input material is sparse, merge adjacent sections rather than forcing thin cards.
- If one section becomes too dense, promote it to full width instead of squeezing it into a rail.
- Use callouts sparingly for the true bottom line, key interpretation, or most important contextual note.
- Only include explicit recommendations when they are genuinely supported by the material.

## Compression Strategy

If the source material is brief, the minimal acceptable structure is:

1. Hero / framing
2. Executive Summary / Overview
3. Main evidence or explanation section
4. References

## Expansion Strategy

If the source material is rich and multi-layered, expand with:

- timeline section
- confidence or status section
- anomaly / key pattern section
- multiple evidence sections
- optional follow-up or next-steps section

But do not let the page become dashboard clutter. Prefer a clean editorial reading experience.
