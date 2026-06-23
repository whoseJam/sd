import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const CELL_W = 60;
const CELL_H = 32;
const GAP = 4;
const ROW_GAP = 18;
const STROKE = C.darkButtonGrey;

const A_TEXTS = [
  "\\frac{1}{1^2}",
  "\\frac{1}{2^2}",
  "\\frac{1}{3^2}",
  "\\frac{1}{4^2}",
  "\\frac{1}{5^2}",
  "...",
  "\\frac{1}{(j-1)^2}",
  "\\frac{1}{j^2}",
];

const B_TEXTS = ["q_1", "q_2", "q_3", "q_4", "q_5", "...", "q_{j-1}", "q_j"];

const N = A_TEXTS.length;
const ROW_W = N * CELL_W + (N - 1) * GAP;
const X0 = -ROW_W / 2 + CELL_W / 2;

function row(cy: number, texts: string[], fontSize: number) {
  for (let i = 0; i < texts.length; i++) {
    const cx = X0 + i * (CELL_W + GAP);
    new sd.Rect({
      targetNode: svg,
      cx,
      cy,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: STROKE,
      strokeWidth: 1.2,
    });
    new sd.Math({
      targetNode: svg,
      text: texts[i],
      cx,
      cy,
      fontSize,
    });
  }
}

row(ROW_GAP, A_TEXTS, 14);
row(-ROW_GAP, B_TEXTS, 16);

sd.main(async () => {
  await sd.pause();
});
