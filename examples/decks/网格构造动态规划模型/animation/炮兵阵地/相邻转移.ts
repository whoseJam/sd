import * as sd from "@/sd";

import { fadeInGrid, makeGrid } from "../common/grid";
import { CANNON, fadeIn, NEUTRAL } from "../common/style";

const svg = sd.svg();

const ROWS = 3;
const COLS = 5;
const CELL = 40;

const grid = makeGrid(svg, {
  rows: ROWS,
  cols: COLS,
  cellW: CELL,
  cellH: CELL,
  gap: 3,
  cx: -80,
  cy: 0,
});

const cannons: [number, number][] = [
  [0, 0],
  [0, 4],
];

const cannonNodes = cannons.map(([r, c]) => {
  const cell = grid.cells[r][c];
  return new sd.Text({
    targetNode: svg,
    text: "●",
    cx: cell.cx,
    cy: cell.cy,
    fontSize: 22,
    fill: CANNON,
    opacity: 0,
  });
});

const downReach: sd.Rect[] = [];
for (const [r, c] of cannons) {
  for (let dr = 1; dr <= 2; dr++) {
    const rr = r + dr;
    if (rr >= ROWS) continue;
    const cell = grid.cells[rr][c];
    downReach.push(
      new sd.Rect({
        targetNode: svg,
        x: cell.cx - CELL / 2,
        y: cell.cy - CELL / 2,
        width: CELL,
        height: CELL,
        fill: CANNON,
        stroke: CANNON,
        strokeWidth: 1,
        opacity: 0,
      }),
    );
  }
}

const rowLabels = ["i", "i+1", "i+2"].map((s, idx) => {
  return new sd.Math({
    targetNode: svg,
    text: s,
    cx: grid.cxOf(0) - CELL * 1.2,
    cy: grid.cyOf(idx),
    fontSize: 16,
    fill: NEUTRAL,
    opacity: 0,
  });
});

const note = new sd.Math({
  targetNode: svg,
  text: "\\text{炮兵向下攻击两行}",
  cx: 200,
  cy: 0,
  fontSize: 16,
  opacity: 0,
});

sd.main(async () => {
  fadeInGrid(grid, 0, 12);
  for (let i = 0; i < rowLabels.length; i++) fadeIn(rowLabels[i], 100 + i * 60);
  await sd.pause();

  for (let i = 0; i < cannonNodes.length; i++) fadeIn(cannonNodes[i], i * 80);
  await sd.pause();

  for (let i = 0; i < downReach.length; i++) {
    downReach[i]
      .startAnimate({ delay: i * 60, duration: 220 })
      .setOpacity(0.28)
      .endAnimate();
  }
  fadeIn(note, downReach.length * 60 + 200);
  await sd.pause();
});
