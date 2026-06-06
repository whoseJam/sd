import * as sd from "@/sd";

import { Grid } from "../grid";

// Triangular region (j ≤ i). Row-by-row enumeration covers j ∈ [1, i];
// column-by-column covers i ∈ [j, n]. Same set of cells, swapped bounds.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 4;
const SIZE = 50;

const grid = new Grid({
  targetNode: svg,
  rows: N,
  cols: N,
  cellSize: SIZE,
});

const HL = "#dde6ef";
const HL_STROKE = C.steelBlue;

for (let i = 1; i <= N; i++) {
  for (let j = 1; j <= i; j++) {
    new sd.Text({
      targetNode: svg,
      text: `${i},${j}`,
      cx: grid.cellCx(i, j),
      cy: grid.cellCy(i, j),
      fontSize: 12,
      fill: C.darkButtonGrey,
    });
  }
}

function pointer(side: "right" | "top", label: string): sd.Group {
  const SIZE_TRI = 9;
  const g = new sd.Group({ targetNode: svg });
  const cx = side === "right" ? grid.right() + 6 : grid.cellCx(1, 1);
  const cy = side === "right" ? grid.cellCy(1, 1) : grid.top() + 6;
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
  new sd.Polygon({
    targetNode: g,
    points: pts,
    fill: C.steelBlue,
    stroke: C.none,
  });
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

const pi = pointer("right", "i");
const pj = pointer("top", "j");

function moveTri(p: sd.Group, dx: number, dy: number) {
  p.startAnimate({ duration: 220, easing: E.easeOut })
    .setTranslate(dx, dy)
    .endAnimate();
}

const STEP = 260;

function clearExcept(r1: number, c1: number, r2: number, c2: number) {
  for (let r = 1; r <= N; r++) {
    for (let c = 1; c <= N; c++) {
      if (r >= r1 && r <= r2 && c >= c1 && c <= c2) continue;
      grid.paintCell(r, c, C.white, { duration: STEP });
    }
  }
}

sd.main(async () => {
  await sd.pause();
  for (let i = 1; i <= N; i++) {
    if (i > 1) clearExcept(i, 1, i, i);
    grid.paintRange(i, 1, i, i, HL, { stroke: HL_STROKE, duration: STEP });
    moveTri(pi, 0, grid.cellCy(i, 1) - grid.cellCy(1, 1));
    await sd.pause();
  }
  clearExcept(0, 0, 0, 0);
  await sd.pause();

  for (let j = 1; j <= N; j++) {
    if (j > 1) clearExcept(j, j, N, j);
    grid.paintRange(j, j, N, j, HL, { stroke: HL_STROKE, duration: STEP });
    moveTri(pj, grid.cellCx(1, j) - grid.cellCx(1, 1), 0);
    await sd.pause();
  }
  clearExcept(0, 0, 0, 0);
  await sd.pause();
});
