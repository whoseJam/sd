# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

This is a pnpm-workspace monorepo. All library code lives under `packages/`; user content lives under `examples/` and `ppt/`.

```
packages/
  core/      @sd/core    Rendering engine (Animate / Node / Layout / Renderer / Math / Utility / Interact)
  reveal/    @sd/reveal  reveal.js integration layer (plugins, MathJax, theme SCSS)
  iframe/    @sd/iframe  IFrame wrapper
  cli/       @sd/cli     Build tasks + CLI entries (sd-animation, sd-animationGroup, sd-ppt, sd-config)
  assets/    @sd/assets  Vendor JS/CSS/fonts (MathJax2/3, snap.svg, dagre, font-awesome)
examples/
  animations/  Single-animation demo scripts (former unit/)
  decks/       Sample PPT decks (former example/)
ppt/
  work/      User lecture decks (algorithm topics)
  题库/      Problem-set mirrors (codeforces, 洛谷, self)
docs/        Markdown notes
gulpfile.js  Workspace-root build entry; tasks live in @sd/cli
```

Cross-package imports go through workspace deps (e.g. `import "@sd/iframe"`, `import "@sd/reveal/plugin/reveal.css"`). The `@sd/reveal` package.json has an `exports` map (`"./*": "./src/*"`) that makes subpath imports look natural.

The `dist/` outputs from `gulp sd`, `gulp reveal`, `gulp iframe` are written to whatever path `-o` specifies (or `pptOutputPath` from `myconfig.json`); they are not committed.

## Build and Development Commands

```bash
# Single animation: bundle <file>.ts and emit <file>.html + <file>.js
gulp animation -i examples/animations/<file>.ts -o <output-dir>
gulp animation -i <file> -w                           # watch mode
gulp animation -i <file> -l                           # use local sd.js (assumes it's at pptOutputPath/sd.js)

# Animation group: walk a directory and bundle each .js/.ts entry
gulp animationGroup -i <directory> -o <output-dir>
gulp animationGroup -i <directory> -w

# Presentation: bundle a deck directory containing ppt.html and per-slide animation scripts
gulp ppt -i <deck-dir> -o <output-dir>
gulp ppt -i <deck-dir> -w
gulp ppt -i <deck-dir> -l                             # use locally-built sd.js / myreveal.js

# Library bundles (run individually when you want fresh sd.js / myreveal.js / iframe.js)
gulp sd      -o <output-dir>
gulp reveal  -o <output-dir>
gulp iframe  -o <output-dir>

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
- `plugin/SDAnimation.js` is the bridge to `@sd/iframe`.

### `@sd/cli` (packages/cli/src/)
- Each gulp task (`sd.js`, `reveal.js`, `iframe.js`, `animation.js`, `ppt.js`, `theme.js`, ...) wraps a webpack-stream pipeline.
- `parser.js` holds CLI arg parsing and `myconfig.json` IO.
- HTML templates for the animation/PPT entry pages (`aniIndex*.html`, `pptIndex*.html`) sit alongside the task files.
- The CLI bin scripts (`#!/usr/bin/env node` on `animation.js`, `ppt.js`, `animationGroup.js`, `config.js`) are exposed via the root `package.json#bin` as `sd-animation` etc.

## Build Flow

Animation bundles do NOT inline `@sd/core`. Instead:
- `aniIndex*.html` loads `sd.js` first (as global `sd`), then the per-animation bundle.
- The per-animation webpack config marks `@/sd` and `slidew` as externals mapping to global `sd`.
- This keeps each animation script tiny (~5-20 KB) and the shared engine cacheable.

PPT bundles work the same way: `pptIndex*.html` loads `sd.js` and `myreveal.js` globals; each slide's animation is a separate small bundle.

The `-l` flag tells the CLI to copy `dist/sd.js` (or `dist/myreveal.js`) from the workspace into the output dir; without `-l`, the HTML loads them from `https://whosejam.site/public/`.

## Loader / Plugin Hoisting

`.npmrc` hoists `*-loader`, `*-webpack-plugin`, `webpack`, and `webpack-stream` to the workspace root `node_modules`. This is needed because `gulpfile.js` is at the workspace root but the per-task webpack configs live in `packages/cli/src/`; without hoisting, webpack-stream (running from cwd = root) cannot resolve loaders that pnpm installed under `packages/cli/node_modules/`.

## Working with the Codebase

- Add a new visual primitive: drop a file under `packages/core/src/Node/Shape/` (or appropriate subfolder), then re-export from `packages/core/src/sd.ts`.
- Add a new layout: drop a file under `packages/core/src/Layout/<category>/`, then re-export from `sd.ts`.
- Add a new reveal plugin: drop a file under `packages/reveal/src/plugin/` and register it in `MyReveal.js`.
- New CLI task: add a `.js` file to `packages/cli/src/`, register it in `gulpfile.js`, and (if user-facing) add to `package.json#bin`.
- New animation demo: put a `.ts` file under `examples/animations/`, then `gulp animation -i examples/animations/<name>.ts`.
