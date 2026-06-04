import * as sd from "@/sd";
import { gridHelpers } from "../grid";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Star → anchor-rectangle reduction is given. The query that differs from
// 矩形周长 is: max overlap, not total perimeter. That's still range-add on
// each event y, but the readout we care about is max of the array — the
// segment-tree "range add, query max" pair the next slide spells out.
const GRID_W = 14;
const GRID_H = 8;
const { UNIT, gx, gy } = gridHelpers(GRID_W, GRID_H, 28);

const WIN_W = 4;
const WIN_H = 3;
// Spread stars so anchor rectangles enter/exit at distinct y's — the sweep
// shows running coverage stepping up before settling on the punchline max.
// sx ≥ W+1 / sy ≥ H+1 keeps anchor rects off the grid border.
const stars: [number, number][] = [
  [5, 4],
  [9, 5],
  [8, 6],
  [11, 6],
  [10, 7],
];

const STAR_INK = C.gold;
const RECT_INK = C.orange;
const SWEEP_LINE = C.red;
const TEXT_NEUTRAL = C.darkButtonGrey;
const GRID_INK = C.silver;
const MAX_INK = C.crimson;

function coverColor(c: number) {
  if (c <= 0) return C.white;
  if (c === 1) return "#fbd2a3";
  if (c === 2) return "#f5995a";
  if (c === 3) return "#d96a1f";
  return "#a14a10";
}

interface Ev {
  x: number;
  w: number;
  eventY: number;
  type: 1 | -1;
  rectIdx: number;
}

// Strip is the 1D coverage readout. Sits below the grid with a small gap so
// the sweep line crossing into events doesn't visually collide with cell
// colour updates.
const STRIP_GAP = 26;
const STRIP_H = 22;
const STRIP_Y = gy(GRID_H) + STRIP_GAP;
const TEXT_Y = STRIP_Y + STRIP_H + 22;

const events: Ev[] = [];
const dataRects: sd.Rect[] = [];
const starNodes: sd.Polygon[] = [];
const cells: sd.Rect[] = [];
const gridV: sd.Line[] = [];
const gridH: sd.Line[] = [];
const segment = sd.make1d(GRID_W, 0);

let frame: sd.Rect;
let line: sd.Line;
let nowText: sd.Text;
let maxText: sd.Text;

const PIN_NOW = { "now ": "now " };
const PIN_MAX = { "max ": "max " };

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
        points: starPoints(gx(x), gy(y), 7),
        fill: STAR_INK,
        stroke: C.darkButtonGrey,
        strokeWidth: 0.5,
        opacity: 0,
      }),
    );
  }

  // Anchor rectangles are stroke-only — they're the input; cell colour does
  // the work of showing coverage so the two layers don't compete.
  stars.forEach(([sx, sy], idx) => {
    // Anchor rect [sx-W, sx] × [sy-H, sy] — star sits at the bottom-right
    // corner of its rect, matching 窗口的星星.ts's region orientation.
    const rx = sx - WIN_W;
    const ry = sy - WIN_H;
    dataRects.push(
      new sd.Rect({
        targetNode: svg,
        x: gx(rx),
        y: gy(ry),
        width: WIN_W * UNIT,
        height: WIN_H * UNIT,
        fill: C.none,
        stroke: RECT_INK,
        strokeWidth: 1.4,
        strokeOpacity: 0,
      }),
    );
    events.push({ x: rx, w: WIN_W, eventY: ry, type: 1, rectIdx: idx });
    events.push({ x: rx, w: WIN_W, eventY: ry + WIN_H, type: -1, rectIdx: idx });
  });

  for (let i = 0; i < GRID_W; i++) {
    cells.push(
      new sd.Rect({
        targetNode: svg,
        x: gx(i),
        y: STRIP_Y - 10,
        width: UNIT,
        height: STRIP_H,
        fill: C.white,
        stroke: C.silver,
        strokeWidth: 0.5,
        opacity: 0,
      }),
    );
  }

  nowText = new sd.Text({
    targetNode: svg,
    text: "now 0",
    cx: gx(GRID_W / 2) - 22,
    cy: TEXT_Y,
    fontSize: 15,
    fill: TEXT_NEUTRAL,
    opacity: 0,
  });
  maxText = new sd.Text({
    targetNode: svg,
    text: "max 0",
    cx: gx(GRID_W / 2) + 22,
    cy: TEXT_Y,
    fontSize: 15,
    fill: MAX_INK,
    opacity: 0,
  });
});

sd.main(async () => {
  events.sort((a, b) => a.eventY - b.eventY || b.type - a.type);

  const grouped: Ev[][] = [];
  for (let k = 0; k < events.length; ) {
    const row: Ev[] = [];
    const y = events[k].eventY;
    while (k < events.length && events[k].eventY === y) row.push(events[k++]);
    grouped.push(row);
  }

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
  frame.startAnimate({ delay: 220, duration: 380, easing: E.easeOut }).setOpacity(1).endAnimate();
  for (let i = 0; i < starNodes.length; i++) {
    starNodes[i]
      .startAnimate({ delay: 320 + i * 60, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  for (let i = 0; i < dataRects.length; i++) {
    dataRects[i]
      .startAnimate({ delay: 460 + i * 70, duration: 360, easing: E.easeOut })
      .setStrokeOpacity(0.55)
      .endAnimate();
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i]
      .startAnimate({ delay: 600 + i * 14, duration: 260, easing: E.easeOut })
      .setOpacity(1)
      .setY(STRIP_Y)
      .endAnimate();
  }
  nowText
    .startAnimate({ delay: 1000, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  maxText
    .startAnimate({ delay: 1060, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  await sd.pause();

  line = new sd.Line({
    targetNode: svg,
    x1: gx(0) - 8,
    y1: gy(0),
    x2: gx(GRID_W) + 8,
    y2: gy(0),
    stroke: SWEEP_LINE,
    strokeWidth: 3,
    opacity: 0,
  });
  line.startAnimate({ duration: 350, easing: E.easeOut }).setOpacity(1).endAnimate();

  await sd.pause();

  const SWEEP_DUR = 700;
  const ARRIVAL_DELAY = SWEEP_DUR - 100;
  const ARRIVAL_DUR = 260;
  const TEXT_DUR = 240;

  let runningMax = 0;

  for (let gIdx = 0; gIdx < grouped.length; gIdx++) {
    const row = grouped[gIdx];
    const y = row[0].eventY;

    line
      .startAnimate({ duration: SWEEP_DUR, easing: E.easeInOut })
      .setY1(gy(y))
      .setY2(gy(y))
      .endAnimate();

    for (const ev of row) {
      for (let i = ev.x; i < ev.x + ev.w; i++) segment[i] += ev.type;
    }
    for (const ev of row) {
      dataRects[ev.rectIdx]
        .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
        .setStrokeOpacity(ev.type === 1 ? 0.95 : 0.18)
        .endAnimate();
    }

    let cellMax = 0;
    for (let i = 0; i < GRID_W; i++) {
      if (segment[i] > cellMax) cellMax = segment[i];
      cells[i]
        .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
        .setFill(coverColor(segment[i]))
        .endAnimate();
    }

    nowText
      .startAnimate({ delay: ARRIVAL_DELAY, duration: TEXT_DUR, easing: E.easeOut })
      .setText(`now ${cellMax}`, PIN_NOW)
      .endAnimate();

    if (cellMax > runningMax) {
      runningMax = cellMax;
      maxText
        .startAnimate({ delay: ARRIVAL_DELAY, duration: TEXT_DUR, easing: E.easeOut })
        .setText(`max ${runningMax}`, PIN_MAX)
        .endAnimate();
    }

    await sd.pause();
  }
});
