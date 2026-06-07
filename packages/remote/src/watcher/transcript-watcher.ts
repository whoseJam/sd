// TranscriptWatcher.
//
// Watches one agent transcript JSONL and dispatches new lines as Messages
// via the adapter. JSONL is the single source of truth: on first attach we
// replay the entire file from offset 0 so the chat reflects the current
// session's full history, then tail for live activity.
//
// State (offset, seen UUIDs) is in-memory only — the server can rebuild it
// at any time by re-parsing the JSONL. No disk persistence.
//
// Why polling (vs fs.watch): fs.watch's behavior is inconsistent across
// platforms (FSEvents on macOS coalesces events differently than inotify on
// Linux) and has edge cases around file rotation. A 400ms stat-poll is
// negligible cost and gets us identical semantics everywhere.

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

import { readBaseline } from "../sessions";
import type { Message } from "../message";
import type { AgentAdapter } from "../adapters/types";

interface PerFileState {
  offset: number;
  seenUuids: Set<string>;
}

const PIN_FILE =
  process.env.TRANSCRIPT_PIN_FILE ?? "/tmp/sd-test/transcript-path.txt";

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
  private files = new Map<string, PerFileState>();

  constructor(private readonly opts: WatcherOptions) {}

  start(): void {
    if (this.timer) return;
    this.tick();
    this.timer = setInterval(() => this.tick(), this.opts.intervalMs ?? 400);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /** Drop all per-file state so the next tick re-reads the (possibly new)
   *  pinned file from offset 0. Used when the user switches sessions. */
  reset(): void {
    this.files.clear();
    this.activeFile = null;
  }

  private rawPin(): string {
    if (process.env.TRANSCRIPT_PATH) return process.env.TRANSCRIPT_PATH;
    try {
      return readFileSync(PIN_FILE, "utf-8").trim();
    } catch {
      return "";
    }
  }

  /** "PENDING" marker means "first jsonl that appears in the project dir
   *  that wasn't in the baseline snapshot taken before tmux Claude was
   *  restarted". Deterministic set-difference; no time-based heuristics. */
  private resolvePin(): string {
    const raw = this.rawPin();
    if (!raw) return "";
    if (raw !== "PENDING") return raw;
    const dir = this.opts.adapter.getTranscriptDir(this.opts.cwd);
    if (!existsSync(dir)) return "";
    const baseline = readBaseline();
    try {
      for (const f of readdirSync(dir)) {
        if (!f.endsWith(".jsonl")) continue;
        const full = join(dir, f);
        if (baseline.has(full)) continue;
        writeFileSync(PIN_FILE, full);
        return full;
      }
    } catch {
      // ignore — try next tick
    }
    return "";
  }

  private tick(): void {
    const pinned = this.resolvePin();
    if (!pinned || !existsSync(pinned)) return;

    const newest = pinned;
    if (newest !== this.activeFile) {
      this.activeFile = newest;
    }

    let perFile = this.files.get(newest);
    // First time we see this file: start from offset 0 so we replay the
    // entire history into chat. Subsequent ticks tail from where we left off.
    if (!perFile) {
      perFile = { offset: 0, seenUuids: new Set() };
      this.files.set(newest, perFile);
    }

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

    const seen = perFile.seenUuids;
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
    // Cap the seen-set to bound memory across a long-running session.
    if (seen.size > 5000) {
      const trimmed = [...seen].slice(-2000);
      perFile.seenUuids = new Set(trimmed);
    }
  }
}

function safeSize(path: string): number {
  try {
    return statSync(path).size;
  } catch {
    return 0;
  }
}
