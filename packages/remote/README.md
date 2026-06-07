# @sd/remote — phone ↔ desktop Claude chat

Self-contained workspace package that lets you talk to a Claude Code session
running on your Mac from a phone, with live preview of decks/animations,
inline snapshots, and visibility into Claude's tool use.

## Architecture

```
phone Safari ⇄ cloudflared ⇄ chat server (Bun :8765)
                                  │
                                  ├─ POST /api/messages
                                  │     → save + tmux send-keys
                                  │     → set responding=true
                                  │
                                  ├─ POST /api/post-agent
                                  │     ← on-hook.ts (Stop) posts assistant reply
                                  │     ← post.ts (manual)
                                  │     → set responding=false
                                  │
                                  ├─ POST /api/tool-call
                                  │     ← on-hook.ts (PreToolUse) posts chip
                                  │     → auto-attaches image_paths
                                  │
                                  ├─ POST /api/preview
                                  │     ← preview.ts show/hide
                                  │     → SSE event "preview"
                                  │
                                  ├─ GET  /api/status
                                  │     → {session, claude, responding}
                                  │
                                  ├─ GET  /api/stream  (SSE)
                                  │     → push new messages + preview state
                                  │
                                  └─ static  /reveal/* /animation/* /snapshots/*
```

After each Claude turn the **Stop hook** (`src/hooks/on-hook.ts`, wired via
`.claude/settings.json`) reads the assistant text from the hook input and
POSTs to `/api/post-agent`. PreToolUse fires per tool call and posts a chip
with the tool name + raw input (and the image itself when Claude is Reading
a PNG/JPG).

Both hooks are **inert outside the tmux workflow**: they POST only when
`$TMUX` is set AND the chat server is reachable on `PORT`.

## Layout

```
packages/remote/
├── package.json
├── README.md                  # this file
├── bin/
│   ├── start-session.sh       # boot server + tunnel + tmux + browser
│   ├── stop.sh                # nuke everything
│   └── tunnel.sh              # standalone tunnel runner
└── src/
    ├── server.ts              # Bun HTTP + SSE
    ├── chat.html              # phone-friendly UI (marked.js for markdown)
    ├── hooks/
    │   └── on-hook.ts         # Stop + PreToolUse handler
    └── cli/
        ├── post.ts            # manually post a chat message
        └── preview.ts         # show/hide preview panel; snap slides/animations
```

The Stop hook is wired in repo-root `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      { "hooks": [{ "type": "command", "command": "bun ${CLAUDE_PROJECT_DIR}/packages/remote/src/hooks/on-hook.ts" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "bun ${CLAUDE_PROJECT_DIR}/packages/remote/src/hooks/on-hook.ts" }] }
    ]
  }
}
```

## Prerequisites

- macOS or Linux. macOS Sharing → Remote Login = on (only if you also want SSH access)
- `brew install tmux cloudflared` (or apt/dnf equivalent on Linux)
- Phone: just Safari/Chrome, no app needed

## Daily flow

### Start

```bash
./packages/remote/bin/start-session.sh
# prints chat URL, saves to /tmp/sd-test/url.txt, pins to tmux status bar,
# auto-opens desktop browser, attaches the claude-dev tmux session
```

Detach with `Ctrl-b d`. Re-running attaches; if Claude died inside the
existing tmux session, it auto-relaunches it.

### On the phone

Open the trycloudflare URL.

- Green pill `Claude` in header = good
- Red pill `restart Claude (fish)` = Claude died; tap to relaunch
- Tool chips appear inline as Claude runs Bash/Read/Edit/etc. Tap to expand the full input JSON.
- Preview panel slides in at top (mobile) or left (desktop) when Claude calls `preview.ts show ...`. Tap close to dismiss.

### Claude in tmux — posting replies + previews

The Stop hook handles assistant text automatically. For visual content the
tmux Claude calls:

```bash
# Open the live deck in the phone's preview panel
bun packages/remote/src/cli/preview.ts show deck

# Or an animation
bun packages/remote/src/cli/preview.ts show animation 状态设置

# Or an arbitrary in-repo URL
bun packages/remote/src/cli/preview.ts show /reveal/index.html "deck"

# Close the preview panel
bun packages/remote/src/cli/preview.ts hide

# Static snapshot of a single slide/animation pause (for an exact moment)
bun packages/remote/src/cli/preview.ts snap slide 6
bun packages/remote/src/cli/preview.ts snap animation 状态设置 --pause 4
```

### Stop

```bash
./packages/remote/bin/stop.sh
# kills tmux session, cloudflared, chat server; leaves messages.json + snapshots
```

To nuke everything including history: `rm -rf /tmp/sd-test` after stop.

## Stable tunnel URL

Quick tunnels reset their URL on each run. For a stable URL register a named
Cloudflare tunnel + your domain:

1. `cloudflared tunnel login`
2. `cloudflared tunnel create sd-dev`
3. DNS: CNAME `dev.yourdomain.com` → `<tunnel-id>.cfargotunnel.com`
4. `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: sd-dev
   credentials-file: /Users/whosejam/.cloudflared/<tunnel-id>.json
   ingress:
     - hostname: dev.yourdomain.com
       service: http://127.0.0.1:8765
     - service: http_status:404
   ```
5. `cloudflared tunnel run sd-dev`

## Troubleshooting

**Phone messages reach the shell instead of Claude** ("fish: Unknown command: hi" in tmux) — Claude isn't running in the pane. Tap the red pill in the chat header to relaunch, run `claude` directly in the tmux pane, or re-run `start-session.sh`.

**Hook doesn't fire / phone never sees AI replies** — Stop hook only runs when (a) inside tmux (`$TMUX` set) AND (b) chat server reachable on `PORT`. Verify the tmux Claude was launched via `start-session.sh`. Set `HOOK_DEBUG=1` to log every invocation to `/tmp/sd-test/hook-debug.log`.

**Tunnel URL keeps changing** — that's quick-tunnel behavior. See "Stable tunnel URL" above.

**Mac sleeps and kills everything** — `caffeinate -i` in front of `start-session.sh`, or in System Settings disable display sleep while plugged in.

**Clear chat history** — `rm /tmp/sd-test/messages.json` then restart the server (`./packages/remote/bin/stop.sh && ./packages/remote/bin/start-session.sh`).
