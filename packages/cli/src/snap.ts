#!/usr/bin/env bun
// Screenshot whatever's at the given URL. The URL path determines mode
// (/reveal/ → deck, /animation/ → animation). Doesn't build or watch —
// point it at a server that's already serving the thing.
//
// Usage:
//   pnpm snap <url> [--slide N | --pause N | --from M --to N | --idle MS | -o PATH]
//
// stdout: absolute path of the produced PNG.

import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const REPO = process.env.REPO ?? resolve(import.meta.dirname, "..", "..", "..");
const REVEAL_ROOT = process.env.REVEAL_ROOT ?? "/tmp/sd-test";
const PORT = process.env.PORT ?? "8765";
const SNAPSHOT_DIR = join(REVEAL_ROOT, "snapshots");
mkdirSync(SNAPSHOT_DIR, { recursive: true });

const [rawUrl, ...rest] = process.argv.slice(2);
if (!rawUrl) usage();

const url = rawUrl.startsWith("/")
  ? `http://127.0.0.1:${PORT}${rawUrl}`
  : rawUrl;

let tool: string;
if (url.includes("/reveal/")) {
  tool = join(REPO, "packages", "cli", "src", "snap-deck.ts");
} else if (url.includes("/animation/")) {
  tool = join(REPO, "packages", "cli", "src", "snap-animation.ts");
} else {
  console.error(
    `snap: can't dispatch — URL must contain /reveal/ or /animation/  (got ${url})`,
  );
  process.exit(1);
}

// Default output under the snapshots dir so the chat can serve the PNG at
// /snapshots/<file>.png. Caller can still override via --output / -o.
const hasOutput = rest.includes("-o") || rest.includes("--output");
if (!hasOutput) {
  rest.push("-o", join(SNAPSHOT_DIR, `snap-${Date.now()}.png`));
}

const result = spawnSync("bun", [tool, url, ...rest], {
  stdio: ["inherit", "inherit", "inherit"],
});
process.exit(result.status ?? 1);

function usage(): never {
  console.error(`usage:
  pnpm snap <url> [flags]

  URL can be /reveal/... or /animation/... (relative to localhost:${PORT})
  or any full URL. The path decides deck vs animation.

  Flags pass through to the underlying tool:
    deck:       --slide N | --from N --to N | --idle MS | -o PATH
    animation:  --pause N | --from N --to N | --idle MS | -o PATH`);
  process.exit(1);
}
