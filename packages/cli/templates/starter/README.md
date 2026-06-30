# my-sd-project

A starter deck built with [@whosejam/sd](https://www.npmjs.com/package/@whosejam/sd).

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation)
- [Bun](https://bun.sh) (for `pnpm open` / `pnpm start`)

## Quick start

```bash
pnpm install
pnpm open hello       # builds, watches, and opens the deck
pnpm close hello      # stops this deck's watchers
pnpm close            # stops all preview watchers
pnpm stop             # stops watchers and the preview server
```

The preview server serves `./dist` at `http://127.0.0.1:8765`. `pnpm open hello` writes this deck to `dist/previews/decks/hello/`, so multiple decks can be previewed at the same time without overwriting each other.

## Layout

```
decks/hello/
├── reveal/           # slide HTML (reveal.js)
│   ├── ppt.html      # deck container
│   └── intro.html    # one slide
└── animation/        # per-slide animation bundles
    └── intro.ts
```

To add a new deck, copy `decks/hello` to `decks/<your-name>` and edit. To see it live: `pnpm open <your-name>`.

## Snapshot

```bash
pnpm snap /previews/decks/hello/reveal/index.html              # all slides into one PNG
pnpm snap /previews/decks/hello/reveal/index.html --slide 1    # just one slide
pnpm snap /previews/decks/hello/animation/intro.html --pause 1 # one animation pause
```

See [@whosejam/sd-cli](https://www.npmjs.com/package/@whosejam/sd-cli) for the
full task list and animation API.
