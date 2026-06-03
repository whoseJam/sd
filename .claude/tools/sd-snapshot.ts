#!/usr/bin/env bun
// Drive a built @sd/core animation through its pauses, screenshot each, stitch
// into one labeled grid PNG. Designed for AI agents / humans who need quick
// visual feedback against an already-built `gulp animation` output.
//
// Usage:
//   bun .claude/tools/sd-snapshot.ts <html-path>
//   bun .claude/tools/sd-snapshot.ts <html-path> --pause 7
//   bun .claude/tools/sd-snapshot.ts <html-path> --from 10 --to 14
//   bun .claude/tools/sd-snapshot.ts <html-path> --from 26 --count 25
//   bun .claude/tools/sd-snapshot.ts <html-path> -o /tmp/foo.png
//
// Output:
//   stdout = absolute path of the stitched PNG (only line printed)
//   stderr = pageerror traces collected during the run, if any
//   exit 0 = no pageerror; exit 1 = errors collected (PNG still written)

import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

interface Args {
  htmlPath: string;
  from: number;
  to: number;
  output: string;
  timeoutMs: number;
}

const VIEWPORT = { width: 1200, height: 690 };
const TILE_SCALE = 0.4;
const STEP_TIMEOUT_DEFAULT = 15000;

function printHelp(): void {
  process.stderr.write(`Usage: sd-snapshot <html-path> [flags]

Flags:
  --from N            First pause to capture (1-indexed, default 1)
  --to N              Last pause to capture (inclusive, default from+24)
  --count N           Alternative to --to: capture N pauses starting at --from
  --pause N           Shorthand for --from N --to N (single frame)
  -o, --output PATH   Output PNG path (default /tmp/sd-snapshot-<name>-<range>.png)
  --timeout MS        Per-step timeout, ms (default ${STEP_TIMEOUT_DEFAULT})
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

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--from") from = Number(argv[++i]);
    else if (arg === "--to") to = Number(argv[++i]);
    else if (arg === "--count") count = Number(argv[++i]);
    else if (arg === "--pause") single = Number(argv[++i]);
    else if (arg === "-o" || arg === "--output") output = argv[++i];
    else if (arg === "--timeout") timeoutMs = Number(argv[++i]);
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
    output = `/tmp/sd-snapshot-${base}-${range}.png`;
  }

  return { htmlPath, from, to, output, timeoutMs };
}

interface ServerHandle {
  url: string;
  close: () => Promise<void>;
}

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
};

function startStaticServer(rootDir: string): Promise<ServerHandle> {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
        const normalized = path
          .normalize(urlPath)
          .replace(/^([./\\])+/, "");
        const fullPath = path.join(rootDir, normalized);
        if (!fullPath.startsWith(rootDir)) {
          res.statusCode = 403;
          res.end();
          return;
        }
        const data = await fs.readFile(fullPath);
        const ext = path.extname(fullPath).toLowerCase();
        res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
        res.end(data);
      } catch {
        res.statusCode = 404;
        res.end();
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      resolve({
        url: `http://127.0.0.1:${port}`,
        close: () =>
          new Promise<void>((done) => {
            server.close(() => done());
          }),
      });
    });
  });
}

function labelSvg(width: number, height: number, label: string): Buffer {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect x="0" y="0" width="56" height="22" fill="#000" fill-opacity="0.65"/>` +
      `<text x="6" y="16" font-family="monospace" font-size="13" fill="#fff">${label}</text>` +
      `</svg>`,
  );
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

async function stitchGrid(
  shots: Buffer[],
  startIndex: number,
  outputPath: string,
): Promise<void> {
  const n = shots.length;
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  const rows = Math.ceil(n / cols);

  const first = await sharp(shots[0]).metadata();
  const cellW = first.width ?? VIEWPORT.width;
  const cellH = first.height ?? VIEWPORT.height;
  const tileW = Math.round(cellW * TILE_SCALE);
  const tileH = Math.round(cellH * TILE_SCALE);

  const composites: sharp.OverlayOptions[] = [];
  for (let idx = 0; idx < n; idx++) {
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    const tile = await sharp(shots[idx])
      .resize(tileW, tileH)
      .composite([{ input: labelSvg(tileW, tileH, `#${startIndex + idx}`), top: 0, left: 0 }])
      .toBuffer();
    composites.push({ input: tile, top: row * tileH, left: col * tileW });
  }

  const canvas = sharp({
    create: {
      width: tileW * cols,
      height: tileH * rows,
      channels: 4,
      background: { r: 240, g: 240, b: 240, alpha: 1 },
    },
  });
  const buf = await canvas.composite(composites).png().toBuffer();
  await fs.writeFile(outputPath, buf);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const htmlAbs = path.resolve(args.htmlPath);
  await fs.access(htmlAbs);
  const docRoot = path.dirname(htmlAbs);
  const fileName = path.basename(htmlAbs);

  const server = await startStaticServer(docRoot);
  const browser = await chromium.launch();
  const pageErrors: string[] = [];

  try {
    const page = await browser.newPage({ viewport: VIEWPORT });
    page.on("pageerror", (err) => {
      pageErrors.push(err.stack ?? err.message);
    });

    await page.goto(`${server.url}/${fileName}`, { waitUntil: "load" });
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
    await stitchGrid(shots, args.from, args.output);
    process.stdout.write(`${path.resolve(args.output)}\n`);
  } finally {
    await browser.close();
    await server.close();
  }

  if (pageErrors.length > 0) {
    process.stderr.write(`\n${pageErrors.length} page error(s) during run:\n`);
    for (const err of pageErrors) {
      process.stderr.write(`${err}\n`);
    }
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  process.stderr.write(
    `${err instanceof Error ? (err.stack ?? err.message) : String(err)}\n`,
  );
  process.exit(1);
});
