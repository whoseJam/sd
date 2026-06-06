import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// 2x + y - z = 5
// 4x + 3y + z = 13
// -2x + 2y + 3z = 4
//
// Step 1: R2 -= 2 R1; R3 += R1.
// Step 2: R3 -= 3 R2.
// Result: upper triangular, z = 0, y = 3, x = 1.

const ROWS = 3;
const COLS = 4;
const CELL_W = 30;
const CELL_H = 24;
const COL_GAP = 4;
const ROW_GAP = 6;
const AUG_GAP = 10;

function cellCenter(r: number, c: number): { cx: number; cy: number } {
  const totalWidth =
    COLS * CELL_W + (COLS - 1) * COL_GAP + AUG_GAP;
  const x0 = -totalWidth / 2 + CELL_W / 2;
  let cx = x0 + c * (CELL_W + COL_GAP);
  if (c >= COLS - 1) cx += AUG_GAP;
  const totalHeight = ROWS * CELL_H + (ROWS - 1) * ROW_GAP;
  const y0 = totalHeight / 2 - CELL_H / 2;
  const cy = y0 - r * (CELL_H + ROW_GAP);
  return { cx, cy };
}

const STAGES: number[][][] = [
  [
    [2, 1, -1, 5],
    [4, 3, 1, 13],
    [-2, 2, 3, 4],
  ],
  [
    [2, 1, -1, 5],
    [0, 1, 3, 3],
    [0, 3, 2, 9],
  ],
  [
    [2, 1, -1, 5],
    [0, 1, 3, 3],
    [0, 0, -7, 0],
  ],
];

const cellBgs: sd.Rect[][] = [];
const cellTexts: sd.Text[][] = [];
for (let r = 0; r < ROWS; r++) {
  const rowBgs: sd.Rect[] = [];
  const rowTexts: sd.Text[] = [];
  for (let c = 0; c < COLS; c++) {
    const { cx, cy } = cellCenter(r, c);
    rowBgs.push(
      new sd.Rect({
        targetNode: svg,
        x: cx - CELL_W / 2, y: cy - CELL_H / 2,
        width: CELL_W, height: CELL_H,
        fill: C.white,
        stroke: C.silver,
        strokeWidth: 0.8,
        rx: 3, ry: 3,
        opacity: 0,
      }),
    );
    rowTexts.push(
      new sd.Text({
        targetNode: svg,
        text: String(STAGES[0][r][c]),
        cx, cy: cy - 1,
        fontSize: 12,
        fill: C.darkButtonGrey,
        opacity: 0,
      }),
    );
  }
  cellBgs.push(rowBgs);
  cellTexts.push(rowTexts);
}

// Augment-bar between columns 3 and 4.
const augBar = (() => {
  const { cx: cxLeft } = cellCenter(0, COLS - 2);
  const { cx: cxRight } = cellCenter(0, COLS - 1);
  const x = (cxLeft + cxRight) / 2;
  const { cy: cyTop } = cellCenter(0, 0);
  const { cy: cyBot } = cellCenter(ROWS - 1, 0);
  return new sd.Line({
    targetNode: svg,
    x1: x, y1: cyTop + CELL_H / 2,
    x2: x, y2: cyBot - CELL_H / 2,
    stroke: C.darkButtonGrey,
    strokeWidth: 1,
    opacity: 0,
  });
})();

const PIVOT_STROKE = C.steelBlue;
const PIVOT_FILL = "#e3f2fd";
const ANSWER_STROKE = C.darkOrange;
const ANSWER_FILL = "#fdecd9";

sd.main(async () => {
  // p1: matrix appears
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const d = (r * COLS + c) * 30;
      cellBgs[r][c]
        .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
        .setOpacity(1).endAnimate();
      cellTexts[r][c]
        .startAnimate({ delay: d + 60, duration: 240, easing: E.easeOut })
        .setOpacity(1).endAnimate();
    }
  }
  augBar
    .startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();

  // p2: highlight R1 as pivot row, then update R2 and R3.
  for (let c = 0; c < COLS; c++) {
    cellBgs[0][c]
      .startAnimate({ duration: 280, easing: E.easeOut })
      .setFill(PIVOT_FILL).setStroke(PIVOT_STROKE).setStrokeWidth(1.2)
      .endAnimate();
  }
  for (let r = 1; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const oldV = STAGES[0][r][c];
      const newV = STAGES[1][r][c];
      if (oldV === newV) continue;
      const d = 250 + c * 80;
      cellTexts[r][c]
        .startAnimate({ delay: d, duration: 280, easing: E.easeOut })
        .setText(String(newV)).endAnimate();
    }
  }
  await sd.pause();

  // p3: highlight R2 as pivot row, update R3.
  for (let c = 0; c < COLS; c++) {
    cellBgs[0][c]
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setFill(C.white).setStroke(C.silver).setStrokeWidth(0.8)
      .endAnimate();
    cellBgs[1][c]
      .startAnimate({ duration: 280, easing: E.easeOut })
      .setFill(PIVOT_FILL).setStroke(PIVOT_STROKE).setStrokeWidth(1.2)
      .endAnimate();
  }
  for (let c = 0; c < COLS; c++) {
    const oldV = STAGES[1][2][c];
    const newV = STAGES[2][2][c];
    if (oldV === newV) continue;
    const d = 250 + c * 80;
    cellTexts[2][c]
      .startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setText(String(newV)).endAnimate();
  }
  await sd.pause();

  // p4: highlight the upper-triangular pivots (diagonal coefs) as the solution chain.
  for (let c = 0; c < COLS; c++) {
    cellBgs[1][c]
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setFill(C.white).setStroke(C.silver).setStrokeWidth(0.8)
      .endAnimate();
  }
  for (let i = 0; i < ROWS; i++) {
    const r = i;
    for (const c of [r, COLS - 1]) {
      cellBgs[r][c]
        .startAnimate({ delay: 280 + i * 200, duration: 320, easing: E.easeOut })
        .setFill(ANSWER_FILL).setStroke(ANSWER_STROKE).setStrokeWidth(1.4)
        .endAnimate();
    }
  }
  await sd.pause();
});
