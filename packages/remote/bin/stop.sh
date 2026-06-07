#!/usr/bin/env bash
# Tear down everything started by start-session.sh:
#   - tmux session 'claude-dev'
#   - cloudflared tunnel for PORT
#   - chat server on PORT
#   - the URL file
#
# Idempotent: skips whatever isn't running.
#
# Note: chat history (/tmp/sd-test/messages.json) and snapshots are NOT
# touched — they persist across stop/start. Delete them manually if needed.

set -euo pipefail

SESSION="${SESSION:-claude-dev}"
PORT="${PORT:-8765}"
REVEAL_ROOT="${REVEAL_ROOT:-/tmp/sd-test}"

# tmux
if tmux has-session -t "$SESSION" 2>/dev/null; then
  tmux kill-session -t "$SESSION"
  echo "✓ tmux session '$SESSION' killed"
else
  echo "  tmux session '$SESSION' not running"
fi

# cloudflared
if pgrep -f "cloudflared.*--url.*:$PORT" >/dev/null 2>&1; then
  pkill -f "cloudflared.*--url.*:$PORT" 2>/dev/null || true
  echo "✓ cloudflared killed"
else
  echo "  cloudflared not running"
fi

# chat server (anything listening on PORT)
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  PIDS=$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t)
  # shellcheck disable=SC2086
  kill $PIDS 2>/dev/null || true
  echo "✓ chat server on :$PORT killed"
else
  echo "  chat server not running"
fi

rm -f "$REVEAL_ROOT/url.txt"

echo "done."
