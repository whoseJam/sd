# AGENTS.md

This file is the agent-facing handbook for maintaining the sd codebase itself
(packages, build, release). It is intentionally not a guide for *writing*
slide decks with sd — that role is owned by the `@whosejam/sd-agents` plugin
under `packages/sd-agents/` and the SKILL.md files it ships. If you're trying
to figure out the deck animation conventions or the `pnpm open` workflow,
install that plugin and let the skill load on demand.

## Repository Layout

This is a pnpm-workspace monorepo. Library code lives under `packages/`; user
content lives under `examples/`.

```
packages/
  core/          @whosejam/sd-core          Rendering engine (animate / node / renderer / math / utility / interact)
  layout/        @whosejam/sd-layout        Layout helpers (array / curve / graph / grid / two-node); depends on dagre
  sd/            @whosejam/sd              Public meta-package: re-exports core + layout() factory
  include-html/  @whosejam/sd-include-html  DOM walker that inlines <... include-html="./xxx.html"> attributes
  reveal/        @whosejam/sd-reveal        reveal.js integration layer (plugins, MathJax, theme SCSS)
  webslides/     @whosejam/sd-webslides     WebSlides host (publish-as-source, not compiled)
  impress/       @whosejam/sd-impress       impress.js host (publish-as-source, not compiled)
  element/       @whosejam/sd-element       <sd-animation> custom element that wraps an iframe (host-side embedding)
  cli/           @whosejam/sd-cli           Build tasks + CLI entries (sd-animation, sd-ppt, sd-init, ...)
  assets/        @whosejam/sd-assets        Vendor JS/CSS/fonts (MathJax2/3, snap.svg, dagre, font-awesome, themes, customcontrols)
  sd-agents/     @whosejam/sd-agents        Plugin source + MCP server (deck authoring is owned here)
examples/
  animations/  Single-animation demo scripts
  decks/       Sample decks (each has reveal/ + animation/)
docs/        Markdown notes
gulpfile.ts  Workspace-root build entry; tasks live in @whosejam/sd-cli
```

The five "compiled" packages (`core`, `layout`, `sd`, `include-html`, `element`)
build to `dist/` via tsup with `bundle: true` and `dts: true`. The three
framework packages (`reveal`, `webslides`, `impress`) are partially or fully
publish-as-source because `main.ts` carries per-deck `DOMAIN` substitution
that has to happen at deck build time. `assets` ships vendor blobs as-is.

Cross-package imports go through workspace deps. The public surface for
each compiled package is its `dist/` entry, declared in its `exports` map.

## Conventions

### Code style

- **No `_xxx` naming.** Use TS `private` / `protected` / `public` modifiers.
- **No `any` / `as any`.** Use `as unknown as T` or refactor the API.
- **No backwards-compat hacks.** When changing core APIs, pick the cleanest
  extensible design; breaking changes are fine.
- **No silent fallback to mask bugs.** If you see `if (!foo) return` at the
  bottom of a stack, find the root cause and declare intent at the correct
  layer instead.
- **No timestamp / random-id hacks.** Anything you can make deterministic
  (set diff, explicit handshake, persistent ID) should not lean on
  `mtime` / `birthtime` / time windows / random suffixes to be "close
  enough". These bite at the worst moment.
- **No SCREAMING_SNAKE globals.** Names like `__SD_HASH__` /
  `__SD_BLOB__` (leading + trailing underscores + all caps) are out.
  HTML sentinels use `{{sdHash}}`; JS globals go through a camelCase
  namespace object.
- **Renaming for shadowing:** make the outer name more precise
  (`suffix` → `suffixes`) or rename the import (`path` → `nodePath`). Do
  not shrink to single letters.
- **No abbreviated or single-character names.** Even in small lambdas:
  `for (const item of items)`, not `for (const i of items)`. Prefer
  `pixel` over `PX`, `chunk` over `c`. Exceptions: `x` / `y` for
  coordinates, `i` / `j` in nested loops, `event` is fine but `e` is not.
- **Optional runtime config absences are silent.** If a `__SD_*_URL__` is
  missing, just `return`; no `console.warn`. Visual gaps are obvious.

### Comments

- Default to no comment. Only add one when the WHY is non-obvious (a hidden
  constraint, a workaround, a subtle invariant).
- No section dividers (`// ── XXX ──`). No comments that explain WHAT the
  code does — well-named identifiers do that.
- No em-dash (`—`) in `//` or `/* */` comments. Use a period or a
  parenthetical instead.
- All `//` and `/* */` are in English; Chinese is fine in chat, not in code.

### Formatting / lint

- `pnpm format` = `oxfmt` (printWidth 80, lf) then `oxlint --fix` with
  `perfectionist/sort-imports` (natural asc, type-imports first) and
  `consistent-type-imports`.
- `pnpm format` exit 1 is usually just `no-unused-vars` warnings; read the
  output before assuming a real failure.
- Not auto-sorted: object keys, JSX props, switch cases, names inside
  `{ ... }` of an import.

### Commits

- Default to **one commit per task** bundling all related changes; don't
  split by "logical theme" unless the user asks. Long commit messages are
  fine.
- Don't sweep unrelated files into a commit. `git add -A` after running
  tasks is a frequent source of this. Prefer `git add` with explicit
  paths or `git add -u` for tracked files only.
- No e2e / smoke-test shell scripts committed into `scripts/` or similar.
  Verify in `/tmp` and discard; if a test belongs to the repo, write it
  in `vitest` under the relevant package's `test/` directory.

## Build and Dev

```bash
pnpm install
pnpm -r build              # build every compiled package (tsup)
pnpm -r --parallel dev     # tsup --watch in every compiled package
pnpm format
```

The workspace also exposes `pnpm start` / `pnpm stop` (preview server) and
`pnpm open <name>` / `pnpm close` / `pnpm snap <url>` for invoking a deck.
Those exist for maintainers verifying that packaging changes don't break
the deck pipeline; the **deck authoring** experience itself is documented
in the `@whosejam/sd-agents` plugin's `deck-authoring` skill, not here.

Direct gulp invocations (for one-shot builds, no watcher):

```bash
gulp sd        -o <output-dir>      # core UMD bundle
gulp reveal    -o <output-dir>
gulp webslides -o <output-dir>
gulp impress   -o <output-dir>
gulp element   -o <output-dir>
gulp theme     -o <output-dir>      # compile Reveal/css/theme/source/*.scss
gulp animation       -i <file.ts>   -o <output-dir>
gulp animation-group -i <directory> -o <output-dir>
gulp ppt             -i <deck-reveal-dir> -o <output-dir>
```

`myconfig.json` at the repo root (gitignored) holds default
`animationOutputPath`, `pptOutputPath`, `releaseOutputPath`. Override per
invocation with `-o`. Manage via `sd-config <key> <value>`.

## Architecture Notes

### `@whosejam/sd-core`

- `sd.ts` is the public surface; every visual primitive, color / easing
  utility, and animation API is re-exported here.
- All visual elements inherit from `SDNode` (`node/node.ts`) and specialize
  into `SDSVGNode` / `SDHTMLNode`.
- `animate/`: action-based animation. `interp.ts` holds the interpolator
  implementations; `action.ts` records intent; `action-list.ts` schedules
  a timeline; `window.ts` drives stage transitions.
- `node/`: visual primitives, organized by kind: `shape/`, `path/`,
  `text/`, `control/`, `filter/`, `other/`, `define/`.
- `renderer/`: dual SVG / HTML output via `RenderNode`.
- `math/`, `utility/`, `interact/`: helpers (vectors, easing, color, root
  canvas, device detection).
- TS path alias inside the package: `@/*` → `packages/core/src/*`. The
  tsup config resolves these at build time so the published bundle has
  no `@/*` paths.

### `@whosejam/sd-layout`

- Exposes one factory: `import { layout } from "@whosejam/sd-layout";
  const L = layout();` returns an object bundling every layout class.
- Path alias `@/*` resolves to layout's src first, then core's src, so
  layouts can `import * as sd from "@/sd"`.

### `@whosejam/sd-reveal`

- `reveal.ts` is the framework runtime; tsup-bundles it to
  `dist/reveal.js`.
- `main.ts` is the per-deck wrapper (the `ThemeManager` plus `DOMAIN`
  substitution); stays at `src/` because cli's webpack compiles it per
  deck with deck-specific constants. Same arrangement for webslides /
  impress.
- Plugins (MathJax2, Codeblock, SDAnimation, ...) live under `plugin/`.
- Theme SCSS lives under `css/theme/source/`; cli's `gulp theme`
  compiles them.

### `@whosejam/sd-cli`

- Each gulp task wraps a webpack-stream pipeline that consumes the
  corresponding package's `dist/` output (or `src/` for framework
  packages whose main.ts is per-deck).
- Resolves package locations via `resolvePackageDir(name)` (a
  `createRequire` wrapper). Works identically inside the workspace
  (pnpm symlinks) and downstream of an actual npm install.
- HTML templates use `<%= base %>` for the asset root: `.` for
  self-contained local builds, `-d <domain>` for remote deploys.
- The cli is `bundle: false` under tsup so each src/X.ts compiles to
  dist/X.js one-for-one, preserving bin shebangs and internal imports.
  Bin scripts (`sd-animation`, `sd-ppt`, `sd-init`, ...) ship in
  `dist/`.

### `@whosejam/sd-agents`

- Source for the agent plugin. Skills live as plain markdown under
  `skills/`, the MCP server is `mcp-server.ts`, and `build.mjs` emits
  per-harness layouts to `dist/<harness>/`. The `dist/` is committed
  (whitelist in `.gitignore`) so users can install without a build.

## Build Flow

Animation bundles do NOT inline `@whosejam/sd-core`.

- The animation template (`packages/element/src/template.html`) loads
  `sd.js` first as global `sd`, then the per-animation bundle.
- The per-animation webpack config marks `@/sd` and `@whosejam/sd` as
  externals mapping to global `sd`.
- Each animation script stays ~5–20 KB; the shared engine is one cached
  download.

Deck bundles work the same way: the framework's `template.html` loads
`sd.js` and the framework bundle as globals; each slide's animation is
its own small bundle.

For webslides / impress the framework bundle is fully self-contained
(framework + include-html walker + init), so the per-deck `main.js` is
empty. For reveal the per-deck `main.js` still carries deck-specific
code (`ThemeManager`).

Every gulp task copies `dist/sd.js` (and framework bundles, for ppt)
next to the output, and the emitted HTML loads them via a relative
`<%= base %>/sd.js`. Builds are self-contained. Pass `-d <domain>` to
make `base` absolute (remote deploys).

## Loader / Plugin Hoisting

`.npmrc` hoists `*-loader`, `*-webpack-plugin`, `webpack`, and
`webpack-stream` to the workspace root `node_modules`. This is needed
because `gulpfile.ts` is at the workspace root but the per-task webpack
configs live in `packages/cli/src/`; without hoisting, webpack-stream
(running from cwd = root) cannot resolve loaders that pnpm installed
under `packages/cli/node_modules/`.

## Working with the Codebase

### Where to put things

- Add a new visual primitive: drop a file under
  `packages/core/src/node/shape/` (or the appropriate subfolder), then
  re-export from `packages/core/src/sd.ts`.
- Add a new layout: drop a file under
  `packages/layout/src/<category>/`, then add it to the bag returned by
  `layout()` in `packages/layout/src/index.ts`.
- Add a new reveal plugin: drop a file under
  `packages/reveal/src/plugin/` and register it in `reveal.ts`.
- New cli task: add a `.ts` file under `packages/cli/src/`, register it
  in `define-tasks.ts`. If it's user-facing, add to
  `packages/cli/package.json#bin`.
- New animation demo: put a `.ts` file under `examples/animations/`,
  then `gulp animation -i examples/animations/<name>.ts`.

### Working as an AI agent

This repo splits agent-facing knowledge across three layers; use the
right one:

- **AGENTS.md (this file)** — repo maintenance: layout, conventions,
  build flow, architecture. Visible to anyone in the repo.
- **`packages/sd-agents/skills/`** — deck authoring: animation style,
  runtime API, dev loop commands. Distributed via the sd-agents plugin
  and reachable in any harness that installs it.
- **`~/.claude/projects/<this-repo>/memory/`** — user-private
  preferences for whosejam (branch naming, agent output style,
  workflow specifics). Not shared with external contributors.

If you learn something cross-cutting the next agent should know:
- If it's about how the codebase is structured / built → here.
- If it's about how to write decks → into `sd-agents/skills/`,
  regenerate `dist/` with `pnpm gen`.
- If it's about whosejam's personal workflow → memory.

Other notes:

- **Tool calls:** don't combine queries and writes in a single `Bash`
  invocation or a single parallel batch. Run queries first, decide,
  then issue writes. Multiple writes that belong to the same wave can
  be merged.
- **Background tasks (watchers, builds, tests):** if one runs noticeably
  past expected time (>1.5×), report what you're seeing and your guess.
  Silent waiting is a collaboration problem.
- **Don't rely on summary lines.** If a doc references a recipe or
  flow, read the actual file before running anything. One-line indexes
  drop the details that make the recipe correct.
