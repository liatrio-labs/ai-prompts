# Example Mapping

## Input source snapshot

- Topic: Octo STS GitHub App permission changes
- Audience: internal technical review
- Delivery goal: explain what the approval screen reflects and why the permission history matters
- Source types: README, GitHub issues, security advisories, pull requests, screenshot

## Core takeaways

1. Octo STS is legitimate and actively maintained.
2. Organization API Insights is the newly added read-only permission.
3. Organization Administration write was already requested earlier and remains the sensitive part.
4. The approval screen combines both the new request and the older escalation.
5. Trust policy files are central to the security model.

## Template mapping

- Hero / framing:
  - title, subtitle, 4 summary cards
- Executive Summary:
  - overall explanation and bottom line
- Evidence / interpretation:
  - table explaining what the approval screen shows
- Confidence Snapshot:
  - legitimacy high, governance sensitivity high
- Why it matters:
  - explain policy-governed token model
- Timeline:
  - Q2 2025 admin escalation, Jun 2025 advisory, Apr 2026 API Insights update
- Optional follow-up section:
  - what a reviewer may want to verify before approval
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
- Use the optional follow-up section only when the material actually benefits from it.
