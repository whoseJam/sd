#!/usr/bin/env bun
// Drive a built @sd/core animation through its pauses, screenshot each, stitch
// into one labeled grid PNG. Designed for AI agents / humans who need quick
// visual feedback against an already-built `gulp animation` output.
//
// Usage:
//   bun .claude/tools/sd-animation-snapshot.ts <html-path>
//   bun .claude/tools/sd-animation-snapshot.ts <html-path> --pause 7
//   bun .claude/tools/sd-animation-snapshot.ts <html-path> --from 10 --to 14
//   bun .claude/tools/sd-animation-snapshot.ts <html-path> --from 26 --count 25
//   bun .claude/tools/sd-animation-snapshot.ts <html-path> -o /tmp/foo.png
//
// Output:
//   stdout = absolute path of the stitched PNG (only line printed)
//   stderr = browser issues (pageerror + console.error/warn + failed
//            requests + 4xx/5xx responses) collected during the run
//   exit 0 = no error-level issues; exit 1 = at least one error
//   (PNG is always written)

import { promises as fs } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { attachIssueCollector, findDocRoot, openInViewer, startStaticServer, stitchGrid } from "./grid";

interface Args {
  htmlPath: string;
  from: number;
  to: number;
  output: string;
  outputExplicit: boolean;
  timeoutMs: number;
  open: boolean;
}

const VIEWPORT = { width: 1200, height: 690 };
const STEP_TIMEOUT_DEFAULT = 15000;

function printHelp(): void {
  process.stderr.write(`Usage: sd-animation-snapshot <html-path> [flags]

Flags:
  --from N            First pause to capture (1-indexed, default 1)
  --to N              Last pause to capture (inclusive, default from+24)
  --count N           Alternative to --to: capture N pauses starting at --from
  --pause N           Shorthand for --from N --to N (single frame)
  -o, --output PATH   Output PNG path (default /tmp/sd-animation-snapshot-<name>-<range>.png)
  --timeout MS        Per-step timeout, ms (default ${STEP_TIMEOUT_DEFAULT})
  --no-open           Don't auto-open the PNG (macOS Preview otherwise refreshes in place)
  -h, --help          Show this help
`);
}

function parseArgs(argv: string[]): Args {
  let htmlPath: string | undefined;
  let from = 1;
  let to: number | undefined;
  let count: number | undefined;
  let single: number | undefined;
  let output: string | undefined;
  let timeoutMs = STEP_TIMEOUT_DEFAULT;
  let open = true;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--from") from = Number(argv[++i]);
    else if (arg === "--to") to = Number(argv[++i]);
    else if (arg === "--count") count = Number(argv[++i]);
    else if (arg === "--pause") single = Number(argv[++i]);
    else if (arg === "-o" || arg === "--output") output = argv[++i];
    else if (arg === "--timeout") timeoutMs = Number(argv[++i]);
    else if (arg === "--no-open") open = false;
    else if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith("-")) htmlPath = arg;
    else throw new Error(`Unknown flag: ${arg}`);
  }

  if (!htmlPath) {
    printHelp();
    process.exit(1);
  }

  if (single !== undefined) {
    from = single;
    to = single;
  } else if (count !== undefined && to === undefined) {
    to = from + count - 1;
  } else if (to === undefined) {
    to = from + 24;
  }

  if (!Number.isInteger(from) || from < 1) {
    throw new Error("--from must be a positive integer");
  }
  if (!Number.isInteger(to) || to < from) {
    throw new Error("--to must be an integer >= --from");
  }

  const outputExplicit = output !== undefined;
  if (!output) {
    const base = path.basename(htmlPath, path.extname(htmlPath));
    const range = from === to ? `p${from}` : `p${from}-${to}`;
    output = `/tmp/sd-animation-snapshot-${base}-${range}.png`;
  }

  return { htmlPath, from, to, output, outputExplicit, timeoutMs, open };
}

interface CaptureResult {
  shots: Buffer[];
  reachedEnd: boolean;
}

async function captureFrames(
  page: Awaited<ReturnType<typeof chromium.prototype.newPage>>,
  args: Args,
): Promise<CaptureResult> {
  // After each advance we wait for the framework to settle at the next
  // boundary — either the next user-pause (enabled flips on a fresh list
  // with finished actions) or end-of-main (sd's pause(LAST_MAIN_STAGE)
  // sets Window.MAIN_FINISHED before suspending forever). MAIN_FINISHED
  // is sd's own end-of-animation flag; reading it removes any need for
  // timeout-based guessing.
  const waitForBoundary = (timeoutMs: number): Promise<void> =>
    page.waitForFunction(
      () => {
        const sd = (globalThis as unknown as {
          sd?: {
            Window: { MAIN_FINISHED: boolean };
            Animate: {
              finished(): boolean;
              currentActionList: { enabled: boolean };
            };
          };
        }).sd;
        if (!sd) return false;
        if (sd.Window.MAIN_FINISHED) return true;
        return (
          sd.Animate.finished() === true &&
          sd.Animate.currentActionList.enabled === true
        );
      },
      undefined,
      { timeout: timeoutMs },
    ).then(() => undefined);

  const mainFinished = (): Promise<boolean> =>
    page.evaluate(() => {
      const sd = (globalThis as unknown as {
        sd: { Window: { MAIN_FINISHED: boolean } };
      }).sd;
      return sd.Window.MAIN_FINISHED;
    });

  const advance = (): Promise<void> =>
    page.evaluate(() => {
      const sd = (globalThis as unknown as {
        sd: { device(): { keyDown(k: string): void } };
      }).sd;
      sd.device().keyDown("N");
    });

  await waitForBoundary(args.timeoutMs);

  // Skip phase: advance to --from. If main finishes before we get there,
  // --from was too high.
  for (let i = 1; i < args.from; i++) {
    if (await mainFinished()) {
      throw new Error(
        `--from ${args.from} exceeds the animation's pause count (only ${i - 1} pause(s) available)`,
      );
    }
    await advance();
    await waitForBoundary(args.timeoutMs);
  }

  // Capture phase: stop when MAIN_FINISHED — no extra screenshot of the
  // post-end empty frame.
  const shots: Buffer[] = [];
  let reachedEnd = false;
  for (let i = args.from; i <= args.to; i++) {
    if (await mainFinished()) {
      reachedEnd = true;
      break;
    }
    shots.push(await page.screenshot({ type: "png" }));
    if (i < args.to) {
      await advance();
      await waitForBoundary(args.timeoutMs);
    }
  }
  return { shots, reachedEnd };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const htmlAbs = path.resolve(args.htmlPath);
  await fs.access(htmlAbs);
  const docRoot = findDocRoot(htmlAbs);
  const urlPath = path.relative(docRoot, htmlAbs).split(path.sep).join("/");

  const server = await startStaticServer(docRoot);
  const browser = await chromium.launch();
  let collector: ReturnType<typeof attachIssueCollector> | undefined;

  try {
    const page = await browser.newPage({ viewport: VIEWPORT });
    collector = attachIssueCollector(page);

    await page.goto(`${server.url}/${urlPath}`, { waitUntil: "load" });
    await page.waitForFunction(
      () => {
        const sd = (globalThis as unknown as {
          sd?: { Window: unknown; Animate: { finished(): boolean }; device: () => unknown };
        }).sd;
        return Boolean(sd?.Window && sd?.Animate?.finished && sd?.device);
      },
      undefined,
      { timeout: args.timeoutMs },
    );
    await page.evaluate(() => {
      const sd = (globalThis as unknown as { sd: { Window: { PUPPETEER: boolean } } }).sd;
      sd.Window.PUPPETEER = true;
    });

    const { shots, reachedEnd } = await captureFrames(page, args);

    // Rewrite the auto-generated path so the filename reflects what was
    // actually captured, not what was requested. Explicit -o paths are
    // honored as-is — the user asked for that name.
    const requested = args.to - args.from + 1;
    let outputPath = args.output;
    if (reachedEnd && !args.outputExplicit) {
      const actualTo = args.from + shots.length - 1;
      const base = path.basename(args.htmlPath, path.extname(args.htmlPath));
      const range = args.from === actualTo ? `p${args.from}` : `p${args.from}-${actualTo}`;
      outputPath = `/tmp/sd-animation-snapshot-${base}-${range}.png`;
    }

    await stitchGrid({
      shots,
      startIndex: args.from,
      outputPath,
      fallbackWidth: VIEWPORT.width,
      fallbackHeight: VIEWPORT.height,
    });
    const resolved = path.resolve(outputPath);
    process.stdout.write(`${resolved}\n`);
    if (reachedEnd && shots.length < requested) {
      process.stderr.write(
        `note: animation has only ${args.from + shots.length - 1} pause(s); requested --to ${args.to} was clamped.\n`,
      );
    }
    if (args.open) await openInViewer(resolved);
  } finally {
    await browser.close();
    await server.close();
  }

  if (collector && collector.issues.length > 0) {
    process.stderr.write(collector.format());
    if (collector.hasErrors()) process.exit(1);
  }
}

main().catch((err: unknown) => {
  process.stderr.write(
    `${err instanceof Error ? (err.stack ?? err.message) : String(err)}\n`,
  );
  process.exit(1);
});
