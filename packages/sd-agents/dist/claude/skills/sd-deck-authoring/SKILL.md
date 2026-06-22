---
name: "sd-deck-authoring"
description: |
  Use when writing or modifying an animation file under examples/decks/<deck>/animation/ or examples/animations/, when invoking pnpm open / close / snap to preview a deck, or when answering questions about the slide layout convention, palette / easing factories, pause semantics, or label discipline for sd decks.
---

# Writing sd deck animations

This skill covers the entire workflow of authoring a deck animation in sd: how the slide tag has to be set up so it centers correctly, what factories every animation file pulls from, how the staggered entrance and `await sd.pause()` beat structure work, the size-before-center trap, and the label / narrative-text discipline that distinguishes a deck from a tech demo.

For invoking the dev loop (start watchers, take screenshots), use the `sd_open` / `sd_close` / `sd_snap` MCP tools. They are the agentic equivalents of `pnpm open <name>` / `pnpm close` / `pnpm snap <url>`.

## Slide layout

`<sd-animation>` is a custom element with `:host { display: block }`. Reveal centers text but not block children, so each tag must carry `style="margin: 0 auto; width: ...; height: ...;"` to center. Write `margin: 0 auto` first, then the size:

```html
<sd-animation
  src="../animation/intro.js"
  style="margin: 0 auto; width: 600px; height: 360px;"
></sd-animation>
```

## Coordinates: math y-up

`sd.svg()` uses math coordinates, not SVG defaults. Higher `y` is higher on the screen. `Rect`'s `y` is the _bottom_ edge (mathematicians read shapes from the bottom up). When porting an effect from raw SVG code, flip the y-axis logic.

## Animation script defaults

At the top of every file:

```ts
import * as sd from "@whosejam/sd";

const C = sd.color();
const E = sd.easing();
```

Use `C.steelBlue` / `E.easeOut`, never `"#4682b4"` / `"easeOut"` literals. Hex only when the palette has no match.

### Staggered fade-in entrance

Layer by visual depth and fire all entrance animations concurrently before the first `await sd.pause()`:

1. grid / background (fade in first, lowest opacity)
2. frame
3. input data
4. measurement scaffolding
5. numeric labels

Within a layer, stagger each element 80–200ms. Between layers, leave a gap of at least 200ms. Background scaffolding is low-presence: opacity `0.30–0.40`, `strokeWidth: 0.6–0.8`, `strokeDashArray: [2, 3]`.

### `await sd.pause()` is a semantic beat, not a timer

Each pause is one algorithmic step. The viewer advances with the N key. Don't sprinkle pauses to "slow things down"; sprinkle them where the algorithm has a meaningful step boundary. End every animation with a trailing `await sd.pause()` so snapshot tools capture the final state and the last beat is pause-able.

### Visual elements carry algorithmic meaning

The end state should let a viewer read the answer (Σ area, coverage `n/W`, invariants) without further animation. Don't rely on motion alone; load each element with semantic payload.

### Loops attach at node CENTER

When drawing a self-loop or a loop attached to a node, the loop's _bottom_ should land on the node's center (`loop.cy = node.y + LOOP_R`), not externally tangent to the node's top edge. Loops are read as "this node points to itself"; anchoring at the center lets the eye follow the arrow without crossing the node boundary.

### Size before center

`setText` / `setFontSize` / `setWidth` commit the new size to `attributes` synchronously, and `setCx` reads that size to compute the x-offset. Always size first, then center:

```ts
text.setText("world").setCx(p[0]).setCy(p[1]); // correct
text.setCx(p[0]).setCy(p[1]).setText("world"); // bug: center drifts by (newW − oldW) / 2
```

## Label discipline

### No narrative text in animations

Caption text, running counters, summary sentences, state read-outs: all of these belong on the slide (the surrounding `<p>` / `<h2>`), not in the animation. The animation is structure; the prose is container. If you find yourself thinking "the animation needs to explain X", the right move is almost always to put X as a slide sentence, not as an `sd.Text` inside the animation.

### Even structural labels should be aggressively dropped

Version numbers like `v_i`, tag annotations like `root[l]`, single-letter algorithmic identifiers like `S` / `M` / `u` / `v`: if position, color, or order already disambiguates the elements, drop the label. Same goes for groups of homogeneous objects: one example with a label, the rest unlabelled, is usually enough.

The cumulative effect: an sd animation should feel like a diagram in a paper, not a labeled simulator. Less ink, more meaning per pixel.

## Directory conventions

Per-deck shared helpers go in `animation/common/`, not `_/` or `shared/`. The `common/` name is consistent across the deck library.

## Dev loop

Local preview workflow (the `sd_*` MCP tools wrap these):

```
sd_open(target: "<deck-or-animation-name>")
  Spawns gulp watchers (sd, reveal, animation-group) and opens the deck
  or standalone animation in your browser. Keep the watchers alive while
  iterating; rebuilds reload automatically.

sd_close()
  Stops the watchers. Run before switching to a different deck.

sd_snap(url: "/reveal/index.html" | "/animation/<name>.html", ...)
  Headless chromium screenshot, returns a PNG path. Args:
    slide: <n>            single slide
    pause: <n>            single animation pause
    from: <n>, to: <n>    range (slides or pauses)
  Output: stdout = absolute PNG path. stderr = any browser console /
  network issues that happened during the run.
```

When iterating on a single animation, prefer `sd_snap` with a specific `--pause` rather than full grids; it is faster and easier to compare.

## Common traps

- **Bundle inflates because of an unmarked import.** Each animation webpack config externalizes `@/sd` and `@whosejam/sd` to the global `sd`. If you import sd via any other name (e.g. a relative path), the engine gets re-bundled into the animation script (5 KB → 500 KB).
- **Slide HTML and animation file out of sync.** The slide references `<sd-animation src="../animation/<name>.js">`. After a rename, both sides must move together.
- **`gulp ppt` after `gulp sd` in single-shot mode wipes `dist/sd.js`.** `ppt`'s cleanup nukes the output dir before re-emitting. In watch mode this is invisible because `gulp sd -w` re-emits immediately. When verifying with one-shot calls, run sd then animation, not sd then ppt then animation.
