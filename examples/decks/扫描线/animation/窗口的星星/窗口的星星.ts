import * as sd from "@/sd";
import { gridHelpers } from "../grid";

const svg = sd.svg();
const C = sd.color();

// Show stars, then a W×H window with its bottom-left anchor marked. Slide
// the window to make the anchor↔inside-stars connection physical, then
// reveal the equivalent "anchor region" rectangle for one star (window
// translated so its top-right hits that star), then for all stars. The
// punchline of the next animation is that scanning these rectangles
// equals counting stars-in-window for every anchor position.
const GRID_W = 14;
const GRID_H = 8;
const { UNIT, gx, gy } = gridHelpers(GRID_W, GRID_H, 36);

const WIN_W = 4;
const WIN_H = 3;
const stars = [
  [3, 2],
  [5, 5],
  [6, 3],
  [8, 6],
  [9, 4],
  [11, 5],
];

const starNodes = [];

sd.init(() => {
  new sd.Rect({
    targetNode: svg,
    x: gx(0),
    y: gy(0),
    width: GRID_W * UNIT,
    height: GRID_H * UNIT,
    fill: C.none,
    stroke: "#d0d0d0",
    strokeWidth: 1,
  });

  stars.forEach(([x, y]) => {
    starNodes.push(
      new sd.Circle({
        targetNode: svg,
        cx: gx(x),
        cy: gy(y),
        r: 5,
        fill: "#444",
      }),
    );
  });
});

sd.main(async () => {
  await sd.pause();

  // Window with its bottom-left anchor as a red dot — slide it through a
  // couple of positions so the rule "anchor at (a, b) ⇒ stars in [a, a+W)
  // × [b, b+H) are visible" reads off the picture.
  const win = new sd.Rect({
    targetNode: svg,
    x: gx(1),
    y: gy(1),
    width: WIN_W * UNIT,
    height: WIN_H * UNIT,
    fill: "#4a90e2",
    fillOpacity: 0.12,
    stroke: "#4a90e2",
    strokeWidth: 2,
    opacity: 0,
  });
  const anchor = new sd.Circle({
    targetNode: svg,
    cx: gx(1),
    cy: gy(1),
    r: 6,
    fill: "#f14c4c",
    opacity: 0,
  });
  win.startAnimate({ duration: 400 }).setOpacity(1).endAnimate();
  anchor.startAnimate({ duration: 400 }).setOpacity(1).endAnimate();
  await sd.pause();

  const stops = [
    [4, 2],
    [6, 3],
  ];
  for (const [wx, wy] of stops) {
    win.startAnimate({ duration: 600 }).setX(gx(wx)).setY(gy(wy)).endAnimate();
    anchor.startAnimate({ duration: 600 }).setCx(gx(wx)).setCy(gy(wy)).endAnimate();
    await sd.pause();
  }

  // For one star: every anchor position (a, b) with a ∈ [sx-W+1, sx] and
  // b ∈ [sy-H+1, sy] sees that star. Reveal that region as a translucent
  // box so the viewer sees the same area swept by anchor positions.
  const [sx, sy] = stars[2];
  const region = new sd.Rect({
    targetNode: svg,
    x: gx(sx - WIN_W + 1),
    y: gy(sy - WIN_H + 1),
    width: WIN_W * UNIT,
    height: WIN_H * UNIT,
    fill: "#f58617",
    fillOpacity: 0,
    stroke: "#f58617",
    strokeWidth: 1.5,
    strokeOpacity: 0,
  });
  region
    .startAnimate({ duration: 600 })
    .setFillOpacity(0.25)
    .setStrokeOpacity(0.8)
    .endAnimate();
  await sd.pause();

  // And the same region for every other star.
  for (let i = 0; i < stars.length; i++) {
    if (i === 2) continue;
    const [x, y] = stars[i];
    const r = new sd.Rect({
      targetNode: svg,
      x: gx(x - WIN_W + 1),
      y: gy(y - WIN_H + 1),
      width: WIN_W * UNIT,
      height: WIN_H * UNIT,
      fill: "#f58617",
      fillOpacity: 0,
      stroke: "#f58617",
      strokeWidth: 1.5,
      strokeOpacity: 0,
    });
    r
      .startAnimate({ duration: 500 })
      .setFillOpacity(0.18)
      .setStrokeOpacity(0.5)
      .endAnimate();
  }
});
