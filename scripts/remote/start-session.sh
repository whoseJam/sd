#!/usr/bin/env bash
# Start (or attach to) a tmux session named "claude-dev" that runs Claude Code
# inside. Survives SSH disconnect. Both your local terminal AND a remote phone
# SSH session can attach to the same tmux session and share input/output.

set -euo pipefail

SESSION="${SESSION:-claude-dev}"
REPO="${REPO:-$HOME/Desktop/sd}"

if ! command -v tmux >/dev/null; then
  echo "tmux not found. Install with: brew install tmux"
  exit 1
fi

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "Session '$SESSION' already exists — attaching."
  exec tmux attach -t "$SESSION"
fi

cd "$REPO"

tmux new-session -d -s "$SESSION" -c "$REPO" -n main
tmux send-keys -t "$SESSION":main "claude" Enter

echo "Created session '$SESSION'. Attaching..."
exec tmux attach -t "$SESSION"
