import * as sd from "@/sd";

import { Grid } from "../grid";

// Divisor lattice: cell (i, d) is populated iff d | i. Row scan walks
// i = 1..N and lights up that row's divisors; column scan walks d = 1..N
// and lights up the multiples i = d, 2d, .... Both passes touch the same
// cells — only the valid cells are colored so the eye doesn't track noise.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 6;
const SIZE = 44;

const grid = new Grid({
  targetNode: svg,
  rows: N,
  cols: N,
  cellSize: SIZE,
});

const HL = "#dde6ef";
const HL_STROKE = C.steelBlue;

for (let i = 1; i <= N; i++) {
  for (let d = 1; d <= i; d++) {
    if (i % d !== 0) continue;
    new sd.Text({
      targetNode: svg,
      text: String(d),
      cx: grid.cellCx(i, d),
      cy: grid.cellCy(i, d),
      fontSize: 14,
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
const pd = pointer("top", "d");

function moveTri(p: sd.Group, dx: number, dy: number) {
  p.startAnimate({ duration: 220, easing: E.easeOut })
    .setTranslate(dx, dy)
    .endAnimate();
}

const STEP = 260;

function clearRow(skipRow: number) {
  for (let r = 1; r <= N; r++) {
    if (r === skipRow) continue;
    for (let c = 1; c <= N; c++)
      grid.paintCell(r, c, C.white, { duration: STEP });
  }
}

function clearCol(skipCol: number) {
  for (let c = 1; c <= N; c++) {
    if (c === skipCol) continue;
    for (let r = 1; r <= N; r++)
      grid.paintCell(r, c, C.white, { duration: STEP });
  }
}

sd.main(async () => {
  await sd.pause();
  for (let i = 1; i <= N; i++) {
    if (i > 1) clearRow(i);
    for (let d = 1; d <= i; d++) {
      if (i % d !== 0) continue;
      grid.paintCell(i, d, HL, { stroke: HL_STROKE, duration: STEP });
    }
    moveTri(pi, 0, grid.cellCy(i, 1) - grid.cellCy(1, 1));
    await sd.pause();
  }
  clearRow(0);
  await sd.pause();

  for (let d = 1; d <= N; d++) {
    if (d > 1) clearCol(d);
    for (let i = d; i <= N; i += d) {
      grid.paintCell(i, d, HL, { stroke: HL_STROKE, duration: STEP });
    }
    moveTri(pd, grid.cellCx(1, d) - grid.cellCx(1, 1), 0);
    await sd.pause();
  }
  clearCol(0);
  await sd.pause();
});
