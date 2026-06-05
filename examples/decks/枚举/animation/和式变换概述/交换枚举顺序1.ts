import * as sd from "@/sd";

import { Grid } from "../grid";

// Same n×m sample space; first scan row by row, then column by column.
// The two orders cover identical cells — that's what makes the swap legal.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const ROWS = 4;
const COLS = 6;
const SIZE = 46;

const grid = new Grid({
  targetNode: svg,
  rows: ROWS,
  cols: COLS,
  cellSize: SIZE,
});

const HL = "#dde6ef";
const HL_STROKE = C.steelBlue;

for (let i = 1; i <= ROWS; i++) {
  for (let j = 1; j <= COLS; j++) {
    new sd.Text({
      targetNode: svg,
      text: `${i},${j}`,
      cx: grid.cellCx(i, j),
      cy: grid.cellCy(i, j),
      fontSize: 11,
      fill: C.darkButtonGrey,
    });
  }
}

function pointer(side: "right" | "top", label: string, baseRow: number, baseCol: number): sd.Group {
  const SIZE_TRI = 9;
  const g = new sd.Group({ targetNode: svg });
  const cx = side === "right" ? grid.right() + 6 : grid.cellCx(1, baseCol);
  const cy = side === "right" ? grid.cellCy(baseRow, 1) : grid.top() + 6;
  const pts: Array<[number, number]> =
    side === "right"
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
  new sd.Polygon({ targetNode: g, points: pts, fill: C.steelBlue, stroke: C.none });
  new sd.Text({
    targetNode: g,
    text: label,
    cx: side === "right" ? cx + 22 : cx,
    cy: side === "right" ? cy : cy + 22,
    fontSize: 14,
    fill: C.steelBlue,
  });
  return g;
}

const pi = pointer("right", "i", 1, 1);
const pj = pointer("top", "j", 1, 1);

function moveTri(p: sd.Group, dx: number, dy: number) {
  p.startAnimate({ duration: 220, easing: E.easeOut }).setTranslate(dx, dy).endAnimate();
}

const STEP = 260;

sd.main(async () => {
  await sd.pause();
  // Pass 1: row by row.
  for (let i = 1; i <= ROWS; i++) {
    if (i > 1) grid.paintRange(i - 1, 1, i - 1, COLS, C.white, { duration: STEP });
    grid.paintRange(i, 1, i, COLS, HL, { stroke: HL_STROKE, duration: STEP, delay: i > 1 ? 40 : 0 });
    moveTri(pi, 0, grid.cellCy(i, 1) - grid.cellCy(1, 1));
    await sd.pause();
  }
  grid.paintRange(ROWS, 1, ROWS, COLS, C.white, { duration: STEP });
  await sd.pause();

  // Pass 2: column by column.
  for (let j = 1; j <= COLS; j++) {
    if (j > 1) grid.paintRange(1, j - 1, ROWS, j - 1, C.white, { duration: STEP });
    grid.paintRange(1, j, ROWS, j, HL, { stroke: HL_STROKE, duration: STEP, delay: j > 1 ? 40 : 0 });
    moveTri(pj, grid.cellCx(1, j) - grid.cellCx(1, 1), 0);
    await sd.pause();
  }
  grid.paintRange(1, COLS, ROWS, COLS, C.white, { duration: STEP });
  await sd.pause();
});
