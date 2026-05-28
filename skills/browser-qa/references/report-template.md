# Browser QA Report Template

Use this structure for the user-facing QA result. Keep it concise and evidence-first.

```markdown
## Browser QA Result: <pass | warn | fail | unknown>

Target: <URL, file, or route>
Viewport: <width>x<height> or unknown
Checked at: <timestamp>

Proof summary: <one sentence with status, counts, and highest-risk finding>

### Checked

- <console/network check result>
- <broken asset check result>
- <keyboard/focus check result>
- <viewport readability check result>
- <content/accessibility smoke result if run>

### Findings

#### <status>: <check label>

- Route/file: `<target>`
- Evidence: <short evidence bullet, screenshot path, console line, or network request>
- Recommendation: <specific next action or `None`>

### Artifacts

- Findings JSON: `<path>`
- Screenshot: `<path or not captured>`
- Local report: `http://127.0.0.1:10891/?report=<run-id>`

### Not Checked

- <important area outside this focused pass>
```

## Good Proof Summary Examples

- `pass: 5 checks passed at 1280x720; no console errors, failed assets, or keyboard blockers observed.`
- `warn: 3 passed, 2 warnings; hero text wraps at 1280x720 and one decorative image is missing alt text.`
- `fail: primary CTA is skipped by keyboard navigation; screenshot and focus notes captured.`
- `unknown: page loaded, but console/network inspection was unavailable in the current browser tool.`

## Report Viewer Note

The HTML report is served by `scripts/serve-report.py`. It discovers every run under `/tmp/browser-qa-reports`, populates the report selector from `/api/reports`, and loads the selected `findings.json` dynamically. Do not generate a separate standalone HTML file per run.
