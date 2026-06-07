#!/usr/bin/env bash
# All-in-one launcher for the remote chat workflow.
#
# Idempotent: if chat server / tunnel / tmux session are already running, this
# just reattaches and re-prints the URL. Safe to re-run.
#
# Outputs:
#   - prints chat URL prominently before attaching
#   - saves URL to /tmp/sd-test/url.txt (cat it anytime)
#   - sets tmux status bar to show the URL while you're attached

set -euo pipefail

SESSION="${SESSION:-claude-dev}"
REPO="${REPO:-$HOME/Desktop/sd}"
REVEAL_ROOT="${REVEAL_ROOT:-/tmp/sd-test}"
PORT="${PORT:-8765}"
SERVER_LOG="$REVEAL_ROOT/server.log"
TUNNEL_LOG="$REVEAL_ROOT/tunnel.log"
URL_FILE="$REVEAL_ROOT/url.txt"

mkdir -p "$REVEAL_ROOT"

for cmd in tmux cloudflared bun; do
  if ! command -v "$cmd" >/dev/null; then
    echo "missing: $cmd (brew install $cmd)" >&2
    exit 1
  fi
done

# 1. Chat server
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "[chat] server already on :$PORT"
else
  echo "[chat] starting server on :$PORT..."
  ( cd "$REPO" && nohup bun scripts/remote/server.ts > "$SERVER_LOG" 2>&1 & )
  for _ in $(seq 1 10); do
    sleep 0.5
    if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then break; fi
  done
fi

# 2. Cloudflared tunnel
if pgrep -f "cloudflared.*tunnel.*--url.*:$PORT" >/dev/null; then
  echo "[tunnel] already running"
else
  echo "[tunnel] starting cloudflared..."
  : > "$TUNNEL_LOG"
  nohup cloudflared tunnel --url "http://127.0.0.1:$PORT" > "$TUNNEL_LOG" 2>&1 &
  for _ in $(seq 1 30); do
    if grep -qE "https://[a-z0-9-]+\.trycloudflare\.com" "$TUNNEL_LOG"; then break; fi
    sleep 1
  done
fi

URL=$(grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" "$TUNNEL_LOG" | head -1 || true)
if [ -n "$URL" ]; then
  echo "$URL" > "$URL_FILE"
fi

cat <<EOF

┌──────────────────────────────────────────────────────────────
│  chat URL:  ${URL:-(check $TUNNEL_LOG)}
│  preview:   ${URL:-...}/reveal/index.html
│  url file:  $URL_FILE
│  server log: $SERVER_LOG
│  tunnel log: $TUNNEL_LOG
└──────────────────────────────────────────────────────────────

EOF

# 3. tmux session (create if missing, but do NOT auto-attach — printing the
# URL box and then immediately attaching causes the URL to be cleared by tmux
# taking over the screen. Let the user attach explicitly.)
if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "[tmux] session '$SESSION' already exists"
else
  echo "[tmux] creating '$SESSION'..."
  cd "$REPO"
  tmux new-session -d -s "$SESSION" -c "$REPO" -n main
  tmux send-keys -t "$SESSION":main "claude" Enter
fi

if [ -n "$URL" ]; then
  tmux set-option -t "$SESSION" status-right " chat: $URL " >/dev/null 2>&1 || true
fi

echo
echo "attach with:  tmux attach -t $SESSION"
echo "detach:       Ctrl-b d"
echo "re-print url: cat $URL_FILE"
