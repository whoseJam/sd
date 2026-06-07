#!/usr/bin/env bun
// Controls the live preview panel in the phone chat. The chat UI subscribes
// to /api/preview and embeds an iframe of whatever URL the server points to.
// At most one preview is active at a time; sending a new URL replaces it,
// sending "hide" clears it.
//
// Also keeps the legacy "snap" mode for taking a static PNG of a single
// slide / animation pause and posting it as a chat image (useful when the
// preview iframe wouldn't help — e.g. capturing a single moment in an
// animation).
//
// Usage:
//   bun scripts/remote/preview.ts show deck
//   bun scripts/remote/preview.ts show animation <name>
//   bun scripts/remote/preview.ts show <relative-url> [label]
//   bun scripts/remote/preview.ts hide
//
//   bun scripts/remote/preview.ts snap slide <N> [label]
//   bun scripts/remote/preview.ts snap slides <FROM> <TO> [label]
//   bun scripts/remote/preview.ts snap animation <name> [--pause N | --from N --to M] [label]

import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const PORT = process.env.PORT ?? "8765";
const REPO = process.env.REPO ?? resolve(import.meta.dirname, "..", "..");
const REVEAL_PATH = process.env.REVEAL_PATH ?? "/reveal/index.html";
const ANIM_BASE_PATH = process.env.ANIM_BASE_PATH ?? "/animation";

const SERVER = `http://127.0.0.1:${PORT}`;
const PPT_TOOL = join(REPO, ".claude/tools/sd-ppt-snapshot.ts");
const ANIM_TOOL = join(REPO, ".claude/tools/sd-animation-snapshot.ts");

interface Args {
  cmd: string;
  sub: string;
  positional: string[];
  flags: Record<string, string>;
}

function parse(argv: string[]): Args {
  const cmd = argv[0] ?? "";
  const sub = argv[1] ?? "";
  const positional: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      flags[a.slice(2)] = argv[++i] ?? "";
    } else {
      positional.push(a);
    }
  }
  return { cmd, sub, positional, flags };
}

async function setPreview(url: string | null, label = ""): Promise<void> {
  const r = await fetch(`${SERVER}/api/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: url ?? "", label }),
  });
  if (!r.ok) {
    console.error(`preview API failed: ${r.status}`);
    process.exit(1);
  }
  console.log(url ? `showing ${url}` : "preview hidden");
}

function animationPath(name: string): string {
  if (name.startsWith("/") || name.startsWith("http")) return name;
  const html = name.endsWith(".html") ? name : `${name}.html`;
  return `${ANIM_BASE_PATH}/${html}`;
}

function runSnap(cmd: string[]): string {
  const proc = Bun.spawnSync({ cmd, stdout: "pipe", stderr: "pipe" });
  const out = new TextDecoder().decode(proc.stdout);
  const err = new TextDecoder().decode(proc.stderr);
  for (const line of out.split("\n")) {
    const t = line.trim();
    if (t.endsWith(".png") && existsSync(t)) return t;
  }
  console.error("snapshot did not produce a PNG");
  if (err) console.error(err);
  process.exit(1);
}

async function post(text: string, png: string): Promise<void> {
  if (!existsSync(png)) {
    console.error("png not found:", png);
    process.exit(1);
  }
  const form = new FormData();
  form.append("text", text);
  form.append("image", Bun.file(png));
  const r = await fetch(`${SERVER}/api/post-agent`, {
    method: "POST",
    body: form,
  });
  if (!r.ok) {
    console.error(`POST failed ${r.status}: ${await r.text()}`);
    process.exit(1);
  }
  console.log(`posted ${png}`);
}

function usage(): never {
  console.error(`usage:
  preview.ts show deck                              # show deck in panel
  preview.ts show animation <name>                  # show animation in panel
  preview.ts show <relative-url> [label]            # show arbitrary URL
  preview.ts hide                                   # close panel

  preview.ts snap slide <N> [label]                 # post slide PNG to chat
  preview.ts snap slides <FROM> <TO> [label]
  preview.ts snap animation <name> [--pause N | --from N --to M] [label]`);
  process.exit(1);
}

const args = parse(process.argv.slice(2));

if (args.cmd === "show") {
  let url = "";
  let label = "";
  if (args.sub === "deck") {
    url = REVEAL_PATH;
    label = "deck";
  } else if (args.sub === "animation") {
    const name = args.positional[0];
    if (!name) usage();
    url = animationPath(name);
    label = `animation ${name}`;
  } else if (args.sub.startsWith("/") || args.sub.startsWith("http")) {
    url = args.sub;
    label = args.positional.join(" ");
  } else {
    usage();
  }
  await setPreview(url, label);
} else if (args.cmd === "hide" || args.cmd === "close") {
  await setPreview(null);
} else if (args.cmd === "snap") {
  if (args.sub === "slide") {
    const n = Number(args.positional[0]);
    if (!Number.isInteger(n)) usage();
    const label = args.positional.slice(1).join(" ") || `slide ${n}`;
    const png = runSnap([
      "bun",
      PPT_TOOL,
      `${SERVER}${REVEAL_PATH}`,
      "--slide",
      String(n),
    ]);
    await post(label, png);
  } else if (args.sub === "slides") {
    const from = Number(args.positional[0]);
    const to = Number(args.positional[1]);
    if (!Number.isInteger(from) || !Number.isInteger(to)) usage();
    const label =
      args.positional.slice(2).join(" ") || `slides ${from}-${to}`;
    const png = runSnap([
      "bun",
      PPT_TOOL,
      `${SERVER}${REVEAL_PATH}`,
      "--from",
      String(from),
      "--to",
      String(to),
    ]);
    await post(label, png);
  } else if (args.sub === "animation") {
    const name = args.positional[0];
    if (!name) usage();
    const url = `${SERVER}${animationPath(name)}`;
    const cmd = ["bun", ANIM_TOOL, url];
    if (args.flags.from) {
      cmd.push("--from", args.flags.from);
      if (args.flags.to) cmd.push("--to", args.flags.to);
    } else if (args.flags.pause) {
      cmd.push("--pause", args.flags.pause);
    }
    const label =
      args.positional.slice(1).join(" ") || `animation ${name}`;
    const png = runSnap(cmd);
    await post(label, png);
  } else {
    usage();
  }
} else {
  usage();
}
