// Claude Code adapter.
//
// Stop  → `last_assistant_message` (top-level string in hook input). Used
//         directly because the JSONL transcript lags one turn behind on disk
//         when Stop fires — see git blame on on-hook.ts for the discovery.
// PreToolUse → tool_name + tool_input. We summarize input for the chip line,
//         attach raw for expand-on-tap, and pull out file_path images when
//         Claude is Reading a PNG/JPG so the phone sees what it's looking at.
//
// After Stop we (a) wait briefly for the JSONL to flush, (b) mark every
// assistant uuid we can see as "already posted" so the next PreToolUse won't
// repost, and (c) SWEEP THE JSONL for any image content blocks Claude saw
// during this turn — covers cases the PreToolUse fast path can miss (tools
// other than Read returning an image, hook failures, file_paths without an
// image extension, etc.). PreToolUse and the sweep dedupe via file_path so
// the same image doesn't appear twice.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { AgentAdapter, Reply, ToolUse } from "./types";

const STATE_FILE =
  process.env.HOOK_STATE_FILE ?? "/tmp/sd-test/hook-state.json";
const SNAPSHOTS_DIR =
  process.env.SNAPSHOTS_DIR ?? "/tmp/sd-test/snapshots";
const PORT = Number(process.env.PORT ?? 8765);

interface ClaudeHookInput {
  session_id?: string;
  transcript_path?: string;
  hook_event_name?: string;
  stop_hook_active?: boolean;
  last_assistant_message?: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
}

interface State {
  session_id?: string;
  /** Assistant entries we've already posted (PreToolUse / Stop dedup). */
  posted_uuids?: string[];
  /** Image file_paths we've already attached (PreToolUse / sweep dedup). */
  posted_image_paths?: string[];
  /** User-entry uuids we've already swept (avoid re-extracting base64). */
  posted_image_user_uuids?: string[];
}

export const claudeCodeAdapter: AgentAdapter = {
  name: "claude-code",

  matches(rawInput) {
    return /"hook_event_name"\s*:\s*"(Stop|PreToolUse)"/.test(rawInput);
  },

  parseStop(parsed) {
    const input = parsed as ClaudeHookInput;
    if (input.hook_event_name !== "Stop") return null;
    if (input.stop_hook_active) return null;
    const text = String(input.last_assistant_message ?? "").trim();
    if (!text) return null;
    return { text, images: findLocalImagePaths(text) };
  },

  parsePreToolUse(parsed) {
    const input = parsed as ClaudeHookInput;
    if (input.hook_event_name !== "PreToolUse") return null;
    if (input.stop_hook_active) return null;
    const tool = String(input.tool_name ?? "?");
    const raw = (input.tool_input ?? {}) as Record<string, unknown>;
    const images = extractImagePaths(tool, raw);
    // Side effect: record file_paths so the post-Stop JSONL sweep dedupes
    // against what we attached on the fast path. Adapter encapsulates state.
    if (images.length > 0) {
      const s = loadState();
      const set = new Set(s.posted_image_paths ?? []);
      for (const p of images) set.add(p);
      s.posted_image_paths = [...set].slice(-200);
      saveState(s);
    }
    return {
      tool,
      summary: summarizeToolInput(tool, raw),
      raw,
      images,
    };
  },

  async syncAfterStop(parsed) {
    const input = parsed as ClaudeHookInput;
    await new Promise((r) => setTimeout(r, 1200));
    const path = input.transcript_path;
    if (!path || !existsSync(path)) return;

    let state = loadState();
    if (state.session_id !== input.session_id) {
      state = {
        session_id: input.session_id,
        posted_uuids: [],
        posted_image_paths: state.posted_image_paths ?? [],
        posted_image_user_uuids: [],
      };
    }
    const posted = new Set(state.posted_uuids ?? []);

    const lines = readFileSync(path, "utf-8").split("\n");
    for (const line of lines) {
      if (!line) continue;
      try {
        const entry = JSON.parse(line) as { type?: string; uuid?: string };
        if (entry.type === "assistant" && entry.uuid) posted.add(entry.uuid);
      } catch {}
    }
    state.posted_uuids = [...posted].slice(-500);

    await sweepImagesFromTranscript(lines, state);
    saveState(state);
  },
};

// Walk the transcript, find any tool_result image content blocks we haven't
// shown yet (i.e. PreToolUse fast path missed them), decode the base64,
// save to /tmp/sd-test/snapshots/, and POST as an agent message attachment.
async function sweepImagesFromTranscript(
  lines: string[],
  state: State,
): Promise<void> {
  // Pass 1: map tool_use ids → originating Read file_path (so we dedupe
  // against what PreToolUse already attached).
  const toolUsePath = new Map<string, string>();
  for (const line of lines) {
    if (!line) continue;
    let entry: any;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (entry.type !== "assistant") continue;
    const blocks = entry.message?.content;
    if (!Array.isArray(blocks)) continue;
    for (const b of blocks) {
      if (b?.type === "tool_use" && b.id) {
        const fp = b.input?.file_path;
        toolUsePath.set(b.id, typeof fp === "string" ? fp : "");
      }
    }
  }

  // Pass 2: scan user entries for tool_result with image content.
  const seenUuids = new Set(state.posted_image_user_uuids ?? []);
  const seenPaths = new Set(state.posted_image_paths ?? []);

  for (const line of lines) {
    if (!line) continue;
    let entry: any;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (entry.type !== "user") continue;
    const userUuid = entry.uuid;
    if (userUuid && seenUuids.has(userUuid)) continue;

    const blocks = entry.message?.content;
    if (!Array.isArray(blocks)) continue;

    for (const b of blocks) {
      if (b?.type !== "tool_result") continue;
      const toolUseId = b.tool_use_id;
      const filePath = toolUseId ? toolUsePath.get(toolUseId) ?? "" : "";

      // Already attached on PreToolUse fast path? skip.
      if (filePath && seenPaths.has(filePath)) {
        if (userUuid) seenUuids.add(userUuid);
        continue;
      }

      const inner = b.content;
      if (!Array.isArray(inner)) continue;

      for (const c of inner) {
        if (c?.type !== "image") continue;
        const src = c.source;
        if (!src || src.type !== "base64" || typeof src.data !== "string") {
          continue;
        }
        const media = String(src.media_type ?? "image/png");
        const ext = (media.split("/")[1] ?? "png").replace(/[^a-z0-9]/gi, "");
        const fname = `jsonl-${(userUuid ?? "x").slice(0, 8)}-${Date.now()}.${ext}`;
        const out = join(SNAPSHOTS_DIR, fname);
        try {
          writeFileSync(out, Buffer.from(src.data, "base64"));
        } catch {
          continue;
        }
        await postImageMessage(filePath || `(image from ${b.tool_use_id ?? "?"})`, out);
        if (filePath) seenPaths.add(filePath);
      }
      if (userUuid) seenUuids.add(userUuid);
    }
  }

  state.posted_image_paths = [...seenPaths].slice(-200);
  state.posted_image_user_uuids = [...seenUuids].slice(-200);
}

async function postImageMessage(text: string, imagePath: string): Promise<void> {
  const form = new FormData();
  form.append("text", text);
  try {
    form.append("image", Bun.file(imagePath));
  } catch {
    return;
  }
  try {
    await fetch(`http://127.0.0.1:${PORT}/api/post-agent`, {
      method: "POST",
      body: form,
    });
  } catch {}
}

function loadState(): State {
  if (!existsSync(STATE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveState(state: State): void {
  try {
    writeFileSync(STATE_FILE, JSON.stringify(state));
  } catch {}
}

const IMAGE_PATH_RE =
  /(?:\/tmp|\/Users\/[\w./-]+)\/[\w./-]+\.(?:png|jpg|jpeg|gif|webp)/gi;

function findLocalImagePaths(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of text.matchAll(IMAGE_PATH_RE)) {
    const p = m[0];
    if (seen.has(p)) continue;
    seen.add(p);
    if (existsSync(p)) out.push(p);
  }
  return out;
}

function summarizeToolInput(
  tool: string,
  input: Record<string, unknown>,
): string {
  const trunc = (s: string, n = 50): string =>
    s.length > n ? s.slice(0, n - 1) + "…" : s;
  const get = (k: string): string =>
    typeof input[k] === "string" ? (input[k] as string) : "";

  switch (tool) {
    case "Read":
    case "Write":
    case "Edit":
    case "NotebookEdit":
      return trunc(get("file_path").replace(/^.*\//, ""));
    case "Grep":
    case "Glob":
      return trunc(get("pattern"));
    case "WebFetch":
    case "WebSearch":
      return trunc(get("url") || get("query"));
    case "Task":
    case "Agent":
      return trunc(get("description") || get("subagent_type"));
    case "TaskCreate":
      return trunc(get("subject"));
    case "TaskUpdate":
      return trunc(
        get("taskId") + " " + (get("status") || get("subject")),
      );
    case "TaskStop":
      return trunc(get("task_id") || get("shell_id"), 30);
    case "ToolSearch":
      return trunc(get("query"), 40);
    case "Bash":
    case "BashOutput":
    case "AskUserQuestion":
      return "";
    default:
      return "";
  }
}

function extractImagePaths(
  tool: string,
  input: Record<string, unknown>,
): string[] {
  if (tool !== "Read") return [];
  const file = typeof input.file_path === "string" ? input.file_path : "";
  if (!file) return [];
  if (!/\.(?:png|jpe?g|gif|webp|bmp|svg)$/i.test(file)) return [];
  if (!existsSync(file)) return [];
  return [file];
}
