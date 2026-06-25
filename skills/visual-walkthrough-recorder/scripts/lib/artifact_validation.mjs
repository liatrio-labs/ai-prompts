import { execFile } from "node:child_process";
import { access, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function fileStatus(filePath) {
  try {
    await access(filePath);
    const fileStat = await stat(filePath);
    return { path: filePath, exists: true, size: fileStat.size };
  } catch {
    return { path: filePath, exists: false, size: 0 };
  }
}

async function ffprobe(filePath) {
  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height,codec_name",
      "-show_entries",
      "format=duration",
      "-of",
      "json",
      filePath,
    ], { encoding: "utf8" });
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

async function extractSampleFrames(filePath, outputDir) {
  try {
    await mkdir(outputDir, { recursive: true });
    await execFileAsync("ffmpeg", [
      "-y",
      "-i",
      filePath,
      "-vf",
      "thumbnail,scale=320:-1",
      "-frames:v",
      "3",
      path.join(outputDir, "frame-%02d.jpg"),
    ], { encoding: "utf8" });
    return true;
  } catch {
    return false;
  }
}

export async function validateArtifactFiles(files, options = {}) {
  const minDurationSeconds = Number(options.minDurationSeconds ?? 2);
  const results = [];
  for (const file of files) {
    const status = await fileStatus(file);
    const warnings = [];
    if (status.exists && /\.(webm|mp4|mov)$/i.test(file)) {
      const probe = await ffprobe(file);
      const durationSeconds = Number.parseFloat(probe?.format?.duration);
      const stream = probe?.streams?.[0] || {};
      status.durationSeconds = Number.isFinite(durationSeconds) ? durationSeconds : null;
      status.width = stream.width || null;
      status.height = stream.height || null;
      status.codec = stream.codec_name || null;
      if (status.durationSeconds !== null && status.durationSeconds < minDurationSeconds) {
        warnings.push(`Video duration is shorter than ${minDurationSeconds}s.`);
      }
      if (!status.width || !status.height) {
        warnings.push("Video resolution could not be verified.");
      }
      if (options.frameOutputDir) {
        status.sampleFramesExtracted = await extractSampleFrames(file, options.frameOutputDir);
        if (!status.sampleFramesExtracted) warnings.push("Sample frame extraction failed.");
      }
    }
    status.warnings = warnings;
    status.ok = status.exists && status.size > 0;
    results.push(status);
  }
  return {
    ok: results.every((result) => result.ok),
    files: results,
  };
}
