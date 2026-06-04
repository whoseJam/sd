import * as sd from "@/sd";
import { gridHelpers } from "../grid";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// sd renders y-up. Rect.y is the bottom edge of the rect in y-up; Line.y is
// plain y-up. The renderer handles the actual SVG flip.
const W = 20;
const H = 10;
const { UNIT, gx, gy } = gridHelpers(W, H, 28);

// The 1D strip below the frame is the visual proxy for the segment tree —
// each cell mirrors a column of the plane. Spacing it apart from the frame
// makes the "2D → 1D reduction" reading clearer.
const STRIP_GAP = 20;
const STRIP_H = 24;
const STRIP_Y = gy(0) - STRIP_GAP - STRIP_H;

const RECT_STROKE_ACTIVE = C.steelBlue;
const RECT_STROKE_DONE = C.silver;
const SWEEP_LINE = C.red;
const SWEPT_FILL = C.orange;
const TICK_ADD = C.mediumSeaGreen;
const TICK_REM = C.darkRed;
const TEXT_NEUTRAL = C.darkButtonGrey;
const GRID_INK = C.silver;

// Coverage ramp is its own gradient — a custom blue scale so the strip's
// coverage count reads distinctly from the orange swept region.
function coverColor(count: number) {
  if (count <= 0) return C.white;
  if (count === 1) return "#cfe6f3";
  if (count === 2) return "#7fb8d6";
  return "#3580a8";
}

const data: [number, number, number, number][] = [
  [1, 1, 5, 3],
  [8, 5, 7, 2],
  [13, 6, 4, 3],
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
const ticks: sd.Line[] = [];
const gridVerticals: sd.Line[] = [];
const gridHorizontals: sd.Line[] = [];
const segment = sd.make1d(W, 0);

let frame: sd.Rect;
let line: sd.Line;
let coverageText: sd.Text;
let areaText: sd.Text;

sd.init(() => {
  // Faint internal grid: turns the frame from "an outline" into "graph
  // paper", which is what the sweepline algorithm actually thinks of as
  // the integer plane underneath.
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
        stroke: C.darkGray,
        strokeWidth: 1,
        opacity: 0,
      }),
    );
    events.push({ x, w, eventY: y, type: 1, rectIdx: idx });
    events.push({ x, w, eventY: y + h, type: -1, rectIdx: idx });
  });

  // Strip cells start 10 units below their final y so the entrance can
  // "slide them up" into place.
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

  // Right-rail readouts: coverage is the per-frame intermediate state;
  // Σ is the actual algorithmic output (union area). Stacking them and
  // letting both morph each beat makes the "running result" tangible.
  coverageText = new sd.Text({
    targetNode: svg,
    text: `0 / ${W}`,
    x: gx(W) + 12,
    cy: STRIP_Y + STRIP_H / 2 - 11,
    fontSize: 15,
    fill: TEXT_NEUTRAL,
    opacity: 0,
  });
  areaText = new sd.Text({
    targetNode: svg,
    text: "Σ 0",
    x: gx(W) + 12,
    cy: STRIP_Y + STRIP_H / 2 + 11,
    fontSize: 15,
    fill: TEXT_NEUTRAL,
    opacity: 0,
  });
});

sd.main(async () => {
  // Same y: +1 before -1 keeps the segment monotonic and the visual order
  // sane (a rect that just ended doesn't get re-highlighted by a new start
  // at the same height).
  events.sort((a, b) => a.eventY - b.eventY || b.type - a.type);

  // Build event ticks on the left margin, in sorted order, so each tick
  // sits at the exact y the sweep will visit next.
  const TICK_X1 = gx(0) - 18;
  const TICK_X2 = gx(0) - 4;
  for (const ev of events) {
    ticks.push(
      new sd.Line({
        targetNode: svg,
        x1: TICK_X1,
        y1: gy(ev.eventY),
        x2: TICK_X2,
        y2: gy(ev.eventY),
        stroke: C.silver,
        strokeWidth: 1,
        opacity: 0,
      }),
    );
  }

  // Entrance choreography reads as layers being laid down in order:
  // graph paper → frame → input rects → strip → tick stops → readouts.
  // Concurrent under one pause, each layer offset so the eye follows.
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
  areaText
    .startAnimate({ delay: 1060, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  await sd.pause();

  // Sweep line slides in from offset (extending past the frame edges hints
  // at "this can go anywhere across the row").
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

  // One pause per event. Within each beat: sweep up (geometric), then at
  // arrival a small "thump" — tick lights up, affected rect borders shift,
  // strip cells repaint, coverage and area readouts update.
  const SWEEP_DUR = 700;
  const ARRIVAL_DELAY = SWEEP_DUR - 100;
  const ARRIVAL_DUR = 260;
  const TEXT_DUR = 240;

  let prevY = 0;
  let prevCov = 0;
  let area = 0;
  for (let evIdx = 0; evIdx < events.length; evIdx++) {
    const ev = events[evIdx];
    const dy = ev.eventY - prevY;

    // Swept bands: one rect per contiguous run of currently-covered cells.
    // Their growth is timed to the sweep so the orange "fills in" behind
    // the line as it moves.
    if (dy > 0) {
      for (let l = 0, r; l < W; l = r + 1) {
        r = l;
        if (segment[l] === 0) continue;
        while (r + 1 < W && segment[r + 1] > 0) r++;
        const band = new sd.Rect({
          targetNode: svg,
          x: gx(l),
          y: gy(prevY),
          width: (r - l + 1) * UNIT,
          height: 0,
          fill: SWEPT_FILL,
          fillOpacity: 0.28,
          stroke: C.none,
        });
        band
          .startAnimate({ duration: SWEEP_DUR, easing: E.easeInOut })
          .setHeight(dy * UNIT)
          .endAnimate();
      }
    }

    line
      .startAnimate({ duration: SWEEP_DUR, easing: E.easeInOut })
      .setY1(gy(ev.eventY))
      .setY2(gy(ev.eventY))
      .endAnimate();

    // Arrival effects are delayed to coincide with sweep landing.
    // Skip opacity here — it was already lifted at entrance, and touching
    // it again would partially overlap that entrance action under flush
    // mode (sd-element's viewBox-measurement pass collapses all delays to
    // t=0, so overlapping ranges on the same attribute throw).
    ticks[evIdx]
      .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
      .setStroke(ev.type === 1 ? TICK_ADD : TICK_REM)
      .setStrokeWidth(2.5)
      .endAnimate();

    dataRects[ev.rectIdx]
      .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
      .setStroke(ev.type === 1 ? RECT_STROKE_ACTIVE : RECT_STROKE_DONE)
      .endAnimate();

    for (let i = ev.x; i < ev.x + ev.w; i++) {
      segment[i] += ev.type;
      cells[i]
        .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
        .setFill(coverColor(segment[i]))
        .endAnimate();
    }

    const cov = segment.reduce((s: number, v: number) => s + (v > 0 ? 1 : 0), 0);
    // Area is the algorithm's real output: each sweep span contributes
    // prevCov × dy. Snap-update at arrival so the digit morph syncs with
    // the visual "thump" rather than ticking continuously.
    if (dy > 0) area += prevCov * dy;

    // setText morphs only the count digit; mapping pins the constant tail/symbol
    // so positional alignment doesn't reshape them.
    coverageText
      .startAnimate({ delay: ARRIVAL_DELAY, duration: TEXT_DUR, easing: E.easeOut })
      .setText(`${cov} / ${W}`, { [` / ${W}`]: ` / ${W}` })
      .endAnimate();
    areaText
      .startAnimate({ delay: ARRIVAL_DELAY, duration: TEXT_DUR, easing: E.easeOut })
      .setText(`Σ ${area}`, { "Σ ": "Σ " })
      .endAnimate();

    prevY = ev.eventY;
    prevCov = cov;
    await sd.pause();
  }
});
