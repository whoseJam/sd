import * as sd from "@/sd";
import { gridHelpers } from "./_grid";

const svg = sd.svg();
const C = sd.color();

// Stars on a plane plus one W×H window. Stars inside the window are
// highlighted; the window slides between two positions to convey
// "max-stars-in-the-window" as the goal.
const GRID_W = 14;
const GRID_H = 8;
const { UNIT, gx, gy } = gridHelpers(GRID_W, GRID_H, 36);

const WIN_W = 4;
const WIN_H = 3;
const stars = [
  [2, 1],
  [3, 4],
  [5, 2],
  [6, 5],
  [7, 1],
  [8, 6],
  [9, 3],
  [10, 5],
  [11, 2],
];

const starNodes = [];
let windowRect;

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

function inWindow(starIdx, wx, wy) {
  const [x, y] = stars[starIdx];
  return x >= wx && x < wx + WIN_W && y >= wy && y < wy + WIN_H;
}

function highlightStars(wx, wy) {
  starNodes.forEach((node, i) => {
    const inside = inWindow(i, wx, wy);
    node.startAnimate({ duration: 400 }).setFill(inside ? "#f14c4c" : "#444").endAnimate();
  });
}

sd.main(async () => {
  await sd.pause();

  windowRect = new sd.Rect({
    targetNode: svg,
    x: gx(1),
    y: gy(1),
    width: WIN_W * UNIT,
    height: WIN_H * UNIT,
    fill: "#4a90e2",
    fillOpacity: 0.12,
    stroke: "#4a90e2",
    strokeWidth: 2,
    opacity: 0,
  });
  windowRect.startAnimate({ duration: 400 }).setOpacity(1).endAnimate();
  highlightStars(1, 1);
  await sd.pause();

  // slide window: try a couple more anchor positions
  const stops = [
    [4, 3],
    [7, 2],
    [6, 4],
  ];
  for (const [wx, wy] of stops) {
    windowRect.startAnimate({ duration: 600 }).setX(gx(wx)).setY(gy(wy)).endAnimate();
    highlightStars(wx, wy);
    await sd.pause();
  }
});
