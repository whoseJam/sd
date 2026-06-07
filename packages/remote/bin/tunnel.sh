#!/usr/bin/env bash
# Start a Cloudflare quick tunnel for the local dev server at port 8765
# (or whatever PORT env var is set). The tunnel exposes /tmp/sd-test/ (live-
# server's root), so on phone you can hit:
#
#   https://<random>.trycloudflare.com/dashboard.html  — Claude's report dashboard
#   https://<random>.trycloudflare.com/reveal/index.html — live deck preview
#
# This is a *quick* tunnel (no Cloudflare account required), so the URL is
# random each run. For a stable URL register a named tunnel + your domain.

set -euo pipefail

PORT="${PORT:-8765}"

if ! command -v cloudflared >/dev/null; then
  echo "cloudflared not found. Install with: brew install cloudflared"
  exit 1
fi

if ! lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Warning: nothing listening on port $PORT — start live-server first." >&2
fi

echo "Starting tunnel for http://127.0.0.1:$PORT"
echo "Look for the 'https://*.trycloudflare.com' line in the output."
echo
exec cloudflared tunnel --url "http://127.0.0.1:$PORT"
