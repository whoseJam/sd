# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

This is a pnpm-workspace monorepo. All library code lives under `packages/`; user content lives under `examples/` and `ppt/`.

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
  decks/       Sample PPT decks (former example/)
ppt/
  work/      User lecture decks (algorithm topics)
  题库/      Problem-set mirrors (codeforces, 洛谷, self)
docs/        Markdown notes
gulpfile.js  Workspace-root build entry; tasks live in @sd/cli
```

Cross-package imports go through workspace deps (e.g. `import "@sd/element"`, `import "@sd/reveal/plugin/reveal.css"`). The `@sd/reveal` package.json has an `exports` map (`"./*": "./src/*"`) that makes subpath imports look natural.

The `dist/` outputs from `gulp sd`, `gulp reveal`, `gulp element` are written to whatever path `-o` specifies (or `pptOutputPath` from `myconfig.json`); they are not committed.

## Build and Development Commands

```bash
# Single animation: bundle <file>.ts and emit <file>.html + <file>.js
gulp animation -i examples/animations/<file>.ts -o <output-dir>
gulp animation -i <file> -w                           # watch mode
gulp animation -i <file> -l                           # use local sd.js (assumes it's at pptOutputPath/sd.js)

# Animation group: walk a directory and bundle each .js/.ts entry
gulp animation-group -i <directory> -o <output-dir>
gulp animation-group -i <directory> -w

# Presentation: bundle a deck directory containing ppt.html and per-slide animation scripts
gulp ppt -i <deck-dir> -o <output-dir>
gulp ppt -i <deck-dir> -w
gulp ppt -i <deck-dir> -l                             # use locally-built sd.js / reveal.js

# Library bundles (run individually when you want fresh sd.js / reveal.js / sd-element.js)
gulp sd        -o <output-dir>
gulp reveal    -o <output-dir>
gulp webslides -o <output-dir>   # IIFE: framework + include-html walker, loaded via <script>
gulp impress   -o <output-dir>   # IIFE: same shape as webslides
gulp element   -o <output-dir>   # IIFE bundle: vanilla HTML can <script src="sd-element.js">

# Theme CSS compile (Reveal/css/theme/source/*.scss -> compiled .css)
gulp theme   -o <output-dir>

# Static dev server (serves pptOutputPath via live-server)
gulp serve -p 8080
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

## Snapshot tool (visual feedback for AI agents)

`.claude/tools/sd-snapshot.ts` — drives a built animation HTML through its `sd.pause()` boundaries via headless chromium and stitches the per-pause screenshots into one labeled grid PNG. Relies on `sd.Window.PUPPETEER` (toggles iframe-sizing chatter) and `sd.device().keyDown("N")` (programmatic frame advance) — both exposed via `sd.ts` re-exports of `Window` / `Animate` / `device`.

```bash
# one-time setup
cd .claude/tools && pnpm install --ignore-workspace && npx playwright install chromium

# default: 5×5 grid of pauses 1-25
bun .claude/tools/sd-snapshot.ts <html-path>
# single frame, or a range
bun .claude/tools/sd-snapshot.ts <html-path> --pause 7
bun .claude/tools/sd-snapshot.ts <html-path> --from 10 --to 14
```

stdout = output PNG absolute path (only line). stderr = `pageerror` traces collected during the run, if any. Exit 0 = clean run; exit 1 = errors collected (PNG still produced for partial-state inspection).

## Loader / Plugin Hoisting

`.npmrc` hoists `*-loader`, `*-webpack-plugin`, `webpack`, and `webpack-stream` to the workspace root `node_modules`. This is needed because `gulpfile.js` is at the workspace root but the per-task webpack configs live in `packages/cli/src/`; without hoisting, webpack-stream (running from cwd = root) cannot resolve loaders that pnpm installed under `packages/cli/node_modules/`.

## Working with the Codebase

- Add a new visual primitive: drop a file under `packages/core/src/Node/Shape/` (or appropriate subfolder), then re-export from `packages/core/src/sd.ts`.
- Add a new layout: drop a file under `packages/core/src/Layout/<category>/`, then re-export from `sd.ts`.
- Add a new reveal plugin: drop a file under `packages/reveal/src/plugin/` and register it in `MyReveal.js`.
- New CLI task: add a `.js` file to `packages/cli/src/`, register it in `gulpfile.js`, and (if user-facing) add to `package.json#bin`.
- New animation demo: put a `.ts` file under `examples/animations/`, then `gulp animation -i examples/animations/<name>.ts`.
