import * as sd from "@/sd";
import { gridHelpers } from "./_grid";

const svg = sd.svg();
const C = sd.color();

// Map each sequence position i to a rectangle [L_i+1, i] × [i, R_i-1] in
// (l, r)-space. The union area asks: how many distinct (l, r) subintervals
// are unique-witnessed by some a_i? If it equals n(n+1)/2 the whole
// sequence is non-boring.
const N = 8;
const { UNIT, gx, gy } = gridHelpers(N + 1, N + 1, 36);

// (L, R) per element index (1-based). L_i = previous-same position or 0,
// R_i = next-same position or N+1.
const lr = [
  [0, 9],
  [0, 9],
  [0, 5],
  [0, 9],
  [3, 9],
  [0, 9],
  [0, 9],
  [0, 9],
];

sd.init(() => {
  new sd.Rect({
    targetNode: svg,
    x: gx(0),
    y: gy(0),
    width: (N + 1) * UNIT,
    height: (N + 1) * UNIT,
    fill: C.none,
    stroke: "#d0d0d0",
    strokeWidth: 1,
  });
});

sd.main(async () => {
  await sd.pause();

  for (let idx = 0; idx < lr.length; idx++) {
    const i = idx + 1;
    const [L, R] = lr[idx];
    // [L+1, i] × [i, R-1]
    const x0 = L + 1;
    const x1 = i + 1; // exclusive upper
    const y0 = i;
    const y1 = R; // exclusive upper
    const w = x1 - x0;
    const h = y1 - y0;
    if (w <= 0 || h <= 0) continue;
    const rect = new sd.Rect({
      targetNode: svg,
      x: gx(x0),
      y: gy(y0),
      width: w * UNIT,
      height: h * UNIT,
      fill: "#f58617",
      fillOpacity: 0,
      stroke: "#f58617",
      strokeWidth: 1,
      strokeOpacity: 0,
    });
    rect
      .startAnimate({ duration: 350 })
      .setFillOpacity(0.18)
      .setStrokeOpacity(0.5)
      .endAnimate();
  }
});
