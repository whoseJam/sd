# Remote dev workflow (phone ↔ desktop Claude)

Goal: see Claude's work-in-progress from your phone (live deck + snapshots +
git state) and type prompts back to the same Claude session running on your
Mac.

Two channels:

- **Visualization** — `/tmp/sd-test/dashboard.html` served over a Cloudflare
  tunnel. Phone Safari renders it. Auto-refresh 15s.
- **Input** — SSH into the Mac, attach to a tmux session where Claude Code is
  running. Both your local terminal and the phone share the session.

## Prerequisites

- macOS Sharing → Remote Login = on (System Settings → General → Sharing)
- `brew install tmux cloudflared`
- Phone SSH client: Blink Shell or Termius
- SSH key from phone added to `~/.ssh/authorized_keys` on the Mac

## Pieces

| File | What |
|---|---|
| `scripts/remote/start-session.sh` | Create/attach a tmux session running `claude` |
| `scripts/remote/tunnel.sh` | Start a Cloudflare quick tunnel for live-server :8765 |
| `scripts/remote/dashboard.ts` | Regenerate `dashboard.html` from git state + snapshots |

## First-time setup

```bash
chmod +x scripts/remote/start-session.sh scripts/remote/tunnel.sh
```

(No global install needed beyond `brew install tmux cloudflared`.)

## Daily flow

### Mac side

Terminal A — Claude session:
```bash
./scripts/remote/start-session.sh
```
You'll land inside tmux with Claude running. Detach with `Ctrl-b d`. The
session keeps running in the background.

Terminal B — dev loop (the usual sd watchers + live-server):
```bash
# (as before — gulp sd / ppt / animation-group / live-server :8765)
```

Terminal C — tunnel:
```bash
./scripts/remote/tunnel.sh
```
Look for `https://*.trycloudflare.com` in the output — that's your public
URL. The URL is random per run; for a stable URL, register a named tunnel
under a Cloudflare account.

### Phone side

Two browser tabs:

- `https://<tunnel>/dashboard.html` — dashboard (auto-refreshes)
- `https://<tunnel>/reveal/index.html` — full-screen deck

One SSH session:
```
ssh whosejam@<mac-ip-or-tailscale-name>
tmux attach -t claude-dev
```
You're now inside the same Claude session you started on the Mac. Type
prompts, see responses. Detach with `Ctrl-b d`.

### When Claude finishes a chunk of work

Claude (or you) runs:
```bash
bun scripts/remote/dashboard.ts
```
Regenerates `/tmp/sd-test/dashboard.html` with the latest git state and
snapshots. The phone tab will pick it up on next refresh.

## Stable tunnel URL (optional)

Quick tunnels reset their URL on each run. For a stable URL:

1. `cloudflared tunnel login` (browser flow)
2. `cloudflared tunnel create sd-dev`
3. Add a CNAME `dev.yourdomain.com` → `<tunnel-id>.cfargotunnel.com` in
   Cloudflare DNS
4. Create `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: sd-dev
   credentials-file: /Users/whosejam/.cloudflared/<tunnel-id>.json
   ingress:
     - hostname: dev.yourdomain.com
       service: http://127.0.0.1:8765
     - service: http_status:404
   ```
5. `cloudflared tunnel run sd-dev`

Now `https://dev.yourdomain.com/dashboard.html` is permanent.

## Troubleshooting

**`tmux attach` from phone says "no server running"** — start-session.sh
hasn't been run on the Mac yet, or the Mac rebooted (kills the tmux server).
Run start-session.sh on the Mac first.

**Phone can SSH but tunnel URL 404s** — live-server isn't running on :8765.
Check Terminal B.

**Dashboard shows old commit** — Claude hasn't regenerated it. Tell Claude to
run `bun scripts/remote/dashboard.ts`.

**Tunnel URL keeps changing** — that's how trycloudflare works. Use named
tunnel (see "Stable tunnel URL" above) for a permanent URL.

**Mac sleeps and kills everything** — caffeinate the terminal where the
tunnel runs (`caffeinate -i ./scripts/remote/tunnel.sh`), or in System
Settings disable display sleep while plugged in.
