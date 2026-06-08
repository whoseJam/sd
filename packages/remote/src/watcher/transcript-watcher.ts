// Watches one agent transcript JSONL and dispatches new lines as Messages
// via the adapter. On first attach we replay from offset 0 (the chat
// reflects full session history); thereafter we tail.
//
// State is in-memory only — the server can always rebuild it by re-parsing
// the JSONL. Polling (vs fs.watch) for cross-platform consistency.

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

import type { AgentAdapter } from "../adapters/types";
import type { Message } from "../message";

import { readBaseline } from "../sessions";

interface PerFileState {
  offset: number;
  seenUuids: Set<string>;
}

const PIN_FILE =
  process.env.TRANSCRIPT_PIN_FILE ?? "/tmp/sd-test/transcript-path.txt";

export interface WatcherOptions {
  cwd: string;
  adapter: AgentAdapter;
  onMessage: (message: Message) => void;
  intervalMs?: number;
}

export class TranscriptWatcher {
  private timer: ReturnType<typeof setInterval> | null = null;
  private activeFile: string | null = null;
  private files = new Map<string, PerFileState>();

  constructor(private readonly options: WatcherOptions) {}

  start(): void {
    if (this.timer) return;
    this.tick();
    this.timer = setInterval(() => this.tick(), this.options.intervalMs ?? 400);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  // Used on session switch.
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

  // "PENDING" marker = "first jsonl that appears in the project dir which
  // wasn't in the baseline snapshot". Deterministic set-difference.
  private resolvePin(): string {
    const raw = this.rawPin();
    if (!raw) return "";
    if (raw !== "PENDING") return raw;
    const dir = this.options.adapter.getTranscriptDir(this.options.cwd);
    if (!existsSync(dir)) return "";
    const baseline = readBaseline();
    try {
      for (const filename of readdirSync(dir)) {
        if (!filename.endsWith(".jsonl")) continue;
        const fullPath = join(dir, filename);
        if (baseline.has(fullPath)) continue;
        writeFileSync(PIN_FILE, fullPath);
        return fullPath;
      }
    } catch {
      // try next tick
    }
    return "";
  }

  private tick(): void {
    const pinned = this.resolvePin();
    if (!pinned || !existsSync(pinned)) return;

    if (pinned !== this.activeFile) {
      this.activeFile = pinned;
    }

    let state = this.files.get(pinned);
    if (!state) {
      state = { offset: 0, seenUuids: new Set() };
      this.files.set(pinned, state);
    }

    const size = safeSize(pinned);
    if (size <= state.offset) return;

    let buffer: Buffer;
    try {
      buffer = readFileSync(pinned);
    } catch {
      return;
    }
    const slice = buffer.subarray(state.offset);
    const text = slice.toString("utf-8");

    // Hold back any mid-line tail until the next tick (writer hasn't
    // flushed its trailing newline yet).
    let consumedBytes = slice.length;
    const lines = text.split("\n");
    if (!text.endsWith("\n")) {
      const tail = lines.pop() ?? "";
      consumedBytes -= Buffer.byteLength(tail, "utf-8");
    }
    state.offset += consumedBytes;

    const seen = state.seenUuids;
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

      const messages = this.options.adapter.parseEntry(entry);
      for (const message of messages) this.options.onMessage(message);
      if (uuid) seen.add(uuid);
    }
    // Cap the seen-set so it doesn't grow unbounded.
    if (seen.size > 5000) {
      state.seenUuids = new Set([...seen].slice(-2000));
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
