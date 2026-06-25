#!/usr/bin/env node
import { spawn } from "node:child_process";
import { access, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function argValue(name) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${code}`));
    });
  });
}

async function main() {
  const input = argValue("--input");
  const output = argValue("--output");
  if (!input || !output) {
    throw new Error("Usage: convert_video.mjs --input=input.webm --output=output.mp4");
  }

  await run("ffmpeg", ["-version"]);

  if (!(await exists(input))) {
    throw new Error(`Input video does not exist: ${input}`);
  }

  await mkdir(path.dirname(path.resolve(output)), { recursive: true });
  await run("ffmpeg", [
    "-y",
    "-i",
    input,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    output,
  ]);

  const outputStat = await stat(output);
  if (outputStat.size === 0) {
    throw new Error(`Converted video is empty: ${output}`);
  }

  console.log(output);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
