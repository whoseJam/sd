#!/usr/bin/env bun
// Unified launcher.
//   pnpm start:local   chat server only
//   pnpm start:remote  + tailscale funnel + tmux Claude
//   pnpm stop:local    kill chat server
//   pnpm stop:remote   kill all of the above

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
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
const URL_FILE = join(REVEAL_ROOT, "url.txt");

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
  const required = mode === "remote" ? ["bun", "tmux", "tailscale"] : ["bun"];
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
    const reset = spawnSync("tailscale", ["funnel", "reset"], {
      encoding: "utf-8",
    });
    if (reset.status === 0) console.log("✓ tailscale funnel reset");
    else console.log("  tailscale funnel reset failed (already off?)");
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
  const status = spawnSync("tailscale", ["status", "--json"], {
    encoding: "utf-8",
  });
  if (status.status !== 0) {
    die(
      "✗ tailscale not signed in. Run: sudo tailscale up\n" +
        "  See docs/tailscale-funnel-setup.md",
    );
  }
  let dnsName = "";
  try {
    const data = JSON.parse(status.stdout) as { Self?: { DNSName?: string } };
    dnsName = (data.Self?.DNSName ?? "").replace(/\.$/, "");
  } catch {
    die("✗ couldn't parse `tailscale status --json` output");
  }
  if (!dnsName) {
    die(
      "✗ tailscale has no DNSName for this machine. Sign in: sudo tailscale up",
    );
  }
  const url = `https://${dnsName}`;

  const existing = spawnSync("tailscale", ["funnel", "status"], {
    encoding: "utf-8",
  });
  if (
    existing.status === 0 &&
    new RegExp(`(127\\.0\\.0\\.1|localhost):${PORT}\\b`).test(existing.stdout)
  ) {
    writeFileSync(URL_FILE, url);
    console.log(`✓ tunnel: ${url}  (reused)`);
    return url;
  }

  console.log(`  starting tailscale funnel → :${PORT}...`);
  const result = spawnSync("tailscale", ["funnel", "--bg", String(PORT)], {
    encoding: "utf-8",
  });
  if (result.status !== 0) {
    die(
      `✗ tailscale funnel failed (status ${result.status}):\n${result.stderr || result.stdout || "(no output)"}`,
    );
  }
  writeFileSync(URL_FILE, url);
  console.log(`✓ tunnel: ${url}`);
  return url;
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
