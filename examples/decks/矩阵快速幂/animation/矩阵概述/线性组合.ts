import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Matrix-vector mult Av as linear combination — row-wise reading.
// v's entries are abstract "things" (🍎, 🍌); A's rows give weights.
// Each entry of the result is one row of A combined with v:
//   (Av)_i = A_{i,0} · 🍎 + A_{i,1} · 🍌

const NEUTRAL = C.darkButtonGrey;
const R0_HL = C.blue;
const R1_HL = C.darkOrange;

const CELL = 22;
const GAP = 2;

const TOP_Y = 0;

interface CellVis {
  bg: sd.Rect;
  text: sd.Text;
  row: number;
  col: number;
}
interface Grid {
  cells: CellVis[];
  brackets: sd.Path[];
}

function makeGrid(
  cx: number,
  cy: number,
  values: string[][],
  fontSize = 14,
): Grid {
  const rows = values.length;
  const cols = values[0].length;
  const matrixW = cols * CELL + (cols - 1) * GAP;
  const matrixH = rows * CELL + (rows - 1) * GAP;

  const cells: CellVis[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = cx - matrixW / 2 + j * (CELL + GAP);
      const y = cy + matrixH / 2 - (i + 1) * CELL - i * GAP;
      cells.push({
        bg: new sd.Rect({
          targetNode: svg,
          x,
          y,
          width: CELL,
          height: CELL,
          fill: "none",
          stroke: "none",
          opacity: 0,
        }),
        text: new sd.Text({
          targetNode: svg,
          text: values[i][j],
          cx: x + CELL / 2,
          cy: y + CELL / 2,
          fontSize,
          fill: NEUTRAL,
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

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Path;

function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function colorTextEl(t: sd.Text | sd.Math, color: string, delay = 0) {
  t.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

function gridFadeIn(g: Grid, delay = 0) {
  for (const b of g.brackets) fadeIn(b, delay);
  for (const c of g.cells) fadeIn(c.text, delay + 80);
}

function colorRow(g: Grid, row: number, color: string, delay = 0) {
  for (const c of g.cells) {
    if (c.row === row) colorTextEl(c.text, color, delay);
  }
}

// ===== Layout =====
const A_CX = -135;
const V_CX = -75;
const EQ_X = -45;
const RES_CX = 30;

const A_GRID = makeGrid(A_CX, TOP_Y, [
  ["3", "5"],
  ["2", "1"],
]);
const V_GRID = makeGrid(V_CX, TOP_Y, [["🍎"], ["🍌"]], 18);

const eqSign = new sd.Text({
  targetNode: svg,
  text: "=",
  cx: EQ_X,
  cy: TOP_Y,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});

// Result column. Each row holds a Math expression; brackets enclose both.
const RES_W = 90;
const RES_H = 2 * CELL + GAP;
const resBracketL = new sd.Path({
  targetNode: svg,
  d: `M ${RES_CX - RES_W / 2 + 4} ${TOP_Y + RES_H / 2 + 2} L ${RES_CX - RES_W / 2} ${TOP_Y + RES_H / 2 + 2} L ${RES_CX - RES_W / 2} ${TOP_Y - RES_H / 2 - 2} L ${RES_CX - RES_W / 2 + 4} ${TOP_Y - RES_H / 2 - 2}`,
  stroke: NEUTRAL,
  strokeWidth: 1.2,
  fill: "none",
  opacity: 0,
});
const resBracketR = new sd.Path({
  targetNode: svg,
  d: `M ${RES_CX + RES_W / 2 - 4} ${TOP_Y + RES_H / 2 + 2} L ${RES_CX + RES_W / 2} ${TOP_Y + RES_H / 2 + 2} L ${RES_CX + RES_W / 2} ${TOP_Y - RES_H / 2 - 2} L ${RES_CX + RES_W / 2 - 4} ${TOP_Y - RES_H / 2 - 2}`,
  stroke: NEUTRAL,
  strokeWidth: 1.2,
  fill: "none",
  opacity: 0,
});

const resultRow1 = new sd.Math({
  targetNode: svg,
  text: "3 \\cdot \\text{🍎} + 5 \\cdot \\text{🍌}",
  cx: RES_CX,
  cy: TOP_Y + (CELL + GAP) / 2,
  fontSize: 13,
  fill: NEUTRAL,
  opacity: 0,
});
const resultRow2 = new sd.Math({
  targetNode: svg,
  text: "2 \\cdot \\text{🍎} + 1 \\cdot \\text{🍌}",
  cx: RES_CX,
  cy: TOP_Y - (CELL + GAP) / 2,
  fontSize: 13,
  fill: NEUTRAL,
  opacity: 0,
});

sd.main(async () => {
  // p1: A (weights), v (emoji elements), = sign, empty result bracket.
  gridFadeIn(A_GRID, 0);
  gridFadeIn(V_GRID, 150);
  fadeIn(eqSign, 280);
  fadeIn(resBracketL, 350);
  fadeIn(resBracketR, 350);
  await sd.pause();

  // p2: row 0 of A → blue. Top result entry "3·🍎 + 5·🍌" fades in (blue).
  colorRow(A_GRID, 0, R0_HL);
  resultRow1
    .startAnimate({ delay: 100, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .setFill(R0_HL)
    .endAnimate();
  await sd.pause();

  // p3: row 1 → orange. Bottom result "2·🍎 + 1·🍌" fades in (orange).
  colorRow(A_GRID, 1, R1_HL);
  resultRow2
    .startAnimate({ delay: 100, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .setFill(R1_HL)
    .endAnimate();
  await sd.pause();
});
