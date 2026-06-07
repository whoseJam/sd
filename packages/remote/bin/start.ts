#!/usr/bin/env bun
// One-shot launcher: chat server + cloudflared tunnel + tmux Claude session.
//
// Pair with bin/stop.ts. Inverse operation is "stop" — symmetric naming.
//
// Why this is in TypeScript and not a shell script: bash isn't portable to
// Windows / non-POSIX environments, and the orchestration logic (poll for
// URL, diff jsonl set, pin watcher) is more readable as TS. tmux,
// cloudflared, and bun must still be installed as CLI binaries; we just
// shell out to them.
//
// Idempotent. Re-running reuses existing server / tunnel / session.

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { createConnection } from "node:net";
import { homedir } from "node:os";
import { join } from "node:path";

const SESSION = process.env.SESSION ?? "claude-dev";
const REPO = process.env.REPO ?? join(homedir(), "Desktop", "sd");
const REVEAL_ROOT = process.env.REVEAL_ROOT ?? "/tmp/sd-test";
const PORT = Number(process.env.PORT ?? 8765);
const SERVER_LOG = join(REVEAL_ROOT, "server.log");
const TUNNEL_LOG = join(REVEAL_ROOT, "tunnel.log");
const URL_FILE = join(REVEAL_ROOT, "url.txt");
const PIN_FILE = join(REVEAL_ROOT, "transcript-path.txt");

mkdirSync(REVEAL_ROOT, { recursive: true });

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});

async function main(): Promise<void> {
  for (const cmd of ["tmux", "cloudflared", "bun"]) {
    if (!which(cmd)) die(`missing: ${cmd} (brew install ${cmd})`);
  }

  await ensureServer();
  const url = await ensureTunnel();
  const needPin = ensureTmuxSession();
  if (needPin) await pinTranscript();
  pinTmuxStatusBar(url);
  openBrowser(url);

  if (process.env.OPEN_BROWSER !== "0" && process.stdout.isTTY) {
    console.log(`\n  chat: ${url}\n`);
  }

  // Land the user inside the tmux session by default. Skip with NO_ATTACH=1
  // for headless / CI invocations (the watcher + tunnel keep running).
  if (process.env.NO_ATTACH === "1") return;
  const r = spawnSync("tmux", ["attach", "-t", SESSION], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

async function ensureServer(): Promise<void> {
  if (await portInUse(PORT)) {
    console.log(`✓ chat server on :${PORT}`);
    return;
  }
  console.log("  starting chat server...");
  const log = Bun.file(SERVER_LOG);
  // Detach via setsid-equivalent: stdio: 'ignore' + ref decreases child link.
  const child = spawn(
    "bun",
    [join(REPO, "packages", "remote", "src", "server.ts")],
    {
      cwd: REPO,
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  const writer = Bun.write(log, ""); // truncate
  await writer;
  const out = Bun.file(SERVER_LOG).writer();
  child.stdout.on("data", (d) => out.write(d));
  child.stderr.on("data", (d) => out.write(d));
  child.unref();

  for (let i = 0; i < 20; i++) {
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
      const alive = await httpAlive(candidate, 3000);
      if (alive) {
        console.log(`✓ tunnel: ${candidate}  (reused)`);
        return candidate;
      }
    }
  }

  // Restart fresh so the log we read for URL parsing is always ours.
  pkill(`cloudflared.*--url.*:${PORT}`);
  await sleep(1000);
  writeFileSync(TUNNEL_LOG, "");
  console.log("  starting cloudflared...");
  const child = spawn(
    "cloudflared",
    ["tunnel", "--url", `http://127.0.0.1:${PORT}`],
    {
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  const out = Bun.file(TUNNEL_LOG).writer();
  child.stdout.on("data", (d) => out.write(d));
  child.stderr.on("data", (d) => out.write(d));
  child.unref();

  for (let i = 0; i < 30; i++) {
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
    const m = log.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    return m ? m[0] : "";
  } catch {
    return "";
  }
}

const SHELL_RE = /^(fish|bash|zsh|sh|dash|ksh)$/;

function ensureTmuxSession(): boolean {
  if (tmux(["has-session", "-t", SESSION]).status === 0) {
    const paneCmd = tmux([
      "display-message",
      "-p",
      "-t",
      SESSION,
      "-F",
      "#{pane_current_command}",
    ]).stdout.trim();

    if (!paneCmd || SHELL_RE.test(paneCmd)) {
      console.log(
        `  Claude not running in tmux (pane: ${paneCmd || "?"}) — relaunching...`,
      );
      tmux(["send-keys", "-t", `${SESSION}:main`, "claude", "Enter"]);
      console.log(`✓ tmux session '${SESSION}' (Claude relaunched)`);
      return true;
    }
    console.log(`✓ tmux session '${SESSION}' (Claude alive: ${paneCmd})`);
    return false;
  }

  tmux(["new-session", "-d", "-s", SESSION, "-c", REPO, "-n", "main"]);
  tmux(["send-keys", "-t", `${SESSION}:main`, "claude", "Enter"]);
  console.log(`✓ tmux session '${SESSION}' (created)`);
  return true;
}

async function pinTranscript(): Promise<void> {
  const claudeDir = join(
    homedir(),
    ".claude",
    "projects",
    REPO.replace(/\//g, "-"),
  );
  const before = new Set(listJsonl(claudeDir));
  console.log("  detecting Claude's transcript file...");
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    const after = listJsonl(claudeDir);
    const fresh = after.find((p) => !before.has(p));
    if (fresh) {
      writeFileSync(PIN_FILE, fresh);
      console.log(
        `✓ watcher pinned to ${fresh.split("/").pop()?.replace(/\.jsonl$/, "")}`,
      );
      return;
    }
  }
  console.warn("  watcher pin: new transcript not detected within 15s");
}

function listJsonl(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".jsonl"))
    .map((f) => join(dir, f));
}

function pinTmuxStatusBar(url: string): void {
  tmux(["set-option", "-t", SESSION, "status-style", "bg=#1d4ed8,fg=#ffffff,bold"]);
  tmux(["set-option", "-t", SESSION, "status-left-length", "200"]);
  tmux(["set-option", "-t", SESSION, "status-left", ` chat: ${url} `]);
  tmux(["set-option", "-t", SESSION, "status-right", ""]);
}

function openBrowser(url: string): void {
  if (process.env.OPEN_BROWSER === "0") return;
  // macOS only; harmless if it fails elsewhere.
  if (process.platform === "darwin") {
    spawn("open", [url], { stdio: "ignore", detached: true }).unref();
  } else if (process.platform === "linux") {
    spawn("xdg-open", [url], { stdio: "ignore", detached: true }).unref();
  } else if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", url], { stdio: "ignore", detached: true }).unref();
  }
}

// ── helpers ──────────────────────────────────────────────────────────────

function tmux(args: string[]): { status: number | null; stdout: string } {
  const r = spawnSync("tmux", args, { encoding: "utf-8" });
  return { status: r.status, stdout: r.stdout ?? "" };
}

function which(cmd: string): boolean {
  const r = spawnSync(
    process.platform === "win32" ? "where" : "command",
    process.platform === "win32" ? [cmd] : ["-v", cmd],
    { encoding: "utf-8", shell: process.platform !== "win32" },
  );
  return r.status === 0 && (r.stdout ?? "").trim().length > 0;
}

function pgrepHas(pattern: string): boolean {
  const r = spawnSync("pgrep", ["-f", pattern]);
  return r.status === 0;
}

function pkill(pattern: string): void {
  spawnSync("pkill", ["-f", pattern]);
}

function portInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = createConnection({ port, host: "127.0.0.1" }, () => {
      sock.destroy();
      resolve(true);
    });
    sock.on("error", () => resolve(false));
    setTimeout(() => {
      sock.destroy();
      resolve(false);
    }, 1500);
  });
}

async function httpAlive(url: string, timeoutMs: number): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function die(msg: string): never {
  console.error(msg);
  process.exit(1);
}
