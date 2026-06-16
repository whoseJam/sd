---
title: sd runtime API reference
trigger: Use when calling any sd.X identifier in a deck animation file, looking up the public surface of @whosejam/sd, choosing between Node subclasses, or picking a layout class from the layout() factory.
priority: high
---

# sd runtime API

Everything in this skill is reachable via `import * as sd from "@whosejam/sd"`. The meta-package re-exports all of `@whosejam/sd-core` flat plus the `layout()` factory from `@whosejam/sd-layout`.

## Root canvas and lifecycle

```ts
const svg = sd.svg();            // root canvas, math y-up
sd.main(async () => { ... });    // entry: runs the animation
await sd.pause();                // semantic beat between steps
```

`sd.main` registers an animation that the host (`<sd-animation>`) drives. Within `main`, every `await sd.pause()` is one step the viewer advances with N.

## Palette and easings

```ts
const palette = sd.color();
const easings = sd.easing();

palette.steelBlue; // SDColor: named palette entries
palette.muted; // semantic groups
easings.easeOut; // named curves
easings.easeInOut;
easings.linear;
```

Never reach for hex literals or string easing names. The factories exist so a deck stays visually coherent.

## Nodes

All visual primitives inherit from `SDNode`. Every node has a parent set via constructor (`{ targetNode: svg }`), is positioned with `setCx` / `setCy` (math-y-up coordinates), has `startAnimate()` / `endAnimate()` to wrap a transition, and chains setters (every setter returns `this`).

### Shapes

```
sd.Rect       sd.Circle     sd.Ellipse
sd.Polygon    sd.Image
```

Example:

```ts
const rectangle = new sd.Rect({ targetNode: svg, x: 0, y: 0, w: 100, h: 50 })
  .setStrokeWidth(2)
  .setFill(palette.steelBlue);
```

`Rect`'s `y` is the bottom edge (math y-up).

### Paths

```
sd.Line       sd.Polyline    sd.Path    sd.PathPen
```

`PathPen` is the imperative drawing API: `pen.moveTo(...).lineTo(...).curveTo(...)` etc. `Path` is the data-driven version (give it the final path string).

### Text

```
sd.Text       sd.Math
```

`Math` renders MathJax (TeX source). `Text` is plain.

### Controls (interactive demos)

```
sd.Button    sd.Input    sd.Slider
```

Used in interactive figures; rarely needed in a normal deck.

### Filters and effects

```
sd.Filter           sd.GaussianBlur    sd.DropShadow
sd.ColorMatrix      sd.Offset          sd.Composite       sd.Blend
sd.Marker           // <marker> definition for arrowheads etc.
```

### Containers

```
sd.Group            // group of nodes, transformed together
sd.Caption          // labeled enclosure
```

## Animation primitives

```
sd.Animate          // low-level: one animated property over a duration
sd.Action           // a callable that records intent
sd.Window           // stage/timeline window
sd.CONTINUE_STAGE   // sentinel: keep current stage
```

Most decks don't construct these directly. The high-level pattern is `node.startAnimate().setX(...).endAnimate()`. Reach for `Animate` directly only when you need a custom interpolator.

## Math utilities

```
sd.Vector / sd.vec(x, y)     // 2D vector type + constructor
sd.mapTo                     // linear remap helper
sd.rand                      // seeded random
```

## Layout factory

```ts
const Layout = sd.layout();
const grid = new Layout.GridLayout(...);
```

The `layout()` factory returns a bag of layout classes. Pick one by intent:

```
ArrayLayout    StackLayout    PileLayout              // 1D arrangements
BezierLayout   CurveLayout    VHBezierLayout          // smooth curves
BraceLayout                                           // mathematical brace
GridLayout                                            // 2D grid
TinyGraphLayout    GridGraphLayout    DAGLayout       // graph drawing
BipartiteGraphLayout
CenterLayout         + CenterContentFitLayout,        // centered, optionally sized to fit content
                       CenterRectContentFitLayout,
                       CenterCircleContentFitLayout,
                       CenterEllipseContentFitLayout
AsideLayout                                           // node beside another node
BackgroundLayout    CircleBackgroundLayout            // node wrapping another node
```

Most algorithm decks lean heavily on `GridLayout` (for tables / arrays) and the graph layouts (`DAGLayout` for `dagre`-driven arrangement).

## Utility

```
sd.init / sd.inter / sd.make1d / sd.make2d / sd.loopUpdate
sd.input            // stdin-style read for interactive demos
sd.trim
sd.device           // device-info object
```

## Type exports

For consumers needing explicit types:

```
sd.SDNode           sd.SDNodeWithRadius
sd.BoxNode          sd.SizedBoxNode
sd.SDColor          sd.SDHEXColor       sd.SDRGBColor
sd.SDRGBAColor      sd.SDPacketColor    sd.SDLiteralColor
sd.SDAllColor
```
