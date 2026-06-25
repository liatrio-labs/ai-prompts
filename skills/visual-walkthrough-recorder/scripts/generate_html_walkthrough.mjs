#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function argValue(name) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function loadConfig() {
  const configPath = argValue("--config");
  if (!configPath) {
    throw new Error("Usage: generate_html_walkthrough.mjs --config=html-config.json");
  }

  const rawConfig = await readFile(path.resolve(configPath), "utf8");
  return JSON.parse(rawConfig);
}

function renderHtml(config) {
  const screenshots = Array.isArray(config.screenshots) ? config.screenshots : [];
  const cards = screenshots
    .map((shot, index) => {
      const title = escapeHtml(shot.title || `Step ${index + 1}`);
      const description = escapeHtml(shot.description || "");
      const src = escapeHtml(shot.src);
      return `
        <article class="card">
          <div class="card-header">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <h2>${title}</h2>
          </div>
          ${description ? `<p>${description}</p>` : ""}
          <img src="${src}" alt="${title}" />
        </article>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(config.title || "Visual Walkthrough")}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --muted: #475569;
      --border: #dbe3ef;
      --accent: #2563eb;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }
    header {
      padding: 40px max(24px, calc((100vw - 1120px) / 2)) 24px;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }
    h1 {
      margin: 0 0 12px;
      font-size: clamp(28px, 4vw, 42px);
      line-height: 1.1;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      color: var(--muted);
      font-size: 14px;
    }
    .meta span {
      padding: 6px 10px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: #f8fafc;
    }
    main {
      width: min(1120px, calc(100vw - 48px));
      margin: 28px auto 56px;
      display: grid;
      gap: 24px;
    }
    .summary {
      color: var(--muted);
      max-width: 760px;
      margin: 0;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 20px 0;
    }
    .card-header span {
      display: inline-grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 999px;
      background: var(--accent);
      color: white;
      font-weight: 800;
      font-size: 13px;
    }
    h2 {
      margin: 0;
      font-size: 20px;
    }
    .card p {
      margin: 10px 20px 16px;
      color: var(--muted);
    }
    img {
      display: block;
      width: 100%;
      border-top: 1px solid var(--border);
      background: #e2e8f0;
    }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(config.title || "Visual Walkthrough")}</h1>
    ${config.summary ? `<p class="summary">${escapeHtml(config.summary)}</p>` : ""}
    <div class="meta">
      ${config.branch ? `<span>Branch: ${escapeHtml(config.branch)}</span>` : ""}
      ${config.targetBranch ? `<span>Target: ${escapeHtml(config.targetBranch)}</span>` : ""}
      <span>Generated: ${escapeHtml(config.generatedAt || new Date().toISOString())}</span>
    </div>
  </header>
  <main>
    ${cards}
  </main>
</body>
</html>`;
}

async function main() {
  const config = await loadConfig();
  const outputPath = path.resolve(config.outputPath || "walkthrough.html");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderHtml(config));
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
