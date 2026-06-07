// Claude Code writes one JSONL line per event to
//   ~/.claude/projects/<encoded-cwd>/<session-id>.jsonl
// where <encoded-cwd> is the cwd with `/` replaced by `-`.
//
// Line shapes the watcher cares about:
//   { type: "assistant", message: { content: Block[] }}
//   { type: "user", message: { content: <string> | Block[] }}
//
// Plain user prompts (content: string) ARE surfaced. The server dedupes
// optimistic POST-rendered prompts against these by text within a window.
// Everything else (file-history-snapshot, attachment, ai-title, ...) is
// ignored.

import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import type { Message } from "../message";
import type { AgentAdapter } from "./types";

const SNAPSHOTS_DIR = process.env.SNAPSHOTS_DIR ?? "/tmp/sd-test/snapshots";

interface JsonlEntry {
  type?: string;
  uuid?: string;
  timestamp?: string;
  message?: {
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

      // Combine all text blocks into one agent bubble; tool_use blocks
      // become separate chips.
      const texts: string[] = [];
      for (const block of blocks) {
        if (
          block?.type === "text" &&
          typeof block.text === "string" &&
          block.text.trim()
        ) {
          texts.push(block.text);
        }
      }
      if (texts.length > 0) {
        out.push({
          id: `${baseId}-text`,
          ts,
          from: "agent",
          text: texts.join("\n\n").trim(),
        });
      }

      let chipIndex = 0;
      for (const block of blocks) {
        if (block?.type !== "tool_use") continue;
        const tool = String(block.name ?? "?");
        const input = (block.input ?? {}) as Record<string, unknown>;
        const summary = summarizeToolInput(tool, input);
        out.push({
          id: `${baseId}-tool-${block.id ?? chipIndex}`,
          ts: ts + ++chipIndex,
          from: "system",
          kind: "tool",
          text: summary ? `${tool}  ${summary}` : tool,
          raw: input,
        });
      }
    } else if (entry.type === "user") {
      const content = entry.message?.content;

      if (typeof content === "string") {
        const text = content.trim();
        if (text) {
          out.push({ id: `${baseId}-user`, ts, from: "user", text });
        }
        return out;
      }

      if (!Array.isArray(content)) return out;

      let imageIndex = 0;
      for (const block of content) {
        if (block?.type !== "tool_result") continue;
        const inner = block.content;
        if (!Array.isArray(inner)) continue;

        for (const child of inner) {
          if (child?.type !== "image") continue;
          const source = child.source;
          if (
            !source ||
            source.type !== "base64" ||
            typeof source.data !== "string"
          ) {
            continue;
          }
          const media = String(source.media_type ?? "image/png");
          const ext = (media.split("/")[1] ?? "png").replace(
            /[^a-z0-9]/gi,
            "",
          );
          const filename = `jsonl-${baseId.slice(0, 8)}-${imageIndex++}-${ts}.${ext}`;
          try {
            writeFileSync(
              join(SNAPSHOTS_DIR, filename),
              Buffer.from(source.data, "base64"),
            );
          } catch {
            continue;
          }
          out.push({
            id: `${baseId}-img-${imageIndex}`,
            ts: ts + imageIndex,
            from: "agent",
            text: "",
            images: [filename],
          });
        }
      }
    }

    return out;
  },
};

// Claude Code's directory encoding: every `/` becomes `-`.
function encodeCwd(cwd: string): string {
  return cwd.replace(/\//g, "-");
}

function summarizeToolInput(
  tool: string,
  input: Record<string, unknown>,
): string {
  const truncate = (text: string, max = 50): string =>
    text.length > max ? text.slice(0, max - 1) + "…" : text;
  const field = (key: string): string =>
    typeof input[key] === "string" ? (input[key] as string) : "";

  switch (tool) {
    case "Read":
    case "Write":
    case "Edit":
    case "NotebookEdit":
      return truncate(field("file_path").replace(/^.*\//, ""));
    case "Grep":
    case "Glob":
      return truncate(field("pattern"));
    case "WebFetch":
    case "WebSearch":
      return truncate(field("url") || field("query"));
    case "Task":
    case "Agent":
      return truncate(field("description") || field("subagent_type"));
    case "TaskCreate":
      return truncate(field("subject"));
    case "TaskUpdate":
      return truncate(
        field("taskId") + " " + (field("status") || field("subject")),
      );
    case "TaskStop":
      return truncate(field("task_id") || field("shell_id"), 30);
    case "ToolSearch":
      return truncate(field("query"), 40);
    case "Bash":
    case "BashOutput":
    case "AskUserQuestion":
      return "";
    default:
      return "";
  }
}
