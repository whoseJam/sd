#!/usr/bin/env bun
// Generate /tmp/sd-test/dashboard.html so a phone can see Claude's latest
// work state through the cloudflared tunnel. Reads:
//   - git state (branch, head, status)
//   - snapshot PNGs under /tmp/sd-{ppt,animation}-snapshot-*.png
// Writes a single-page mobile-friendly dashboard that auto-refreshes.

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const REVEAL_ROOT = process.env.REVEAL_ROOT ?? "/tmp/sd-test";
const SNAP_DIR = join(REVEAL_ROOT, "snapshots");
mkdirSync(SNAP_DIR, { recursive: true });

function git(...args: string[]): string {
  const proc = Bun.spawnSync({
    cmd: ["git", ...args],
    stdout: "pipe",
    stderr: "pipe",
  });
  return new TextDecoder().decode(proc.stdout).trim();
}

const branch = git("rev-parse", "--abbrev-ref", "HEAD");
const headSha = git("rev-parse", "--short", "HEAD");
const headMsg = git("log", "-1", "--pretty=%s");
const statusRaw = git("status", "--short");
const statusLines = statusRaw ? statusRaw.split("\n") : [];

const snapshots = readdirSync("/tmp")
  .filter(
    (f) =>
      (f.startsWith("sd-ppt-snapshot-") ||
        f.startsWith("sd-animation-snapshot-")) &&
      f.endsWith(".png"),
  )
  .map((name) => ({
    name,
    mtime: statSync(`/tmp/${name}`).mtimeMs,
  }))
  .sort((a, b) => b.mtime - a.mtime)
  .slice(0, 16);

for (const s of snapshots) {
  copyFileSync(`/tmp/${s.name}`, join(SNAP_DIR, s.name));
}

const revealPresent = existsSync(join(REVEAL_ROOT, "reveal/index.html"));

const escapeHtml = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const statusBlock =
  statusLines.length === 0
    ? '<pre class="status-clean">working tree clean</pre>'
    : `<pre class="status-dirty">${escapeHtml(statusLines.join("\n"))}</pre>`;

const snapshotCards = snapshots
  .map((s) => {
    const trimmed = s.name
      .replace(/^sd-ppt-snapshot-/, "")
      .replace(/^sd-animation-snapshot-/, "")
      .replace(/\.png$/, "");
    return `
      <a class="snap" href="/snapshots/${encodeURIComponent(s.name)}" target="_blank">
        <img src="/snapshots/${encodeURIComponent(s.name)}" alt="${escapeHtml(s.name)}" loading="lazy">
        <div class="snap-caption">${escapeHtml(trimmed)}</div>
      </a>`;
  })
  .join("");

const previewSection = revealPresent
  ? `<iframe src="/reveal/index.html" loading="lazy"></iframe>`
  : `<div class="empty">No deck built yet. Run gulp ppt -i &lt;deck&gt; -o /tmp/sd-test/reveal -l.</div>`;

const now = new Date().toLocaleString("zh-CN", {
  hour12: false,
});

const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <meta http-equiv="refresh" content="15">
  <title>sd dev dashboard</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", system-ui, sans-serif;
      background: #1a1a1a;
      color: #e8e8e8;
      -webkit-text-size-adjust: 100%;
    }
    header {
      padding: 14px 16px;
      background: #2a2a2a;
      border-bottom: 1px solid #444;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .branch {
      font-weight: 600;
      color: #ffa647;
      font-size: 15px;
      word-break: break-all;
    }
    .meta {
      font-family: ui-monospace, "SF Mono", monospace;
      color: #999;
      font-size: 12px;
      margin-top: 2px;
    }
    .msg {
      color: #ddd;
      margin-top: 6px;
      font-size: 14px;
      line-height: 1.4;
      word-break: break-all;
    }
    main { padding: 12px; }
    section {
      margin-bottom: 16px;
      background: #222;
      border-radius: 8px;
      padding: 12px;
    }
    h2 {
      margin: 0 0 10px;
      font-size: 11px;
      color: #ffa647;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      font-weight: 600;
    }
    iframe {
      width: 100%;
      height: 60vh;
      border: 1px solid #444;
      border-radius: 4px;
      background: #fff;
      display: block;
    }
    .snaps {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 8px;
    }
    .snap {
      background: #2a2a2a;
      border-radius: 4px;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      display: block;
    }
    .snap img {
      width: 100%;
      display: block;
      background: #fff;
    }
    .snap-caption {
      font-size: 10px;
      padding: 4px 6px;
      color: #888;
      word-break: break-all;
      font-family: ui-monospace, monospace;
    }
    pre {
      margin: 0;
      font-size: 12px;
      color: #ccc;
      white-space: pre-wrap;
      word-break: break-all;
      font-family: ui-monospace, monospace;
    }
    .status-clean { color: #6cc874; }
    .status-dirty { color: #ffa647; }
    .empty {
      color: #888;
      font-style: italic;
      font-size: 13px;
      padding: 24px 0;
      text-align: center;
    }
    footer {
      padding: 16px;
      color: #555;
      font-size: 11px;
      text-align: center;
      font-family: ui-monospace, monospace;
    }
  </style>
</head>
<body>
  <header>
    <div class="branch">${escapeHtml(branch)}</div>
    <div class="meta">${escapeHtml(headSha)} · ${escapeHtml(now)}</div>
    <div class="msg">${escapeHtml(headMsg)}</div>
  </header>
  <main>
    <section>
      <h2>Status</h2>
      ${statusBlock}
    </section>
    <section>
      <h2>Preview</h2>
      ${previewSection}
    </section>
    <section>
      <h2>Snapshots (${snapshots.length})</h2>
      ${snapshots.length > 0 ? `<div class="snaps">${snapshotCards}</div>` : '<div class="empty">No snapshots yet.</div>'}
    </section>
  </main>
  <footer>auto-refresh 15s · ${escapeHtml(REVEAL_ROOT)}</footer>
</body>
</html>
`;

writeFileSync(join(REVEAL_ROOT, "dashboard.html"), html);
console.log(`wrote ${join(REVEAL_ROOT, "dashboard.html")}`);
console.log(`branch ${branch} (${headSha})`);
console.log(`snapshots ${snapshots.length}`);
