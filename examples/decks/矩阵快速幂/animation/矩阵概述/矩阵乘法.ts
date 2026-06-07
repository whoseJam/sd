import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// 2x2 matrix multiply with concrete numbers. Walk each result cell;
// highlight the contributing row of A and column of B, then fill C.
// Coordinate system: math y-up (positive y is visually up). Rect's y
// is the BOTTOM edge of the cell in math coords. Row 0 is the TOP of
// the matrix → its bottom edge sits at the highest math-y.

const A = [
  [1, 2],
  [3, 4],
];
const B = [
  [5, 6],
  [7, 8],
];
const CV = [
  [19, 22],
  [43, 50],
];

const NEUTRAL = C.darkButtonGrey;
const ROW_HL = C.blue;
const COL_HL = C.darkOrange;
const RES_HL = C.darkOrange;

const CELL = 34;
const GAP = 2;
const A_CX = -135;
const B_CX = -40;
const EQ_X = 25;
const C_CX = 95;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}

function cellY(row: number): number {
  // Row 0 (top): bottom edge at GAP/2 (above center).
  // Row 1 (bottom): bottom edge at -(CELL + GAP/2).
  return GAP / 2 - row * (CELL + GAP);
}

function cellX(matrixCx: number, col: number): number {
  return matrixCx - CELL - GAP / 2 + col * (CELL + GAP);
}

function makeCell(
  matrixCx: number,
  row: number,
  col: number,
  value: string,
): Cell {
  const x = cellX(matrixCx, col);
  const y = cellY(row);
  return {
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
      text: value,
      cx: x + CELL / 2,
      cy: y + CELL / 2,
      fontSize: 18,
      fill: NEUTRAL,
      opacity: 0,
    }),
  };
}

// Brackets for each matrix, rendered LaTeX-style with thin strokes.
function makeBracket(matrixCx: number, side: "L" | "R"): sd.Path {
  const halfW = CELL + GAP / 2;
  const halfH = CELL + GAP / 2 + 2;
  const cx = side === "L" ? matrixCx - halfW - 6 : matrixCx + halfW + 6;
  const tip = side === "L" ? 5 : -5;
  return new sd.Path({
    targetNode: svg,
    d: `M ${cx + tip} ${halfH} L ${cx} ${halfH} L ${cx} ${-halfH} L ${cx + tip} ${-halfH}`,
    stroke: NEUTRAL,
    strokeWidth: 1.4,
    fill: "none",
    opacity: 0,
  });
}

const aCells: Cell[][] = [];
const bCells: Cell[][] = [];
const cCells: Cell[][] = [];
for (let i = 0; i < 2; i++) {
  aCells.push([]);
  bCells.push([]);
  cCells.push([]);
  for (let j = 0; j < 2; j++) {
    aCells[i].push(makeCell(A_CX, i, j, String(A[i][j])));
    bCells[i].push(makeCell(B_CX, i, j, String(B[i][j])));
    cCells[i].push(makeCell(C_CX, i, j, "?"));
  }
}

const brackets = [
  makeBracket(A_CX, "L"),
  makeBracket(A_CX, "R"),
  makeBracket(B_CX, "L"),
  makeBracket(B_CX, "R"),
  makeBracket(C_CX, "L"),
  makeBracket(C_CX, "R"),
];

const eqSign = new sd.Text({
  targetNode: svg,
  text: "=",
  cx: EQ_X,
  cy: 0,
  fontSize: 20,
  fill: NEUTRAL,
  opacity: 0,
});

// Summary formula shown only in p1. Replaced by colored tokens once we
// start walking individual result cells.
const formula = new sd.Math({
  targetNode: svg,
  text: "C_{ij} = \\sum_k A_{ik} B_{kj}",
  cx: 0,
  cy: -65,
  fontSize: 14,
  fill: NEUTRAL,
  opacity: 0,
});

// Per-token arithmetic caption: [a × b + c × d = e]. Each token is its
// own sd.Text so digits can be colored independently — \textcolor in
// MathJax3 needs the color extension, which isn't bundled here.
const TOKEN_FILLS = [
  ROW_HL,
  NEUTRAL,
  COL_HL,
  NEUTRAL,
  ROW_HL,
  NEUTRAL,
  COL_HL,
  NEUTRAL,
  RES_HL,
];
const TOKEN_OPS: Record<number, string> = {
  1: "×",
  3: "+",
  5: "×",
  7: "=",
};
const TOKEN_X_STEP = 20;
const TOKEN_CY = -65;
const TOKEN_FONT = 16;
const tokens: sd.Text[] = TOKEN_FILLS.map(
  (fill, i) =>
    new sd.Text({
      targetNode: svg,
      text: TOKEN_OPS[i] ?? "",
      cx: (i - 4) * TOKEN_X_STEP,
      cy: TOKEN_CY,
      fontSize: TOKEN_FONT,
      fill,
      opacity: 0,
    }),
);

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Path;

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

function setToken(idx: number, value: string, delay = 0) {
  tokens[idx]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setText(value)
    .setCx((idx - 4) * TOKEN_X_STEP)
    .setCy(TOKEN_CY)
    .endAnimate();
}

function colorCellText(cell: Cell, color: string, delay = 0) {
  cell.text
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

function uncolorCellText(cell: Cell, delay = 0) {
  cell.text
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(NEUTRAL)
    .endAnimate();
}

function fillResult(i: number, j: number, value: number, delay = 0) {
  const cx = cellX(C_CX, j) + CELL / 2;
  const cy = cellY(i) + CELL / 2;
  cCells[i][j].text
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setText(String(value))
    .setCx(cx)
    .setCy(cy)
    .setFill(RES_HL)
    .endAnimate();
}

sd.main(async () => {
  // p1: brackets + cells + numbers + neutral summary formula.
  for (const b of brackets) fadeIn(b);
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      fadeIn(aCells[i][j].text, 80);
      fadeIn(bCells[i][j].text, 100);
      fadeIn(cCells[i][j].text, 120);
    }
  }
  fadeIn(eqSign, 80);
  fadeIn(formula, 200);
  await sd.pause();

  // p2-p5: each C cell — re-color row of A and column of B,
  // re-write the formula, fill the result.
  const order: Array<[number, number]> = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];
  let prevRow = -1;
  let prevCol = -1;
  let firstIter = true;
  for (const [i, j] of order) {
    if (prevRow !== -1 && prevRow !== i) {
      for (const c of aCells[prevRow]) uncolorCellText(c);
    }
    if (prevCol !== -1 && prevCol !== j) {
      uncolorCellText(bCells[0][prevCol]);
      uncolorCellText(bCells[1][prevCol]);
    }
    if (prevRow !== i) for (const c of aCells[i]) colorCellText(c, ROW_HL, 60);
    if (prevCol !== j) {
      colorCellText(bCells[0][j], COL_HL, 60);
      colorCellText(bCells[1][j], COL_HL, 60);
    }
    // Drop the summary formula on the first iteration, then bring up the
    // colored arithmetic tokens.
    if (firstIter) {
      fadeOut(formula);
      for (const t of tokens) fadeIn(t, 150);
      firstIter = false;
    }
    setToken(0, String(A[i][0]), 200);
    setToken(2, String(B[0][j]), 200);
    setToken(4, String(A[i][1]), 200);
    setToken(6, String(B[1][j]), 200);
    setToken(8, String(CV[i][j]), 200);
    fillResult(i, j, CV[i][j], 300);
    prevRow = i;
    prevCol = j;
    await sd.pause();
  }
});
