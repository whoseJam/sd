#!/usr/bin/env bun
// Static file server for `pnpm open`. Serves the preview root and injects a
// reload poller into every HTML so watcher rebuilds refresh the page.

import { existsSync, mkdirSync, readFileSync, statSync, watch } from "node:fs";
import { extname, join } from "node:path";

const REPO = process.env.REPO ?? process.cwd();
const REVEAL_ROOT = process.env.REVEAL_ROOT ?? join(REPO, "dist");
const PORT = Number(process.env.PORT ?? 8765);
const DIST_DIR = join(REPO, "dist");

mkdirSync(REVEAL_ROOT, { recursive: true });

const distHashCache = new Map<string, { mtimeMs: number; hash: string }>();
function getDistHash(name: "sd.js" | "reveal.js"): string {
  const filePath = join(DIST_DIR, name);
  let mtimeMs: number;
  try {
    mtimeMs = statSync(filePath).mtimeMs;
  } catch {
    return "0";
  }
  const cached = distHashCache.get(name);
  if (cached && cached.mtimeMs === mtimeMs) return cached.hash;
  const hash = Bun.hash(readFileSync(filePath)).toString(36);
  distHashCache.set(name, { mtimeMs, hash });
  return hash;
}

let reloadEpoch = 0;
let reloadTimer: ReturnType<typeof setTimeout> | null = null;
function bumpReload(): void {
  if (reloadTimer) clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    reloadEpoch++;
  }, 200);
}
try {
  watch(REVEAL_ROOT, { recursive: true }, bumpReload);
} catch {
  // fs.watch recursive not supported on this platform
}
try {
  watch(DIST_DIR, bumpReload);
} catch {
  // dist not yet created at boot
}

const RELOAD_SCRIPT = `<script>(function(){let l=null;setInterval(function(){fetch('/api/reload-token').then(function(r){return r.json()}).then(function(j){if(l!==null&&j.epoch!==l)location.reload();l=j.epoch})},1000);})();</script>`;

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};

function contentType(path: string): string {
  return MIME[extname(path).toLowerCase()] ?? "application/octet-stream";
}

function decodePath(path: string): string {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

Bun.serve({
  port: PORT,
  hostname: "127.0.0.1",
  fetch(request) {
    const url = new URL(request.url);
    const path = decodePath(url.pathname);

    if (path === "/api/reload-token") {
      return Response.json({ epoch: reloadEpoch });
    }

    if (path === "/api/sd-preview-server") {
      return Response.json({ ok: true, root: REVEAL_ROOT });
    }

    const basename = path.split("/").pop() ?? "";
    if (basename === "sd.js" || basename === "reveal.js") {
      const filePath = join(DIST_DIR, basename);
      if (existsSync(filePath)) {
        const versioned = url.searchParams.has("v");
        return new Response(Bun.file(filePath), {
          headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": versioned
              ? "public, max-age=31536000, immutable"
              : "no-store",
          },
        });
      }
    }

    let resolvedPath = path;
    if (resolvedPath.endsWith("/")) resolvedPath += "index.html";
    const filePath = join(REVEAL_ROOT, resolvedPath);
    if (!filePath.startsWith(REVEAL_ROOT)) {
      return new Response("forbidden", { status: 403 });
    }
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const mime = contentType(filePath);
      if (mime.startsWith("text/html")) {
        let html = readFileSync(filePath, "utf-8");
        html = html
          .replaceAll("{{sdHash}}", getDistHash("sd.js"))
          .replaceAll("{{revealHash}}", getDistHash("reveal.js"));
        if (html.includes("</body>")) {
          html = html.replace("</body>", RELOAD_SCRIPT + "</body>");
        }
        return new Response(html, {
          headers: { "Content-Type": mime, "Cache-Control": "no-store" },
        });
      }
      const immutable = path.includes("/vendor/") || url.searchParams.has("v");
      return new Response(Bun.file(filePath), {
        headers: {
          "Content-Type": mime,
          "Cache-Control": immutable
            ? "public, max-age=31536000, immutable"
            : "public, max-age=300",
        },
      });
    }
    return new Response("not found", { status: 404 });
  },
});

console.log(
  `preview server on http://127.0.0.1:${PORT}  (root: ${REVEAL_ROOT})`,
);
