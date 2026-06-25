# Artifact Policy

## Location

Store outputs outside the application repo by default:

```text
../walkthrough-artifacts/<branch-slug>/
```

Allow the user to override the output folder.

## Files

Typical files:

```text
run-log.md
videos/<branch-slug>-walkthrough.mp4
screenshots/001-callout.png
walkthrough.html
mr-description.md
```

Only final files should remain after a normal run.

Expected final files:

- `run-log.md`
- `videos/<branch-slug>-walkthrough.mp4` when `ffmpeg` is available, otherwise `.webm`
- `walkthrough.html` and referenced screenshots only when requested
- `mr-description.md` only when the user explicitly requested an MR/PR description
- `automation-report.json` only when diagnostics are intentionally preserved

## Cleanup

Clean up temporary files by default:

- temporary storage state
- temporary screenshots used only for validation
- intermediate WebM files when MP4-only output was requested and conversion succeeded
- scratch config files
- generated recording scripts
- raw Playwright `page@...webm` files
- validation frames unless diagnostics are intentionally preserved
- empty `tmp/` or `screenshots/` folders when not needed

Do not delete final videos, HTML, screenshots referenced by HTML, requested `mr-description.md`, or `run-log.md`.

Use `scripts/cleanup_artifacts.mjs --output-dir=...` to normalize an artifact folder after manual retries. Use `--preserve=diagnostics` only when `automation-report.json` and other diagnostic outputs should remain available for debugging.

MR descriptions must use `assets/mr-description-template.md` and keep the video upload placeholder intact. Do not include local artifact paths in MR descriptions.

Screenshots must not remain as standalone artifacts. Keep screenshots only when:

- `walkthrough.html` was requested and references them
- the user explicitly asked to keep raw screenshots

## Run Log

Write `run-log.md` with:

- current branch
- target branch
- interaction mode: `automated` or `guided`
- visual applicability decision
- recording mode and plan item count
- preflight status, warnings, and whether preflight was explicitly skipped
- selected artifact format
- selected browser/auth mode
- selected caption position/colors
- pages or routes visited
- output paths
- whether `mr-description.md` was requested and generated
- warnings
- selector retries or script revisions
- `automation-report.json` when `run_walkthrough.mjs` is used

## Validation

Before recording, run config preflight unless the user explicitly skips it. At minimum, preflight must prove that planned action selectors and highlight selectors are unique, visible, and scrollable into the viewport with padding.

After recording, verify final files exist and are nonzero. When `ffprobe` is available, verify duration and resolution. When `ffmpeg` is available, extract sample frames. If validation is inconclusive, report the warning and let the user review the real video.
