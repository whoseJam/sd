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

  if (!output) {
    const base = path.basename(htmlPath, path.extname(htmlPath));
    const range = from === to ? `p${from}` : `p${from}-${to}`;
    output = `/tmp/sd-animation-snapshot-${base}-${range}.png`;
  }

  return { htmlPath, from, to, output, timeoutMs, open };
}

async function captureFrames(
  page: Awaited<ReturnType<typeof chromium.prototype.newPage>>,
  args: Args,
): Promise<Buffer[]> {
  // currentActionList.enabled flips false→true on the first tick after the
  // user code's first pause(). Combined with finished(), this distinguishes
  // "settled at a real pause boundary" from "before main() even ran". Plain
  // finished() is trivially true in both states and would race the snapshot.
  const waitForFinished = async (): Promise<void> => {
    await page.waitForFunction(
      () => {
        const sd = (globalThis as unknown as {
          sd?: {
            Animate: {
              finished(): boolean;
              currentActionList: { enabled: boolean };
            };
          };
        }).sd;
        return (
          sd?.Animate.finished() === true &&
          sd.Animate.currentActionList.enabled === true
        );
      },
      { timeout: args.timeoutMs },
    );
  };

  const advance = async (): Promise<void> => {
    await page.evaluate(() => {
      const sd = (globalThis as unknown as { sd: { device(): { keyDown(k: string): void } } }).sd;
      sd.device().keyDown("N");
    });
  };

  await waitForFinished();

  for (let i = 1; i < args.from; i++) {
    await advance();
    await waitForFinished();
  }

  const shots: Buffer[] = [];
  for (let i = args.from; i <= args.to; i++) {
    shots.push(await page.screenshot({ type: "png" }));
    if (i < args.to) {
      await advance();
      try {
        await waitForFinished();
      } catch {
        // Animation got stuck — capture whatever state we're in on the next iter.
      }
    }
  }
  return shots;
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
      { timeout: args.timeoutMs },
    );
    await page.evaluate(() => {
      const sd = (globalThis as unknown as { sd: { Window: { PUPPETEER: boolean } } }).sd;
      sd.Window.PUPPETEER = true;
    });

    const shots = await captureFrames(page, args);
    await stitchGrid({
      shots,
      startIndex: args.from,
      outputPath: args.output,
      fallbackWidth: VIEWPORT.width,
      fallbackHeight: VIEWPORT.height,
    });
    const resolved = path.resolve(args.output);
    process.stdout.write(`${resolved}\n`);
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
