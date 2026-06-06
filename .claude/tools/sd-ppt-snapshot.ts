#!/usr/bin/env bun
// Drive a built sd deck (reveal / webslides / impress) at a running dev
// server URL through every slide, screenshot each at its initial state,
// stitch into one labeled grid PNG. The dev loop already runs a server
// (gulp serve / serve.py); this tool just points chromium at it.
//
// Usage:
//   bun .claude/tools/sd-ppt-snapshot.ts <deck-url>
//   bun .claude/tools/sd-ppt-snapshot.ts <deck-url> --slide 3
//   bun .claude/tools/sd-ppt-snapshot.ts <deck-url> --from 5 --to 8
//   bun .claude/tools/sd-ppt-snapshot.ts <deck-url> --idle 600
//   bun .claude/tools/sd-ppt-snapshot.ts <deck-url> -o /tmp/foo.png

import path from "node:path";
import { chromium } from "playwright";

import { attachIssueCollector, openInViewer, stitchGrid } from "./grid";

type Framework = "reveal" | "webslides" | "impress";

interface Args {
  url: string;
  from: number;
  to?: number;
  output?: string;
  idleMs?: number;
  timeoutMs: number;
  open: boolean;
}

const VIEWPORT = { width: 1200, height: 690 };
// Slides that embed sd-animation iframes need their initial pause to fully
// render before capture — short waits leave fade-in mid-flight and ghost
// the slide transition on top. --idle overrides per invocation.
const IDLE_DEFAULT_BY_FW: Record<Framework, number> = {
  reveal: 1000,
  webslides: 1000,
  impress: 1000,
};
const READY_TIMEOUT_DEFAULT = 10000;

function printHelp(): void {
  process.stderr.write(`Usage: sd-ppt-snapshot <deck-url> [flags]

Flags:
  --from N            First slide (1-indexed, default 1)
  --to N              Last slide (inclusive, default = total)
  --count N           Alternative to --to: capture N slides from --from
  --slide N           Shorthand for --from N --to N (single slide)
  --idle MS           Wait per slide after navigation before screenshot (default per framework: reveal/webslides 300, impress 1100)
  -o, --output PATH   Output PNG path (default /tmp/sd-ppt-snapshot-<name>-<range>.png)
  --timeout MS        Framework-ready timeout, ms (default ${READY_TIMEOUT_DEFAULT})
  --no-open           Don't auto-open the PNG (macOS Preview otherwise refreshes in place)
  -h, --help          Show this help
`);
}

function parseArgs(argv: string[]): Args {
  let url: string | undefined;
  let from = 1;
  let to: number | undefined;
  let count: number | undefined;
  let single: number | undefined;
  let output: string | undefined;
  let idleMs: number | undefined;
  let timeoutMs = READY_TIMEOUT_DEFAULT;
  let open = true;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--from") from = Number(argv[++i]);
    else if (arg === "--to") to = Number(argv[++i]);
    else if (arg === "--count") count = Number(argv[++i]);
    else if (arg === "--slide") single = Number(argv[++i]);
    else if (arg === "--idle") idleMs = Number(argv[++i]);
    else if (arg === "-o" || arg === "--output") output = argv[++i];
    else if (arg === "--timeout") timeoutMs = Number(argv[++i]);
    else if (arg === "--no-open") open = false;
    else if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith("-")) url = arg;
    else throw new Error(`Unknown flag: ${arg}`);
  }

  if (!url) {
    printHelp();
    process.exit(1);
  }

  if (single !== undefined) {
    from = single;
    to = single;
  } else if (count !== undefined && to === undefined) {
    to = from + count - 1;
  }

  if (!Number.isInteger(from) || from < 1) {
    throw new Error("--from must be a positive integer");
  }
  if (to !== undefined && (!Number.isInteger(to) || to < from)) {
    throw new Error("--to must be an integer >= --from");
  }

  return { url, from, to, output, idleMs, timeoutMs, open };
}

type Page = Awaited<ReturnType<typeof chromium.prototype.newPage>>;

// Adapter logic is sent into the page as serializable strings, evaluated against
// the framework globals each bundle exposes:
//   reveal     → window.Reveal (UMD global from reveal.js)
//   webslides  → window.ws (set by packages/webslides/src/main.ts after init)
//   impress    → window.impress() (re-calling with default rootId returns the same API)
async function detectFramework(
  page: Page,
  timeoutMs: number,
): Promise<Framework> {
  await page.waitForFunction(
    () => {
      const w = window as unknown as {
        Reveal?: { getTotalSlides?: () => number; isReady?: () => boolean };
        ws?: { maxSlide_?: number };
        impress?: (id?: string) => unknown;
      };
      if (w.Reveal?.isReady?.() && (w.Reveal.getTotalSlides?.() ?? 0) > 0)
        return true;
      if (typeof w.ws?.maxSlide_ === "number" && w.ws.maxSlide_ > 0)
        return true;
      if (
        typeof w.impress === "function" &&
        document.body.classList.contains("impress-supported") &&
        document.querySelectorAll("#impress .step").length > 0
      ) {
        return true;
      }
      return false;
    },
    undefined,
    { timeout: timeoutMs },
  );

  return page.evaluate((): Framework => {
    const w = window as unknown as {
      Reveal?: { getTotalSlides?: () => number };
      ws?: { maxSlide_?: number };
      impress?: unknown;
    };
    if (typeof w.Reveal?.getTotalSlides === "function") return "reveal";
    if (typeof w.ws?.maxSlide_ === "number") return "webslides";
    if (typeof w.impress === "function") return "impress";
    throw new Error("no known slide framework detected on window");
  });
}

async function getTotal(page: Page, fw: Framework): Promise<number> {
  return page.evaluate((framework) => {
    const w = window as unknown as {
      Reveal: { getTotalSlides: () => number };
      ws: { maxSlide_: number };
    };
    if (framework === "reveal") return w.Reveal.getTotalSlides();
    if (framework === "webslides") return w.ws.maxSlide_;
    return document.querySelectorAll("#impress .step").length;
  }, fw);
}

async function gotoSlide(
  page: Page,
  fw: Framework,
  index: number,
): Promise<void> {
  await page.evaluate(
    ([framework, i]) => {
      const w = window as unknown as {
        Reveal: {
          slide: (h: number, v: number, f: number) => void;
          getHorizontalSlides: () => Element[];
        };
        ws: { goToSlide: (i: number) => void };
        impress: () => { goto: (i: number) => void };
      };
      if (framework === "reveal") {
        // Reveal counts both horizontal and vertical slides into getTotalSlides(),
        // but slide(h, v, f) needs the (h, v) pair. Walk the horizontal sections
        // to convert a linear index into the right coordinates.
        let remaining = i;
        const horiz = w.Reveal.getHorizontalSlides();
        for (let h = 0; h < horiz.length; h++) {
          const verticals = horiz[h].querySelectorAll(":scope > section");
          const vCount = Math.max(1, verticals.length);
          if (remaining < vCount) {
            w.Reveal.slide(h, verticals.length > 0 ? remaining : 0, 0);
            return;
          }
          remaining -= vCount;
        }
        w.Reveal.slide(horiz.length - 1, 0, 0);
      } else if (framework === "webslides") w.ws.goToSlide(i);
      else w.impress().goto(i);
    },
    [fw, index] as [Framework, number],
  );
}

// Use the URL's last meaningful path segment (skipping a generic "index"
// basename) as the filename stem so output names mirror the deck route.
function stemFromUrl(rawUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return "deck";
  }
  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "deck";
  const last = segments[segments.length - 1];
  const base = last.replace(/\.[^.]+$/, "");
  if (base === "index" && segments.length >= 2)
    return segments[segments.length - 2];
  return base || "deck";
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const browser = await chromium.launch();
  let collector: ReturnType<typeof attachIssueCollector> | undefined;

  try {
    const page = await browser.newPage({ viewport: VIEWPORT });
    collector = attachIssueCollector(page);

    await page.goto(args.url, { waitUntil: "load" });
    const framework = await detectFramework(page, args.timeoutMs);
    const total = await getTotal(page, framework);

    const from = args.from;
    if (from > total) {
      throw new Error(`--from ${from} exceeds total slides (${total})`);
    }
    const requestedTo = args.to;
    const to = Math.min(requestedTo ?? total, total);
    const clamped = requestedTo !== undefined && requestedTo > total;

    const output =
      args.output ??
      (() => {
        const stem = stemFromUrl(args.url);
        const range = from === to ? `s${from}` : `s${from}-${to}`;
        return `/tmp/sd-ppt-snapshot-${framework}-${stem}-${range}.png`;
      })();

    const idleMs = args.idleMs ?? IDLE_DEFAULT_BY_FW[framework];
    const shots: Buffer[] = [];
    for (let i = from; i <= to; i++) {
      // Frameworks use 0-indexed APIs; --from / --to are 1-indexed for humans.
      await gotoSlide(page, framework, i - 1);
      await page.waitForTimeout(idleMs);
      shots.push(await page.screenshot({ type: "png" }));
    }

    await stitchGrid({
      shots,
      startIndex: from,
      outputPath: output,
      fallbackWidth: VIEWPORT.width,
      fallbackHeight: VIEWPORT.height,
    });
    const resolved = path.resolve(output);
    process.stdout.write(`${resolved}\n`);
    if (clamped) {
      process.stderr.write(
        `note: deck has only ${total} slide(s); requested --to ${requestedTo} was clamped.\n`,
      );
    }
    if (args.open) await openInViewer(resolved);
  } finally {
    await browser.close();
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
