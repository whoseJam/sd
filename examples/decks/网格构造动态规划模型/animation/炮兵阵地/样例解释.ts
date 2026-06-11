import * as sd from "@/sd";

import { fadeInGrid, makeGrid } from "../common/grid";
import {
  CANNON,
  fadeIn,
  fadeOpacity,
  MOUNTAIN,
  setFill,
} from "../common/style";

const svg = sd.svg();

const ROWS = 5;
const COLS = 5;
const CELL = 40;

const grid = makeGrid(svg, {
  rows: ROWS,
  cols: COLS,
  cellW: CELL,
  cellH: CELL,
  gap: 3,
  cx: -120,
  cy: 0,
});

const mountains: [number, number][] = [
  [1, 1],
  [2, 3],
  [3, 0],
];
const cannons: [number, number][] = [
  [0, 0],
  [2, 2],
  [4, 4],
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

const attackOverlays: sd.Rect[][] = cannons.map(([r, c]) => {
  const overlays: sd.Rect[] = [];
  const offsets = [
    [0, -2],
    [0, -1],
    [0, 1],
    [0, 2],
    [-2, 0],
    [-1, 0],
    [1, 0],
    [2, 0],
  ];
  for (const [dr, dc] of offsets) {
    const rr = r + dr;
    const cc = c + dc;
    if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue;
    const cell = grid.cells[rr][cc];
    overlays.push(
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
  return overlays;
});

const note = new sd.Math({
  targetNode: svg,
  text: "\\text{灰格为山地, 不可部署}",
  cx: 160,
  cy: 0,
  fontSize: 16,
  opacity: 0,
});

sd.main(async () => {
  fadeInGrid(grid, 0, 10);
  for (const [r, c] of mountains) {
    setFill(grid.cells[r][c].bg, MOUNTAIN, 250);
  }
  fadeIn(note, 400);
  await sd.pause();

  for (let i = 0; i < cannons.length; i++) {
    fadeIn(cannonNodes[i], i * 80);
  }
  await sd.pause();

  for (let i = 0; i < attackOverlays.length; i++) {
    for (let j = 0; j < attackOverlays[i].length; j++) {
      attackOverlays[i][j]
        .startAnimate({ delay: j * 30, duration: 220 })
        .setOpacity(0.25)
        .endAnimate();
    }
  }
  await sd.pause();

  for (let i = 0; i < attackOverlays.length; i++) {
    for (const o of attackOverlays[i]) fadeOpacity(o, 0);
  }
  await sd.pause();
});
