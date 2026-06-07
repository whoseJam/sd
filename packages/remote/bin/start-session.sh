#!/usr/bin/env bash
# One-shot launcher: chat server + cloudflared tunnel + tmux Claude session.
#
# Design goals (after user feedback that the previous UX was terrible):
#   1. Single command to run.
#   2. Each step prints ✓ when ready. No "info box" that gets wiped.
#   3. URL is shown ONCE while it's still your terminal, then pinned to the
#      tmux status bar (blue bar at the bottom) so it's visible forever after
#      attaching.
#   4. The desktop browser opens to the chat URL automatically — proves the
#      tunnel works, gives you something to bookmark.
#   5. Auto-attach. You land at the Claude prompt with the URL visible at
#      the bottom of the screen.
#
# Idempotent. Re-running reuses existing server/tunnel/session.

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

# ── chat server ────────────────────────────────────────────────────────────
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "✓ chat server on :$PORT"
else
  echo "  starting chat server..."
  ( cd "$REPO" && nohup bun packages/remote/src/server.ts > "$SERVER_LOG" 2>&1 & )
  for _ in $(seq 1 10); do
    sleep 0.5
    if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then break; fi
  done
  if ! lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "✗ chat server failed (check $SERVER_LOG)" >&2
    exit 1
  fi
  echo "✓ chat server on :$PORT"
fi

# ── tunnel ─────────────────────────────────────────────────────────────────
# Reuse if URL file matches a live tunnel; otherwise restart fresh so our log
# always has the URL we'll display.
URL=""
if [ -f "$URL_FILE" ] && pgrep -f "cloudflared.*--url.*:$PORT" >/dev/null 2>&1; then
  CANDIDATE=$(cat "$URL_FILE")
  if curl -s -o /dev/null --max-time 3 "$CANDIDATE" 2>/dev/null; then
    URL="$CANDIDATE"
    echo "✓ tunnel: $URL  (reused)"
  fi
fi

if [ -z "$URL" ]; then
  pkill -f "cloudflared.*--url.*:$PORT" 2>/dev/null || true
  sleep 1
  : > "$TUNNEL_LOG"
  echo "  starting cloudflared..."
  nohup cloudflared tunnel --url "http://127.0.0.1:$PORT" > "$TUNNEL_LOG" 2>&1 &
  for _ in $(seq 1 30); do
    URL=$(grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" "$TUNNEL_LOG" | head -1 || true)
    if [ -n "$URL" ]; then break; fi
    sleep 1
  done
  if [ -z "$URL" ]; then
    echo "✗ tunnel: no URL after 30s (check $TUNNEL_LOG)" >&2
    exit 1
  fi
  echo "$URL" > "$URL_FILE"
  echo "✓ tunnel: $URL"
fi

# ── tmux session ───────────────────────────────────────────────────────────
SHELLS_RE='^(fish|bash|zsh|sh|dash|ksh)$'
NEED_PIN=0
if tmux has-session -t "$SESSION" 2>/dev/null; then
  PANE_CMD=$(tmux display-message -p -t "$SESSION" -F '#{pane_current_command}' 2>/dev/null || echo "")
  if [[ "$PANE_CMD" =~ $SHELLS_RE ]] || [ -z "$PANE_CMD" ]; then
    echo "  Claude not running in tmux (pane: ${PANE_CMD:-?}) — relaunching..."
    tmux send-keys -t "$SESSION":main "claude" Enter
    echo "✓ tmux session '$SESSION' (Claude relaunched)"
    NEED_PIN=1
  else
    echo "✓ tmux session '$SESSION' (Claude alive: $PANE_CMD)"
  fi
else
  cd "$REPO"
  tmux new-session -d -s "$SESSION" -c "$REPO" -n main
  tmux send-keys -t "$SESSION":main "claude" Enter
  echo "✓ tmux session '$SESSION' (created)"
  NEED_PIN=1
fi

# ── pin the watcher to this Claude's transcript ────────────────────────────
# Without pinning, the watcher falls back to "newest mtime" which leaks
# other Claude sessions running in the same project dir (e.g. cmux's
# parent Claude). After Claude boots in tmux we detect its new JSONL by
# diffing against the file set we saw beforehand.
if [ "$NEED_PIN" = "1" ]; then
  CLAUDE_DIR="$HOME/.claude/projects/$(echo "$REPO" | sed 's|/|-|g')"
  BEFORE=$(ls "$CLAUDE_DIR"/*.jsonl 2>/dev/null | sort)
  echo "  detecting Claude's transcript file..."
  for _ in $(seq 1 30); do
    sleep 0.5
    AFTER=$(ls "$CLAUDE_DIR"/*.jsonl 2>/dev/null | sort)
    NEW=$(comm -13 <(echo "$BEFORE") <(echo "$AFTER") | head -1)
    if [ -n "$NEW" ]; then
      echo "$NEW" > "$REVEAL_ROOT/transcript-path.txt"
      echo "✓ watcher pinned to $(basename "$NEW" .jsonl)"
      break
    fi
  done
fi

# Pin URL to the status bar in a hard-to-miss blue bar. status-left is
# left-aligned with plenty of room, won't truncate like status-right.
tmux set-option -t "$SESSION" status-style "bg=#1d4ed8,fg=#ffffff,bold" >/dev/null
tmux set-option -t "$SESSION" status-left-length 200 >/dev/null
tmux set-option -t "$SESSION" status-left " chat: $URL " >/dev/null
tmux set-option -t "$SESSION" status-right "" >/dev/null

# ── desktop browser preview ────────────────────────────────────────────────
if command -v open >/dev/null && [ "${OPEN_BROWSER:-1}" = "1" ]; then
  open "$URL" 2>/dev/null || true
fi

# ── attach ─────────────────────────────────────────────────────────────────
exec tmux attach -t "$SESSION"
