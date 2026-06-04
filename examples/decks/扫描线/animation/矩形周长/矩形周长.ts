import * as sd from "@/sd";
import { gridHelpers } from "../grid";

const svg = sd.svg();
const C = sd.color();

// 7 rectangles laid out in a wider y-up grid. The scanline sweeps from
// bottom to top; at each y-event we update the bottom segment-coverage
// array. The horizontal perimeter contribution at this y is the set of
// cells whose coverage flips (0↔positive) — we flash those segments to
// show that |Δ covered length| accumulates the horizontal perimeter.
const W = 30;
const H = 16;
const { UNIT, gx, gy, Y0 } = gridHelpers(W, H, 18);
const STRIP_GAP = 14;
const STRIP_H = 12;

const NEUTRAL = "#d0d0d0";
const RECT_STROKE = "#666";
const SCAN = "#f14c4c";
const EDGE = "#4a90e2";

// (x, y, w, h) — translated from the original work/扫描线/矩形周长/ dataset
// so the topology matches.
const data = [
  [0, 4, 10, 5],
  [5, 8, 10, 7],
  [8, 0, 4, 9],
  [16, 0, 4, 5],
  [9, 11, 4, 4],
  [22, 5, 3, 5],
  [25, 4, 3, 8],
];

const events = [];
const cells = [];
const segment = sd.make1d(W, 0);

const STRIP_Y = Y0 - STRIP_GAP - STRIP_H;

function coverageColor(c) {
  if (c <= 0) return C.white;
  if (c === 1) return "#cfe0f5";
  if (c === 2) return "#8eb4e4";
  return "#4a80c4";
}

sd.init(() => {
  new sd.Rect({
    targetNode: svg,
    x: gx(0),
    y: gy(0),
    width: W * UNIT,
    height: H * UNIT,
    fill: C.none,
    stroke: NEUTRAL,
    strokeWidth: 1,
  });

  data.forEach(([x, y, w, h]) => {
    new sd.Rect({
      targetNode: svg,
      x: gx(x),
      y: gy(y),
      width: w * UNIT,
      height: h * UNIT,
      fill: NEUTRAL,
      fillOpacity: 0.3,
      stroke: RECT_STROKE,
      strokeWidth: 1,
    });
    events.push({ x, w, eventY: y, type: +1 });
    events.push({ x, w, eventY: y + h, type: -1 });
  });

  for (let i = 0; i < W; i++) {
    cells.push(
      new sd.Rect({
        targetNode: svg,
        x: gx(i),
        y: STRIP_Y,
        width: UNIT,
        height: STRIP_H,
        fill: C.white,
        stroke: NEUTRAL,
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
    x2: gx(W),
    y2: gy(0),
    stroke: SCAN,
    strokeWidth: 2.5,
    opacity: 0,
  });
  line.startAnimate({ duration: 400 }).setOpacity(1).endAnimate();
  await sd.pause();

  // Group events that share the same y — they all contribute to perimeter
  // at this row, and we want the "before vs after" diff for the whole row.
  let i = 0;
  while (i < events.length) {
    let j = i;
    while (j + 1 < events.length && events[j + 1].eventY === events[i].eventY) j++;

    line
      .startAnimate({ duration: 500 })
      .setY1(gy(events[i].eventY))
      .setY2(gy(events[i].eventY))
      .endAnimate();
    await sd.pause();

    const before = segment.map((c) => c > 0);
    for (let k = i; k <= j; k++) {
      const ev = events[k];
      for (let x = ev.x; x < ev.x + ev.w; x++) segment[x] += ev.type;
    }
    const after = segment.map((c) => c > 0);

    for (let k = 0; k < W; k++) {
      cells[k]
        .startAnimate({ duration: 350 })
        .setFill(coverageColor(segment[k]))
        .endAnimate();
    }

    // Permanent horizontal perimeter at this y: the contiguous runs where
    // coverage flipped. These accumulate so the viewer sees the full
    // horizontal perimeter outline of the rect union by the end.
    for (let l = 0, r; l < W; l = r + 1) {
      r = l;
      if (before[l] === after[l]) continue;
      while (r + 1 < W && before[r + 1] !== after[r + 1] && before[r + 1] === before[l]) r++;
      const trail = new sd.Line({
        targetNode: svg,
        x1: gx(l),
        y1: gy(events[i].eventY),
        x2: gx(r + 1),
        y2: gy(events[i].eventY),
        stroke: EDGE,
        strokeWidth: 8,
        opacity: 0,
      });
      trail.startAnimate({ duration: 400 }).setOpacity(0.95).endAnimate();
    }
    await sd.pause();
    i = j + 1;
  }
});
