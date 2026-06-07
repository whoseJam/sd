// TranscriptWatcher.
//
// Watches an agent's transcript directory for the most recently modified
// .jsonl file, then polls that file for new bytes. Each newly-appearing line
// is parsed by the adapter into 0+ Messages which are handed to the
// onMessage callback (the server saves + SSE-broadcasts them).
//
// Why polling (vs fs.watch): fs.watch's behavior is inconsistent across
// platforms (FSEvents on macOS coalesces events differently than inotify on
// Linux) and has edge cases around file rotation. A 400ms stat-poll is
// negligible cost and gets us identical semantics everywhere.
//
// State is persisted to /tmp/sd-test/watcher-state.json so a server restart
// resumes from the right byte offset and doesn't re-broadcast history.
// First-run skips historical content (starts at current EOF).

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

import type { Message } from "../message";
import type { AgentAdapter } from "../adapters/types";

interface PerFileState {
  offset: number;
  seenUuids: string[];
}

interface WatcherState {
  /** Map: absolute jsonl path → offset/uuids. */
  files: Record<string, PerFileState>;
}

const STATE_FILE =
  process.env.WATCHER_STATE_FILE ?? "/tmp/sd-test/watcher-state.json";

export interface WatcherOptions {
  /** Working directory whose Claude session we want to follow. */
  cwd: string;
  /** Adapter that knows where its agent's logs live and how to parse them. */
  adapter: AgentAdapter;
  /** Called per parsed message. The watcher does NOT throttle, dedupe by
   *  content, or buffer — implement that downstream if needed. */
  onMessage: (m: Message) => void;
  /** Stat poll interval in milliseconds. Default 400. */
  intervalMs?: number;
}

export class TranscriptWatcher {
  private timer: ReturnType<typeof setInterval> | null = null;
  private activeFile: string | null = null;
  private state: WatcherState;
  private bootstrapped = false;

  constructor(private readonly opts: WatcherOptions) {
    this.state = loadState();
  }

  start(): void {
    if (this.timer) return;
    this.tick();
    this.timer = setInterval(() => this.tick(), this.opts.intervalMs ?? 400);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /** Lock the watcher to a specific transcript path if pinned. Pinning lives
   *  in /tmp/sd-test/transcript-path.txt (written by start-session.sh after
   *  it launches Claude in tmux) and falls back to the env var override. The
   *  newest-mtime auto-pick is only used when nothing is pinned — useful in
   *  test/dev but leaks parent Claude sessions into chat if the user runs
   *  one in the same project dir. */
  private pinnedPath(): string {
    const env = process.env.TRANSCRIPT_PATH;
    if (env) return env;
    try {
      return readFileSync("/tmp/sd-test/transcript-path.txt", "utf-8").trim();
    } catch {
      return "";
    }
  }

  private tick(): void {
    let target: string;
    const pinned = this.pinnedPath();
    if (pinned) {
      if (!existsSync(pinned)) return;
      target = pinned;
    } else {
      const dir = this.opts.adapter.getTranscriptDir(this.opts.cwd);
      if (!existsSync(dir)) return;
      let files: { full: string; mtime: number }[] = [];
      try {
        files = readdirSync(dir)
          .filter((f) => f.endsWith(".jsonl"))
          .map((f) => {
            const full = join(dir, f);
            return { full, mtime: statSync(full).mtimeMs };
          });
      } catch {
        return;
      }
      if (files.length === 0) return;
      files.sort((a, b) => b.mtime - a.mtime);
      target = files[0].full;
    }

    const newest = target;
    if (newest !== this.activeFile) {
      this.activeFile = newest;
    }

    let perFile = this.state.files[newest];

    // First time we ever see this file: skip everything that's already in it
    // (we only want to forward live activity, not replay history). After
    // bootstrap we follow the tail.
    if (!perFile) {
      const size = safeSize(newest);
      perFile = { offset: size, seenUuids: [] };
      this.state.files[newest] = perFile;
      saveState(this.state);
      this.bootstrapped = true;
      return;
    }
    this.bootstrapped = true;

    const size = safeSize(newest);
    if (size <= perFile.offset) return;

    let buf: Buffer;
    try {
      buf = readFileSync(newest);
    } catch {
      return;
    }
    const slice = buf.subarray(perFile.offset);
    const text = slice.toString("utf-8");

    // If the file ends mid-line (writer hasn't flushed the final newline),
    // hold back the last fragment until the next tick.
    let consumedBytes = slice.length;
    let lines = text.split("\n");
    if (!text.endsWith("\n")) {
      const tail = lines.pop() ?? "";
      consumedBytes -= Buffer.byteLength(tail, "utf-8");
    }
    perFile.offset += consumedBytes;

    const seen = new Set(perFile.seenUuids);
    for (const line of lines) {
      if (!line) continue;
      let entry: unknown;
      try {
        entry = JSON.parse(line);
      } catch {
        continue;
      }
      const uuid =
        typeof entry === "object" && entry && "uuid" in entry
          ? String((entry as { uuid?: unknown }).uuid ?? "")
          : "";
      if (uuid && seen.has(uuid)) continue;

      const messages = this.opts.adapter.parseEntry(entry);
      for (const m of messages) this.opts.onMessage(m);
      if (uuid) seen.add(uuid);
    }
    perFile.seenUuids = [...seen].slice(-1000);
    saveState(this.state);
  }
}

function safeSize(path: string): number {
  try {
    return statSync(path).size;
  } catch {
    return 0;
  }
}

function loadState(): WatcherState {
  if (!existsSync(STATE_FILE)) return { files: {} };
  try {
    const j = JSON.parse(readFileSync(STATE_FILE, "utf-8"));
    if (!j.files) return { files: {} };
    return j;
  } catch {
    return { files: {} };
  }
}

function saveState(state: WatcherState): void {
  try {
    mkdirSync(dirname(STATE_FILE), { recursive: true });
    writeFileSync(STATE_FILE, JSON.stringify(state));
  } catch {
    // ignore — best-effort persistence
  }
}
