import * as sd from "@/sd";

import { Grid } from "../grid";

// 4 × 5 grid with i (row) and j (column) pointers and a single sample
// square highlighted at the intersection. Static — the explanation is the
// pointers + the painted square, not a sweep.

const svg = sd.svg();
const C = sd.color();

const ROWS = 4;
const COLS = 5;
const SIZE = 50;
const I_AT = 2;
const J_AT = 2;
const D = 2;

const grid = new Grid({
  targetNode: svg,
  rows: ROWS,
  cols: COLS,
  cellSize: SIZE,
  rowLabels: ["1", "2", "3", "4"],
  colLabels: ["1", "2", "3", "4", "5"],
});

const SQR_FILL = "#dde6ef";
const SQR_STROKE = C.steelBlue;

// Pointer chevrons — small triangles outside the grid pointing inward at
// the chosen row and column.
function pointerTriangle(cx: number, cy: number, dir: "left" | "down"): sd.Polygon {
  const SIZE_TRI = 9;
  // tip points toward grid; base is on the far side.
  const points: Array<[number, number]> =
    dir === "left"
      ? [
          [cx, cy],
          [cx + SIZE_TRI, cy + SIZE_TRI / 2],
          [cx + SIZE_TRI, cy - SIZE_TRI / 2],
        ]
      : [
          [cx, cy],
          [cx - SIZE_TRI / 2, cy + SIZE_TRI],
          [cx + SIZE_TRI / 2, cy + SIZE_TRI],
        ];
  return new sd.Polygon({
    targetNode: svg,
    points,
    fill: C.steelBlue,
    stroke: C.none,
  });
}

// i pointer: on the right side of the grid, pointing left at row I_AT.
pointerTriangle(grid.right() + 6, grid.cellCy(I_AT, 1), "left");
new sd.Text({
  targetNode: svg,
  text: "i",
  cx: grid.right() + 26,
  cy: grid.cellCy(I_AT, 1),
  fontSize: 16,
  fill: C.steelBlue,
});

// j pointer: above the grid, pointing down at column J_AT.
pointerTriangle(grid.cellCx(1, J_AT), grid.top() + 6, "down");
new sd.Text({
  targetNode: svg,
  text: "j",
  cx: grid.cellCx(1, J_AT),
  cy: grid.top() + 26,
  fontSize: 16,
  fill: C.steelBlue,
});

sd.main(async () => {
  grid.paintRange(I_AT, J_AT, I_AT + D - 1, J_AT + D - 1, SQR_FILL, { stroke: SQR_STROKE });
  await sd.pause();
});
