import * as sd from "@/sd";
import { gridHelpers } from "../grid";

const svg = sd.svg();
const C = sd.color();

// The "stars → rectangles" transform has already been made (in the
// previous slide's animation). Here we apply the area-sweep on those
// rectangles, but ask a different question: at every (a, b) anchor we
// want the *count* of rectangles covering that point — i.e. the count
// of stars the window would see. Coverage depth → orange gradient on a
// 1-D segment array; the scanline picks the row that hits each event.
const GRID_W = 14;
const GRID_H = 8;
const { UNIT, gx, gy, Y0 } = gridHelpers(GRID_W, GRID_H, 36);
const STRIP_GAP = 16;
const STRIP_H = 16;

const WIN_W = 4;
const WIN_H = 3;
const stars = [
  [5, 4],
  [7, 5],
  [8, 3],
  [10, 4],
];

const RECT_STROKE = "#f58617";
const SCAN = "#f14c4c";

// Each star contributes a rectangle [x-W+1, x] × [y-H+1, y] in anchor-space.
// Clamp to the grid so we don't draw off the canvas.
const data = stars.map(([x, y]) => ({
  x: Math.max(0, x - WIN_W + 1),
  y: Math.max(0, y - WIN_H + 1),
  w: Math.min(WIN_W, x + 1),
  h: Math.min(WIN_H, y + 1),
}));

const events = [];
const cells = [];
const segment = sd.make1d(GRID_W, 0);

const STRIP_Y = Y0 - STRIP_GAP - STRIP_H;

function coverageColor(c) {
  if (c <= 0) return C.white;
  if (c === 1) return "#fbd2a3";
  if (c === 2) return "#f5995a";
  return "#d96a1f";
}

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
    new sd.Circle({
      targetNode: svg,
      cx: gx(x),
      cy: gy(y),
      r: 5,
      fill: "#444",
    });
  });

  data.forEach(({ x, y, w, h }) => {
    new sd.Rect({
      targetNode: svg,
      x: gx(x),
      y: gy(y),
      width: w * UNIT,
      height: h * UNIT,
      fill: RECT_STROKE,
      fillOpacity: 0.06,
      stroke: RECT_STROKE,
      strokeWidth: 1,
      strokeOpacity: 0.5,
    });
    events.push({ x, w, eventY: y, type: +1 });
    events.push({ x, w, eventY: y + h, type: -1 });
  });

  for (let i = 0; i < GRID_W; i++) {
    cells.push(
      new sd.Rect({
        targetNode: svg,
        x: gx(i),
        y: STRIP_Y,
        width: UNIT,
        height: STRIP_H,
        fill: C.white,
        stroke: "#d0d0d0",
        strokeWidth: 0.5,
      }),
    );
  }
});

sd.main(async () => {
  events.sort((a, b) => a.eventY - b.eventY);
  await sd.pause();

  const line = new sd.Line({
    targetNode: svg,
    x1: gx(0),
    y1: gy(0),
    x2: gx(GRID_W),
    y2: gy(0),
    stroke: SCAN,
    strokeWidth: 2.5,
    opacity: 0,
  });
  line.startAnimate({ duration: 400 }).setOpacity(1).endAnimate();
  await sd.pause();

  let prevY = 0;
  for (const ev of events) {
    const dy = ev.eventY - prevY;
    if (dy > 0) {
      // Coverage-depth bands between prev and current scanline. The band
      // colour reflects the count, not just "covered" — that's the whole
      // point: max count = max stars-in-window.
      for (let l = 0, r; l < GRID_W; l = r + 1) {
        r = l;
        if (segment[l] === 0) continue;
        while (r + 1 < GRID_W && segment[r + 1] === segment[l]) r++;
        new sd.Rect({
          targetNode: svg,
          x: gx(l),
          y: gy(prevY),
          width: (r - l + 1) * UNIT,
          height: dy * UNIT,
          fill: coverageColor(segment[l]),
          fillOpacity: 0,
          stroke: C.none,
        }).startAnimate({ duration: 500 }).setFillOpacity(0.4).endAnimate();
      }
    }
    line.startAnimate({ duration: 500 }).setY1(gy(ev.eventY)).setY2(gy(ev.eventY)).endAnimate();
    prevY = ev.eventY;
    await sd.pause();

    for (let i = ev.x; i < ev.x + ev.w; i++) {
      segment[i] += ev.type;
      cells[i].startAnimate({ duration: 350 }).setFill(coverageColor(segment[i])).endAnimate();
    }
    await sd.pause();
  }
});
