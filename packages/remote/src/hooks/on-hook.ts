#!/usr/bin/env bun
// Generic hook dispatcher.
//
// Reads the agent's hook event JSON on stdin, finds the first AgentAdapter
// whose matches() claims it, parses, and POSTs to the chat server. To
// support Codex / Aider / any other CLI agent: write a new adapter in
// adapters/, append it to ADAPTERS, done — server and UI code don't change.

import { writeFileSync } from "node:fs";

import { claudeCodeAdapter } from "../adapters/claude-code";
import type { AgentAdapter } from "../adapters/types";

const ADAPTERS: AgentAdapter[] = [claudeCodeAdapter];

const PORT = Number(process.env.PORT ?? 8765);
const DEBUG = process.env.HOOK_DEBUG === "1";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of Bun.stdin.stream()) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf-8");
}

function logLine(line: string): void {
  if (!DEBUG) return;
  try {
    writeFileSync("/tmp/sd-test/hook-debug.log", line + "\n", { flag: "a" });
  } catch {}
}

async function postReply(text: string, images?: string[]): Promise<void> {
  const form = new FormData();
  form.append("text", text);
  for (const p of images ?? []) {
    try {
      form.append("image", Bun.file(p));
    } catch {}
  }
  try {
    await fetch(`http://127.0.0.1:${PORT}/api/post-agent`, {
      method: "POST",
      body: form,
    });
  } catch {}
}

async function postToolUse(
  tool: string,
  summary: string,
  raw: unknown,
  images?: string[],
): Promise<void> {
  try {
    await fetch(`http://127.0.0.1:${PORT}/api/tool-call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool_name: tool,
        summary,
        raw,
        image_paths: images ?? [],
      }),
    });
  } catch {}
}

async function main(): Promise<void> {
  const raw = await readStdin();
  if (DEBUG) {
    logLine(
      `${new Date().toISOString()}  TMUX=${process.env.TMUX ? "yes" : "no"}  raw=${raw.slice(0, 400)}`,
    );
  }
  if (!process.env.TMUX) return;

  const adapter = ADAPTERS.find((a) => a.matches(raw));
  if (!adapter) {
    logLine("  return: no matching adapter");
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    logLine("  return: bad json");
    return;
  }

  const stop = adapter.parseStop(parsed);
  if (stop) {
    await postReply(stop.text, stop.images);
    logLine(`  ${adapter.name}: stop posted (${stop.text.length} chars)`);
    if (adapter.syncAfterStop) {
      try {
        await adapter.syncAfterStop(parsed);
      } catch {}
    }
    return;
  }

  const toolUse = adapter.parsePreToolUse(parsed);
  if (toolUse) {
    await postToolUse(
      toolUse.tool,
      toolUse.summary,
      toolUse.raw,
      toolUse.images,
    );
    logLine(
      `  ${adapter.name}: tool ${toolUse.tool} ${toolUse.summary.slice(0, 60)}`,
    );
    return;
  }

  logLine("  return: adapter parsed nothing");
}

main().catch(() => {});
