# Template Sections

Use this file to map arbitrary research into the briefing template preserved in `assets/report-template-example.html` and the reusable scaffold in `assets/report-template-starter.html`.

## Section Functions

### 1. Hero / Framing

Purpose:

- tell the reader what the briefing is about
- establish why it matters
- present 3-4 top-level summary cards if useful

Inputs that belong here:

- topic title
- one-sentence subtitle or briefing purpose
- headline findings
- recommendation posture

### 2. Executive Summary

Purpose:

- give the reader the whole answer quickly
- explain the main conclusion before the evidence details

Good content for this section:

- the core conclusion
- the most important nuance or caveat
- one short “bottom line” callout

### 3. Evidence Interpretation Block

Purpose:

- translate raw source evidence into a clear analytical reading
- show how the visible facts map to the conclusion

Examples:

- what an approval screen implies
- what logs actually show
- what a code path is doing
- what a benchmark means in practice

### 4. Confidence / Risk / Sensitivity Block

Purpose:

- communicate trust level, risk level, or operational sensitivity
- give readers a decision-oriented understanding of the stakes

Examples:

- confidence snapshot
- risk checkpoint
- governance sensitivity
- operational blast radius

### 5. Why It Matters

Purpose:

- explain why the evidence matters beyond the raw finding
- connect the result to user impact, governance, or implementation consequences

Use this when the topic needs interpretation rather than just summary.

### 6. Most Important Finding or Anomaly

Purpose:

- spotlight the one finding that most changes the decision
- create a strong narrative pivot in the middle of the document

This section is especially useful when one issue outweighs the rest.

### 7. Recent Changes / Timeline

Purpose:

- show how the current state evolved
- make it easy to see what changed recently versus what is older background

Use this section when chronology materially affects interpretation.

### 8. Decision Guidance

Purpose:

- convert the analysis into action
- tell the reader what conditions support approval, delay, escalation, or mitigation

Typical sub-parts:

- decision checkpoint / next checks
- conditions that support action A
- conditions that support action B
- recommended posture

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
- Use callouts sparingly for the real “bottom line” or most decision-relevant implication.

## Compression Strategy

If the source research is brief, the minimal acceptable structure is:

1. Hero / framing
2. Executive Summary
3. Main evidence section
4. Decision Guidance
5. References

## Expansion Strategy

If the source research is rich and multi-layered, expand with:

- timeline section
- confidence or legitimacy section
- anomaly / key risk section
- multiple evidence sections

But do not let the page become dashboard clutter. Prefer a clean editorial reading experience.
