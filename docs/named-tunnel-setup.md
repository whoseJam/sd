# Named Cloudflare Tunnel Setup (Optional)

`pnpm start:remote` defaults to a Cloudflare **quick tunnel**: zero config, but
the URL is random (`*.trycloudflare.com`) on every run, and the connection has
no SLA — SSE / long-lived streams get cut periodically. Good enough for casual
phone access, but if your chat seems to "freeze" while the desktop Claude is
actually fine, you're almost certainly looking at a dropped SSE stream.

Switch to a **named tunnel** to get:

- A stable URL (`chat.yourdomain.xyz`) you can bookmark once
- Reliable SSE / WebSocket connections
- A real health dashboard in the Cloudflare console
- A domain you can whitelist in your local proxy (Clash, Surge, etc.) so they
  stop intercepting tunnel traffic

The setup is opt-in: leave `myconfig.json` alone and `pnpm start:remote` keeps
using the quick tunnel exactly like before.

## Prerequisites

- A **Cloudflare account** (free)
- A **domain hosted on Cloudflare DNS**

If you don't already have one, the cheapest path is to register a throwaway
domain through [Cloudflare Registrar](https://dash.cloudflare.com/?to=/:account/domains/register).
`.xyz`, `.click`, `.link` are typically a few USD per year. Registering through
Cloudflare puts the domain on their DNS automatically, so you skip nameserver
migration entirely.

If you already own a domain registered elsewhere (e.g. Tencent Cloud, GoDaddy,
Namecheap), you can keep the registrar and only move authoritative DNS to
Cloudflare: in the Cloudflare dashboard, "Add a Site", then change the
nameservers at your registrar to the two `*.ns.cloudflare.com` Cloudflare gives
you. Migrate any existing DNS records first or your existing services will
break.

## One-time setup

```bash
# 1. Install cloudflared
brew install cloudflared            # macOS
# or: https://github.com/cloudflare/cloudflared/releases

# 2. Authorize cloudflared with your Cloudflare account.
#    Opens a browser; pick the domain you want to use.
#    Writes ~/.cloudflared/cert.pem
cloudflared tunnel login

# 3. Create a named tunnel. The name is local — pick anything.
cloudflared tunnel create sd-chat
# Output includes the tunnel UUID and credentials file path:
#   ~/.cloudflared/<UUID>.json

# 4. Point a subdomain at the tunnel. This writes a CNAME record into
#    your Cloudflare DNS automatically.
cloudflared tunnel route dns sd-chat chat.yourdomain.xyz
```

That's the entire Cloudflare side. No `config.yml` needed — `pnpm start:remote`
runs the tunnel by name and lets cloudflared figure out the rest.

## Tell this repo to use it

Two values go into `myconfig.json` at the repo root (gitignored, same file the
animation/PPT output paths already live in):

```bash
sd-config tunnelName sd-chat
sd-config tunnelHostname chat.yourdomain.xyz
```

Or edit `myconfig.json` directly:

```json
{
  "tunnelName": "sd-chat",
  "tunnelHostname": "chat.yourdomain.xyz"
}
```

Both fields are required to enable named-tunnel mode. If either is empty or
missing, `pnpm start:remote` silently falls back to the quick tunnel.

## Use it

```bash
pnpm start:remote
```

You'll see:

```
  starting cloudflared (named: sd-chat → chat.yourdomain.xyz)...
✓ tunnel: https://chat.yourdomain.xyz
```

`/tmp/sd-test/url.txt` gets `https://chat.yourdomain.xyz` written into it.
Bookmark that URL on your phone — it won't change.

`pnpm stop:remote` reads the same config and kills the right cloudflared
process automatically.

## Troubleshooting

**`tunnel 'sd-chat' not found on this machine`**
You skipped `cloudflared tunnel create sd-chat`, or you ran the setup as a
different user. `cloudflared tunnel list` confirms what exists. The credentials
JSON should be in `~/.cloudflared/<UUID>.json`.

**Local `curl https://chat.yourdomain.xyz` fails but the phone works**
Local HTTP proxy (Clash, Surge, ClashX) is intercepting DNS with fake-IP. The
tunnel itself is fine — only your machine's local resolution is broken. Add
a direct rule for your domain in the proxy config:

```yaml
# Clash example
rules:
  - DOMAIN-SUFFIX,yourdomain.xyz,DIRECT
```

**`pnpm stop:remote` says "cloudflared not running" but it actually is**
The stop logic reads `myconfig.json` to pick the kill pattern. If you changed
`tunnelName` between start and stop, it can't find the old process. Kill it
manually:

```bash
pkill -f "cloudflared.*tunnel.*run"
```

**Falling back to quick tunnel temporarily**
Clear both fields:

```bash
sd-config tunnelName ""
sd-config tunnelHostname ""
```

Next `pnpm start:remote` is back on the random `*.trycloudflare.com` URL.

## Uninstall

```bash
sd-config tunnelName ""
sd-config tunnelHostname ""
cloudflared tunnel delete sd-chat
# Optionally remove the chat.yourdomain.xyz DNS record from the Cloudflare
# dashboard — `tunnel delete` doesn't clean it up.
```

The credentials file `~/.cloudflared/<UUID>.json` is a private key. Don't
commit it, don't share it. The repo doesn't touch it; only your local
cloudflared does.
