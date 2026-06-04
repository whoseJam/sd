import * as sd from "@/sd";
import { gridHelpers } from "../grid";

const svg = sd.svg();
const C = sd.color();

// A grid with black points placed at lattice cells. Horizontal then vertical
// links join points sharing a row / column. A red scanline sweeps top-to-bottom
// through events: at a vertical-segment start it opens a tracker dot riding
// the scanline in that column and bumps the per-column counter strip below;
// at a horizontal-segment row it flashes a red query band over the column
// range [xl, xr]; at a vertical-segment end it closes the tracker and
// decrements the counter. Dots, strip cells, trackers, query band all align
// on the same per-column x grid (column k centered at gx(k)+UNIT/2).
const GRID_W = 11;
const GRID_H = 8;
const { UNIT, gx, gy, Y0 } = gridHelpers(GRID_W, GRID_H, 40);
const STRIP_GAP = 18;
const STRIP_H = 18;
const STRIP_Y = Y0 - STRIP_GAP - STRIP_H;

const SCAN = "#f14c4c";
const LINK = "#4a90e2";
const TRACKER = "#1c6fd6";

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

const dotX = (x) => gx(x) + UNIT / 2;
const dotY = (y) => gy(y) + UNIT / 2;

const cells = [];
const segment = sd.make1d(GRID_W, 0);

function coverageColor(c) {
  if (c <= 0) return C.white;
  if (c === 1) return "#cfe0f5";
  if (c === 2) return "#8eb4e4";
  return LINK;
}

const horizGroups = new Map();
for (const [x, y] of data) {
  if (!horizGroups.has(y)) horizGroups.set(y, []);
  horizGroups.get(y).push(x);
}
const vertGroups = new Map();
for (const [x, y] of data) {
  if (!vertGroups.has(x)) vertGroups.set(x, []);
  vertGroups.get(x).push(y);
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

  data.forEach(([x, y]) => {
    new sd.Circle({
      targetNode: svg,
      cx: dotX(x),
      cy: dotY(y),
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
        opacity: 0,
      }),
    );
  }
});

sd.main(async () => {
  await sd.pause();

  for (const [y, xs] of horizGroups) {
    if (xs.length < 2) continue;
    xs.sort((a, b) => a - b);
    new sd.Line({
      targetNode: svg,
      x1: dotX(xs[0]),
      y1: dotY(y),
      x2: dotX(xs[xs.length - 1]),
      y2: dotY(y),
      stroke: LINK,
      strokeWidth: 1.5,
      strokeOpacity: 0.6,
    })
      .startAnimate({ duration: 600 })
      .pointStoT()
      .endAnimate();
  }
  await sd.pause();

  for (const [x, ys] of vertGroups) {
    if (ys.length < 2) continue;
    ys.sort((a, b) => a - b);
    new sd.Line({
      targetNode: svg,
      x1: dotX(x),
      y1: dotY(ys[0]),
      x2: dotX(x),
      y2: dotY(ys[ys.length - 1]),
      stroke: LINK,
      strokeWidth: 1.5,
      strokeOpacity: 0.6,
    })
      .startAnimate({ duration: 600 })
      .pointStoT()
      .endAnimate();
  }
  await sd.pause();

  const line = new sd.Line({
    targetNode: svg,
    x1: gx(0),
    y1: dotY(0),
    x2: gx(GRID_W),
    y2: dotY(0),
    stroke: SCAN,
    strokeWidth: 2.5,
    opacity: 0,
  });
  line.startAnimate({ duration: 400 }).setOpacity(1).endAnimate();
  for (const cell of cells) cell.startAnimate({ duration: 400 }).setOpacity(1).endAnimate();
  await sd.pause();

  const events = [];
  for (const [x, ys] of vertGroups) {
    if (ys.length < 2) continue;
    const sorted = [...ys].sort((a, b) => a - b);
    events.push({ kind: "v+", x, eventY: sorted[0] });
    events.push({ kind: "v-", x, eventY: sorted[sorted.length - 1] });
  }
  for (const [y, xs] of horizGroups) {
    if (xs.length < 2) continue;
    const sorted = [...xs].sort((a, b) => a - b);
    events.push({ kind: "h", eventY: y, xl: sorted[0], xr: sorted[sorted.length - 1] });
  }
  const order = { "v+": 0, h: 1, "v-": 2 };
  events.sort((a, b) => {
    if (a.eventY !== b.eventY) return a.eventY - b.eventY;
    return order[a.kind] - order[b.kind];
  });

  const trackerByX = new Map();
  for (const ev of events) {
    line.startAnimate({ duration: 500 }).setY1(dotY(ev.eventY)).setY2(dotY(ev.eventY)).endAnimate();
    for (const tracker of trackerByX.values()) {
      tracker.startAnimate({ duration: 500 }).setCy(dotY(ev.eventY)).endAnimate();
    }

    if (ev.kind === "v+") {
      const tracker = new sd.Circle({
        targetNode: svg,
        cx: dotX(ev.x),
        cy: dotY(ev.eventY),
        r: 4,
        fill: TRACKER,
        opacity: 0,
      });
      trackerByX.set(ev.x, tracker);
      tracker.startAnimate({ duration: 350 }).setOpacity(1).endAnimate();
      segment[ev.x] += 1;
      cells[ev.x].startAnimate({ duration: 350 }).setFill(coverageColor(segment[ev.x])).endAnimate();
    } else if (ev.kind === "v-") {
      const tracker = trackerByX.get(ev.x);
      if (tracker) {
        tracker.startAnimate({ duration: 350 }).setOpacity(0).endAnimate();
        trackerByX.delete(ev.x);
      }
      segment[ev.x] -= 1;
      cells[ev.x].startAnimate({ duration: 350 }).setFill(coverageColor(segment[ev.x])).endAnimate();
    } else {
      const band = new sd.Rect({
        targetNode: svg,
        x: gx(ev.xl),
        y: STRIP_Y - STRIP_H - 8,
        width: (ev.xr - ev.xl + 1) * UNIT,
        height: STRIP_H,
        fill: C.none,
        stroke: SCAN,
        strokeWidth: 2,
        opacity: 0,
      });
      band.startAnimate({ duration: 350 }).setOpacity(1).endAnimate();
      await sd.pause();
      band.startAnimate({ duration: 350 }).setOpacity(0).endAnimate();
    }
    await sd.pause();
  }
});
