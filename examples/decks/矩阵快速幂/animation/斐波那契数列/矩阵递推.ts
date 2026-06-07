import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Fill F = [[1, 1], [1, 0]] into the ?-template. No captions inside —
// the surrounding slide carries the explanation.
// Style matches 矩阵乘法 / 线性组合 (custom cells, folded-corner brackets).

const NEUTRAL = C.darkButtonGrey;
const HL = C.darkOrange;

const CELL_W = 30;
const CELL_H = 26;
const GAP = 2;

const Y = 0;

interface CellVis {
  question: sd.Math;
  filled: sd.Math;
  row: number;
  col: number;
}
interface Grid {
  cells: CellVis[];
  brackets: sd.Path[];
}

function makeMGrid(
  cx: number,
  cy: number,
  finalValues: string[][],
  fontSize = 16,
): Grid {
  const rows = finalValues.length;
  const cols = finalValues[0].length;
  const matrixW = cols * CELL_W + (cols - 1) * GAP;
  const matrixH = rows * CELL_H + (rows - 1) * GAP;

  const cells: CellVis[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cellCx = cx - matrixW / 2 + j * (CELL_W + GAP) + CELL_W / 2;
      const cellCy = cy + matrixH / 2 - (i + 1) * CELL_H - i * GAP + CELL_H / 2;
      cells.push({
        question: new sd.Math({
          targetNode: svg,
          text: "?",
          cx: cellCx,
          cy: cellCy,
          fontSize,
          fill: NEUTRAL,
          opacity: 0,
        }),
        filled: new sd.Math({
          targetNode: svg,
          text: finalValues[i][j],
          cx: cellCx,
          cy: cellCy,
          fontSize,
          fill: HL,
          opacity: 0,
        }),
        row: i,
        col: j,
      });
    }
  }

  const halfW = matrixW / 2 + 4;
  const halfH = matrixH / 2 + 2;
  const brackets: sd.Path[] = [
    new sd.Path({
      targetNode: svg,
      d: `M ${cx - halfW + 4} ${cy + halfH} L ${cx - halfW} ${cy + halfH} L ${cx - halfW} ${cy - halfH} L ${cx - halfW + 4} ${cy - halfH}`,
      stroke: NEUTRAL,
      strokeWidth: 1.2,
      fill: "none",
      opacity: 0,
    }),
    new sd.Path({
      targetNode: svg,
      d: `M ${cx + halfW - 4} ${cy + halfH} L ${cx + halfW} ${cy + halfH} L ${cx + halfW} ${cy - halfH} L ${cx + halfW - 4} ${cy - halfH}`,
      stroke: NEUTRAL,
      strokeWidth: 1.2,
      fill: "none",
      opacity: 0,
    }),
  ];
  return { cells, brackets };
}

interface SimpleGrid {
  cells: sd.Math[];
  brackets: sd.Path[];
}
function makeSimpleGrid(
  cx: number,
  cy: number,
  values: string[][],
  fontSize = 13,
): SimpleGrid {
  const rows = values.length;
  const cols = values[0].length;
  const matrixW = cols * CELL_W + (cols - 1) * GAP;
  const matrixH = rows * CELL_H + (rows - 1) * GAP;

  const cells: sd.Math[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cellCx = cx - matrixW / 2 + j * (CELL_W + GAP) + CELL_W / 2;
      const cellCy = cy + matrixH / 2 - (i + 1) * CELL_H - i * GAP + CELL_H / 2;
      cells.push(
        new sd.Math({
          targetNode: svg,
          text: values[i][j],
          cx: cellCx,
          cy: cellCy,
          fontSize,
          fill: NEUTRAL,
          opacity: 0,
        }),
      );
    }
  }

  const halfW = matrixW / 2 + 4;
  const halfH = matrixH / 2 + 2;
  const brackets: sd.Path[] = [
    new sd.Path({
      targetNode: svg,
      d: `M ${cx - halfW + 4} ${cy + halfH} L ${cx - halfW} ${cy + halfH} L ${cx - halfW} ${cy - halfH} L ${cx - halfW + 4} ${cy - halfH}`,
      stroke: NEUTRAL,
      strokeWidth: 1.2,
      fill: "none",
      opacity: 0,
    }),
    new sd.Path({
      targetNode: svg,
      d: `M ${cx + halfW - 4} ${cy + halfH} L ${cx + halfW} ${cy + halfH} L ${cx + halfW} ${cy - halfH} L ${cx + halfW - 4} ${cy - halfH}`,
      stroke: NEUTRAL,
      strokeWidth: 1.2,
      fill: "none",
      opacity: 0,
    }),
  ];
  return { cells, brackets };
}

const DUR = 320;
type AnyEl = sd.Math | sd.Path | sd.Text;

function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function fadeOut(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
}

function fillCell(c: CellVis, delay = 0) {
  fadeOut(c.question, delay);
  fadeIn(c.filled, delay + 60);
}

const M = makeMGrid(-130, Y, [
  ["1", "1"],
  ["1", "0"],
]);
const V = makeSimpleGrid(-60, Y, [["f_{n-1}"], ["f_{n-2}"]], 13);
const R = makeSimpleGrid(20, Y, [["f_n"], ["f_{n-1}"]], 13);

const eqSign = new sd.Text({
  targetNode: svg,
  text: "=",
  cx: -22,
  cy: Y,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});

sd.main(async () => {
  // p1: ?-template + vectors + = sign.
  for (const b of M.brackets) fadeIn(b);
  for (const c of M.cells) fadeIn(c.question, 80);
  for (const b of V.brackets) fadeIn(b, 100);
  for (const c of V.cells) fadeIn(c, 180);
  fadeIn(eqSign, 200);
  for (const b of R.brackets) fadeIn(b, 250);
  for (const c of R.cells) fadeIn(c, 330);
  await sd.pause();

  // p2: top row of M fills (1, 1).
  fillCell(M.cells[0]);
  fillCell(M.cells[1], 100);
  await sd.pause();

  // p3: bottom row fills (1, 0).
  fillCell(M.cells[2]);
  fillCell(M.cells[3], 100);
  await sd.pause();
});
