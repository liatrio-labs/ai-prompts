# Browser QA Evidence Contract

Write findings JSON before rendering the final report. Keep it small, deterministic, and safe to paste into a review.

Save each run as `findings.json` under a named subfolder in the system temp report root:

```text
/tmp/browser-qa-reports/<run-id>/findings.json
```

Put screenshots and other report artifacts in the same run subfolder. Artifact values should be filenames or relative paths inside that run folder so the local report server can serve them.

```json
{
  "target": {
    "url": "file:///path/to/page.html or https://example.com",
    "checked_at": "2026-05-28T01:23:45Z",
    "viewport": { "width": 1280, "height": 720 }
  },
  "summary": {
    "status": "pass",
    "passes": 5,
    "warnings": 0,
    "failures": 0,
    "unknowns": 0
  },
  "checks": [
    {
      "id": "console-errors",
      "label": "Console errors",
      "status": "pass",
      "evidence": [
        {
          "kind": "console",
          "message": "No uncaught JavaScript errors observed during page load and primary CTA click.",
          "source": "browser console"
        }
      ],
      "recommendation": ""
    }
  ],
  "artifacts": {
    "screenshot": "screenshot-home.png",
    "focus_screenshot": "screenshot-focus.png"
  }
}
```

## Required Keys

- Top level: `target`, `summary`, `checks`, `artifacts`
- `target`: `url`, `checked_at`, `viewport`
- `summary`: `status`, `passes`, `warnings`, `failures`, `unknowns`
- every check: `id`, `label`, `status`, `evidence`
- every evidence item: `kind`, `message`, `source`

## Allowed Values

Statuses:

- `pass`
- `warn`
- `fail`
- `unknown`

Evidence kinds:

- `console`
- `network`
- `screenshot`
- `snapshot`
- `manual-note`

## Validation Rules

- Missing required keys fail validation.
- Any status outside the enum fails validation.
- Any evidence kind outside the enum fails validation.
- Every non-`pass` check must include at least one evidence item.
- Artifact values must be strings or `null`.
- Evidence must never include credentials, cookies, tokens, or private page data.
