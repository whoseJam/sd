import * as sd from "@/sd";
import { gridHelpers } from "./_grid";

const svg = sd.svg();
const C = sd.color();

// Each star turns into a W×H rectangle of "anchor positions that include
// this star". Overlapping regions = positions seeing multiple stars at once.
// The problem becomes: max overlap depth among these rectangles.
const GRID_W = 14;
const GRID_H = 8;
const { UNIT, gx, gy } = gridHelpers(GRID_W, GRID_H, 36);

const WIN_W = 4;
const WIN_H = 3;
const stars = [
  [4, 4],
  [6, 5],
  [7, 3],
  [9, 5],
  [10, 4],
];

const starNodes = [];
const rectNodes = [];

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
    starNodes.push(
      new sd.Circle({
        targetNode: svg,
        cx: gx(x),
        cy: gy(y),
        r: 5,
        fill: "#444",
      }),
    );
  });
});

sd.main(async () => {
  await sd.pause();

  // Each star: bottom-left of the rectangle is (x - W + 1, y - H + 1),
  // top-right is the star itself.
  stars.forEach(([x, y]) => {
    const rect = new sd.Rect({
      targetNode: svg,
      x: gx(x - WIN_W + 1),
      y: gy(y - WIN_H + 1),
      width: WIN_W * UNIT,
      height: WIN_H * UNIT,
      fill: "#f58617",
      fillOpacity: 0,
      stroke: "#f58617",
      strokeWidth: 1,
      strokeOpacity: 0,
    });
    rectNodes.push(rect);
  });
  for (const rect of rectNodes) {
    rect
      .startAnimate({ duration: 600 })
      .setFillOpacity(0.18)
      .setStrokeOpacity(0.6)
      .endAnimate();
  }
  await sd.pause();
});
