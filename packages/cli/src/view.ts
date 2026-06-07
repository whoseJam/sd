#!/usr/bin/env bun
// Backs `pnpm show <name>` and `pnpm hide`.
//
// show: ensures local server is running, kills any previous watchers,
// spawns watchers for the target deck/animation, POSTs /api/preview so
// the chat's stage panel shows the iframe, opens a local browser tab.
//
// hide: kills the watchers and clears the stage panel. Doesn't touch the
// server — use `pnpm stop:local` / `pnpm stop:remote` for that.

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
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
const SERVER = `http://127.0.0.1:${PORT}`;

mkdirSync(REVEAL_ROOT, { recursive: true });
mkdirSync(LOG_DIR, { recursive: true });

const sub = process.argv[2];

if (sub === "hide") {
  await killExisting();
  await pushPreview("", "");
  console.log("✓ hidden");
  process.exit(0);
}

if (sub !== "show") usage();
const name = process.argv[3];
if (!name) usage();

await ensureServer();
await killExisting();
const isDeck = existsSync(join(REPO, "examples", "decks", name));
const isAnim = existsSync(join(REPO, "examples", "animations", `${name}.ts`));
if (!isDeck && !isAnim) {
  die(
    `not found: examples/decks/${name} or examples/animations/${name}.ts`,
  );
}

const pids = isDeck ? startDeckWatchers(name) : startAnimationWatchers(name);
writeFileSync(PIDS_FILE, JSON.stringify(pids));

const url = isDeck ? "/reveal/index.html" : `/animation/${name}.html`;
const label = isDeck ? `deck ${name}` : `animation ${name}`;
await pushPreview(url, label);
openBrowser(`${SERVER}/`);
console.log(`showing ${name}  →  ${url}`);

// ── implementations ─────────────────────────────────────────────────────

async function ensureServer(): Promise<void> {
  if (await portInUse(PORT)) return;
  console.log("  chat server not running — booting pnpm start:local...");
  spawnSync("pnpm", ["start:local"], { cwd: REPO, stdio: "inherit" });
  for (let i = 0; i < 20; i++) {
    if (await portInUse(PORT)) return;
    await sleep(500);
  }
  die("✗ chat server failed to start");
}

async function killExisting(): Promise<void> {
  if (!existsSync(PIDS_FILE)) return;
  let pids: number[] = [];
  try {
    pids = JSON.parse(readFileSync(PIDS_FILE, "utf-8"));
  } catch {
    return;
  }
  for (const p of pids) {
    try {
      process.kill(p);
    } catch {
      // already dead
    }
  }
}

function startDeckWatchers(name: string): number[] {
  return [
    spawnWatcher("sd", ["gulp", "sd", "-w"]),
    spawnWatcher(`ppt-${name}`, [
      "gulp",
      "ppt",
      "-i",
      `examples/decks/${name}/reveal`,
      "-o",
      join(REVEAL_ROOT, "reveal"),
      "-l",
      "-w",
    ]),
    spawnWatcher(`anim-${name}`, [
      "gulp",
      "animation-group",
      "-i",
      `examples/decks/${name}/animation`,
      "-o",
      join(REVEAL_ROOT, "animation"),
      "-l",
      "-w",
    ]),
  ];
}

function startAnimationWatchers(name: string): number[] {
  return [
    spawnWatcher("sd", ["gulp", "sd", "-w"]),
    spawnWatcher(`anim-${name}`, [
      "gulp",
      "animation",
      "-i",
      `examples/animations/${name}.ts`,
      "-o",
      join(REVEAL_ROOT, "animation"),
      "-l",
      "-w",
    ]),
  ];
}

function spawnWatcher(tag: string, cmd: string[]): number {
  const logPath = join(LOG_DIR, `${tag}.log`);
  writeFileSync(logPath, "");
  const child = spawn("pnpm", ["exec", ...cmd], {
    cwd: REPO,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const writer = Bun.file(logPath).writer();
  child.stdout.on("data", (d) => writer.write(d));
  child.stderr.on("data", (d) => writer.write(d));
  child.unref();
  console.log(`  ${tag}: pid ${child.pid}  log ${logPath}`);
  return child.pid!;
}

async function pushPreview(url: string, label: string): Promise<void> {
  try {
    await fetch(`${SERVER}/api/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, label }),
    });
  } catch {
    console.warn("  could not POST /api/preview — chat may not be open");
  }
}

function openBrowser(url: string): void {
  if (process.env.OPEN_BROWSER === "0") return;
  if (process.platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
  } else if (process.platform === "linux") {
    spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
  } else if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", url], { detached: true, stdio: "ignore" }).unref();
  }
}

function portInUse(port: number): Promise<boolean> {
  return new Promise((res) => {
    const s = createConnection({ port, host: "127.0.0.1" }, () => {
      s.destroy();
      res(true);
    });
    s.on("error", () => res(false));
    setTimeout(() => {
      s.destroy();
      res(false);
    }, 1500);
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function usage(): never {
  console.error(`usage:
  pnpm show <deck-name>
  pnpm show <animation-name>
  pnpm hide`);
  process.exit(1);
}

function die(msg: string): never {
  console.error(msg);
  process.exit(1);
}
