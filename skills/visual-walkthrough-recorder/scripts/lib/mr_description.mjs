import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function bulletList(items) {
  const cleaned = (Array.isArray(items) ? items : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return cleaned.map((item) => `- ${item}`).join("\n");
}

export function mrDescriptionMissingFields(config) {
  if (!(config.includeMrDescription || config.include_mr_description)) return [];
  const missing = [];
  if (!Array.isArray(config.mrSummaryItems) || config.mrSummaryItems.filter(Boolean).length === 0) {
    missing.push("mrSummaryItems");
  }
  if (!Array.isArray(config.mrChangeItems) || config.mrChangeItems.filter(Boolean).length === 0) {
    missing.push("mrChangeItems");
  }
  if (!Array.isArray(config.validationItems) || config.validationItems.filter(Boolean).length === 0) {
    missing.push("validationItems");
  }
  return missing;
}

function validationLines(config) {
  return bulletList(config.validationItems);
}

function renderTemplate(template, values) {
  return template.replace(/{{(summary|whatChanged|validation)}}/g, (_match, key) => values[key] || "");
}

export async function generateMrDescription({ config, outputPath, templatePath }) {
  const missing = mrDescriptionMissingFields({ ...config, includeMrDescription: true });
  if (missing.length > 0) {
    throw new Error(`MR description requires explicit ${missing.join(", ")}.`);
  }
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const resolvedTemplatePath = templatePath || path.resolve(scriptDir, "../../assets/mr-description-template.md");
  const template = await readFile(resolvedTemplatePath, "utf8");
  const summary = bulletList(config.mrSummaryItems);
  const whatChanged = bulletList(config.mrChangeItems);
  const validation = validationLines(config);
  const output = renderTemplate(template, { summary, whatChanged, validation });
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output.endsWith("\n") ? output : `${output}\n`);
  return outputPath;
}
