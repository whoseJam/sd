#!/usr/bin/env bun
// Backs `pnpm open <name>` and `pnpm close`.

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createConnection } from "node:net";
import { join, resolve } from "node:path";

const REPO = process.env.REPO ?? resolve(import.meta.dirname, "..", "..", "..");
const REVEAL_ROOT = process.env.REVEAL_ROOT ?? "/tmp/sd-test";
const PORT = Number(process.env.PORT ?? 8765);
const PIDS_FILE = join(REVEAL_ROOT, "view-pids.json");
const LOG_DIR = join(REVEAL_ROOT, "view-logs");
const PREVIEW_FILE = join(REVEAL_ROOT, "preview-url.txt");
// url.txt exists iff `start:remote` is active (it writes the funnel URL there).
const REMOTE_MARKER = join(REVEAL_ROOT, "url.txt");
const SERVER = `http://127.0.0.1:${PORT}`;

mkdirSync(REVEAL_ROOT, { recursive: true });
mkdirSync(LOG_DIR, { recursive: true });

const subcommand = process.argv[2];

if (subcommand === "hide") {
  await killExisting();
  writePreview("", "");
  console.log("✓ hidden");
  process.exit(0);
}

if (subcommand !== "show") usage();
const name = process.argv[3];
if (!name) usage();

await ensureServer();
await killExisting();
const isDeck = existsSync(join(REPO, "examples", "decks", name));
const isAnimation = existsSync(
  join(REPO, "examples", "animations", `${name}.ts`),
);
if (!isDeck && !isAnimation) {
  die(`not found: examples/decks/${name} or examples/animations/${name}.ts`);
}

const pids = isDeck ? startDeckWatchers(name) : startAnimationWatchers(name);
writeFileSync(PIDS_FILE, JSON.stringify(pids));

const url = isDeck ? "/reveal/index.html" : `/animation/${name}.html`;
const label = isDeck ? `deck ${name}` : `animation ${name}`;
writePreview(url, label);
if (existsSync(REMOTE_MARKER)) {
  console.log(`showing ${name}  →  ${url}  (phone via funnel)`);
} else {
  openBrowser(`${SERVER}${url}`);
  console.log(`showing ${name}  →  ${SERVER}${url}`);
}

// ── helpers ──────────────────────────────────────────────────────────────

async function ensureServer(): Promise<void> {
  if (await portInUse(PORT)) return;
  console.log("  server not running — booting pnpm start:local...");
  spawnSync("pnpm", ["start:local"], { cwd: REPO, stdio: "inherit" });
  for (let attempt = 0; attempt < 20; attempt++) {
    if (await portInUse(PORT)) return;
    await sleep(500);
  }
  die("✗ server failed to start");
}

async function killExisting(): Promise<void> {
  if (!existsSync(PIDS_FILE)) return;
  let pids: number[] = [];
  try {
    pids = JSON.parse(readFileSync(PIDS_FILE, "utf-8"));
  } catch {
    return;
  }
  for (const pid of pids) {
    try {
      process.kill(pid);
    } catch {
      // already dead
    }
  }
}

function startDeckWatchers(deckName: string): number[] {
  return [
    spawnWatcher("sd", ["gulp", "sd", "-w"]),
    spawnWatcher(`ppt-${deckName}`, [
      "gulp",
      "ppt",
      "-i",
      `examples/decks/${deckName}/reveal`,
      "-o",
      join(REVEAL_ROOT, "reveal"),
      "-l",
      "-w",
    ]),
    spawnWatcher(`anim-${deckName}`, [
      "gulp",
      "animation-group",
      "-i",
      `examples/decks/${deckName}/animation`,
      "-o",
      join(REVEAL_ROOT, "animation"),
      "-l",
      "-w",
    ]),
  ];
}

function startAnimationWatchers(animationName: string): number[] {
  return [
    spawnWatcher("sd", ["gulp", "sd", "-w"]),
    spawnWatcher(`anim-${animationName}`, [
      "gulp",
      "animation",
      "-i",
      `examples/animations/${animationName}.ts`,
      "-o",
      join(REVEAL_ROOT, "animation"),
      "-l",
      "-w",
    ]),
  ];
}

function spawnWatcher(tag: string, command: string[]): number {
  const logPath = join(LOG_DIR, `${tag}.log`);
  writeFileSync(logPath, "");
  // stdio → fd: Node streams would keep this process alive even after unref.
  const logFd = openSync(logPath, "a");
  const child = spawn("pnpm", ["exec", ...command], {
    cwd: REPO,
    detached: true,
    stdio: ["ignore", logFd, logFd],
  });
  child.unref();
  console.log(`  ${tag}: pid ${child.pid}  log ${logPath}`);
  return child.pid!;
}

// Single source of truth for the chat's preview iframe URL. server.ts reads
// this file as a static asset; no API endpoint involved.
function writePreview(url: string, label: string): void {
  writeFileSync(PREVIEW_FILE, url ? `${url}\t${label}` : "");
}

function openBrowser(url: string): void {
  if (process.env.OPEN_BROWSER === "0") return;
  if (process.platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
  } else if (process.platform === "linux") {
    spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
  } else if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", url], {
      detached: true,
      stdio: "ignore",
    }).unref();
  }
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

function usage(): never {
  console.error(`usage:
  pnpm open <deck-name>
  pnpm open <animation-name>
  pnpm close`);
  process.exit(1);
}

function die(message: string): never {
  console.error(message);
  process.exit(1);
}
