// Claude Code adapter.
//
// Claude Code writes one JSONL line per event to
//   ~/.claude/projects/<encoded-cwd>/<session-id>.jsonl
// where <encoded-cwd> is the cwd with every `/` replaced by `-`.
//
// Per-line shapes the watcher cares about:
//   { type: "assistant", uuid, timestamp, message: { content: [
//       { type: "text", text },
//       { type: "tool_use", id, name, input },
//   ]}}
//   { type: "user", uuid, timestamp, message: { content: <string> }}
//       — a plain text prompt the user typed (in tmux or via web POST)
//   { type: "user", uuid, timestamp, message: { content: [
//       { type: "tool_result", tool_use_id, content: [
//           { type: "image", source: { type: "base64", media_type, data } },
//       ]},
//   ]}}
//
// Plain user prompts ARE parsed: JSONL is the single source of truth, so
// boot-time replay must include user-typed lines. The server dedupes
// optimistic POST-rendered user messages against JSONL replays by text+ts.
// Everything else (file-history-snapshot, attachment, system, queue-
// operation, ai-title, last-prompt) is ignored.

import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import type { Message } from "../message";
import type { AgentAdapter } from "./types";

const SNAPSHOTS_DIR =
  process.env.SNAPSHOTS_DIR ?? "/tmp/sd-test/snapshots";

interface JsonlEntry {
  type?: string;
  uuid?: string;
  timestamp?: string;
  message?: {
    /** Assistant entries always use Block[]. User entries are either a
     *  Block[] (tool_result responses) or a plain string (the user's
     *  typed prompt). */
    content?: Block[] | string;
  };
}

interface Block {
  type?: string;
  text?: string;
  // tool_use:
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
  // tool_result:
  tool_use_id?: string;
  content?: Block[];
  // image:
  source?: {
    type?: string;
    media_type?: string;
    data?: string;
  };
}

export const claudeCodeAdapter: AgentAdapter = {
  name: "claude-code",

  getTranscriptDir(cwd) {
    return join(homedir(), ".claude", "projects", encodeCwd(cwd));
  },

  parseEntry(raw) {
    const entry = raw as JsonlEntry;
    const out: Message[] = [];
    if (!entry || typeof entry !== "object") return out;

    const ts = Date.parse(entry.timestamp ?? "") || Date.now();
    const baseId = entry.uuid ?? `anon-${ts}`;

    if (entry.type === "assistant") {
      const content = entry.message?.content;
      if (!Array.isArray(content)) return out;
      const blocks = content;

      // Combine all text blocks in this entry into one agent bubble. tool_use
      // blocks become separate chips, each with its own id derived from the
      // block's tool_use_id.
      const texts: string[] = [];
      for (const b of blocks) {
        if (b?.type === "text" && typeof b.text === "string" && b.text.trim()) {
          texts.push(b.text);
        }
      }
      if (texts.length > 0) {
        const text = texts.join("\n\n").trim();
        out.push({
          id: `${baseId}-text`,
          ts,
          from: "agent",
          text,
        });
      }

      let chipIdx = 0;
      for (const b of blocks) {
        if (b?.type !== "tool_use") continue;
        const tool = String(b.name ?? "?");
        const input = (b.input ?? {}) as Record<string, unknown>;
        const summary = summarizeToolInput(tool, input);
        out.push({
          id: `${baseId}-tool-${b.id ?? chipIdx}`,
          ts: ts + ++chipIdx,
          from: "system",
          kind: "tool",
          text: summary ? `${tool}  ${summary}` : tool,
          raw: input,
        });
      }
    } else if (entry.type === "user") {
      const content = entry.message?.content;

      // Plain user prompt: content is a string. Surface it as a user bubble.
      if (typeof content === "string") {
        const text = content.trim();
        if (text) {
          out.push({ id: `${baseId}-user`, ts, from: "user", text });
        }
        return out;
      }

      if (!Array.isArray(content)) return out;
      const blocks = content;

      let imgIdx = 0;
      for (const b of blocks) {
        if (b?.type !== "tool_result") continue;
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
          const fname = `jsonl-${baseId.slice(0, 8)}-${imgIdx++}-${ts}.${ext}`;
          const path = join(SNAPSHOTS_DIR, fname);
          try {
            writeFileSync(path, Buffer.from(src.data, "base64"));
          } catch {
            continue;
          }
          out.push({
            id: `${baseId}-img-${imgIdx}`,
            ts: ts + imgIdx,
            from: "agent",
            text: "",
            images: [fname],
          });
        }
      }
    }

    return out;
  },
};

function encodeCwd(cwd: string): string {
  // Claude Code's directory encoding: replace `/` with `-`. The leading
  // slash becomes a leading hyphen.
  return cwd.replace(/\//g, "-");
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
