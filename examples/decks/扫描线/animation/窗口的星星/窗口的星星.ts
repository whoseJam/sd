import * as sd from "@/sd";

import { gridHelpers } from "../grid";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// The reduction in one picture: a W×H window's bottom-left anchor at (a, b)
// sees star (sx, sy) iff a ∈ [sx-W+1, sx] and b ∈ [sy-H+1, sy]. That set of
// valid anchors is a W×H rectangle per star. "Max stars in any window
// position" = "max overlap of those rectangles" — handed straight to a
// sweepline.
const GRID_W = 14;
const GRID_H = 8;
const { UNIT, gx, gy } = gridHelpers(GRID_W, GRID_H, 30);

const WIN_W = 4;
const WIN_H = 3;
// Each star's anchor region is [sx-W, sx] × [sy-H, sy]; keep stars at
// sx ≥ 5 / sy ≥ 4 so no region touches the grid border.
const stars: [number, number][] = [
  [5, 4],
  [6, 6],
  [8, 5],
  [10, 7],
  [11, 4],
  [13, 6],
];

const STAR_INK = C.gold;
const STAR_LIT = C.crimson;
const WIN_INK = C.steelBlue;
const REGION_INK = C.orange;
const TEXT_NEUTRAL = C.darkButtonGrey;
const GRID_INK = C.silver;

const gridV: sd.Line[] = [];
const gridH: sd.Line[] = [];
const starNodes: sd.Polygon[] = [];

let frame: sd.Rect;
let win: sd.Rect;
let countText: sd.Text;

const PIN_SEEN = { "seen ": "seen " };

// sd-element's flush pass (used for measuring iframe size) accumulates every
// beat's actions into one list. To stay under the partial-overlap check, every
// per-beat fill morph on a star (and every per-beat setText on the readout)
// has to land on the same (delay, duration) — identical ranges merge instead
// of throwing. Hold these centrally so future edits stay aligned.
const LIT_DELAY = 100;
const LIT_DUR = 360;
const READ_DELAY = 200;
const READ_DUR = 260;

function starPoints(
  cx: number,
  cy: number,
  rOut: number,
  rIn = rOut * 0.42,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const a = Math.PI / 2 - (i * Math.PI) / 5;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

function inWindow(wx: number, wy: number, sx: number, sy: number) {
  return sx >= wx && sx <= wx + WIN_W && sy >= wy && sy <= wy + WIN_H;
}

function seen(wx: number, wy: number) {
  let n = 0;
  for (const [sx, sy] of stars) if (inWindow(wx, wy, sx, sy)) n++;
  return n;
}

sd.init(() => {
  for (let i = 1; i < GRID_W; i++) {
    gridV.push(
      new sd.Line({
        targetNode: svg,
        x1: gx(i),
        y1: gy(0),
        x2: gx(i),
        y2: gy(GRID_H),
        stroke: GRID_INK,
        strokeWidth: 0.8,
        strokeDashArray: [2, 3],
        opacity: 0,
      }),
    );
  }
  for (let j = 1; j < GRID_H; j++) {
    gridH.push(
      new sd.Line({
        targetNode: svg,
        x1: gx(0),
        y1: gy(j),
        x2: gx(GRID_W),
        y2: gy(j),
        stroke: GRID_INK,
        strokeWidth: 0.8,
        strokeDashArray: [2, 3],
        opacity: 0,
      }),
    );
  }

  frame = new sd.Rect({
    targetNode: svg,
    x: gx(0),
    y: gy(0),
    width: GRID_W * UNIT,
    height: GRID_H * UNIT,
    fill: C.none,
    stroke: C.silver,
    strokeWidth: 1.5,
    opacity: 0,
  });

  for (const [x, y] of stars) {
    starNodes.push(
      new sd.Polygon({
        targetNode: svg,
        points: starPoints(gx(x), gy(y), 9),
        fill: STAR_INK,
        stroke: C.darkButtonGrey,
        strokeWidth: 0.5,
        opacity: 0,
      }),
    );
  }

  countText = new sd.Text({
    targetNode: svg,
    text: "seen 0",
    x: gx(GRID_W) + 14,
    cy: gy(GRID_H / 2),
    fontSize: 16,
    fill: TEXT_NEUTRAL,
    opacity: 0,
  });
});

sd.main(async () => {
  for (let i = 0; i < gridV.length; i++) {
    gridV[i]
      .startAnimate({ delay: i * 8, duration: 220, easing: E.easeOut })
      .setOpacity(0.35)
      .endAnimate();
  }
  for (let j = 0; j < gridH.length; j++) {
    gridH[j]
      .startAnimate({ delay: 60 + j * 16, duration: 220, easing: E.easeOut })
      .setOpacity(0.35)
      .endAnimate();
  }
  frame
    .startAnimate({ delay: 220, duration: 400, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  for (let i = 0; i < starNodes.length; i++) {
    starNodes[i]
      .startAnimate({ delay: 400 + i * 80, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  countText
    .startAnimate({ delay: 900, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  await sd.pause();

  // Window enters with its anchor dot — the dot is the algorithmically meaningful point,
  // not the window's center.
  const initWX = 1;
  const initWY = 1;
  win = new sd.Rect({
    targetNode: svg,
    x: gx(initWX),
    y: gy(initWY),
    width: WIN_W * UNIT,
    height: WIN_H * UNIT,
    fill: WIN_INK,
    fillOpacity: 0.12,
    stroke: WIN_INK,
    strokeWidth: 2,
    opacity: 0,
  });
  // entrance + retreat must share the same (delay, duration) on opacity —
  // flush-mode action accumulation otherwise sees a partial overlap.
  win
    .startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  litStars(initWX, initWY);
  countText
    .startAnimate({ delay: READ_DELAY, duration: READ_DUR, easing: E.easeOut })
    .setText(`seen ${seen(initWX, initWY)}`, PIN_SEEN)
    .endAnimate();

  await sd.pause();

  // Drag the anchor around — each stop is a different (a, b). Stars inside the window
  // glow crimson, count morphs to match. The eye internalizes "anchor → visibility".
  const stops: [number, number][] = [
    [4, 2],
    [6, 3],
    [8, 4],
  ];
  for (const [wx, wy] of stops) {
    win
      .startAnimate({ duration: 600, easing: E.easeInOut })
      .setX(gx(wx))
      .setY(gy(wy))
      .endAnimate();
    litStars(wx, wy);
    countText
      .startAnimate({
        delay: READ_DELAY,
        duration: READ_DUR,
        easing: E.easeOut,
      })
      .setText(`seen ${seen(wx, wy)}`, PIN_SEEN)
      .endAnimate();
    await sd.pause();
  }

  // Flip the picture: hide the window, pick one star, and reveal the set of anchors
  // that would have seen it — a W×H rectangle. That's the per-star contribution.
  win
    .startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
  // Reset every non-focus star to dim — touching the focus star here would create
  // an overlapping fill action with the lit transition below (partial overlap on the
  // same attr is a hard throw in sd's action list).
  const focusIdx = 0;
  for (let i = 0; i < starNodes.length; i++) {
    if (i === focusIdx) continue;
    starNodes[i]
      .startAnimate({ delay: LIT_DELAY, duration: LIT_DUR, easing: E.easeOut })
      .setFill(STAR_INK)
      .endAnimate();
  }
  countText
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();

  const [fsx, fsy] = stars[focusIdx];
  starNodes[focusIdx]
    .startAnimate({ delay: LIT_DELAY, duration: LIT_DUR, easing: E.easeOut })
    .setFill(STAR_LIT)
    .endAnimate();
  // Closed interval: anchor seeing (sx, sy) ⇔ a ∈ [sx-W, sx] × [sy-H, sy].
  // The region's TOP-RIGHT corner is the star itself.
  const focusRegion = new sd.Rect({
    targetNode: svg,
    x: gx(fsx - WIN_W),
    y: gy(fsy - WIN_H),
    width: WIN_W * UNIT,
    height: WIN_H * UNIT,
    fill: REGION_INK,
    fillOpacity: 0,
    stroke: REGION_INK,
    strokeWidth: 1.5,
    strokeOpacity: 0,
  });
  focusRegion
    .startAnimate({ delay: 320, duration: 500, easing: E.easeOut })
    .setFillOpacity(0.3)
    .setStrokeOpacity(0.9)
    .endAnimate();

  await sd.pause();

  // Window re-enters at the circle's start point — a beat on its own so the
  // viewer registers "the anchor is back inside the region" before the orbit.
  // r < min(WIN_W, WIN_H)/2 so the circle stays interior, not flush with the
  // region edge.
  const cxr = fsx - WIN_W / 2;
  const cyr = fsy - WIN_H / 2;
  const r = 1;
  const startAngle = Math.PI;
  const pointAt = (theta: number): [number, number] => [
    cxr + r * Math.cos(theta),
    cyr + r * Math.sin(theta),
  ];

  const [sxStart, syStart] = pointAt(startAngle);
  win
    .startAnimate({ duration: 0 })
    .setX(gx(sxStart))
    .setY(gy(syStart))
    .endAnimate();
  win
    .startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(0.55)
    .endAnimate();

  await sd.pause();

  // Orbit a true circle interior to the region — window stays entirely inside.
  win.tween({
    duration: 2000,
    easing: E.linear,
    bounds: {
      x: [gx(cxr - r), gx(cxr + r) + WIN_W * UNIT],
      y: [gy(cyr - r), gy(cyr + r) + WIN_H * UNIT],
    },
    fn: (t) => {
      const [x, y] = pointAt(startAngle + t * 2 * Math.PI);
      return { x: gx(x), y: gy(y) };
    },
  });

  await sd.pause();

  // Window retreats, then every remaining star's anchor rectangle fades in —
  // the forest of orange rectangles is what the next slide's sweep consumes.
  win
    .startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
  for (let i = 0; i < stars.length; i++) {
    if (i === focusIdx) continue;
    const [sx, sy] = stars[i];
    const r = new sd.Rect({
      targetNode: svg,
      x: gx(sx - WIN_W),
      y: gy(sy - WIN_H),
      width: WIN_W * UNIT,
      height: WIN_H * UNIT,
      fill: REGION_INK,
      fillOpacity: 0,
      stroke: REGION_INK,
      strokeWidth: 1.2,
      strokeOpacity: 0,
    });
    r.startAnimate({ delay: i * 100, duration: 420, easing: E.easeOut })
      .setFillOpacity(0.18)
      .setStrokeOpacity(0.5)
      .endAnimate();
  }

  await sd.pause();
});

function litStars(wx: number, wy: number) {
  for (let i = 0; i < stars.length; i++) {
    const [sx, sy] = stars[i];
    starNodes[i]
      .startAnimate({ delay: LIT_DELAY, duration: LIT_DUR, easing: E.easeOut })
      .setFill(inWindow(wx, wy, sx, sy) ? STAR_LIT : STAR_INK)
      .endAnimate();
  }
}
