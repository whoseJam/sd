import * as sd from "@/sd";
import { gridHelpers } from "../grid";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Horizontal-edge sweep. At each y where some rect-edge lives, the
// contribution to the horizontal perimeter is exactly the number of cells
// whose covered/uncovered status flips. Σ over all y events = total
// horizontal-edge length of the union.
const W = 20;
const H = 10;
const { UNIT, gx, gy } = gridHelpers(W, H, 28);

const STRIP_GAP = 20;
const STRIP_H = 24;
const STRIP_Y = gy(0) - STRIP_GAP - STRIP_H;

const RECT_STROKE_ACTIVE = C.steelBlue;
const RECT_STROKE_DONE = C.silver;
const SWEEP_LINE = C.red;
const TICK_ADD = C.mediumSeaGreen;
const TICK_REM = C.darkRed;
const EDGE_INK = C.steelBlue;
const TEXT_NEUTRAL = C.darkButtonGrey;
const GRID_INK = C.silver;

function coverColor(count: number) {
  if (count <= 0) return C.white;
  if (count === 1) return "#cfe6f3";
  if (count === 2) return "#7fb8d6";
  return "#3580a8";
}

const data: [number, number, number, number][] = [
  [1, 1, 6, 4],
  [4, 3, 5, 3],
  [10, 2, 4, 5],
  [13, 5, 5, 3],
  [16, 1, 3, 4],
];

interface Ev {
  x: number;
  w: number;
  eventY: number;
  type: 1 | -1;
  rectIdx: number;
}

const events: Ev[] = [];
const dataRects: sd.Rect[] = [];
const cells: sd.Rect[] = [];
const gridVerticals: sd.Line[] = [];
const gridHorizontals: sd.Line[] = [];
const segment = sd.make1d(W, 0);

let frame: sd.Rect;
let line: sd.Line;
let coverageText: sd.Text;
let deltaText: sd.Text;
let sumText: sd.Text;

sd.init(() => {
  // Graph paper: same low-presence treatment as 扫描线 — there to make the
  // integer plane legible, not to draw attention.
  for (let i = 1; i < W; i++) {
    gridVerticals.push(
      new sd.Line({
        targetNode: svg,
        x1: gx(i),
        y1: gy(0),
        x2: gx(i),
        y2: gy(H),
        stroke: GRID_INK,
        strokeWidth: 0.8,
        strokeDashArray: [2, 3],
        opacity: 0,
      }),
    );
  }
  for (let j = 1; j < H; j++) {
    gridHorizontals.push(
      new sd.Line({
        targetNode: svg,
        x1: gx(0),
        y1: gy(j),
        x2: gx(W),
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
    width: W * UNIT,
    height: H * UNIT,
    fill: C.none,
    stroke: C.silver,
    strokeWidth: 1.5,
    opacity: 0,
  });

  data.forEach(([x, y, w, h], idx) => {
    dataRects.push(
      new sd.Rect({
        targetNode: svg,
        x: gx(x),
        y: gy(y),
        width: w * UNIT,
        height: h * UNIT,
        fill: C.buttonGrey,
        stroke: C.silver,
        strokeWidth: 1,
        opacity: 0,
      }),
    );
    events.push({ x, w, eventY: y, type: 1, rectIdx: idx });
    events.push({ x, w, eventY: y + h, type: -1, rectIdx: idx });
  });

  for (let i = 0; i < W; i++) {
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

  coverageText = new sd.Text({
    targetNode: svg,
    text: `cov 0 / ${W}`,
    x: gx(W) + 12,
    cy: STRIP_Y + STRIP_H / 2 - 16,
    fontSize: 15,
    fill: TEXT_NEUTRAL,
    opacity: 0,
  });
  deltaText = new sd.Text({
    targetNode: svg,
    text: "Δ 0",
    x: gx(W) + 12,
    cy: STRIP_Y + STRIP_H / 2,
    fontSize: 15,
    fill: TEXT_NEUTRAL,
    opacity: 0,
  });
  sumText = new sd.Text({
    targetNode: svg,
    text: "Σ 0",
    x: gx(W) + 12,
    cy: STRIP_Y + STRIP_H / 2 + 16,
    fontSize: 15,
    fill: TEXT_NEUTRAL,
    opacity: 0,
  });
});

sd.main(async () => {
  // Group y-events: rows with multiple edges at the same y all contribute
  // together. Sort so +1 before -1 within a row keeps before/after pairs
  // consistent.
  events.sort((a, b) => a.eventY - b.eventY || b.type - a.type);

  const grouped: Ev[][] = [];
  for (let k = 0; k < events.length; ) {
    const row: Ev[] = [];
    const y = events[k].eventY;
    while (k < events.length && events[k].eventY === y) row.push(events[k++]);
    grouped.push(row);
  }

  // Tick marks live at each grouped y on the left margin — the y-event
  // schedule, made tangible.
  const TICK_X1 = gx(0) - 18;
  const TICK_X2 = gx(0) - 4;
  const ticks: sd.Line[] = grouped.map((row) =>
    new sd.Line({
      targetNode: svg,
      x1: TICK_X1,
      y1: gy(row[0].eventY),
      x2: TICK_X2,
      y2: gy(row[0].eventY),
      stroke: C.silver,
      strokeWidth: 1,
      opacity: 0,
    }),
  );

  // Layered entrance: graph paper → frame → input rects → strip → ticks → readouts.
  for (let i = 0; i < gridVerticals.length; i++) {
    gridVerticals[i]
      .startAnimate({ delay: i * 8, duration: 220, easing: E.easeOut })
      .setOpacity(0.35)
      .endAnimate();
  }
  for (let j = 0; j < gridHorizontals.length; j++) {
    gridHorizontals[j]
      .startAnimate({ delay: 60 + j * 16, duration: 220, easing: E.easeOut })
      .setOpacity(0.35)
      .endAnimate();
  }
  frame.startAnimate({ delay: 220, duration: 400, easing: E.easeOut }).setOpacity(1).endAnimate();
  for (let i = 0; i < dataRects.length; i++) {
    dataRects[i]
      .startAnimate({ delay: 340 + i * 80, duration: 300, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i]
      .startAnimate({ delay: 460 + i * 15, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .setY(STRIP_Y)
      .endAnimate();
  }
  for (let i = 0; i < ticks.length; i++) {
    ticks[i]
      .startAnimate({ delay: 780 + i * 30, duration: 220, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  coverageText
    .startAnimate({ delay: 980, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  deltaText
    .startAnimate({ delay: 1040, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  sumText
    .startAnimate({ delay: 1100, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  await sd.pause();

  // Sweep line extends slightly past the frame edges — hints "can land
  // anywhere across the row".
  line = new sd.Line({
    targetNode: svg,
    x1: gx(0) - 8,
    y1: gy(0),
    x2: gx(W) + 8,
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

  let totalPerim = 0;
  for (let gIdx = 0; gIdx < grouped.length; gIdx++) {
    const row = grouped[gIdx];
    const y = row[0].eventY;

    const before = segment.map((c) => (c > 0 ? 1 : 0));
    for (const ev of row) {
      for (let x = ev.x; x < ev.x + ev.w; x++) segment[x] += ev.type;
    }
    const after = segment.map((c) => (c > 0 ? 1 : 0));

    let delta = 0;
    for (let k = 0; k < W; k++) if (before[k] !== after[k]) delta++;
    totalPerim += delta;
    const cov = after.reduce((s, v) => s + v, 0);

    line
      .startAnimate({ duration: SWEEP_DUR, easing: E.easeInOut })
      .setY1(gy(y))
      .setY2(gy(y))
      .endAnimate();

    // Drop a permanent perimeter segment along each contiguous run of
    // flipped cells at this y — those segments ARE the horizontal-edge
    // perimeter being assembled in front of the viewer.
    for (let l = 0, r; l < W; l = r + 1) {
      r = l;
      if (before[l] === after[l]) continue;
      while (r + 1 < W && before[r + 1] !== after[r + 1]) r++;
      // Thin enough not to fight the rect outlines on the boundary;
      // saturated stroke + opaque alpha carries the contrast instead.
      const trail = new sd.Line({
        targetNode: svg,
        x1: gx(l),
        y1: gy(y),
        x2: gx(r + 1),
        y2: gy(y),
        stroke: EDGE_INK,
        strokeWidth: 2.2,
        opacity: 0,
      });
      trail
        .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }

    // Arrival: ticks light up by event type (mixed rows show both colors
    // via the dominant +1 sort first).
    const dominant = row[0].type;
    ticks[gIdx]
      .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
      .setStroke(dominant === 1 ? TICK_ADD : TICK_REM)
      .setStrokeWidth(2.5)
      .endAnimate();

    for (const ev of row) {
      dataRects[ev.rectIdx]
        .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
        .setStroke(ev.type === 1 ? RECT_STROKE_ACTIVE : RECT_STROKE_DONE)
        .endAnimate();
    }

    for (let k = 0; k < W; k++) {
      cells[k]
        .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
        .setFill(coverColor(segment[k]))
        .endAnimate();
    }

    coverageText
      .startAnimate({ delay: ARRIVAL_DELAY, duration: TEXT_DUR, easing: E.easeOut })
      .setText(`cov ${cov} / ${W}`, { "cov ": "cov ", [` / ${W}`]: ` / ${W}` })
      .endAnimate();
    deltaText
      .startAnimate({ delay: ARRIVAL_DELAY, duration: TEXT_DUR, easing: E.easeOut })
      .setText(`Δ ${delta}`, { "Δ ": "Δ " })
      .endAnimate();
    sumText
      .startAnimate({ delay: ARRIVAL_DELAY, duration: TEXT_DUR, easing: E.easeOut })
      .setText(`Σ ${totalPerim}`, { "Σ ": "Σ " })
      .endAnimate();

    await sd.pause();
  }
});
