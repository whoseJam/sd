#!/usr/bin/env bun
// Snapshot a deck slide / animation / whole-deck-grid and post the resulting
// PNG into the remote chat thread. Use this when the user (on phone) asks to
// see a slide / animation — sending a link doesn't work because they can't
// render iframes in chat; they need an actual image.
//
// Requires the chat server running on PORT and live-server/our server
// serving /tmp/sd-test/{reveal,animation}/.
//
// Usage:
//   bun scripts/remote/preview.ts slide <N> [label]
//   bun scripts/remote/preview.ts slides <FROM> <TO> [label]
//   bun scripts/remote/preview.ts animation <name> [--from N --to N] [label]
//   bun scripts/remote/preview.ts deck [label]    # all slides as grid

import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const PORT = process.env.PORT ?? "8765";
const REPO =
  process.env.REPO ?? resolve(import.meta.dirname, "..", "..");
const REVEAL_URL =
  process.env.REVEAL_URL ?? `http://127.0.0.1:${PORT}/reveal/index.html`;
const ANIM_BASE =
  process.env.ANIM_BASE ?? `http://127.0.0.1:${PORT}/animation`;

const PPT_TOOL = join(REPO, ".claude/tools/sd-ppt-snapshot.ts");
const ANIM_TOOL = join(REPO, ".claude/tools/sd-animation-snapshot.ts");

interface ParsedArgs {
  cmd: string;
  positional: string[];
  flags: Record<string, string>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const cmd = argv[0] ?? "";
  const positional: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      flags[a.slice(2)] = argv[++i] ?? "";
    } else {
      positional.push(a);
    }
  }
  return { cmd, positional, flags };
}

function runSnap(cmd: string[]): string {
  const proc = Bun.spawnSync({ cmd, stdout: "pipe", stderr: "pipe" });
  const out = new TextDecoder().decode(proc.stdout);
  const err = new TextDecoder().decode(proc.stderr);
  // The snapshot tools print the PNG absolute path on stdout (sole line).
  for (const line of out.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.endsWith(".png") && existsSync(trimmed)) return trimmed;
  }
  console.error("snapshot tool failed or did not produce a PNG");
  if (err) console.error(err);
  process.exit(1);
}

async function post(text: string, pngPath: string): Promise<void> {
  if (!existsSync(pngPath)) {
    console.error("png not found:", pngPath);
    process.exit(1);
  }
  const form = new FormData();
  form.append("text", text);
  form.append("image", Bun.file(pngPath));
  const r = await fetch(`http://127.0.0.1:${PORT}/api/post-agent`, {
    method: "POST",
    body: form,
  });
  if (!r.ok) {
    console.error(`POST failed ${r.status}: ${await r.text()}`);
    process.exit(1);
  }
  console.log(`posted ${pngPath}`);
}

function usage(): never {
  console.error(`usage:
  bun scripts/remote/preview.ts slide <N> [label]
  bun scripts/remote/preview.ts slides <FROM> <TO> [label]
  bun scripts/remote/preview.ts deck [label]
  bun scripts/remote/preview.ts animation <name> [--from N --to N] [label]`);
  process.exit(1);
}

const { cmd, positional, flags } = parseArgs(process.argv.slice(2));

if (cmd === "slide") {
  const n = Number(positional[0]);
  if (!Number.isInteger(n)) usage();
  const label = positional.slice(1).join(" ") || `slide ${n}`;
  const png = runSnap([
    "bun",
    PPT_TOOL,
    REVEAL_URL,
    "--slide",
    String(n),
  ]);
  await post(label, png);
} else if (cmd === "slides") {
  const from = Number(positional[0]);
  const to = Number(positional[1]);
  if (!Number.isInteger(from) || !Number.isInteger(to)) usage();
  const label = positional.slice(2).join(" ") || `slides ${from}-${to}`;
  const png = runSnap([
    "bun",
    PPT_TOOL,
    REVEAL_URL,
    "--from",
    String(from),
    "--to",
    String(to),
  ]);
  await post(label, png);
} else if (cmd === "deck") {
  const label = positional.join(" ") || "deck overview";
  const png = runSnap(["bun", PPT_TOOL, REVEAL_URL]);
  await post(label, png);
} else if (cmd === "animation") {
  const name = positional[0];
  if (!name) usage();
  const animUrl = name.startsWith("http")
    ? name
    : `${ANIM_BASE}/${name.endsWith(".html") ? name : `${name}.html`}`;
  const args: string[] = ["bun", ANIM_TOOL, animUrl];
  if (flags.from) {
    args.push("--from", flags.from);
    if (flags.to) args.push("--to", flags.to);
  } else if (flags.pause) {
    args.push("--pause", flags.pause);
  }
  const label = positional.slice(1).join(" ") || `animation ${name}`;
  const png = runSnap(args);
  await post(label, png);
} else {
  usage();
}
