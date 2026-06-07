# Remote chat workflow (phone ↔ desktop Claude)

Goal: chat with Claude from your phone. Your messages go through `tmux
send-keys` into the Claude session on the Mac. Claude's replies come back
automatically via a Stop hook that reads the conversation JSONL transcript
and posts the assistant text (with any referenced local images) to the chat.

## Architecture

```
phone Safari ⇄ cloudflared ⇄ chat server (Bun :8765)
                                  │
                                  ├─ POST /api/messages (you typed something)
                                  │     → save to messages.json
                                  │     → tmux send-keys to claude-dev session
                                  │     → Claude reads it as input
                                  │
                                  ├─ POST /api/post-agent (from on-stop.ts)
                                  │     → save as 'agent' message
                                  │     → auto-attach any /tmp/...png paths
                                  │       mentioned in the reply
                                  │
                                  ├─ GET  /api/status  (chat polls every 5s)
                                  │     → tmux session alive? Claude running?
                                  │     → drives the green/red pill in header
                                  │
                                  ├─ POST /api/restart-claude
                                  │     → tmux send-keys "claude" to relaunch
                                  │
                                  └─ serves chat.html, /reveal/*, /snapshots/*
```

After each Claude turn, the Stop hook (`on-stop.ts`, configured in
`.claude/settings.json`) reads the transcript JSONL, extracts the last
assistant text, finds any local image paths in it (regex on `/tmp/...png`
etc.), and POSTs `text + images` to `/api/post-agent`. The phone sees the
reply within a few seconds, snapshots inline.

The hook is inert outside the tmux workflow — it only POSTs when `TMUX`
env var is set AND the chat server is reachable.

## Files

| File | What |
|---|---|
| `scripts/remote/server.ts` | Bun chat server; replaces live-server on :8765 |
| `scripts/remote/chat.html` | Phone-friendly UI; polls every 3s; green/red Claude status pill |
| `scripts/remote/on-stop.ts` | Stop hook: reads transcript, posts assistant reply + images |
| `scripts/remote/post.ts` | Manual posting CLI (rarely needed once the hook works) |
| `scripts/remote/start-session.sh` | Boots everything: server + tunnel + tmux + opens browser |
| `scripts/remote/stop.sh` | Tears it all down (tmux, tunnel, server, URL file) |
| `scripts/remote/tunnel.sh` | Standalone tunnel runner (if you only want that piece) |
| `.claude/settings.json` | Wires the Stop hook into Claude Code |

## Prerequisites

- macOS Sharing → Remote Login = on (only if you also want SSH access)
- `brew install tmux cloudflared`
- Phone: just Safari, no app needed

## Daily flow

### Start

```bash
./scripts/remote/start-session.sh
```

Idempotent. Prints `✓` lines for chat server, tunnel URL, tmux session;
saves URL to `/tmp/sd-test/url.txt`; pins URL to the tmux status bar (blue
bar at bottom); opens the chat in your desktop browser; auto-attaches the
`claude-dev` tmux session running Claude. Detach with `Ctrl-b d`.

If Claude died inside the existing tmux session, re-running this script
detects the shell in the pane and `send-keys "claude"` to relaunch.

(Plus your usual sd watchers in another terminal: `gulp sd -w`, `gulp ppt -i <deck> -o /tmp/sd-test/reveal -l -w`, `gulp animation-group -i <deck> -o /tmp/sd-test/animation -l -w`.)

### On the phone

Open the trycloudflare URL (in your browser address bar after `start-session.sh`).
Type. Watch.

- Green pill `Claude` in the header = good
- Red pill `restart Claude (fish)` = Claude died; tap to relaunch in tmux
- Preview link in the header opens `/reveal/index.html` in a new tab

### Stop

```bash
./scripts/remote/stop.sh
```

Kills tmux session, cloudflared, chat server. Leaves `messages.json` and
snapshots on disk so the next `start-session.sh` keeps history.

To nuke everything including history: `rm -rf /tmp/sd-test` after stop.

## Stable tunnel URL

`trycloudflare` URLs are random per run. For a stable URL register a named
tunnel + your domain:

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

**Phone messages reach the shell instead of Claude** ("fish: Unknown command:
hi" in tmux) — Claude isn't running in the pane. Tap the red pill in the
chat header to relaunch, or run `claude` directly in the tmux pane, or
re-run `start-session.sh`.

**Hook doesn't fire / phone never sees AI replies** — Stop hook only runs
when (a) inside tmux (`$TMUX` set) and (b) chat server reachable on
`PORT`. Verify the tmux Claude was launched via `start-session.sh` (so it
inherits `TMUX`).

**Tunnel URL keeps changing** — see "Stable tunnel URL" above.

**Mac sleeps and kills everything** — `caffeinate -i` in front of
`start-session.sh`, or in System Settings disable display sleep while
plugged in.

**Clear chat history** — `rm /tmp/sd-test/messages.json` then restart the
server (`./scripts/remote/stop.sh && ./scripts/remote/start-session.sh`).

**tmux status bar still shown after Claude exit** — by design: tmux
session, server, and tunnel all keep running so you can re-attach later.
Run `./scripts/remote/stop.sh` for a clean nuke.
