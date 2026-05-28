# Browser QA Compact Check Set

Use these checks for the default demo-sized pass. Keep scope narrow and mark a check `unknown` when the current browser tooling cannot prove it.

| Check ID | Label | Pass condition | Evidence to capture for non-pass |
| --- | --- | --- | --- |
| `console-errors` | Console errors | No uncaught JavaScript errors observed during load and critical path. Warnings may be `warn` if relevant. | Console excerpt and action that triggered it. |
| `failed-requests` | Failed requests | No failed document/script/style/image/API requests observed during load and critical path. | URL, status code, and request type. |
| `broken-assets` | Broken images/assets | Visible images and required assets load without broken placeholders or missing states. | Screenshot, DOM selector, or failed request. |
| `keyboard-focus` | Keyboard/focus smoke | Primary link, form, or CTA is reachable and usable by keyboard when applicable. | Focus order note, skipped element, or screenshot. |
| `viewport-readability` | 16:9 viewport readability | Main content is readable at a webinar-friendly 16:9 viewport with no blocking clipping or overflow. | Screenshot and viewport size. |
| `content-smoke` | Content/accessibility smoke | Page has an obvious heading/main content; obvious informative images have useful alt text when inspectable. | Snapshot detail, DOM excerpt, or manual note. |

Default critical-path order:

1. Open `about:blank` in a named `agent-browser` session and clear `console`, `errors`, and `network requests` buffers.
2. Load target.
3. Exercise the primary route/form/CTA.
4. Inspect `agent-browser errors --json`, `agent-browser console --json`, and `agent-browser network requests --json`.
5. Capture screenshot only when it proves a state, warning, or defect.
6. Write JSON findings before summarizing.

Console capture guidance:

- Use the built-in `agent-browser console`, `agent-browser errors`, and `agent-browser network requests` commands rather than injecting a late console interceptor after page load.
- Mark `console-errors` or `failed-requests` as `unknown` only when those built-in commands fail or are unavailable for the browser provider.
- Ignore report-viewer-local noise such as `127.0.0.1:10891/favicon.ico` unless the report viewer itself is the target under test.
