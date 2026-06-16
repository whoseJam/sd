# my-sd-project

A starter deck built with [@whosejam/sd](https://www.npmjs.com/package/@whosejam/sd).

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation)
- [Bun](https://bun.sh) (for `pnpm open` / `pnpm start`)
- macOS or Linux (Windows: use WSL)

## Quick start

```bash
pnpm install
pnpm open hello       # builds, watches, opens the deck in your browser
pnpm close            # stops the watchers
```

## Layout

```
decks/hello/
├── reveal/           # slide HTML (reveal.js)
│   ├── ppt.html      # deck container
│   └── intro.html    # one slide
└── animation/        # per-slide animation bundles
    └── intro.ts
```

To add a new deck, copy `decks/hello` to `decks/<your-name>` and edit. To see it
live: `pnpm open <your-name>`.

## Snapshot

```bash
pnpm snap /reveal/index.html              # all slides into one PNG
pnpm snap /reveal/index.html --slide 1    # just one
pnpm snap /animation/intro.html           # animation pauses
```

See [@whosejam/sd-cli](https://www.npmjs.com/package/@whosejam/sd-cli) for the
full task list and animation API.
