// Session management: list / switch / create.
//
// A "session" is one Claude Code JSONL file. The watcher follows whichever
// session is currently pinned; switching just rewrites the pin and resets
// the watcher so it re-reads the new file from offset 0.

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

export interface SessionInfo {
  /** UUID — file basename without ".jsonl". */
  id: string;
  /** Absolute path to the JSONL. */
  path: string;
  /** AI-generated title; falls back to first user prompt; "(empty)" if both
   *  are missing. */
  title: string;
  /** File mtime in epoch ms. */
  mtime: number;
  /** Whether this matches the currently pinned transcript. */
  isActive: boolean;
  /** Approximate line count. */
  entryCount: number;
}

const PIN_FILE =
  process.env.TRANSCRIPT_PIN_FILE ?? "/tmp/sd-test/transcript-path.txt";
const BASELINE_FILE =
  process.env.TRANSCRIPT_BASELINE_FILE ??
  "/tmp/sd-test/transcript-baseline.txt";

export function getPinnedPath(): string {
  if (process.env.TRANSCRIPT_PATH) return process.env.TRANSCRIPT_PATH;
  try {
    return readFileSync(PIN_FILE, "utf-8").trim();
  } catch {
    return "";
  }
}

export function pinSession(path: string): void {
  writeFileSync(PIN_FILE, path);
}

/** Snapshot the existing jsonl set so the watcher can later identify a
 *  freshly-created session by set difference. Used by /api/sessions/new
 *  to mark "the next genuinely new file in this dir is the active
 *  session". */
export function writeBaseline(dir: string): void {
  const list: string[] = [];
  try {
    for (const f of readdirSync(dir)) {
      if (f.endsWith(".jsonl")) list.push(join(dir, f));
    }
  } catch {
    // ignore — empty baseline means any new file is fresh
  }
  writeFileSync(BASELINE_FILE, list.join("\n"));
}

export function readBaseline(): Set<string> {
  try {
    return new Set(
      readFileSync(BASELINE_FILE, "utf-8")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    );
  } catch {
    return new Set();
  }
}

export function listSessions(dir: string, pinned: string): SessionInfo[] {
  if (!existsSync(dir)) return [];
  const out: SessionInfo[] = [];
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".jsonl")) continue;
    const full = join(dir, f);
    let mtime = 0;
    try {
      mtime = statSync(full).mtimeMs;
    } catch {
      continue;
    }
    const id = f.slice(0, -".jsonl".length);
    const { title, entryCount } = readMeta(full);
    out.push({
      id,
      path: full,
      title,
      mtime,
      isActive: full === pinned,
      entryCount,
    });
  }
  out.sort((a, b) => b.mtime - a.mtime);
  return out;
}

/** Walk the JSONL once for the latest aiTitle and the first user prompt.
 *  We do a string pre-filter so JSON.parse only runs on candidate lines —
 *  cheap enough to re-run on every /api/sessions hit for a directory with
 *  dozens of files. */
function readMeta(path: string): { title: string; entryCount: number } {
  let title = "";
  let firstPrompt = "";
  let count = 0;
  let buf: string;
  try {
    buf = readFileSync(path, "utf-8");
  } catch {
    return { title: "(unreadable)", entryCount: 0 };
  }
  for (const line of buf.split("\n")) {
    if (!line) continue;
    count++;
    const head = line.slice(0, 80);
    if (head.includes('"aiTitle"')) {
      try {
        const e = JSON.parse(line) as { aiTitle?: unknown };
        if (typeof e.aiTitle === "string") title = e.aiTitle;
      } catch {
        // ignore
      }
    } else if (!firstPrompt && head.includes('"type":"user"')) {
      try {
        const e = JSON.parse(line) as {
          message?: { content?: unknown };
        };
        const c = e.message?.content;
        if (typeof c === "string") firstPrompt = c.trim().slice(0, 80);
      } catch {
        // ignore
      }
    }
  }
  return { title: title || firstPrompt || "(empty)", entryCount: count };
}
