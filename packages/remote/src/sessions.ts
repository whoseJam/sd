// A "session" is one Claude Code JSONL file. The watcher follows whichever
// is currently pinned.

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

export interface SessionInfo {
  id: string;
  path: string;
  title: string;
  mtime: number;
  isActive: boolean;
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

// Snapshot the existing jsonl set; the watcher identifies a newly-created
// session by set difference.
export function writeBaseline(dir: string): void {
  const baseline: string[] = [];
  try {
    for (const filename of readdirSync(dir)) {
      if (filename.endsWith(".jsonl")) baseline.push(join(dir, filename));
    }
  } catch {
    // empty baseline means any new file is fresh
  }
  writeFileSync(BASELINE_FILE, baseline.join("\n"));
}

export function readBaseline(): Set<string> {
  try {
    return new Set(
      readFileSync(BASELINE_FILE, "utf-8")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    );
  } catch {
    return new Set();
  }
}

export function listSessions(dir: string, pinned: string): SessionInfo[] {
  if (!existsSync(dir)) return [];
  const result: SessionInfo[] = [];
  for (const filename of readdirSync(dir)) {
    if (!filename.endsWith(".jsonl")) continue;
    const path = join(dir, filename);
    let mtime = 0;
    try {
      mtime = statSync(path).mtimeMs;
    } catch {
      continue;
    }
    const id = filename.slice(0, -".jsonl".length);
    const { title, entryCount } = readMeta(path);
    result.push({
      id,
      path,
      title,
      mtime,
      isActive: path === pinned,
      entryCount,
    });
  }
  result.sort((a, b) => b.mtime - a.mtime);
  return result;
}

// Walk the JSONL once for the latest aiTitle + first user prompt. Cheap
// enough to re-run on every /api/sessions hit for ~40 files.
function readMeta(path: string): { title: string; entryCount: number } {
  let title = "";
  let firstPrompt = "";
  let entryCount = 0;
  let buffer: string;
  try {
    buffer = readFileSync(path, "utf-8");
  } catch {
    return { title: "(unreadable)", entryCount: 0 };
  }
  for (const line of buffer.split("\n")) {
    if (!line) continue;
    entryCount++;
    const head = line.slice(0, 80);
    if (head.includes('"aiTitle"')) {
      try {
        const entry = JSON.parse(line) as { aiTitle?: unknown };
        if (typeof entry.aiTitle === "string") title = entry.aiTitle;
      } catch {}
    } else if (!firstPrompt && head.includes('"type":"user"')) {
      try {
        const entry = JSON.parse(line) as {
          message?: { content?: unknown };
        };
        const content = entry.message?.content;
        if (typeof content === "string") {
          firstPrompt = content.trim().slice(0, 80);
        }
      } catch {}
    }
  }
  return { title: title || firstPrompt || "(empty)", entryCount };
}
