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
import type { Page } from "playwright";
import sharp from "sharp";

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

interface Bbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CaptureResult {
  shots: Buffer[];
  reachedEnd: boolean;
  clip: Bbox | null;
}

const CLIP_PADDING = 24;

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
  const bboxes: Bbox[] = [];
  let reachedEnd = false;
  for (let i = args.from; i <= args.to; i++) {
    if (await mainFinished()) {
      reachedEnd = true;
      break;
    }
    shots.push(await page.screenshot({ type: "png" }));
    const bb = await measureSvgBBox(page);
    if (bb) bboxes.push(bb);
    if (i < args.to) {
      await advance();
      await waitForBoundary(args.timeoutMs);
    }
  }
  // Union of per-frame bboxes — animations that mount entities mid-run
  // (e.g. sweep bands) would be clipped if we only sampled one frame.
  const unionBox = unionBBoxes(bboxes);
  const clip = unionBox ? await pageClipFromSvgBox(page, unionBox) : null;
  return { shots, reachedEnd, clip };
}

function measureSvgBBox(page: Page): Promise<Bbox | null> {
  return page.evaluate(() => {
    const svg = document.querySelector("svg");
    if (!svg) return null;
    const bbox = svg.getBBox();
    if (!bbox || bbox.width === 0 || bbox.height === 0) return null;
    return { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height };
  });
}

function unionBBoxes(bboxes: Bbox[]): Bbox | null {
  if (bboxes.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const b of bboxes) {
    if (b.x < minX) minX = b.x;
    if (b.y < minY) minY = b.y;
    if (b.x + b.width > maxX) maxX = b.x + b.width;
    if (b.y + b.height > maxY) maxY = b.y + b.height;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function pageClipFromSvgBox(page: Page, svgBox: Bbox): Promise<Bbox | null> {
  return page.evaluate((box: Bbox) => {
    const svg = document.querySelector("svg");
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    if (rect.width === 0 || rect.height === 0 || vb.width === 0 || vb.height === 0) return null;
    // preserveAspectRatio="xMidYMid meet" — content fits inside the SVG rect,
    // letterboxed and centered. Scale = min of axis ratios.
    const scale = Math.min(rect.width / vb.width, rect.height / vb.height);
    const offsetX = rect.x + (rect.width - vb.width * scale) / 2;
    const offsetY = rect.y + (rect.height - vb.height * scale) / 2;
    return {
      x: offsetX + (box.x - vb.x) * scale,
      y: offsetY + (box.y - vb.y) * scale,
      width: box.width * scale,
      height: box.height * scale,
    };
  }, svgBox);
}

async function cropShots(
  shots: Buffer[],
  clip: Bbox,
  viewport: { width: number; height: number },
): Promise<Buffer[]> {
  const left = Math.max(0, Math.floor(clip.x - CLIP_PADDING));
  const top = Math.max(0, Math.floor(clip.y - CLIP_PADDING));
  const right = Math.min(viewport.width, Math.ceil(clip.x + clip.width + CLIP_PADDING));
  const bottom = Math.min(viewport.height, Math.ceil(clip.y + clip.height + CLIP_PADDING));
  const width = right - left;
  const height = bottom - top;
  if (width <= 0 || height <= 0) return shots;
  return Promise.all(
    shots.map((buf) =>
      sharp(buf).extract({ left, top, width, height }).png().toBuffer(),
    ),
  );
}

// Skips the iframe + postMessage dance sd-element uses to enter flush mode;
// directly sets the same Window flags as soon as sd.js parses. SHOULD_FLUSH
// makes pause() resolve instantly, so main() runs to the end in one tick and
// every beat's actions land in a single action list — same accumulation the
// real deck triggers. Without this the snapshot only exercises the
// "advance via key N" path, which never hits partial-overlap conflicts.
const FORCE_FLUSH_MODE = `
  (() => {
    const arm = () => {
      const sd = window.sd;
      if (!sd || !sd.Window) return setTimeout(arm, 0);
      sd.Window.SHOULD_FLUSH = true;
      sd.Window.PUPPETEER = true;
      sd.Window.IFRAME_ID = 0;
      sd.Window.IFRAME_URL = '';
      sd.Window.IFRAME_RATE = 1.01;
      sd.Window.IFRAME_MAX_FRAME = Infinity;
    };
    arm();
  })();
`;

async function runFlushPass(
  browser: Awaited<ReturnType<typeof chromium.launch>>,
  url: string,
  timeoutMs: number,
): Promise<ReturnType<typeof attachIssueCollector>> {
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  const collector = attachIssueCollector(page);
  await page.addInitScript(FORCE_FLUSH_MODE);
  try {
    await page.goto(url, { waitUntil: "load" });
    await page.waitForFunction(
      () => (globalThis as unknown as { sd?: { Window?: { MAIN_FINISHED?: boolean } } })
        .sd?.Window?.MAIN_FINISHED === true,
      undefined,
      { timeout: timeoutMs },
    );
  } catch {
    // Timeout means main() never reached LAST_MAIN_STAGE — usually because an
    // action conflict threw partway. The pageerror is already in the collector.
  }
  await ctx.close();
  return collector;
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
  let captureError: unknown;

  try {
    const flushCollector = await runFlushPass(
      browser,
      `${server.url}/${urlPath}`,
      Math.min(args.timeoutMs, 15000),
    );
    if (flushCollector.hasErrors()) {
      process.stderr.write(
        "flush pass would throw when sd-element measures the iframe:\n",
      );
      process.stderr.write(flushCollector.format());
      await browser.close();
      await server.close();
      process.exit(1);
    }

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

    const { shots, reachedEnd, clip } = await captureFrames(page, args);

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

    const finalShots = clip ? await cropShots(shots, clip, VIEWPORT) : shots;

    await stitchGrid({
      shots: finalShots,
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
  } catch (err) {
    captureError = err;
  } finally {
    await browser.close();
    await server.close();
  }

  // Always surface collected page-level issues — a hidden action-list throw
  // would otherwise just look like an opaque waitForBoundary timeout.
  if (collector && collector.issues.length > 0) {
    process.stderr.write(collector.format());
  }
  if (captureError !== undefined) {
    process.stderr.write(
      `${captureError instanceof Error ? (captureError.stack ?? captureError.message) : String(captureError)}\n`,
    );
    process.exit(1);
  }
  if (collector?.hasErrors()) process.exit(1);
}

main().catch((err: unknown) => {
  process.stderr.write(
    `${err instanceof Error ? (err.stack ?? err.message) : String(err)}\n`,
  );
  process.exit(1);
});
