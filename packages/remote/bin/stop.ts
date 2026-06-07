#!/usr/bin/env bun
// Tear down everything started by start.ts:
//   - tmux session 'claude-dev'
//   - cloudflared tunnel for PORT
//   - chat server on PORT
//   - the URL file
//
// Idempotent: skips whatever isn't running.

import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const SESSION = process.env.SESSION ?? "claude-dev";
const PORT = Number(process.env.PORT ?? 8765);
const REVEAL_ROOT = process.env.REVEAL_ROOT ?? "/tmp/sd-test";
const URL_FILE = join(REVEAL_ROOT, "url.txt");

if (spawnSync("tmux", ["has-session", "-t", SESSION]).status === 0) {
  spawnSync("tmux", ["kill-session", "-t", SESSION]);
  console.log(`✓ tmux session '${SESSION}' killed`);
} else {
  console.log(`  tmux session '${SESSION}' not running`);
}

const cfPattern = `cloudflared.*--url.*:${PORT}`;
if (spawnSync("pgrep", ["-f", cfPattern]).status === 0) {
  spawnSync("pkill", ["-f", cfPattern]);
  console.log("✓ cloudflared killed");
} else {
  console.log("  cloudflared not running");
}

const lsof = spawnSync("lsof", ["-nP", `-iTCP:${PORT}`, "-sTCP:LISTEN", "-t"], {
  encoding: "utf-8",
});
const pids = (lsof.stdout ?? "")
  .split("\n")
  .map((s) => s.trim())
  .filter((s) => /^\d+$/.test(s));
if (pids.length) {
  spawnSync("kill", pids);
  console.log(`✓ chat server on :${PORT} killed`);
} else {
  console.log("  chat server not running");
}

if (existsSync(URL_FILE)) rmSync(URL_FILE);

console.log("done.");
