import * as sd from "@/sd";

import { Grid } from "../lib/grid";

// 4×4 matrix with one cell highlighted to illustrate the row-sum /
// col-sum query.

const svg = sd.svg();
const C = sd.color();

const N = 4;
const SIZE = 50;
const grid = new Grid({
  targetNode: svg,
  rows: N,
  cols: N,
  cellSize: SIZE,
  rowLabels: ["1", "2", "3", "4"],
  colLabels: ["1", "2", "3", "4"],
});

grid.paintRange(2, 2, 3, 3, "#cfead0", { stroke: C.darkGreen, duration: 240 });

sd.main(async () => {
  await sd.pause();
});
