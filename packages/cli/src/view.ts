#!/usr/bin/env bun
// Backs `pnpm open <name>` and `pnpm close`.

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const REPO = process.env.REPO ?? process.cwd();
const REVEAL_ROOT = process.env.REVEAL_ROOT ?? join(REPO, "dist");
const DIST_DIR = join(REPO, "dist");
const PORT = Number(process.env.PORT ?? 8765);
const PIDS_FILE = join(REVEAL_ROOT, "view-pids.json");
const LOG_DIR = join(REVEAL_ROOT, "view-logs");
const PREVIEW_DIR = join(REVEAL_ROOT, "previews");
const SERVER = `http://127.0.0.1:${PORT}`;

mkdirSync(REVEAL_ROOT, { recursive: true });
mkdirSync(LOG_DIR, { recursive: true });

const subcommand = process.argv[2];

if (subcommand === "hide") {
  const name = process.argv[3];
  if (name) killNamed(name);
  else killAll();
  console.log("✓ hidden");
  process.exit(0);
}

if (subcommand !== "show") usage();
const name = process.argv[3];
if (!name) usage();

const isDeck = existsSync(join(REPO, "examples", "decks", name));
const isAnimation = existsSync(
  join(REPO, "examples", "animations", `${name}.ts`),
);
if (!isDeck && !isAnimation) {
  die(`not found: examples/decks/${name} or examples/animations/${name}.ts`);
}

const targetKey = isDeck ? deckKey(name) : animationKey(name);
let pidState = readPidState();
const buildSd = needsSharedBuild("sd.js");
const buildReveal = isDeck && needsSharedBuild("reveal.js");
deleteAfterKill(pidState, targetKey);
writePidState(pidState);
if (isDeck) buildDeck(name, { buildSd, buildReveal });
else buildAnimation(name, { buildSd });

await ensureServer();
pidState = readPidState();
ensureSharedWatcher(pidState, "shared:sd", "sd", [
  "gulp",
  "sd",
  "-o",
  DIST_DIR,
  "-w",
]);
if (isDeck) {
  ensureSharedWatcher(pidState, "shared:reveal", "reveal", [
    "gulp",
    "reveal",
    "-o",
    DIST_DIR,
    "-w",
  ]);
}
pidState[targetKey] = isDeck
  ? startDeckWatchers(name)
  : startAnimationWatchers(name);
writePidState(pidState);

const url = isDeck
  ? `/previews/decks/${toUrlPath(name)}/reveal/index.html`
  : `/previews/animations/${toUrlPath(name)}/animation/${toUrlPath(name)}.html`;
openBrowser(`${SERVER}${url}`);
console.log(`showing ${name}  →  ${SERVER}${url}`);

async function ensureServer(): Promise<void> {
  if (await previewServerReady()) return;
  console.log("  server not running — booting pnpm start...");
  const result = spawnSync("pnpm", ["start"], { cwd: REPO, stdio: "inherit" });
  if (result.status !== 0) die("✗ server failed to start");
  for (let attempt = 0; attempt < 20; attempt++) {
    if (await previewServerReady()) return;
    await sleep(500);
  }
  die("✗ server failed to start");
}

async function previewServerReady(): Promise<boolean> {
  try {
    const response = await fetch(`${SERVER}/api/sd-preview-server`);
    return response.ok;
  } catch {
    return false;
  }
}

type PidState = Record<string, number[]>;

function readPidState(): PidState {
  if (!existsSync(PIDS_FILE)) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(PIDS_FILE, "utf-8"));
  } catch {
    return {};
  }
  if (Array.isArray(parsed)) {
    return { legacy: parsed.filter(isNumber) };
  }
  if (!parsed || typeof parsed !== "object") return {};
  const state: PidState = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (!Array.isArray(value)) continue;
    state[key] = value.filter(isNumber);
  }
  return state;
}

function writePidState(pidState: PidState): void {
  const liveState: PidState = {};
  for (const [key, processIds] of Object.entries(pidState)) {
    const liveProcessIds = processIds.filter(isProcessAlive);
    if (liveProcessIds.length) liveState[key] = liveProcessIds;
  }
  if (Object.keys(liveState).length === 0) {
    rmSync(PIDS_FILE, { force: true });
    return;
  }
  writeFileSync(PIDS_FILE, JSON.stringify(liveState, null, 2));
}

function killAll(): void {
  const pidState = readPidState();
  for (const key of Object.keys(pidState)) killPidList(pidState[key]);
  rmSync(PIDS_FILE, { force: true });
}

function killNamed(name: string): void {
  const pidState = readPidState();
  deleteAfterKill(pidState, deckKey(name));
  deleteAfterKill(pidState, animationKey(name));
  if (!hasPreviewTarget(pidState)) {
    deleteAfterKill(pidState, "shared:sd");
    deleteAfterKill(pidState, "shared:reveal");
  }
  writePidState(pidState);
}

function deleteAfterKill(pidState: PidState, key: string): void {
  killPidList(pidState[key] ?? []);
  delete pidState[key];
}

function killPidList(processIds: number[]): void {
  for (const processId of processIds) {
    try {
      process.kill(processId);
    } catch {
      // already dead
    }
  }
}

function hasPreviewTarget(pidState: PidState): boolean {
  return Object.keys(pidState).some(
    (key) => key.startsWith("deck:") || key.startsWith("animation:"),
  );
}

function needsSharedBuild(outputFileName: string): boolean {
  return !existsSync(join(DIST_DIR, outputFileName));
}

function ensureSharedWatcher(
  pidState: PidState,
  key: string,
  tag: string,
  command: string[],
): void {
  const liveProcessIds = (pidState[key] ?? []).filter(isProcessAlive);
  if (liveProcessIds.length) {
    pidState[key] = liveProcessIds;
    return;
  }
  pidState[key] = [spawnWatcher(tag, command)];
}

function startDeckWatchers(deckName: string): number[] {
  return [
    spawnWatcher(`ppt-${deckName}`, [
      "gulp",
      "ppt",
      "-i",
      `examples/decks/${deckName}/reveal`,
      "-o",
      join(deckPreviewRoot(deckName), "reveal"),
      "-w",
    ]),
    spawnWatcher(`anim-${deckName}`, [
      "gulp",
      "animation-group",
      "-i",
      `examples/decks/${deckName}/animation`,
      "-o",
      join(deckPreviewRoot(deckName), "animation"),
      "-w",
    ]),
  ];
}

function startAnimationWatchers(animationName: string): number[] {
  return [
    spawnWatcher(`anim-${animationName}`, [
      "gulp",
      "animation",
      "-i",
      `examples/animations/${animationName}.ts`,
      "-o",
      join(animationPreviewRoot(animationName), "animation"),
      "-w",
    ]),
  ];
}

function buildDeck(
  deckName: string,
  options: { buildSd: boolean; buildReveal: boolean },
): void {
  const previewRoot = deckPreviewRoot(deckName);
  rmSync(previewRoot, { recursive: true, force: true });
  if (options.buildSd) runGulp("sd", ["sd", "-o", DIST_DIR]);
  if (options.buildReveal) runGulp("reveal", ["reveal", "-o", DIST_DIR]);
  runGulp("ppt", [
    "ppt",
    "-i",
    `examples/decks/${deckName}/reveal`,
    "-o",
    join(previewRoot, "reveal"),
  ]);
  runGulp("animation-group", [
    "animation-group",
    "-i",
    `examples/decks/${deckName}/animation`,
    "-o",
    join(previewRoot, "animation"),
  ]);
}

function buildAnimation(
  animationName: string,
  options: { buildSd: boolean },
): void {
  const previewRoot = animationPreviewRoot(animationName);
  rmSync(previewRoot, { recursive: true, force: true });
  if (options.buildSd) runGulp("sd", ["sd", "-o", DIST_DIR]);
  runGulp("animation", [
    "animation",
    "-i",
    `examples/animations/${animationName}.ts`,
    "-o",
    join(previewRoot, "animation"),
  ]);
}

function runGulp(label: string, args: string[]): void {
  console.log(`  building ${label}...`);
  const result = spawnSync("pnpm", ["exec", "gulp", ...args], {
    cwd: REPO,
    stdio: "inherit",
  });
  if (result.status !== 0) die(`${label} build failed`);
}

function spawnWatcher(tag: string, command: string[]): number {
  const logPath = join(LOG_DIR, `${safeLogTag(tag)}.log`);
  writeFileSync(logPath, "");
  // OS handle, not Node stream. Listeners would pin this process alive.
  const logHandle = openSync(logPath, "a");
  const child = spawn("pnpm", ["exec", ...command], {
    cwd: REPO,
    detached: true,
    stdio: ["ignore", logHandle, logHandle],
  });
  child.unref();
  console.log(`  ${tag}: pid ${child.pid}  log ${logPath}`);
  return child.pid!;
}

function deckPreviewRoot(deckName: string): string {
  return join(PREVIEW_DIR, "decks", deckName);
}

function animationPreviewRoot(animationName: string): string {
  return join(PREVIEW_DIR, "animations", animationName);
}

function deckKey(deckName: string): string {
  return `deck:${deckName}`;
}

function animationKey(animationName: string): string {
  return `animation:${animationName}`;
}

function toUrlPath(path: string): string {
  return path
    .split(/[\\/]/)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function safeLogTag(tag: string): string {
  return tag.replace(/[\\/:*?"<>|]/g, "-");
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function isProcessAlive(processId: number): boolean {
  try {
    process.kill(processId, 0);
    return true;
  } catch {
    return false;
  }
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function usage(): never {
  console.error(`usage:
  pnpm open <deck-name>
  pnpm open <animation-name>
  pnpm close [name]`);
  process.exit(1);
}

function die(message: string): never {
  console.error(message);
  process.exit(1);
}
