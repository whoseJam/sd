# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

This is a pnpm-workspace monorepo. All library code lives under `packages/`; user content lives under `examples/`.

```
packages/
  core/          @sd/core          Rendering engine (animate / node / renderer / math / utility / interact)
  layout/        @sd/layout        Layout helpers (array / curve / graph / grid / two-node); depends on dagre
  include-html/  @sd/include-html  DOM walker that inlines <... include-html="./xxx.html"> attributes
  reveal/        @sd/reveal        reveal.js integration layer (plugins, MathJax, theme SCSS)
  webslides/     @sd/webslides     WebSlides host: framework + include-html walker, shipped as IIFE bundle
  impress/       @sd/impress       impress.js host: framework + include-html walker, shipped as IIFE bundle
  element/       @sd/element       <sd-animation> custom element that wraps an iframe (host-side embedding)
  cli/           @sd/cli           Build tasks + CLI entries (sd-animation, sd-animation-group, sd-ppt, sd-config)
  remote/        @sd/remote        Phone ↔ desktop Claude Code remote chat (Bun HTTP/SSE server, mobile UI)
  assets/        @sd/assets        Vendor JS/CSS/fonts (MathJax2/3, snap.svg, dagre, font-awesome, themes, customcontrols)
examples/
  animations/  Single-animation demo scripts (former unit/)
  decks/       Sample PPT decks (former example/); each deck has `reveal/` + `animation/` subdirs
docs/        Markdown notes
gulpfile.js  Workspace-root build entry; tasks live in @sd/cli
```

Legacy decks/animations that depend on removed APIs live in `deprecated/` (gitignored, local only) — do not build from there.

Cross-package imports go through workspace deps (e.g. `import "@sd/element"`, `import "@sd/reveal/plugin/reveal.css"`). The `@sd/reveal` package.json has an `exports` map (`"./*": "./src/*"`) that makes subpath imports look natural.

The `dist/` outputs from `gulp sd`, `gulp reveal`, `gulp element` are written to whatever path `-o` specifies (or `pptOutputPath` from `myconfig.json`); they are not committed.

## Conventions

### Code style

- **No `_xxx` naming.** Use TS `private` / `protected` / `public` modifiers, not `_`-prefixed fields, even for lazy-getter backing storage.
- **No `any` / `as any`.** Use `as unknown as T` or refactor the API.
- **No backwards-compat hacks.** When changing core APIs, pick the cleanest extensible design; breaking changes are fine.
- **No silent fallback to mask bugs.** If you see `if (!foo) return` at the bottom of a stack, find the root cause and declare intent at the correct layer instead.
- **Renaming for shadowing:** make the outer name more precise (`suffix` → `suffixes`) or rename the import (`path` → `nodePath`). Do not shrink to single letters (`s` / `x` / `p`).
- **Optional runtime config absences are silent.** If `__SD_*_URL__` is missing, just `return` — no `console.warn`. Visual gaps are obvious; don't add noise.

### Comments

- Default to no comment. Only add one when the WHY is non-obvious (a hidden constraint, a workaround, a subtle invariant).
- All `//` and `/* */` are in English. Chinese in chat is fine; in code, English only.
- Don't explain WHAT the code does; well-named identifiers already do that.

### Formatting / lint

- `pnpm format` = `oxfmt` (printWidth 80, lf) then `oxlint --fix` with `perfectionist/sort-imports` (natural asc, type-imports first) and `consistent-type-imports`.
- Import-order issues (including circular-import failures caused by reordering) get fixed automatically by running format.
- `pnpm format` exit 1 is usually just `no-unused-vars` warnings; read the output before assuming a real failure.
- Not auto-sorted: object keys, JSX props, switch cases, names inside `{ ... }` of an import.

### Commits

- Default to **one commit per task** bundling all related changes — don't split by "logical theme" unless the user asks. Long commit messages are fine.

## Build and Development Commands

### Develop a deck (the canonical loop)

Decks under `examples/decks/<name>/` are split: `reveal/` holds `ppt.html` + slide HTML; `animation/` holds the per-slide bundles. The slide HTML references its bundle via `<sd-animation src="../../animation/<name>/<name>.js">`, so the two trees must land at sibling output paths.

**One command:**

```bash
pnpm open <deck-name>     # spawn watchers, embed the deck in the chat stage + open local browser
pnpm close                # stop watching + clear the stage panel
```

For phone access: `pnpm start:remote` first (adds a cloudflared tunnel + tmux Claude session). Then `pnpm open <deck-name>` works the same — the chat's stage panel shows the deck on the phone over the tunnel. `pnpm stop:remote` tears it all down.

By default `start:remote` uses a Cloudflare quick tunnel (zero config, random `*.trycloudflare.com` URL, SSE not guaranteed stable). For a fixed URL on your own domain + reliable long connections, set up a Cloudflare named tunnel — see [docs/named-tunnel-setup.md](docs/named-tunnel-setup.md). Opt-in via `tunnelName` + `tunnelHostname` in `myconfig.json`; absent → quick tunnel.

`pnpm open` spawns `gulp sd -w` / `gulp ppt -w` / `gulp animation-group -w` for the named deck (or `gulp animation -w` if the name resolves to `examples/animations/<name>.ts`), writes their PIDs so `pnpm close` can clean them up, and writes `/reveal/index.html` into `/tmp/sd-test/preview-url.txt` (the chat client polls that file every 2s). Locally it also `open`s `http://127.0.0.1:8765/` in your browser.

The Bun server injects a 1-line reload poller into every HTML it serves, so watcher rebuilds refresh the iframe automatically — no DevTools "Disable cache" toggle needed.

Full set of commands:

```bash
pnpm open <name>          watch + preview a deck/animation
pnpm close                stop watching + clear preview
pnpm snap <url>            one-shot screenshot (see "Snapshot tool" below)
pnpm start:local          boot the Bun server (auto-called by open)
pnpm stop:local           stop the Bun server
pnpm start:remote         server + cloudflared tunnel + tmux Claude (phone access)
pnpm stop:remote          tear down all of remote
```

### Other tasks

```bash
gulp animation -i examples/animations/<file>.ts -o <output-dir>     # single animation, emit <file>.html + <file>.js
gulp animation -i <file> -w                                          # watch mode
gulp animation -i <file> -l                                          # use local sd.js (at pptOutputPath/sd.js)
gulp animation-group -i <directory> -o <output-dir> [-w]             # walk a dir, bundle each .js/.ts

gulp sd        -o <output-dir>                                       # library bundles
gulp reveal    -o <output-dir>
gulp webslides -o <output-dir>   # IIFE: framework + include-html walker, loaded via <script>
gulp impress   -o <output-dir>   # IIFE: same shape as webslides
gulp element   -o <output-dir>   # IIFE bundle: vanilla HTML can <script src="sd-element.js">

gulp theme   -o <output-dir>     # compile Reveal/css/theme/source/*.scss
```

`myconfig.json` at the repo root (gitignored) holds default `animationOutputPath`, `pptOutputPath`, `releaseOutputPath`. Override per-invocation with `-o`. Manage via `gulp <task>` after first run, or `sd-config <key> <value>`.

## Architecture Notes

### `@sd/core` (packages/core/src/)

- `sd.ts` is the public surface — every visual primitive, color/easing utility, and animation API is re-exported here.
- All visual elements inherit from `SDNode` (`node/node.ts`) and specialize into `SDSVGNode` (`node/svg-node.ts`) / `SDHTMLNode` (`node/html-node.ts`).
- `animate/`: action-based animation. `interp.ts` holds the interpolator implementations (number, color, path, points, matrix...). `action.ts` records intent; `action-list.ts` schedules a timeline; `window.ts` drives stage transitions.
- `node/`: visual primitives, organized by kind — `shape/` (Rect, Circle, Ellipse, Polygon, Image), `path/` (Line, Polyline, Path, PathPen), `text/` (Text, Math), `control/` (Button, Input, Slider), `filter/` (DropShadow, GaussianBlur, ColorMatrix, ...), `other/` (Group, Caption), `define/` (Marker).
- `renderer/`: dual SVG / HTML output via `RenderNode`.
- `math/`, `utility/`, `interact/`: helpers (vectors, easing, color, root canvas, device detection).
- Layout helpers used to live here; they moved to the separate `@sd/layout` package.
- TS path alias inside the package: `@/*` → `packages/core/src/*`.

### `@sd/layout` (packages/layout/src/)

- Exposes one factory: `import { layout } from "@sd/layout"; const L = layout();` returns an object bundling every layout class (`ArrayLayout`, `StackLayout`, `PileLayout`, `BezierLayout`, `CurveLayout`, `VHBezierLayout`, `BraceLayout`, `GridLayout`, `TinyGraphLayout`, `GridGraphLayout`, `BipartiteGraphLayout`, `DAGLayout`, `CenterLayout` + `Center{Content,Rect,Circle,Ellipse}ContentFitLayout`, `AsideLayout`, `BackgroundLayout`, `CircleBackgroundLayout`).
- Source organized by category: `array/`, `curve/`, `graph/` (uses `dagre`), `grid/`, `two-node/`.
- Path alias inside the package: `@/*` resolves to `packages/layout/src/*` first, then `packages/core/src/*` — so layouts can `import * as sd from "@/sd"` the same way core internals do.
- Currently no examples/decks consume it; add `"@sd/layout": "workspace:*"` to your package's deps when you need it.

### `@sd/reveal` (packages/reveal/src/)

- `MyReveal.js` is the bundle entry; ships as global `MyReveal` (UMD).
- Plugins (MathJax2, Codeblock, Chalkboard, SDAnimation, ...) live under `plugin/`.
- Theme SCSS lives under `css/theme/source/`; `gulp theme` compiles them.
- `plugin/SDAnimation.js` drives `<sd-animation>` elements across slide transitions (start/stop the active slide's animations); `MyReveal.js` imports `@sd/element` so the bundle auto-registers the tag.

### `@sd/cli` (packages/cli/src/)

- Each gulp task (`sd.js`, `reveal.js`, `element.js`, `animation.js`, `ppt.js`, `theme.js`, ...) wraps a webpack-stream pipeline.
- `parser.js` holds CLI arg parsing and `myconfig.json` IO.
- HTML templates use a single `<%= base %>` placeholder (".") for self-contained local builds, or the `-d <domain>` value for remote deploys. The animation iframe template lives in `packages/element/src/template.html`; each framework's deck template lives in its own package (`packages/reveal/src/template.html`, etc.).
- The CLI bin scripts (`#!/usr/bin/env node` on `animation.js`, `ppt.js`, `animation-group.js`, `config.js`) are exposed via the root `package.json#bin` as `sd-animation` etc.

## Build Flow

Animation bundles do NOT inline `@sd/core`. Instead:

- `packages/element/src/template.html` loads `sd.js` first (as global `sd`), then the per-animation bundle.
- The per-animation webpack config marks `@/sd` and `slidew` as externals mapping to global `sd`.
- This keeps each animation script tiny (~5-20 KB) and the shared engine cacheable.

PPT bundles work the same way: the framework's `template.html` loads `sd.js` and the framework bundle (`reveal.js` / `webslides.js` / `impress.js`) as globals; each slide's animation is a separate small bundle.

For webslides/impress the framework bundle is fully self-contained (framework + include-html walker + init), so the per-deck `main.js` is an empty stub; for reveal the per-deck `main.js` still carries deck-specific code (e.g. `ThemeManager`).

The `-l` flag tells the CLI to copy `dist/sd.js` (or the framework bundle) from the workspace into the output dir; without `-l`, the HTML loads them from `https://whosejam.site/public/`.

## SD-PPT Animation Style

Default style for animations written in `examples/decks/<deck>/animation/*.ts`. (Future variations may emerge — for now there is one default, applied everywhere.)

### Slide layout

- `<sd-animation>` is a custom element with `:host { display: block }`. Reveal centers text but **not** block children, so each tag must carry `style="margin: 0 auto; width: ...; height: ...;"` to center. Write `margin: 0 auto` first, then the size.

### Animation script defaults

- Get the palette + easings from factories at the top of every file:
  ```ts
  const C = sd.color();
  const E = sd.easing();
  ```
  Use `C.steelBlue` / `E.easeOut`, not `"#4682b4"` / `"easeOut"`. Hex only when the palette has no match.
- **Staggered fade-in entrance.** Layer by visual depth: grid/background → frame → input data → measurement scaffolding → numeric labels. 80–200ms delay per element within a layer, ≥200ms gap between layers. All entrance animations fire concurrently before the first `await sd.pause()`.
- **`await sd.pause()` is a semantic beat, not a timer.** Each pause corresponds to one algorithmic step; the viewer advances with N. End every animation with a trailing `await sd.pause()` so snapshot tools capture the final state and the last beat is pause-able.
- **Visual elements carry algorithmic meaning.** The end state should let a viewer read the answer (Σ area, coverage `n/W`, invariants) without further animation. Don't rely on motion alone — load each element with semantic payload.
- **Background scaffolding is low-presence:** opacity 0.30–0.40, `strokeWidth` 0.6–0.8, `strokeDashArray: [2, 3]`. Fade these in first.

## Snapshot tool

`pnpm snap <url>` stitches per-frame screenshots into one labeled grid PNG via headless chromium. The URL must point at something already being served — `pnpm open <name>` is the easiest way to get a server up.

```bash
pnpm snap /reveal/index.html                    # all slides grid
pnpm snap /reveal/index.html --slide 6          # single slide
pnpm snap /reveal/index.html --from 5 --to 8    # range
pnpm snap /animation/foo.html                   # animation grid of pauses 1-25
pnpm snap /animation/foo.html --pause 7
pnpm snap /animation/foo.html --from 10 --to 14
```

Relative URLs (starting with `/`) resolve against `http://127.0.0.1:8765`. Pass a full URL (incl. the cloudflare tunnel one) to override. The path itself determines mode: `/reveal/` → deck mode, `/animation/` → animation mode.

stdout = absolute PNG path. stderr = browser issues (pageerror + console + network) collected during the run. Exit 0 = clean; exit 1 = errors (PNG still produced).

Implementations: `packages/cli/src/snap.ts` (dispatcher), `snap-deck.ts`, `snap-animation.ts`, `snap-grid.ts` (shared label/stitch helpers).

## Remote chat workflow (when running in tmux from pnpm start:remote)

If `$TMUX` is set you're inside the `claude-dev` session that `pnpm start:remote` boots. The user is on their phone hitting the same Bun server (:8765) you can reach locally — `pnpm start:remote` just adds a cloudflared tunnel pointing at it. Local URL and tunneled URL serve identical paths.

How to show the user something:

- **Live deck or animation** — same commands as locally:

  ```bash
  pnpm open <deck-name>
  pnpm open <animation-name>
  pnpm close
  ```

  Spawns watchers + pushes the URL into the chat's stage panel. Watcher rebuilds refresh the iframe automatically.

- **Static snapshot** — `pnpm snap <url>` writes a PNG to `/tmp/sd-test/snapshots/` and prints its path. Reference it as a markdown image in your chat reply:

  ```
  ![slide 6](/snapshots/<filename>.png)
  ```

  The chat client renders markdown; image appears inline. Relative URLs resolve the same locally and through the tunnel.

- **Status reports** are normal chat messages.

## Loader / Plugin Hoisting

`.npmrc` hoists `*-loader`, `*-webpack-plugin`, `webpack`, and `webpack-stream` to the workspace root `node_modules`. This is needed because `gulpfile.js` is at the workspace root but the per-task webpack configs live in `packages/cli/src/`; without hoisting, webpack-stream (running from cwd = root) cannot resolve loaders that pnpm installed under `packages/cli/node_modules/`.

## Working with the Codebase

### Where to put things

- Add a new visual primitive: drop a file under `packages/core/src/Node/Shape/` (or the appropriate subfolder), then re-export from `packages/core/src/sd.ts`.
- Add a new layout: drop a file under `packages/core/src/Layout/<category>/`, then re-export from `sd.ts`.
- Add a new reveal plugin: drop a file under `packages/reveal/src/plugin/` and register it in `MyReveal.js`.
- New CLI task: add a `.ts` file to `packages/cli/src/`, register it in `gulpfile.ts`, and (if user-facing) add to `package.json#bin`.
- New animation demo: put a `.ts` file under `examples/animations/`, then `gulp animation -i examples/animations/<name>.ts`.

### Working as an AI agent

This repo intentionally stores **no per-agent memory** — every collaboration norm lives in this file. If you learn something the next agent should know (a build trap, a missing flag, a convention), update CLAUDE.md instead of recording it privately.

- **Tool calls:** don't combine queries and writes in a single `Bash` invocation or a single parallel batch. Run queries first, decide, then issue writes. Multiple writes that belong to the same wave (e.g. `mkdir` + `mv` + edit the gitignore) can be merged. Queries are cheap and reversible; writes aren't — see the current state before mutating.
- **Background tasks (watchers, builds, tests):** if one runs noticeably past expected time (>1.5×), report what you're seeing and your guess; silent waiting is a collaboration problem.
- **Don't rely on summary lines.** If a doc references a recipe, dev loop, or build flow, read the actual file before running anything — one-line indexes drop the details that make the recipe correct.
- **Don't add backwards-compat shims** when changing APIs (see Conventions). When in doubt about whether something old is in use, grep — the codebase is small enough.
