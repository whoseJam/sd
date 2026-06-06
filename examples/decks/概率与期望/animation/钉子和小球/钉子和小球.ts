import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const ROWS = 4;
const PEG_R = 3.5;
const ROW_GAP_Y = 24;
const COL_GAP_X = 28;
const TOP_Y = 90;
const BIN_Y = -50;
const BIN_W = 26;
const BIN_H = 24;

function pegPos(row: number, col: number): { x: number; y: number } {
  const x = (col - row / 2) * COL_GAP_X;
  const y = TOP_Y - row * ROW_GAP_Y;
  return { x, y };
}

const pegs: sd.Circle[] = [];
for (let r = 0; r <= ROWS; r++) {
  for (let c = 0; c <= r; c++) {
    const { x, y } = pegPos(r, c);
    pegs.push(
      new sd.Circle({
        targetNode: svg,
        cx: x, cy: y, r: PEG_R,
        fill: C.darkButtonGrey,
        stroke: "none",
        opacity: 0,
      }),
    );
  }
}

// Binomial coefficients C(ROWS, k) for k = 0..ROWS.
function binom(n: number, k: number): number {
  let v = 1;
  for (let i = 0; i < k; i++) v = (v * (n - i)) / (i + 1);
  return Math.round(v);
}
const COEFS = Array.from({ length: ROWS + 1 }, (_, k) => binom(ROWS, k));

const binBgs: sd.Rect[] = [];
const binTexts: sd.Text[] = [];
const HIGHLIGHT_FILL = "#fdecd9";
const HIGHLIGHT_STROKE = C.darkOrange;
for (let k = 0; k <= ROWS; k++) {
  const { x } = pegPos(ROWS, k);
  binBgs.push(
    new sd.Rect({
      targetNode: svg,
      x: x - BIN_W / 2, y: BIN_Y - BIN_H / 2,
      width: BIN_W, height: BIN_H,
      fill: C.white,
      stroke: C.silver,
      strokeWidth: 0.8,
      rx: 3, ry: 3,
      opacity: 0,
    }),
  );
  binTexts.push(
    new sd.Text({
      targetNode: svg,
      text: String(COEFS[k]),
      cx: x, cy: BIN_Y - 1,
      fontSize: 12,
      fill: C.darkOrange,
      opacity: 0,
    }),
  );
}

const formula = new sd.Text({
  targetNode: svg,
  text: `C(${ROWS}, k) / 2^${ROWS}`,
  cx: 0, cy: BIN_Y - 30,
  fontSize: 12,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  // p1: pegs appear top-down
  let k = 0;
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= r; c++) {
      const d = r * 90 + c * 30;
      pegs[k++]
        .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
        .setOpacity(1).endAnimate();
    }
  }
  await sd.pause();

  // p2: bins appear
  for (let i = 0; i <= ROWS; i++) {
    const d = i * 100;
    binBgs[i].startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();

  // p3: probability counts appear inside bins, highlighting them.
  for (let i = 0; i <= ROWS; i++) {
    const d = i * 140;
    binBgs[i].startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setFill(HIGHLIGHT_FILL).setStroke(HIGHLIGHT_STROKE).setStrokeWidth(1.2)
      .endAnimate();
    binTexts[i].startAnimate({ delay: d + 60, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  formula.startAnimate({ delay: (ROWS + 1) * 140 + 200, duration: 360, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();
});
