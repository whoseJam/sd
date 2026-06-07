# @sd/remote — phone ↔ desktop Claude chat

Workspace package that lets you talk to a Claude Code session running on
your Mac from a phone, with live deck/animation preview and inline tool
chips.

## Architecture

```
phone Safari ⇄ cloudflared ⇄ chat server (Bun :8765)
                                  │
                                  ├─ TranscriptWatcher
                                  │     polls ~/.claude/projects/<cwd>/<id>.jsonl
                                  │     dispatches new lines via the
                                  │     Claude Code adapter
                                  │
                                  ├─ POST /api/messages
                                  │     → tmux send-keys to Claude
                                  │
                                  ├─ GET  /api/messages?since=<ts>
                                  │     ← chat client polls every 2s
                                  │
                                  ├─ GET  /api/status, /api/sessions,
                                  │       /api/reload-token
                                  │
                                  ├─ GET  /api/stream  (SSE; broken
                                  │       through cloudflared so client
                                  │       also polls)
                                  │
                                  └─ static  /reveal/* /animation/*
                                            /snapshots/*  /preview-url.txt
```

JSONL is the single source of truth: there are no hooks installed on the
user's machine, no `.claude/settings.json` to wire up. The watcher reads
whatever Claude Code writes anyway and serializes it into chat messages.

## Layout

```
packages/remote/
├── package.json
├── README.md                  # this file
└── src/
    ├── server.ts              # Bun HTTP + SSE + reload-token
    ├── message.ts             # shared Message type
    ├── sessions.ts            # pin file / baseline / list sessions
    ├── adapters/
    │   ├── types.ts           # AgentAdapter contract
    │   └── claude-code.ts     # parses Claude Code JSONL
    ├── watcher/
    │   └── transcript-watcher.ts
    └── chat/
        ├── index.html
        ├── styles/*.css
        └── modules/*.js       # api / app / dom / messages / preview / …
```

CLI entry points (start / stop / open / close / snap) live one package
over, under `packages/cli/src/`, since they're project-level commands
alongside `sd-animation` etc.

## Prerequisites

- macOS or Linux
- `brew install tmux cloudflared`
- Phone: just Safari/Chrome

## Daily flow

### Start

```bash
pnpm start:remote
# boots: chat server :8765, cloudflared tunnel, tmux 'claude-dev' running
#   `claude --dangerously-skip-permissions`. Prints + pins the tunnel URL
#   to the tmux status bar, opens your Mac browser, attaches the tmux
#   session. Re-running reuses what's already alive.
```

Detach with `Ctrl-b d`.

For local-only viewing (no tunnel, no tmux) use `pnpm start:local`.

### On the phone

Open the cloudflare URL.

- `● Claude` green pill = tmux Claude alive
- `restart Claude (fish)` red pill = died; tap to relaunch
- Header session picker: pick any prior session to `claude --resume` it,
  or "+ Start new session" to fork
- Tool calls render as inline chips (tap to expand the raw input JSON)
- Preview panel embeds whatever `pnpm open` last pointed at — `tap to
  show ↗` on mobile to expand

### Showing the user something (tmux Claude)

```bash
pnpm open <deck-name>          # examples/decks/<deck-name>
pnpm open <animation-name>     # examples/animations/<animation-name>.ts
pnpm close                     # stop watching + clear preview

pnpm snap <url>                # one-shot PNG into /tmp/sd-test/snapshots/
pnpm snap /reveal/index.html --slide 6
pnpm snap /animation/foo.html --pause 4
```

`pnpm open` spawns the `gulp sd -w` / `gulp ppt -w` / `gulp
animation-group -w` watchers, tracks their PIDs in
`/tmp/sd-test/view-pids.json`, and writes the preview URL into
`/tmp/sd-test/preview-url.txt`. The chat client fetches that file
every 2s and updates the iframe.

To embed a snapshot in a chat reply, reference it as a relative URL:

```
![slide 6](/snapshots/<file>.png)
```

### Stop

```bash
pnpm stop:remote
# kills view watchers + tmux + cloudflared + bun server.
```

## Stable tunnel URL

Quick tunnels reset their URL on each run. For a stable URL register a
named Cloudflare tunnel + your domain:

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

**Phone messages reach the shell instead of Claude** (`fish: Unknown
command: ...` in tmux) — Claude isn't running in the pane. Tap the red
status pill to relaunch, or run `claude --dangerously-skip-permissions`
directly in the pane.

**Chat shows another Claude's messages** — the transcript watcher is
pinned to the wrong jsonl. `pnpm start:remote` should pin correctly on
boot; if it's wrong, edit `/tmp/sd-test/transcript-path.txt` to the
right absolute path, or use the session picker in the chat header.

**Phone sees the deck but content is empty** — reveal.js's `layout()`
throws on narrow viewports. The chat embeds the deck iframe at a fixed
960×720 inner viewport and CSS-scales it down, so this should be
invisible to the user; if you load `/reveal/index.html` directly on a
phone browser instead of through the chat, you'll hit the bug.

**Mac sleeps and kills everything** — `caffeinate -i pnpm start:remote`,
or in System Settings disable display sleep while plugged in.

**Tunnel URL keeps changing** — that's quick-tunnel behavior. See
"Stable tunnel URL" above.
