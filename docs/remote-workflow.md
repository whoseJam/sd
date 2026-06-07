# Remote chat workflow (phone ↔ desktop Claude)

Goal: chat with Claude from your phone. Messages appear in a thread (like
iMessage). Your messages get injected into the tmux session where Claude is
running on the Mac. Claude's replies are pushed back to the same thread as
chat messages, with optional image attachments (snapshots).

## How it works

```
phone Safari ⇄ trycloudflare URL ⇄ chat server (Bun, port 8765)
                                         │
                                         ├─ POST /api/messages (from phone)
                                         │     ↓ saved to messages.json
                                         │     ↓ tmux send-keys → Claude
                                         │
                                         ├─ POST /api/post-agent (from Claude in tmux)
                                         │     ↓ saved to messages.json
                                         │     ↑ phone polls /api/messages every 3s
                                         │
                                         └─ serves chat.html, snapshots/, /reveal/*
```

Both you (in phone Safari) and Claude (in tmux on Mac) see the same accumulating
chat log. No refresh — phone polls for new messages every 3s and appends them.

## Files

| File | What |
|---|---|
| `scripts/remote/server.ts` | Bun HTTP server: chat API + static; replaces live-server on 8765 |
| `scripts/remote/chat.html` | Mobile-friendly chat UI; polls every 3s |
| `scripts/remote/post.ts` | CLI: Claude calls this to post a message into the thread |
| `scripts/remote/start-session.sh` | Start (or attach to) tmux session `claude-dev` running Claude Code |
| `scripts/remote/tunnel.sh` | Cloudflare quick tunnel for port 8765 |

## Prerequisites

- macOS Sharing → Remote Login = on (optional; only if you also want SSH access)
- `brew install tmux cloudflared`
- Phone: just Safari, no app needed

## Daily flow

### Mac side — one command

```bash
./scripts/remote/start-session.sh
```

Idempotent: starts chat server on :8765, starts cloudflared tunnel,
captures the URL, prints it (and saves to `/tmp/sd-test/url.txt`), then
creates/attaches the tmux `claude-dev` session running Claude. Tmux status
bar shows the URL while you're attached. Detach with `Ctrl-b d`; the
session, server, and tunnel keep running. Re-run anytime to reattach +
re-print URL.

If you ever need just the tunnel or the server alone, the underlying
scripts are `scripts/remote/tunnel.sh` and `bun scripts/remote/server.ts`.

(Plus your usual sd watchers in another terminal: `gulp sd -w`, `gulp ppt -i <deck> -o /tmp/sd-test/reveal -l -w`, `gulp animation-group -i <deck> -o /tmp/sd-test/animation -l -w`.)

### Phone side

Open `https://<tunnel>/` in Safari. That's the chat. Type messages, see Claude's
replies. Open `https://<tunnel>/reveal/index.html` in another tab for the live
deck preview.

### Claude in tmux — posting replies

Inside tmux Claude can post replies to the chat thread by running:

```bash
# text only
bun scripts/remote/post.ts "finished the LIS animation, take a look"

# text + images (snapshots show inline in chat)
bun scripts/remote/post.ts "see slide 6" /tmp/sd-ppt-snapshot-s6.png

# stdin
echo "long multi-line text..." | bun scripts/remote/post.ts -
```

Convention: post a short summary at the end of each work chunk so you can
follow along without watching the terminal.

## Why not just a dashboard

A dashboard would be a "current state" view — useful for status but breaks the
flow when you want to align thinking with Claude. A chat is cumulative: every
message stays, no auto-refresh erases context. Text-only chat for "let me
think through this with you", attachments only when there's something visual
to share.

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

**Phone shows old chat, no new messages** — chat server might be down. Check
Terminal B; restart `bun scripts/remote/server.ts`.

**Tmux session not receiving my messages** — `tmux ls` to verify
`claude-dev` is running. Start it via `start-session.sh`. The chat server
logs `tmux session: claude-dev (has-session: true)` on startup if found.

**Tunnel URL keeps changing** — that's quick-tunnel behavior. See "Stable
tunnel URL" above.

**Mac sleeps and kills the tunnel** — `caffeinate -i` in front of the tunnel
command, or in System Settings disable display sleep while plugged in.

**Clear chat history** — `rm /tmp/sd-test/messages.json` then restart server.
