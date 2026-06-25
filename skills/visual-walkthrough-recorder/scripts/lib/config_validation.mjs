import { mrDescriptionMissingFields } from "./mr_description.mjs";

const SUPPORTED_ACTIONS = new Set(["goto", "click", "fill", "select", "press", "wait", "screenshot", "caption"]);
// Pre-record steps run before capture and support only this subset (no
// screenshot/caption), matching runPreRecordStep in create_recording_script.mjs.
const PRE_RECORD_ACTIONS = new Set(["goto", "click", "fill", "select", "press", "wait"]);
const ACTIONS_REQUIRING_SELECTOR = new Set(["click", "fill", "select"]);
const ACTIONS_RECOMMENDING_WAIT = new Set(["click", "fill", "select", "press"]);
const SUPPORTED_ARTIFACT_FORMATS = new Set(["auto", "webm", "mp4", "both"]);

function isSelector(value) {
  return Boolean(value && typeof value === "object" && (
    value.role ||
    value.label ||
    value.testId ||
    value.text ||
    value.css
  ));
}

function hasWaitFor(step) {
  return Boolean(step.waitFor && typeof step.waitFor === "object" && (
    step.waitFor.url ||
    step.waitFor.role ||
    step.waitFor.label ||
    step.waitFor.testId ||
    step.waitFor.text ||
    step.waitFor.css
  ));
}

function validateStep(step, index, errors, warnings, prefix = "steps", allowedActions = SUPPORTED_ACTIONS) {
  const label = `${prefix}[${index}]`;
  if (!step || typeof step !== "object") {
    errors.push(`${label} must be an object.`);
    return;
  }
  if (!allowedActions.has(step.action)) {
    errors.push(`${label}.action is unsupported: ${step.action || "<missing>"}.`);
  }
  if (step.action === "goto" && !step.url) {
    errors.push(`${label}.url is required for goto actions.`);
  }
  if (ACTIONS_REQUIRING_SELECTOR.has(step.action) && !isSelector(step.selector)) {
    errors.push(`${label}.selector is required for ${step.action} actions.`);
  }
  if (step.action === "fill" && step.value === undefined) {
    errors.push(`${label}.value is required for fill actions.`);
  }
  if (step.action === "select" && step.value === undefined) {
    errors.push(`${label}.value is required for select actions.`);
  }
  if (step.highlight && !isSelector(step.highlight)) {
    errors.push(`${label}.highlight is not a supported selector.`);
  }
  if (step.waitFor && !hasWaitFor(step)) {
    errors.push(`${label}.waitFor is not supported.`);
  }
  if (ACTIONS_RECOMMENDING_WAIT.has(step.action) && !hasWaitFor(step)) {
    warnings.push(`${label} changes page state without an explicit waitFor.`);
  }
}

export function validateRecordingConfigShape(config, options = {}) {
  const errors = [];
  const warnings = [];
  if (!config || typeof config !== "object") {
    return { ok: false, errors: ["Config must be a JSON object."], warnings };
  }
  if (options.requireBaseUrl !== false && !config.baseUrl) {
    errors.push("baseUrl is required.");
  }
  if (!config.branchSlug && !config.currentBranch) {
    warnings.push("branchSlug or currentBranch is recommended for stable artifact names.");
  }
  const artifactFormat = config.artifactFormat || "auto";
  if (!SUPPORTED_ARTIFACT_FORMATS.has(artifactFormat)) {
    errors.push(`artifactFormat must be one of: ${[...SUPPORTED_ARTIFACT_FORMATS].join(", ")}.`);
  }
  const steps = Array.isArray(config.steps) ? config.steps : [];
  if (steps.length === 0) {
    errors.push("steps must include at least one recording step.");
  }
  if ((config.htmlOnly || config.html_only) && !config.includeHtmlWalkthrough) {
    errors.push("htmlOnly requires includeHtmlWalkthrough=true.");
  }
  if (config.includeHtmlWalkthrough && !steps.some((step) => step?.action === "screenshot")) {
    warnings.push("includeHtmlWalkthrough is enabled but no screenshot steps are configured.");
  }
  if ((config.recordingMode || "branch-change") === "branch-change") {
    if (Array.isArray(config.planItems) && config.planItems.length > 0 && steps.length < config.planItems.length) {
      warnings.push("branch-change plan has fewer steps than plan items; ensure every plan item has visible evidence.");
    }
    if (config.diffEvidence && Array.isArray(config.diffEvidence) && config.diffEvidence.length === 0) {
      warnings.push("branch-change config has empty diffEvidence.");
    }
  }
  steps.forEach((step, index) => validateStep(step, index, errors, warnings));
  (Array.isArray(config.preRecordSteps) ? config.preRecordSteps : [])
    .forEach((step, index) => validateStep(step, index, errors, warnings, "preRecordSteps", PRE_RECORD_ACTIONS));

  const missingMrFields = mrDescriptionMissingFields(config);
  if (missingMrFields.length > 0) {
    const message = `MR description requested but missing: ${missingMrFields.join(", ")}.`;
    if (options.strictMrDescription) errors.push(message);
    else warnings.push(message);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}
