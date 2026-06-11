import * as sd from "@/sd";

import { fadeInGrid, makeGrid } from "../common/grid";
import { fadeIn, KING, setFill } from "../common/style";

const svg = sd.svg();

const N = 3;
const CELL = 52;
const grid = makeGrid(svg, {
  rows: N,
  cols: N,
  cellW: CELL,
  cellH: CELL,
  gap: 3,
  cx: -120,
  cy: 0,
});

const kings: [number, number][] = [
  [0, 0],
  [0, 2],
  [2, 1],
];
const kingNodes = kings.map(([r, c]) => {
  const cell = grid.cells[r][c];
  return new sd.Text({
    targetNode: svg,
    text: "♚",
    cx: cell.cx,
    cy: cell.cy,
    fontSize: 32,
    fill: KING,
    opacity: 0,
  });
});

const attackDots: sd.Circle[][] = kings.map(([r, c]) => {
  const dots: sd.Circle[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const rr = r + dr;
      const cc = c + dc;
      if (rr < 0 || rr >= N || cc < 0 || cc >= N) continue;
      const cell = grid.cells[rr][cc];
      dots.push(
        new sd.Circle({
          targetNode: svg,
          cx: cell.cx,
          cy: cell.cy,
          r: 5,
          fill: KING,
          opacity: 0,
        }),
      );
    }
  }
  return dots;
});

const note = new sd.Math({
  targetNode: svg,
  text: "N=3,\\ K=3",
  cx: 130,
  cy: 0,
  fontSize: 22,
  opacity: 0,
});

sd.main(async () => {
  fadeInGrid(grid, 0, 25);
  fadeIn(note, 400);
  await sd.pause();

  for (let i = 0; i < kings.length; i++) {
    fadeIn(kingNodes[i]);
    await sd.pause();
    for (let j = 0; j < attackDots[i].length; j++) {
      fadeIn(attackDots[i][j], j * 35);
      setFill(grid.cells[0][0].bg, "#fdecd9", 0);
    }
    await sd.pause();
  }
});
