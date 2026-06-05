import * as sd from "@/sd";
import { gridHelpers } from "../grid";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const GRID_W = 13;
const GRID_H = 4;
const { UNIT, gx, gy } = gridHelpers(GRID_W, GRID_H, 32);

// Counter ticks 0 → 2 → 4 across rows 1 and 2.
const data: [number, number][] = [
  [1, 0],
  [4, 0],
  [11, 0],
  [0, 1],
  [11, 1],
  [1, 2],
  [8, 2],
  [12, 2],
  [4, 3],
  [8, 3],
  [11, 3],
];

const DOT_INK = "#222";
const AXIS_INK = C.steelBlue;
const SCAN = C.red;
const NEW_INK = C.crimson;
const TRACKER = C.steelBlue;
const TEXT_NEUTRAL = C.darkButtonGrey;
const GRID_INK = C.silver;

const dotX = (x: number) => gx(x) + UNIT / 2;
const dotY = (y: number) => gy(y) + UNIT / 2;

const STRIP_GAP = 26;
const STRIP_H = 18;
const STRIP_Y = gy(GRID_H) + STRIP_GAP;
const TEXT_Y = STRIP_Y + STRIP_H + 24;

interface HAxis {
  y: number;
  xl: number;
  xr: number;
}
interface VAxis {
  x: number;
  yl: number;
  yr: number;
}
interface Crossing {
  x: number;
  y: number;
  isNew: boolean;
}

const rowGroups = new Map<number, number[]>();
const colGroups = new Map<number, number[]>();
for (const [x, y] of data) {
  if (!rowGroups.has(y)) rowGroups.set(y, []);
  rowGroups.get(y)!.push(x);
  if (!colGroups.has(x)) colGroups.set(x, []);
  colGroups.get(x)!.push(y);
}
const horizAxes: HAxis[] = [];
for (const [y, xs] of rowGroups) {
  if (xs.length < 2) continue;
  xs.sort((a, b) => a - b);
  horizAxes.push({ y, xl: xs[0], xr: xs[xs.length - 1] });
}
const vertAxes: VAxis[] = [];
for (const [x, ys] of colGroups) {
  if (ys.length < 2) continue;
  ys.sort((a, b) => a - b);
  vertAxes.push({ x, yl: ys[0], yr: ys[ys.length - 1] });
}

const dataSet = new Set<string>(data.map(([x, y]) => `${x},${y}`));
const crossings: Crossing[] = [];
for (const h of horizAxes) {
  for (const v of vertAxes) {
    if (v.x < h.xl || v.x > h.xr) continue;
    if (h.y < v.yl || h.y > v.yr) continue;
    crossings.push({ x: v.x, y: h.y, isNew: !dataSet.has(`${v.x},${h.y}`) });
  }
}
const newCount = crossings.filter((c) => c.isNew).length;

const gridV: sd.Line[] = [];
const gridH: sd.Line[] = [];
const dotNodes: sd.Circle[] = [];
const hAxisLines: sd.Line[] = [];
const vAxisLines: sd.Line[] = [];
const stripCells: sd.Rect[] = [];
const newMarkers = new Map<string, sd.Circle>();

let frame: sd.Rect;
let scanLine: sd.Line;
let previewText: sd.Text;
let countText: sd.Text;

const PIN_NEW = { "found ": "found " };

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
    stroke: GRID_INK,
    strokeWidth: 1.5,
    opacity: 0,
  });

  for (const [x, y] of data) {
    dotNodes.push(
      new sd.Circle({
        targetNode: svg,
        cx: dotX(x),
        cy: dotY(y),
        r: 6,
        fill: DOT_INK,
        opacity: 0,
      }),
    );
  }

  for (let i = 0; i < GRID_W; i++) {
    stripCells.push(
      new sd.Rect({
        targetNode: svg,
        x: gx(i) + 2,
        y: STRIP_Y,
        width: UNIT - 4,
        height: STRIP_H,
        fill: C.white,
        stroke: GRID_INK,
        strokeWidth: 0.5,
        opacity: 0,
      }),
    );
  }

  previewText = new sd.Text({
    targetNode: svg,
    text: `target ${newCount}`,
    cx: gx(GRID_W / 2) - 35,
    cy: TEXT_Y,
    fontSize: 15,
    fill: TEXT_NEUTRAL,
    opacity: 0,
  });

  countText = new sd.Text({
    targetNode: svg,
    text: "found 0",
    cx: gx(GRID_W / 2) + 35,
    cy: TEXT_Y,
    fontSize: 15,
    fill: NEW_INK,
    opacity: 0,
  });
});

sd.main(async () => {
  for (let i = 0; i < gridV.length; i++) {
    gridV[i]
      .startAnimate({ delay: i * 8, duration: 220, easing: E.easeOut })
      .setOpacity(0.3)
      .endAnimate();
  }
  for (let j = 0; j < gridH.length; j++) {
    gridH[j]
      .startAnimate({ delay: 60 + j * 16, duration: 220, easing: E.easeOut })
      .setOpacity(0.3)
      .endAnimate();
  }
  frame.startAnimate({ delay: 220, duration: 360, easing: E.easeOut }).setOpacity(1).endAnimate();
  for (let i = 0; i < dotNodes.length; i++) {
    dotNodes[i]
      .startAnimate({ delay: 360 + i * 70, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }

  await sd.pause();

  for (let i = 0; i < horizAxes.length; i++) {
    const { y, xl, xr } = horizAxes[i];
    const ln = new sd.Line({
      targetNode: svg,
      x1: dotX(xl),
      y1: dotY(y),
      x2: dotX(xl),
      y2: dotY(y),
      stroke: AXIS_INK,
      strokeWidth: 1.5,
      strokeOpacity: 0.7,
    });
    hAxisLines.push(ln);
    ln
      .startAnimate({ delay: i * 140, duration: 380, easing: E.easeOut })
      .setX2(dotX(xr))
      .endAnimate();
  }

  await sd.pause();

  // Vertical axes: same for columns.
  for (let i = 0; i < vertAxes.length; i++) {
    const { x, yl, yr } = vertAxes[i];
    const ln = new sd.Line({
      targetNode: svg,
      x1: dotX(x),
      y1: dotY(yl),
      x2: dotX(x),
      y2: dotY(yl),
      stroke: AXIS_INK,
      strokeWidth: 1.5,
      strokeOpacity: 0.7,
    });
    vAxisLines.push(ln);
    ln
      .startAnimate({ delay: i * 140, duration: 380, easing: E.easeOut })
      .setY2(dotY(yr))
      .endAnimate();
  }

  await sd.pause();

  // Pre-mark the white→black candidates so the viewer sees the rule's
  // outcome before the sweep confirms it. Ring = "interior white point".
  const newOrder = crossings
    .filter((c) => c.isNew)
    .sort((a, b) => a.y - b.y || a.x - b.x);
  for (let i = 0; i < newOrder.length; i++) {
    const c = newOrder[i];
    const ring = new sd.Circle({
      targetNode: svg,
      cx: dotX(c.x),
      cy: dotY(c.y),
      r: 7,
      fill: C.white,
      stroke: NEW_INK,
      strokeWidth: 2,
      opacity: 0,
    });
    newMarkers.set(`${c.x},${c.y}`, ring);
    ring
      .startAnimate({ delay: i * 160, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  previewText
    .startAnimate({ delay: 200 + newOrder.length * 160, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  await sd.pause();

  // Hand off to the scanline: bring up the strip + running counter +
  // sweepline. Preview stays as the target the counter is racing toward.
  for (let i = 0; i < stripCells.length; i++) {
    stripCells[i]
      .startAnimate({ delay: i * 14, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  scanLine = new sd.Line({
    targetNode: svg,
    x1: gx(0) - 8,
    y1: dotY(0),
    x2: gx(GRID_W) + 8,
    y2: dotY(0),
    stroke: SCAN,
    strokeWidth: 2.5,
    opacity: 0,
  });
  scanLine.startAnimate({ delay: 200, duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  countText
    .startAnimate({ delay: 320, duration: 260, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  await sd.pause();

  interface Ev {
    kind: "v+" | "h" | "v-";
    x?: number;
    eventY: number;
    xl?: number;
    xr?: number;
  }
  const events: Ev[] = [];
  for (const v of vertAxes) {
    events.push({ kind: "v+", x: v.x, eventY: v.yl });
    events.push({ kind: "v-", x: v.x, eventY: v.yr });
  }
  for (const h of horizAxes) {
    events.push({ kind: "h", eventY: h.y, xl: h.xl, xr: h.xr });
  }
  const order = { "v+": 0, h: 1, "v-": 2 };
  events.sort((a, b) => a.eventY - b.eventY || order[a.kind] - order[b.kind]);

  const grouped: Ev[][] = [];
  for (let k = 0; k < events.length; ) {
    const row: Ev[] = [];
    const y = events[k].eventY;
    while (k < events.length && events[k].eventY === y) row.push(events[k++]);
    grouped.push(row);
  }

  const SWEEP_DUR = 600;
  const ARRIVAL_DELAY = SWEEP_DUR - 100;
  const ARRIVAL_DUR = 260;
  const HOLD_DUR = 320;

  const trackerByX = new Map<number, sd.Circle>();
  const segment = sd.make1d(GRID_W, 0);
  let runningNew = 0;

  for (const row of grouped) {
    const y = row[0].eventY;
    const vPluses = row.filter((e) => e.kind === "v+");
    const hEv = row.find((e) => e.kind === "h");
    const vMinuses = row.filter((e) => e.kind === "v-");

    // Insert beat: sweep arrives, v+ trackers commit into the segment.
    scanLine
      .startAnimate({ duration: SWEEP_DUR, easing: E.easeInOut })
      .setY1(dotY(y))
      .setY2(dotY(y))
      .endAnimate();
    for (const tr of trackerByX.values()) {
      tr.startAnimate({ duration: SWEEP_DUR, easing: E.easeInOut }).setCy(dotY(y)).endAnimate();
    }
    for (const ev of vPluses) {
      const tr = new sd.Circle({
        targetNode: svg,
        cx: dotX(ev.x!),
        cy: dotY(y),
        r: 4,
        fill: TRACKER,
        opacity: 0,
      });
      trackerByX.set(ev.x!, tr);
      tr
        .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      segment[ev.x!] = 1;
      stripCells[ev.x!]
        .startAnimate({ delay: ARRIVAL_DELAY, duration: ARRIVAL_DUR, easing: E.easeOut })
        .setFill(TRACKER)
        .endAnimate();
    }
    await sd.pause();

    // Query beat: band over [xl,xr] reads the segment without mutating it;
    // the running counter updates here, not during insert.
    let band: sd.Rect | undefined;
    if (hEv) {
      const xl = hEv.xl!;
      const xr = hEv.xr!;
      let rowNew = 0;
      band = new sd.Rect({
        targetNode: svg,
        x: gx(xl) + 2,
        y: STRIP_Y - 4,
        width: (xr - xl) * UNIT + UNIT - 4,
        height: STRIP_H + 8,
        fill: C.none,
        stroke: SCAN,
        strokeWidth: 2,
        opacity: 0,
      });
      band
        .startAnimate({ duration: ARRIVAL_DUR, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      for (let x = xl; x <= xr; x++) {
        if (segment[x] !== 1) continue;
        const key = `${x},${y}`;
        const ring = newMarkers.get(key);
        if (ring) {
          ring
            .startAnimate({ delay: ARRIVAL_DUR, duration: HOLD_DUR, easing: E.easeOut })
            .setFill(DOT_INK)
            .endAnimate();
          rowNew++;
        } else {
          const dotIdx = data.findIndex(([dx, dy]) => dx === x && dy === y);
          if (dotIdx >= 0) {
            dotNodes[dotIdx]
              .startAnimate({ delay: ARRIVAL_DUR, duration: HOLD_DUR / 2, easing: E.easeOut })
              .setR(8)
              .endAnimate();
            dotNodes[dotIdx]
              .startAnimate({
                delay: ARRIVAL_DUR + HOLD_DUR / 2,
                duration: HOLD_DUR / 2,
                easing: E.easeOut,
              })
              .setR(6)
              .endAnimate();
          }
        }
      }
      if (rowNew > 0) {
        runningNew += rowNew;
        countText
          .startAnimate({ delay: ARRIVAL_DUR, duration: HOLD_DUR, easing: E.easeOut })
          .setText(`found ${runningNew}`, PIN_NEW)
          .endAnimate();
      }
      await sd.pause();
      band.startAnimate({ duration: 260, easing: E.easeOut }).setOpacity(0).endAnimate();
    }

    // v- retires under the next sweep — no separate beat.
    for (const ev of vMinuses) {
      const tr = trackerByX.get(ev.x!);
      if (tr) {
        tr.startAnimate({ duration: ARRIVAL_DUR, easing: E.easeOut }).setOpacity(0).endAnimate();
        trackerByX.delete(ev.x!);
      }
      segment[ev.x!] = 0;
      stripCells[ev.x!]
        .startAnimate({ duration: ARRIVAL_DUR, easing: E.easeOut })
        .setFill(C.white)
        .endAnimate();
    }
  }
});
