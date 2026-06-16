#!/usr/bin/env bun
// MCP server exposing sd cli operations as agent-callable tools.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { spawnSync } from "node:child_process";
import { z } from "zod";

const server = new McpServer({ name: "sd", version: "0.0.1" });

function runPnpm(args: string[]): string {
  const result = spawnSync("pnpm", args, { encoding: "utf-8" });
  return (result.stdout ?? "") + (result.stderr ?? "");
}

server.tool(
  "sd_open",
  "Start watchers and open a deck (or standalone animation) in the browser. The watchers stay alive until sd_close is called.",
  {
    target: z
      .string()
      .describe(
        "deck name under examples/decks/, or animation file name under examples/animations/ (without .ts extension)",
      ),
  },
  async ({ target }) => ({
    content: [{ type: "text", text: runPnpm(["open", target]) }],
  }),
);

server.tool(
  "sd_close",
  "Stop deck or animation watchers started by sd_open.",
  {},
  async () => ({
    content: [{ type: "text", text: runPnpm(["close"]) }],
  }),
);

server.tool(
  "sd_snap",
  "Take a one-shot screenshot of a deck (grid of slides) or animation (grid of pauses) and return the saved PNG path.",
  {
    url: z
      .string()
      .describe(
        "served URL; relative paths starting with / resolve against the local preview server. /reveal/index.html for the active deck, /animation/<name>.html for a standalone animation",
      ),
    slide: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("single slide index (deck mode only)"),
    pause: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("single pause index (animation mode only)"),
    from: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("range start (inclusive)"),
    to: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("range end (inclusive)"),
  },
  async ({ url, slide, pause, from, to }) => {
    const args = ["snap", url];
    if (slide !== undefined) args.push("--slide", String(slide));
    if (pause !== undefined) args.push("--pause", String(pause));
    if (from !== undefined) args.push("--from", String(from));
    if (to !== undefined) args.push("--to", String(to));
    return { content: [{ type: "text", text: runPnpm(args) }] };
  },
);

await server.connect(new StdioServerTransport());
