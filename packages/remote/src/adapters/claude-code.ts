// Claude Code adapter.
//
// Stop  → `last_assistant_message` (top-level string in hook input). Used
//         directly because the JSONL transcript lags one turn behind on disk
//         when Stop fires — see git blame on on-hook.ts for the discovery.
// PreToolUse → tool_name + tool_input. We summarize input for the chip line,
//         attach raw for expand-on-tap, and pull out file_path images when
//         Claude is Reading a PNG/JPG so the phone sees what it's looking at.
//
// After Stop we wait briefly for the JSONL to flush, then mark every
// assistant uuid we can see as "already posted". This prevents the next
// PreToolUse hook fire from interpreting older entries as new and reposting
// them.

import { existsSync, readFileSync, writeFileSync } from "node:fs";

import type { AgentAdapter, Reply, ToolUse } from "./types";

const STATE_FILE =
  process.env.HOOK_STATE_FILE ?? "/tmp/sd-test/hook-state.json";

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
  posted_uuids?: string[];
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
    return {
      tool,
      summary: summarizeToolInput(tool, raw),
      raw,
      images: extractImagePaths(tool, raw),
    };
  },

  async syncAfterStop(parsed) {
    const input = parsed as ClaudeHookInput;
    await new Promise((r) => setTimeout(r, 1200));
    const path = input.transcript_path;
    if (!path || !existsSync(path)) return;

    let state = loadState();
    if (state.session_id !== input.session_id) {
      state = { session_id: input.session_id, posted_uuids: [] };
    }
    const posted = new Set(state.posted_uuids ?? []);

    for (const line of readFileSync(path, "utf-8").split("\n")) {
      if (!line) continue;
      try {
        const entry = JSON.parse(line) as { type?: string; uuid?: string };
        if (entry.type === "assistant" && entry.uuid) posted.add(entry.uuid);
      } catch {
        // skip
      }
    }
    state.posted_uuids = [...posted];
    if (state.posted_uuids.length > 500) {
      state.posted_uuids = state.posted_uuids.slice(-500);
    }
    saveState(state);
  },
};

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
  } catch {
    // ignore
  }
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

// Render a short summary of a tool's input. Short = scannable in a chat
// list. The full input is available via the chip's expandable details.
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
    // Bash etc. have arbitrary-length first params — show only the tool name,
    // command goes in expanded details.
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
