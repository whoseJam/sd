// Shared helpers for sd-animation-snapshot / sd-ppt-snapshot:
//   - tiny static file server (lets chromium load deck assets by URL)
//   - per-tile label SVG
//   - sqrt-grid PNG stitcher
//   - browser-issue collector (pageerror + console + network failures)

import http from "node:http";
import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import type { Page } from "playwright";
import sharp from "sharp";

// Built sd HTML may live at <root>/<entry>/foo.html and reference `../sd.js`.
// The static server's root must be the dir holding sd.js, not the html's own
// dir, otherwise up-relative requests 404. Walk up until we find sd.js.
export function findDocRoot(htmlAbs: string): string {
  let dir = path.dirname(htmlAbs);
  for (let depth = 0; depth < 5; depth++) {
    if (existsSync(path.join(dir, "sd.js"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.dirname(htmlAbs);
}

export interface ServerHandle {
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

export function startStaticServer(rootDir: string): Promise<ServerHandle> {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
        const normalized = path.normalize(urlPath).replace(/^([./\\])+/, "");
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

export function labelSvg(width: number, height: number, label: string): Buffer {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect x="0" y="0" width="56" height="22" fill="#000" fill-opacity="0.65"/>` +
      `<text x="6" y="16" font-family="monospace" font-size="13" fill="#fff">${label}</text>` +
      `</svg>`,
  );
}

export interface StitchOptions {
  shots: Buffer[];
  startIndex: number;
  outputPath: string;
  tileScale?: number;
  fallbackWidth?: number;
  fallbackHeight?: number;
}

export async function stitchGrid(opts: StitchOptions): Promise<void> {
  const { shots, startIndex, outputPath } = opts;
  const tileScale = opts.tileScale ?? 0.4;
  const n = shots.length;
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  const rows = Math.ceil(n / cols);

  const first = await sharp(shots[0]).metadata();
  const cellW = first.width ?? opts.fallbackWidth ?? 1200;
  const cellH = first.height ?? opts.fallbackHeight ?? 690;
  const tileW = Math.round(cellW * tileScale);
  const tileH = Math.round(cellH * tileScale);

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

// Auto-open the result so the human running this can see what the agent
// just produced. macOS Preview refreshes in place when the same file is
// re-opened, so a persistent Preview window stays in sync across reruns.
export async function openInViewer(filePath: string): Promise<void> {
  if (process.platform !== "darwin") return;
  const { spawn } = await import("node:child_process");
  spawn("open", [filePath], { stdio: "ignore", detached: true }).unref();
}

// Browser-issue collection. We want the snapshot output to be a faithful
// signal of what actually broke during a run — pageerrors alone miss too
// much (404s, include-html walker warnings, action-conflict errors thrown
// inside iframes, etc).
export type IssueLevel = "error" | "warn";
export interface Issue {
  level: IssueLevel;
  kind:
    | "pageerror"
    | "console.error"
    | "console.warning"
    | "request-failed"
    | "http-error";
  message: string;
  location?: string;
}
export interface IssueCollector {
  issues: Issue[];
  hasErrors(): boolean;
  format(): string;
}

// Patterns suppressed because they're either browser-level noise (favicon)
// or sd-internal control-flow throws that get surfaced as pageerrors but
// aren't actually errors.
const NOISE_PATTERNS: RegExp[] = [
  /favicon\.ico/,
  /Reload \(not an error\)/,
];

function isNoise(text: string): boolean {
  return NOISE_PATTERNS.some((r) => r.test(text));
}

export function attachIssueCollector(page: Page): IssueCollector {
  const issues: Issue[] = [];

  page.on("pageerror", (err) => {
    const text = err.stack ?? err.message;
    if (isNoise(text)) return;
    issues.push({ level: "error", kind: "pageerror", message: text });
  });

  page.on("console", (msg) => {
    const type = msg.type();
    if (type !== "error" && type !== "warning") return;
    const text = msg.text();
    if (isNoise(text)) return;
    const loc = msg.location();
    const location =
      loc?.url && loc.url !== ""
        ? `${loc.url}:${loc.lineNumber ?? 0}:${loc.columnNumber ?? 0}`
        : undefined;
    issues.push({
      level: type === "error" ? "error" : "warn",
      kind: type === "error" ? "console.error" : "console.warning",
      message: text,
      location,
    });
  });

  page.on("requestfailed", (req) => {
    const url = req.url();
    if (isNoise(url)) return;
    const failure = req.failure();
    issues.push({
      level: "error",
      kind: "request-failed",
      message: `${req.method()} ${url} — ${failure?.errorText ?? "unknown"}`,
    });
  });

  page.on("response", (resp) => {
    const status = resp.status();
    if (status < 400) return;
    const url = resp.url();
    if (isNoise(url)) return;
    issues.push({
      level: status >= 500 ? "error" : "warn",
      kind: "http-error",
      message: `[${status}] ${resp.request().method()} ${url}`,
    });
  });

  return {
    issues,
    hasErrors: () => issues.some((i) => i.level === "error"),
    format: () => {
      if (issues.length === 0) return "";
      const errCount = issues.filter((i) => i.level === "error").length;
      const warnCount = issues.length - errCount;
      const head = `\n${issues.length} issue(s) during run (${errCount} error, ${warnCount} warn):`;
      const lines = [head];
      for (const issue of issues) {
        const tag = issue.level === "error" ? "[ERROR]" : "[WARN] ";
        lines.push(`${tag} ${issue.kind}: ${issue.message}`);
        if (issue.location) lines.push(`        at ${issue.location}`);
      }
      return lines.join("\n") + "\n";
    },
  };
}
