#!/usr/bin/env bun
// Unified launcher.
//   pnpm start:local   chat server only
//   pnpm start:remote  + cloudflared tunnel + tmux Claude
//   pnpm stop:local    kill chat server
//   pnpm stop:remote   kill all of the above

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createConnection } from "node:net";
import { homedir } from "node:os";
import { join } from "node:path";

type Mode = "local" | "remote";
type Verb = "start" | "stop";

const SESSION = process.env.SESSION ?? "claude-dev";
const REPO = process.env.REPO ?? join(homedir(), "Desktop", "sd");
const REVEAL_ROOT = process.env.REVEAL_ROOT ?? "/tmp/sd-test";
const PORT = Number(process.env.PORT ?? 8765);
const SERVER_LOG = join(REVEAL_ROOT, "server.log");
const TUNNEL_LOG = join(REVEAL_ROOT, "tunnel.log");
const URL_FILE = join(REVEAL_ROOT, "url.txt");
const PIN_FILE = join(REVEAL_ROOT, "transcript-path.txt");
const BASELINE_FILE = join(REVEAL_ROOT, "transcript-baseline.txt");

mkdirSync(REVEAL_ROOT, { recursive: true });

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main(): Promise<void> {
  const verb = process.argv[2] as Verb | undefined;
  const mode = process.argv[3] as Mode | undefined;
  if (
    (verb !== "start" && verb !== "stop") ||
    (mode !== "local" && mode !== "remote")
  ) {
    console.error("usage: serve.ts <start|stop> <local|remote>");
    process.exit(1);
  }
  if (verb === "start") await start(mode);
  else await stop(mode);
}

async function start(mode: Mode): Promise<void> {
  const required = mode === "remote" ? ["bun", "tmux", "cloudflared"] : ["bun"];
  for (const command of required) {
    if (!which(command)) die(`missing: ${command} (brew install ${command})`);
  }

  await ensureServer();
  if (mode === "local") {
    console.log(`\n  open: http://127.0.0.1:${PORT}/\n`);
    openBrowser(`http://127.0.0.1:${PORT}/`);
    return;
  }

  const url = await ensureTunnel();
  const needPin = ensureTmuxSession();
  if (needPin) pinTranscript();
  pinTmuxStatusBar(url);
  openBrowser(url);
  console.log(`\n  chat: ${url}\n`);
  if (process.env.NO_ATTACH === "1") return;
  const result = spawnSync("tmux", ["attach", "-t", SESSION], {
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function stop(mode: Mode): Promise<void> {
  killViewWatchers();
  if (mode === "remote") {
    if (spawnSync("tmux", ["has-session", "-t", SESSION]).status === 0) {
      spawnSync("tmux", ["kill-session", "-t", SESSION]);
      console.log(`✓ tmux session '${SESSION}' killed`);
    } else {
      console.log(`  tmux session '${SESSION}' not running`);
    }
    const cloudflaredPattern = `cloudflared.*--url.*:${PORT}`;
    if (pgrepHas(cloudflaredPattern)) {
      pkill(cloudflaredPattern);
      console.log("✓ cloudflared killed");
    } else {
      console.log("  cloudflared not running");
    }
    if (existsSync(URL_FILE)) rmSync(URL_FILE);
  }

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
    console.log(`✓ chat server on :${PORT} killed`);
  } else {
    console.log("  chat server not running");
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
    console.log(`✓ chat server on :${PORT}`);
    return;
  }
  console.log("  starting chat server...");
  const child = spawn(
    "bun",
    [join(REPO, "packages", "remote", "src", "server.ts")],
    {
      cwd: REPO,
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  await Bun.write(Bun.file(SERVER_LOG), "");
  const log = Bun.file(SERVER_LOG).writer();
  child.stdout.on("data", (chunk) => log.write(chunk));
  child.stderr.on("data", (chunk) => log.write(chunk));
  child.unref();
  for (let attempt = 0; attempt < 20; attempt++) {
    await sleep(500);
    if (await portInUse(PORT)) {
      console.log(`✓ chat server on :${PORT}`);
      return;
    }
  }
  die(`✗ chat server failed (check ${SERVER_LOG})`);
}

async function ensureTunnel(): Promise<string> {
  if (existsSync(URL_FILE)) {
    const candidate = readFileSync(URL_FILE, "utf-8").trim();
    if (candidate && pgrepHas(`cloudflared.*--url.*:${PORT}`)) {
      if (await httpAlive(candidate, 3000)) {
        console.log(`✓ tunnel: ${candidate}  (reused)`);
        return candidate;
      }
    }
  }
  pkill(`cloudflared.*--url.*:${PORT}`);
  await sleep(1000);
  writeFileSync(TUNNEL_LOG, "");
  console.log("  starting cloudflared...");
  const child = spawn(
    "cloudflared",
    ["tunnel", "--url", `http://127.0.0.1:${PORT}`, "--protocol", "http2"],
    { detached: true, stdio: ["ignore", "pipe", "pipe"] },
  );
  const log = Bun.file(TUNNEL_LOG).writer();
  child.stdout.on("data", (chunk) => log.write(chunk));
  child.stderr.on("data", (chunk) => log.write(chunk));
  child.unref();
  for (let attempt = 0; attempt < 30; attempt++) {
    await sleep(1000);
    const url = extractTunnelUrl();
    if (url) {
      writeFileSync(URL_FILE, url);
      console.log(`✓ tunnel: ${url}`);
      return url;
    }
  }
  die(`✗ tunnel: no URL after 30s (check ${TUNNEL_LOG})`);
}

function extractTunnelUrl(): string {
  try {
    const log = readFileSync(TUNNEL_LOG, "utf-8");
    const match = log.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    return match ? match[0] : "";
  } catch {
    return "";
  }
}

const SHELL_RE = /^(fish|bash|zsh|sh|dash|ksh)$/;
const CLAUDE_CMD = "claude --dangerously-skip-permissions";

function ensureTmuxSession(): boolean {
  if (tmux(["has-session", "-t", SESSION]).status === 0) {
    const paneCommand = tmux([
      "display-message",
      "-p",
      "-t",
      SESSION,
      "-F",
      "#{pane_current_command}",
    ]).stdout.trim();
    if (!paneCommand || SHELL_RE.test(paneCommand)) {
      console.log(
        `  Claude not running in tmux (pane: ${paneCommand || "?"}) — relaunching...`,
      );
      tmux(["send-keys", "-t", `${SESSION}:main`, CLAUDE_CMD, "Enter"]);
      console.log(`✓ tmux session '${SESSION}' (Claude relaunched)`);
      return true;
    }
    console.log(`✓ tmux session '${SESSION}' (Claude alive: ${paneCommand})`);
    return false;
  }
  tmux(["new-session", "-d", "-s", SESSION, "-c", REPO, "-n", "main"]);
  tmux(["send-keys", "-t", `${SESSION}:main`, CLAUDE_CMD, "Enter"]);
  console.log(`✓ tmux session '${SESSION}' (created)`);
  return true;
}

function pinTranscript(): void {
  const claudeDir = join(
    homedir(),
    ".claude",
    "projects",
    REPO.replace(/\//g, "-"),
  );
  writeFileSync(BASELINE_FILE, listJsonl(claudeDir).join("\n"));
  writeFileSync(PIN_FILE, "PENDING");
  console.log("✓ watcher armed (waits for tmux Claude's first jsonl)");
}

function listJsonl(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((filename) => filename.endsWith(".jsonl"))
    .map((filename) => join(dir, filename));
}

function pinTmuxStatusBar(url: string): void {
  tmux([
    "set-option",
    "-t",
    SESSION,
    "status-style",
    "bg=#1d4ed8,fg=#ffffff,bold",
  ]);
  tmux(["set-option", "-t", SESSION, "status-left-length", "200"]);
  tmux(["set-option", "-t", SESSION, "status-left", ` chat: ${url} `]);
  tmux(["set-option", "-t", SESSION, "status-right", ""]);
}

function openBrowser(url: string): void {
  if (process.env.OPEN_BROWSER === "0") return;
  if (process.platform === "darwin") {
    spawn("open", [url], { stdio: "ignore", detached: true }).unref();
  } else if (process.platform === "linux") {
    spawn("xdg-open", [url], { stdio: "ignore", detached: true }).unref();
  } else if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", url], {
      stdio: "ignore",
      detached: true,
    }).unref();
  }
}

function tmux(args: string[]): { status: number | null; stdout: string } {
  const result = spawnSync("tmux", args, { encoding: "utf-8" });
  return { status: result.status, stdout: result.stdout ?? "" };
}

function which(command: string): boolean {
  const result = spawnSync(
    process.platform === "win32" ? "where" : "command",
    process.platform === "win32" ? [command] : ["-v", command],
    { encoding: "utf-8", shell: process.platform !== "win32" },
  );
  return result.status === 0 && (result.stdout ?? "").trim().length > 0;
}

function pgrepHas(pattern: string): boolean {
  return spawnSync("pgrep", ["-f", pattern]).status === 0;
}

function pkill(pattern: string): void {
  spawnSync("pkill", ["-f", pattern]);
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

async function httpAlive(url: string, timeoutMs: number): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function die(message: string): never {
  console.error(message);
  process.exit(1);
}
