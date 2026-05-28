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

1. Load target.
2. Exercise the primary route/form/CTA.
3. Inspect console and request failures.
4. Capture screenshot only when it proves a state, warning, or defect.
5. Write JSON findings before summarizing.
