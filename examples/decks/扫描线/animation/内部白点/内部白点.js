import * as sd from "@/sd";
import { gridHelpers } from "../_grid";

const svg = sd.svg();
const C = sd.color();

// Several black points on a grid. Two points sharing a row form a
// horizontal segment; two sharing a column form a vertical segment. An
// interior white point becomes black exactly when it sits on the
// intersection of a horizontal and a vertical segment. We translate
// "count intersections" into a sweep: sort all events by y, walk up,
// maintain a segment array of "currently active vertical columns", and
// whenever the scanline hits a horizontal segment row, the answer for
// that row is the count of active columns inside [xl, xr].
const GRID_W = 12;
const GRID_H = 8;
const { UNIT, gx, gy, Y0 } = gridHelpers(GRID_W, GRID_H, 40);
const STRIP_GAP = 16;
const STRIP_H = 18;

const SCAN = "#f14c4c";
const LINK = "#4a90e2";

const data = [
  [3, 1],
  [7, 1],
  [2, 3],
  [4, 3],
  [9, 3],
  [1, 5],
  [5, 5],
  [9, 5],
  [3, 6],
  [6, 6],
  [9, 6],
];

const cells = [];
const segment = sd.make1d(GRID_W, 0);

const STRIP_Y = Y0 - STRIP_GAP - STRIP_H;

function coverageColor(c) {
  if (c <= 0) return C.white;
  if (c === 1) return "#cfe0f5";
  if (c === 2) return "#8eb4e4";
  return LINK;
}

// Group by y (horizontal pairs) and by x (vertical pairs).
const byY = new Map();
for (const [x, y] of data) {
  if (!byY.has(y)) byY.set(y, []);
  byY.get(y).push(x);
}
const byX = new Map();
for (const [x, y] of data) {
  if (!byX.has(x)) byX.set(x, []);
  byX.get(x).push(y);
}

// Events: vertical-segment endpoints (+1 / -1 on segment[x]) and
// horizontal-segment rows (query type, attached to a row span).
const events = [];
for (const [x, ys] of byX) {
  if (ys.length < 2) continue;
  ys.sort((a, b) => a - b);
  events.push({ kind: "v+", x, eventY: ys[0] });
  events.push({ kind: "v-", x, eventY: ys[ys.length - 1] });
}
for (const [y, xs] of byY) {
  if (xs.length < 2) continue;
  xs.sort((a, b) => a - b);
  events.push({ kind: "h", eventY: y, xl: xs[0], xr: xs[xs.length - 1] });
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

  for (const [x, ys] of byX) {
    if (ys.length < 2) continue;
    const sorted = [...ys].sort((a, b) => a - b);
    new sd.Line({
      targetNode: svg,
      x1: gx(x),
      y1: gy(sorted[0]),
      x2: gx(x),
      y2: gy(sorted[sorted.length - 1]),
      stroke: LINK,
      strokeWidth: 1.2,
      opacity: 0.5,
    });
  }
  for (const [y, xs] of byY) {
    if (xs.length < 2) continue;
    const sorted = [...xs].sort((a, b) => a - b);
    new sd.Line({
      targetNode: svg,
      x1: gx(sorted[0]),
      y1: gy(y),
      x2: gx(sorted[sorted.length - 1]),
      y2: gy(y),
      stroke: LINK,
      strokeWidth: 1.2,
      opacity: 0.5,
    });
  }

  data.forEach(([x, y]) => {
    new sd.Circle({
      targetNode: svg,
      cx: gx(x),
      cy: gy(y),
      r: 6,
      fill: "#222",
    });
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
  // Sort events by y; for a tie, opens (+1) before queries (h) before
  // closes (-1) so a vertical column that starts at row y is counted by a
  // horizontal segment also at row y.
  const order = { "v+": 0, "h": 1, "v-": 2 };
  events.sort((a, b) => {
    if (a.eventY !== b.eventY) return a.eventY - b.eventY;
    return order[a.kind] - order[b.kind];
  });
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

  for (const ev of events) {
    line.startAnimate({ duration: 500 }).setY1(gy(ev.eventY)).setY2(gy(ev.eventY)).endAnimate();
    if (ev.kind === "v+") {
      segment[ev.x] += 1;
      cells[ev.x].startAnimate({ duration: 350 }).setFill(coverageColor(segment[ev.x])).endAnimate();
    } else if (ev.kind === "v-") {
      segment[ev.x] -= 1;
      cells[ev.x].startAnimate({ duration: 350 }).setFill(coverageColor(segment[ev.x])).endAnimate();
    } else {
      // Highlight the query range [xl, xr] on the strip — these cells'
      // active-column count is the number of new black points on this row.
      const flash = new sd.Rect({
        targetNode: svg,
        x: gx(ev.xl),
        y: STRIP_Y - 4,
        width: (ev.xr - ev.xl + 1) * UNIT,
        height: STRIP_H + 8,
        fill: C.none,
        stroke: "#f14c4c",
        strokeWidth: 2,
        opacity: 0,
      });
      flash.startAnimate({ duration: 350 }).setOpacity(1).endAnimate();
    }
    await sd.pause();
  }
});
