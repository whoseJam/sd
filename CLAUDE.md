# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

This is a pnpm-workspace monorepo. All library code lives under `packages/`; user content lives under `examples/`.

```
packages/
  core/       @sd/core       Rendering engine (Animate / Node / Layout / Renderer / Math / Utility / Interact)
  reveal/     @sd/reveal     reveal.js integration layer (plugins, MathJax, theme SCSS)
  webslides/  @sd/webslides  WebSlides host: framework + include-html walker, shipped as IIFE bundle
  impress/    @sd/impress    impress.js host: framework + include-html walker, shipped as IIFE bundle
  element/    @sd/element    <sd-animation> custom element that wraps an iframe (host-side embedding)
  cli/        @sd/cli        Build tasks + CLI entries (sd-animation, sd-animation-group, sd-ppt, sd-config)
  assets/     @sd/assets     Vendor JS/CSS/fonts (MathJax2/3, snap.svg, dagre, font-awesome, themes, customcontrols)
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

### Develop a deck locally (the canonical loop)

Decks under `examples/decks/<name>/` are split: `reveal/` holds `ppt.html` + slide HTML; `animation/` holds the per-slide bundles. The slide HTML references its bundle via `<sd-animation src="../../animation/<name>/<name>.js">`, so the two trees must land at sibling output paths.

Run these **four in background**:

```bash
gulp sd -w                                                                          # rebuild dist/sd.js on core changes
gulp ppt           -i examples/decks/<deck>/reveal    -o /tmp/sd-test/reveal -l -w  # deck HTML + reveal bundle
gulp animation-group -i examples/decks/<deck>/animation -o /tmp/sd-test/animation -l -w  # per-slide animation bundles
gulp serve -o /tmp/sd-test -p 8765                                                  # live-server: no-cache + page auto-reload
```

`-l` copies the locally-built `sd.js` / `reveal.js` into the output dir (otherwise the HTML loads them from `https://whosejam.site/public/`).

Browser: **http://127.0.0.1:8765/reveal/index.html** — and **in DevTools turn on "Disable cache"**. Chrome's in-memory cache for `<sd-animation>` iframes survives `Cache-Control: no-store`; live-server's WebSocket-triggered full-page reload (fired when any file under `-o` changes) is what reliably flushes those iframes. A dumb static server (`npx http-server`, `python -m http.server`) does NOT work here — no auto-reload means the iframe sits on the old bundle indefinitely.

If `gulp` isn't on PATH, prefix with `pnpm exec`.

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

- `sd.ts` is the public surface — every visual primitive, layout, and utility is re-exported here.
- All visual elements inherit from `SDNode` (`Node/SDNode.ts`, ~450 LOC) and specialize into `SDHTMLNode` / `SDSVGNode`.
- Reactive system lives under `Node/Core/`.
- `Animate/`: action-based animation. `Interp.ts` holds the interpolator implementations (number, color, path, points, matrix...). `Action.ts` records intent; `ActionList.ts` schedules a timeline; `Window.ts` drives stage transitions.
- `Layout/`: `Array/` (Stack, Pile), `Curve/` (Bezier, Brace), `Graph/` (DAG, Bipartite), `Grid/`, `TwoNode/`.
- `Renderer/`: dual SVG / HTML output via `RenderNode`.
- TS path alias inside the package: `@/*` → `packages/core/src/*`.

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

## Snapshot tools (visual feedback for AI agents)

Two tools under `.claude/tools/`, both stitch per-frame screenshots into one labeled grid PNG via headless chromium. Shared helpers (static server, label SVG, grid stitcher) live in `.claude/tools/grid.ts`.

`sd-animation-snapshot.ts` — drives a built animation HTML through its `sd.pause()` boundaries. Relies on `sd.Window.PUPPETEER` (toggles iframe-sizing chatter) and `sd.device().keyDown("N")` (programmatic frame advance) — both exposed via `sd.ts` re-exports of `Window` / `Animate` / `device`.

`sd-ppt-snapshot.ts` — drives a built deck (reveal / webslides / impress) through every slide and screenshots each at its initial state (no per-iframe pause advance). Auto-detects the framework from window globals: `Reveal` (set explicitly by `packages/reveal/src/reveal.ts`), `ws` (set by `packages/webslides/src/main.ts`), or `impress`. Idle wait per slide defaults to 300ms for reveal/webslides and 1100ms for impress (transitionDuration is 1000ms).

```bash
# one-time setup
cd .claude/tools && pnpm install --ignore-workspace && npx playwright install chromium

# animations: default 5×5 grid of pauses 1-25
bun .claude/tools/sd-animation-snapshot.ts <html-path>
bun .claude/tools/sd-animation-snapshot.ts <html-path> --pause 7
bun .claude/tools/sd-animation-snapshot.ts <html-path> --from 10 --to 14

# decks: default = all slides
bun .claude/tools/sd-ppt-snapshot.ts <deck/index.html>
bun .claude/tools/sd-ppt-snapshot.ts <deck/index.html> --slide 3
bun .claude/tools/sd-ppt-snapshot.ts <deck/index.html> --from 5 --to 8
bun .claude/tools/sd-ppt-snapshot.ts <deck/index.html> --idle 1500
```

stdout = output PNG absolute path (only line). stderr = `pageerror` traces collected during the run, if any. Exit 0 = clean run; exit 1 = errors collected (PNG still produced for partial-state inspection).

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
