import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// A^13 via repeated squaring. 4 cells left-to-right: A¹, A², A⁴, A⁸ —
// each obtained by squaring the previous. Above each cell, the bit of
// 13 = (1101)_2 that decides whether this power goes into the product.
// Horizontal layout keeps the animation short so it fits a typical
// PPT iframe (~200px tall).

const NEUTRAL = C.darkButtonGrey;
const HL = C.darkOrange;
const HL_BG = "#fdecd9";
const SKIP = "#bbb";

const POWERS = [1, 2, 4, 8];
const SUPS: Record<number, string> = { 1: "¹", 2: "²", 4: "⁴", 8: "⁸" };
// 13 = (1101)_2. Index into cells matches POWERS (so cell i has bit i).
const BITS = [1, 0, 1, 1];

const CELL_W = 38;
const CELL_H = 32;
const ARROW = 28;

const TOTAL_W = CELL_W * 4 + ARROW * 3;
const cellCxs = POWERS.map(
  (_, i) => -TOTAL_W / 2 + CELL_W / 2 + i * (CELL_W + ARROW),
);

const CELL_Y = 8;
const BIT_Y = 44;
const EQ_Y = -30;

interface CellVis {
  bg: sd.Rect;
  text: sd.Text;
}

const cells: CellVis[] = cellCxs.map((cx, i) => ({
  bg: new sd.Rect({
    targetNode: svg,
    x: cx - CELL_W / 2,
    y: CELL_Y - CELL_H / 2,
    width: CELL_W,
    height: CELL_H,
    fill: C.white,
    stroke: NEUTRAL,
    strokeWidth: 1.2,
    opacity: 0,
  }),
  text: new sd.Text({
    targetNode: svg,
    text: `A${SUPS[POWERS[i]]}`,
    cx,
    cy: CELL_Y,
    fontSize: 17,
    fill: NEUTRAL,
    opacity: 0,
  }),
}));

const bitLabels: sd.Text[] = cellCxs.map(
  (cx, i) =>
    new sd.Text({
      targetNode: svg,
      text: String(BITS[i]),
      cx,
      cy: BIT_Y,
      fontSize: 14,
      fill: NEUTRAL,
      opacity: 0,
    }),
);

const arrowLines: sd.Line[] = [];
const arrowHeads: sd.Path[] = [];
const arrowLabels: sd.Text[] = [];
for (let i = 0; i < cellCxs.length - 1; i++) {
  const x1 = cellCxs[i] + CELL_W / 2 + 2;
  const x2 = cellCxs[i + 1] - CELL_W / 2 - 5;
  arrowLines.push(
    new sd.Line({
      targetNode: svg,
      x1,
      y1: CELL_Y,
      x2: x2 - 3,
      y2: CELL_Y,
      stroke: NEUTRAL,
      strokeWidth: 1.2,
      opacity: 0,
    }),
  );
  arrowHeads.push(
    new sd.Path({
      targetNode: svg,
      d: `M ${x2 - 3} ${CELL_Y - 3} L ${x2 + 3} ${CELL_Y} L ${x2 - 3} ${CELL_Y + 3} Z`,
      fill: NEUTRAL,
      stroke: NEUTRAL,
      opacity: 0,
    }),
  );
  arrowLabels.push(
    new sd.Text({
      targetNode: svg,
      text: "²",
      cx: (x1 + x2) / 2,
      cy: CELL_Y + 10,
      fontSize: 11,
      fill: NEUTRAL,
      opacity: 0,
    }),
  );
}

const header = new sd.Math({
  targetNode: svg,
  text: "13 = (1101)_2",
  cx: 0,
  cy: 72,
  fontSize: 13,
  fill: NEUTRAL,
  opacity: 0,
});

const equation = new sd.Math({
  targetNode: svg,
  text: "A^{13} = A^1 \\cdot A^4 \\cdot A^8",
  cx: 0,
  cy: EQ_Y,
  fontSize: 16,
  fill: HL,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Path | sd.Line;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  // p1: header + squaring chain (cells appear L→R with squaring arrows).
  fadeIn(header);
  for (let i = 0; i < cells.length; i++) {
    const d = 180 + i * 200;
    fadeIn(cells[i].bg, d);
    fadeIn(cells[i].text, d + 60);
    if (i > 0) {
      fadeIn(arrowLines[i - 1], d - 80);
      fadeIn(arrowHeads[i - 1], d - 80);
      fadeIn(arrowLabels[i - 1], d - 80);
    }
  }
  await sd.pause();

  // p2: bit labels appear above each cell — 1, 0, 1, 1 (bit 0…3).
  for (let i = 0; i < bitLabels.length; i++) fadeIn(bitLabels[i], i * 80);
  await sd.pause();

  // p3: bits with value 1 highlight orange; bit=0 cell grays out.
  for (let i = 0; i < cells.length; i++) {
    const on = BITS[i] === 1;
    const color = on ? HL : SKIP;
    cells[i].bg
      .startAnimate({ delay: i * 60, duration: DUR, easing: E.easeOut })
      .setStroke(color)
      .setStrokeWidth(on ? 2 : 1)
      .setFill(on ? HL_BG : C.white)
      .endAnimate();
    cells[i].text
      .startAnimate({ delay: i * 60, duration: DUR, easing: E.easeOut })
      .setFill(color)
      .endAnimate();
    bitLabels[i]
      .startAnimate({ delay: i * 60, duration: DUR, easing: E.easeOut })
      .setFill(color)
      .endAnimate();
  }
  await sd.pause();

  // p4: the product over selected cells.
  fadeIn(equation);
  await sd.pause();
});
