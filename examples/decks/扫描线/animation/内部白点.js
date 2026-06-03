import * as sd from "@/sd";
import { gridHelpers } from "./_grid";

const svg = sd.svg();
const C = sd.color();

// A handful of black points on a plane. The puzzle: a white point becomes
// black exactly when it sits on the intersection of a horizontal line and
// a vertical line drawn through black points. We highlight those grid
// intersection points to make the rule visible.
const GRID_W = 12;
const GRID_H = 8;
const { UNIT, gx, gy } = gridHelpers(GRID_W, GRID_H, 40);

const blacks = [
  [2, 1],
  [8, 1],
  [3, 4],
  [9, 4],
  [4, 6],
  [10, 6],
];

const dots = [];

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

  blacks.forEach(([x, y]) => {
    dots.push(
      new sd.Circle({
        targetNode: svg,
        cx: gx(x),
        cy: gy(y),
        r: 6,
        fill: "#222",
      }),
    );
  });
});

sd.main(async () => {
  await sd.pause();

  // Draw horizontal lines through y-coords with two or more blacks.
  const rowsByY = new Map();
  for (const [x, y] of blacks) {
    if (!rowsByY.has(y)) rowsByY.set(y, []);
    rowsByY.get(y).push(x);
  }
  const colsByX = new Map();
  for (const [x, y] of blacks) {
    if (!colsByX.has(x)) colsByX.set(x, []);
    colsByX.get(x).push(y);
  }

  for (const [y, xs] of rowsByY) {
    if (xs.length < 2) continue;
    xs.sort((a, b) => a - b);
    const line = new sd.Line({
      targetNode: svg,
      x1: gx(xs[0]),
      y1: gy(y),
      x2: gx(xs[xs.length - 1]),
      y2: gy(y),
      stroke: "#4a90e2",
      strokeWidth: 1.5,
      opacity: 0,
    });
    line.startAnimate({ duration: 400 }).setOpacity(0.6).endAnimate();
  }
  for (const [x, ys] of colsByX) {
    if (ys.length < 2) continue;
    ys.sort((a, b) => a - b);
    const line = new sd.Line({
      targetNode: svg,
      x1: gx(x),
      y1: gy(ys[0]),
      x2: gx(x),
      y2: gy(ys[ys.length - 1]),
      stroke: "#4a90e2",
      strokeWidth: 1.5,
      opacity: 0,
    });
    line.startAnimate({ duration: 400 }).setOpacity(0.6).endAnimate();
  }
  await sd.pause();

  // Mark intersection grid points (rows × cols, excluding existing blacks).
  const blackSet = new Set(blacks.map(([x, y]) => `${x},${y}`));
  for (const y of rowsByY.keys()) {
    if (rowsByY.get(y).length < 2) continue;
    for (const x of colsByX.keys()) {
      if (colsByX.get(x).length < 2) continue;
      if (blackSet.has(`${x},${y}`)) continue;
      const c = new sd.Circle({
        targetNode: svg,
        cx: gx(x),
        cy: gy(y),
        r: 5,
        fill: "#f14c4c",
        opacity: 0,
      });
      c.startAnimate({ duration: 400 }).setOpacity(1).endAnimate();
    }
  }
});
