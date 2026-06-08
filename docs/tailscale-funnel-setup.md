# Tailscale Funnel Setup

`pnpm start:remote` exposes the local Bun chat server (`:8765`) to your phone
through [Tailscale Funnel](https://tailscale.com/kb/1223/funnel). One-time
setup, ~5 minutes. Free for personal use (no credit card needed).

Why Tailscale Funnel and not Cloudflare quick tunnel:

- Fixed URL — `https://<machine>.tail-XXXXX.ts.net` doesn't change across
  runs. Bookmark once on your phone.
- Stable long-lived connections — SSE / WebSocket actually stay up. The chat
  client stays "alive" while desktop Claude works.
- No domain, no payment, no ICP filing.

## Prerequisites

- macOS / Linux / Windows host
- A Tailscale account (email or GitHub login, no credit card)

## One-time setup

```bash
# 1. Install tailscale
brew install tailscale                    # macOS
# Linux: https://tailscale.com/download/linux

# 2. Start the daemon and sign in (opens browser).
#    First time picks the device name — accept the default or rename it.
sudo tailscale up

# 3. Enable Funnel for your tailnet (one-time, in the Tailscale admin console)
#    https://login.tailscale.com/admin/dns/funnel
#    Toggle "HTTPS certificates" on, then "Funnel" on.
#    Confirm your account agrees to expose nodes to the public internet.

# 4. Verify your device has a DNSName
tailscale status --json | grep -i dnsname
# Should print something like "DNSName": "your-mac.tail-XXXXX.ts.net."
```

That's it. `pnpm start:remote` handles the per-run `tailscale funnel` enable
itself; you don't need to run it manually.

## Use it

```bash
pnpm start:remote
```

You'll see:

```
✓ chat server on :8765
  starting tailscale funnel → :8765...
✓ tunnel: https://your-mac.tail-XXXXX.ts.net
```

`/tmp/sd-test/url.txt` now contains the URL. Bookmark it on your phone.

`pnpm stop:remote` runs `tailscale funnel reset` to take the funnel down. The
tailnet itself stays signed in — only the public exposure is removed.

## Troubleshooting

**`✗ tailscale not signed in`**
Run `sudo tailscale up`. If that succeeds and Funnel still fails, check the
admin console — Funnel must be enabled at the tailnet level, not just per
device.

**`✗ tailscale funnel failed ... requires HTTPS to be enabled`**
Enable HTTPS certificates in the admin console first:
https://login.tailscale.com/admin/dns/https — then re-run.

**`✗ tailscale funnel failed ... Funnel is not enabled`**
Enable Funnel for the tailnet:
https://login.tailscale.com/admin/dns/funnel

**Phone can reach the URL but pages render blank**
Funnel only proxies the port you funnel'd. If the chat server tries to load
assets from a different port, those won't be reachable. The Bun server in this
repo serves everything off :8765, so this shouldn't happen — if it does,
something on the page is hardcoded to `127.0.0.1` somewhere.

**URL is missing from `/tmp/sd-test/url.txt`**
`pnpm start:remote` writes it. If it's not there, the script bailed before
that step — re-run and read the console output.

## Disable Funnel temporarily

```bash
tailscale funnel reset      # drop all funnels
```

To re-enable next run, just `pnpm start:remote` again.

## What Funnel exposes

Only the port `pnpm start:remote` explicitly funnels (default `8765`).
Everything else on your tailnet stays private (LAN-only inside Tailscale).
Funnel traffic terminates TLS at Tailscale's edge and is forwarded over the
Tailscale tunnel to your machine — your local IP is not exposed.

If you want to stop using Tailscale entirely:

```bash
tailscale funnel reset
sudo tailscale down
brew uninstall tailscale       # optional
```
