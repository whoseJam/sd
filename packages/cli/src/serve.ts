#!/usr/bin/env bun
// Boots / kills the preview server.
//   pnpm start   → ensure preview server is listening on :PORT
//   pnpm stop    → kill the preview server + any view watchers

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createConnection } from "node:net";
import { homedir } from "node:os";
import { join } from "node:path";

type Verb = "start" | "stop";

const REPO = process.env.REPO ?? join(homedir(), "Desktop", "sd");
const REVEAL_ROOT = process.env.REVEAL_ROOT ?? "/tmp/sd-test";
const PORT = Number(process.env.PORT ?? 8765);
const SERVER_LOG = join(REVEAL_ROOT, "server.log");

mkdirSync(REVEAL_ROOT, { recursive: true });

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main(): Promise<void> {
  const verb = process.argv[2] as Verb | undefined;
  if (verb !== "start" && verb !== "stop") {
    console.error("usage: serve.ts <start|stop>");
    process.exit(1);
  }
  if (verb === "start") await start();
  else stop();
}

async function start(): Promise<void> {
  if (!which("bun")) die("missing: bun (brew install bun)");
  await ensureServer();
  console.log(`\n  server on :${PORT} — run \`pnpm open <name>\` to view\n`);
}

function stop(): void {
  killViewWatchers();
  const lsof = spawnSync(
    "lsof",
    ["-nP", `-iTCP:${PORT}`, "-sTCP:LISTEN", "-t"],
    { encoding: "utf-8" },
  );
  const pids = (lsof.stdout ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d+$/.test(line));
  if (pids.length) {
    spawnSync("kill", pids);
    console.log(`✓ preview server on :${PORT} killed`);
  } else {
    console.log("  preview server not running");
  }
  console.log("done.");
}

function killViewWatchers(): void {
  const file = join(REVEAL_ROOT, "view-pids.json");
  if (!existsSync(file)) return;
  let pids: number[] = [];
  try {
    pids = JSON.parse(readFileSync(file, "utf-8"));
  } catch {
    return;
  }
  let killed = 0;
  for (const pid of pids) {
    try {
      process.kill(pid);
      killed++;
    } catch {
      // already dead
    }
  }
  if (killed) console.log(`✓ killed ${killed} view watchers`);
  rmSync(file);
}

async function ensureServer(): Promise<void> {
  if (await portInUse(PORT)) {
    console.log(`✓ preview server on :${PORT}`);
    return;
  }
  console.log("  starting preview server...");
  // stdio takes an OS handle, not a Node stream. Listeners would pin the
  // event loop and the parent would never exit after child.unref().
  writeFileSync(SERVER_LOG, "");
  const logHandle = openSync(SERVER_LOG, "a");
  const child = spawn(
    "bun",
    [join(REPO, "packages", "cli", "src", "preview-server.ts")],
    {
      cwd: REPO,
      detached: true,
      stdio: ["ignore", logHandle, logHandle],
    },
  );
  child.unref();
  for (let attempt = 0; attempt < 20; attempt++) {
    await sleep(500);
    if (await portInUse(PORT)) {
      console.log(`✓ preview server on :${PORT}`);
      return;
    }
  }
  die(`✗ preview server failed (check ${SERVER_LOG})`);
}

function which(command: string): boolean {
  const result = spawnSync(
    process.platform === "win32" ? "where" : "command",
    process.platform === "win32" ? [command] : ["-v", command],
    { encoding: "utf-8", shell: process.platform !== "win32" },
  );
  return result.status === 0 && (result.stdout ?? "").trim().length > 0;
}

function portInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: "127.0.0.1" }, () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 1500);
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function die(message: string): never {
  console.error(message);
  process.exit(1);
}
