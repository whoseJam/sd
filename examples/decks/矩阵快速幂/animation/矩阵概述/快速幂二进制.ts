import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Demo: A^13 — show that 13 = 8 + 4 + 1 (binary 1101) so
// A^13 = A^8 · A^4 · A^1. The squaring chain produces the powers
// in O(log n); the contributing ones combine into the answer.
const POWERS = [1, 2, 4, 8];
const BITS = [1, 0, 1, 1]; // bit 0 .. bit 3 of 13 = 1101
const SUP_DIGIT: Record<number, string> = {
  1: "¹", 2: "²", 4: "⁴", 8: "⁸",
};

const HIGHLIGHT_FILL = "#fdecd9";
const HIGHLIGHT_STROKE = C.darkOrange;
const NEUTRAL_STROKE = C.silver;

const CELL_W = 36;
const CELL_H = 32;
const CELL_GAP = 16;
const CELL_Y = 50;

const cellTopLeftX: number[] = POWERS.map((_, i) => {
  const totalWidth = POWERS.length * CELL_W + (POWERS.length - 1) * CELL_GAP;
  return -totalWidth / 2 + i * (CELL_W + CELL_GAP);
});

const cellBgs: sd.Rect[] = [];
const cellTexts: sd.Text[] = [];

for (let i = 0; i < POWERS.length; i++) {
  const x = cellTopLeftX[i];
  cellBgs.push(
    new sd.Rect({
      targetNode: svg,
      x, y: CELL_Y,
      width: CELL_W, height: CELL_H,
      fill: C.white,
      stroke: NEUTRAL_STROKE,
      strokeWidth: 1,
      rx: 4, ry: 4,
      opacity: 0,
    }),
  );
  cellTexts.push(
    new sd.Text({
      targetNode: svg,
      text: `A${SUP_DIGIT[POWERS[i]]}`,
      cx: x + CELL_W / 2,
      cy: CELL_Y + CELL_H / 2 - 1,
      fontSize: 15,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

// Squaring arrows between consecutive cells.
const arrowLines: sd.Line[] = [];
const arrowHeads: sd.Path[] = [];
const arrowLabels: sd.Text[] = [];
for (let i = 0; i < POWERS.length - 1; i++) {
  const sx = cellTopLeftX[i] + CELL_W + 3;
  const ex = cellTopLeftX[i + 1] - 3;
  const y = CELL_Y + CELL_H / 2;
  arrowLines.push(
    new sd.Line({
      targetNode: svg,
      x1: sx, y1: y, x2: ex - 5, y2: y,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.2,
      opacity: 0,
    }),
  );
  arrowHeads.push(
    new sd.Path({
      targetNode: svg,
      d: `M ${ex} ${y} L ${ex - 5} ${y - 3} L ${ex - 5} ${y + 3} Z`,
      stroke: C.darkButtonGrey,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
  arrowLabels.push(
    new sd.Text({
      targetNode: svg,
      text: "²",
      cx: (sx + ex) / 2, cy: y - 9,
      fontSize: 11,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

const equation = new sd.Text({
  targetNode: svg,
  text: "A¹³ = A⁸ · A⁴ · A¹",
  cx: 0, cy: -50,
  fontSize: 16,
  fill: C.darkOrange,
  opacity: 0,
});

const decomp = new sd.Text({
  targetNode: svg,
  text: "13 = 8 + 4 + 1",
  cx: 0, cy: -15,
  fontSize: 13,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  // p1: cells appear left to right (the squaring chain values).
  for (let i = 0; i < POWERS.length; i++) {
    const d = i * 200;
    cellBgs[i]
      .startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    cellTexts[i]
      .startAnimate({ delay: d + 80, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    if (i > 0) {
      arrowLines[i - 1]
        .startAnimate({ delay: d - 60, duration: 220, easing: E.easeOut })
        .setOpacity(1).endAnimate();
      arrowHeads[i - 1]
        .startAnimate({ delay: d - 60, duration: 220, easing: E.easeOut })
        .setOpacity(1).endAnimate();
      arrowLabels[i - 1]
        .startAnimate({ delay: d - 60, duration: 220, easing: E.easeOut })
        .setOpacity(1).endAnimate();
    }
  }
  await sd.pause();

  // p2: decomposition.
  decomp
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();

  // p3: highlight contributing powers (bits = 1).
  for (let i = 0; i < POWERS.length; i++) {
    if (BITS[i] !== 1) continue;
    const d = i * 140;
    cellBgs[i]
      .startAnimate({ delay: d, duration: 300, easing: E.easeOut })
      .setFill(HIGHLIGHT_FILL).setStroke(HIGHLIGHT_STROKE).setStrokeWidth(1.4)
      .endAnimate();
    cellTexts[i]
      .startAnimate({ delay: d, duration: 300, easing: E.easeOut })
      .setFill(HIGHLIGHT_STROKE).endAnimate();
  }
  await sd.pause();

  // p4: final equation.
  equation
    .startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();
});
