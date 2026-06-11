import * as sd from "@/sd";

import { fadeInGrid, makeGrid } from "../common/grid";
import {
  BARREN,
  CORN,
  fadeIn,
  FERTILE,
  NEUTRAL_STROKE,
  setFill,
} from "../common/style";

const svg = sd.svg();

const ROWS = 3;
const COLS = 4;
const CELL = 46;

const grid = makeGrid(svg, {
  rows: ROWS,
  cols: COLS,
  cellW: CELL,
  cellH: CELL,
  gap: 3,
  cx: -120,
  cy: 0,
  fill: FERTILE,
  stroke: NEUTRAL_STROKE,
});

const barren: [number, number][] = [
  [0, 1],
  [1, 3],
  [2, 1],
];
const corn: [number, number][] = [
  [0, 0],
  [0, 2],
  [1, 0],
  [1, 2],
  [2, 0],
  [2, 2],
];

const cornNodes = corn.map(([r, c]) => {
  const cell = grid.cells[r][c];
  return new sd.Text({
    targetNode: svg,
    text: "★",
    cx: cell.cx,
    cy: cell.cy,
    fontSize: 24,
    fill: CORN,
    opacity: 0,
  });
});

const note = new sd.Math({
  targetNode: svg,
  text: "\\text{相邻不能同时种}",
  cx: 200,
  cy: 0,
  fontSize: 16,
  opacity: 0,
});

sd.main(async () => {
  fadeInGrid(grid, 0, 12);
  for (const [r, c] of barren) setFill(grid.cells[r][c].bg, BARREN, 220);
  fadeIn(note, 400);
  await sd.pause();

  for (let i = 0; i < cornNodes.length; i++) fadeIn(cornNodes[i], i * 80);
  await sd.pause();
});
