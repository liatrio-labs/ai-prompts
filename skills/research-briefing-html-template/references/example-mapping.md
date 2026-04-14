# Example Mapping

## Input research snapshot

- Topic: Octo STS GitHub App permission changes
- Audience: internal technical review
- Decision: whether to approve updated GitHub App permissions
- Source types: README, GitHub issues, security advisories, pull requests, screenshot

## Findings

1. Octo STS is legitimate and actively maintained.
2. Organization API Insights is the newly added read-only permission.
3. Organization Administration write was already requested earlier and remains the sensitive part.
4. The approval screen combines both the new request and the older escalation.
5. Trust policy files are central to the security model.

## Template mapping

- Hero / framing:
  - title, subtitle, 4 summary cards
- Executive Summary:
  - overall conclusion and bottom line
- Evidence / interpretation:
  - table explaining what the approval screen shows
- Confidence Snapshot:
  - legitimacy high, governance sensitivity high
- Risk / decision checkpoint:
  - what to verify before approval
- Why it matters:
  - explain policy-governed token model
- Timeline:
  - Q2 2025 admin escalation, Jun 2025 advisory, Apr 2026 API Insights update
- Decision Guidance:
  - approve only if org-level need and strict policy governance exist
- References:
  - normalized table with source rows

## Theme choice

- Default: Liatrio
- Alt: Dracula
- Alt: Minimal

## Notes

- Keep citations as hover-trigger chips.
- Keep Show Reference in-page with flash-on-scroll.
- Keep the references section in table form with truncated URLs.
