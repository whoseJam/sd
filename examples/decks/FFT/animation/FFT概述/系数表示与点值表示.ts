import * as sd from "@/sd";

import { arrow, AXIS_COLOR, plot } from "../common/coord";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const UNIT_X = 30;
const UNIT_Y = 14;
const X_LO = -2.6;
const X_HI = 2.6;
const Y_LIMIT = 7;

const A_FN = (x: number) => x ** 3 + x ** 2 - 2 * x - 3;
const COEFS = [-3, -2, 1, 1];

const SAMPLES = [
  { x: -2, color: C.darkOrange },
  { x: -1, color: C.red },
  { x: 0, color: C.green },
  { x: 1, color: C.blue },
];

arrow(svg, X_LO * UNIT_X - 6, 0, X_HI * UNIT_X + 6, 0, AXIS_COLOR);
arrow(svg, 0, -Y_LIMIT * UNIT_Y - 4, 0, Y_LIMIT * UNIT_Y + 4, AXIS_COLOR);

const curve = plot(svg, A_FN, X_LO, X_HI, UNIT_X, UNIT_Y, Y_LIMIT, C.blue);
const label = new sd.Math({
  targetNode: svg,
  text: "A(x)=x^3+x^2-2x-3",
  cx: X_HI * UNIT_X + 100,
  cy: 70,
  fontSize: 16,
  fill: C.blue,
  opacity: 0,
});

const CELL_W = 38;
const CELL_H = 30;
const GAP = 4;
const ARR_X0 = X_HI * UNIT_X + 80;
const COEF_CY = 30;
const VAL_CY = -30;

const coefCells: sd.Rect[] = [];
const coefTexts: sd.Math[] = [];
for (let i = 0; i < COEFS.length; i++) {
  const cx = ARR_X0 + i * (CELL_W + GAP);
  coefCells.push(
    new sd.Rect({
      targetNode: svg,
      cx,
      cy: COEF_CY,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: AXIS_COLOR,
      strokeWidth: 1.2,
      opacity: 0,
    }),
  );
  coefTexts.push(
    new sd.Math({
      targetNode: svg,
      text: String(COEFS[i]),
      cx,
      cy: COEF_CY,
      fontSize: 14,
      opacity: 0,
    }),
  );
}

const sampleCircles: sd.Circle[] = SAMPLES.map(
  (s) =>
    new sd.Circle({
      targetNode: svg,
      cx: s.x * UNIT_X,
      cy: A_FN(s.x) * UNIT_Y,
      r: 5,
      fill: s.color,
      opacity: 0,
    }),
);

const valueCells: sd.Rect[] = [];
const valueCircles: sd.Circle[] = [];
for (let i = 0; i < SAMPLES.length; i++) {
  const cx = ARR_X0 + i * (CELL_W + GAP);
  valueCells.push(
    new sd.Rect({
      targetNode: svg,
      cx,
      cy: VAL_CY,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: AXIS_COLOR,
      strokeWidth: 1.2,
      opacity: 0,
    }),
  );
  valueCircles.push(
    new sd.Circle({
      targetNode: svg,
      cx,
      cy: VAL_CY,
      r: 6,
      fill: SAMPLES[i].color,
      opacity: 0,
    }),
  );
}

// Dashed pairing lines from each sample point on the curve to its
// corresponding entry in the point-value array. Same color as the dot so
// the eye traces "this point on the curve = this slot in the array".
const pairLines: sd.Line[] = SAMPLES.map((s, i) => {
  const dstCx = ARR_X0 + i * (CELL_W + GAP);
  return new sd.Line({
    targetNode: svg,
    x1: s.x * UNIT_X,
    y1: A_FN(s.x) * UNIT_Y,
    x2: dstCx,
    y2: VAL_CY,
    stroke: s.color,
    strokeWidth: 0.8,
    strokeDashArray: [3, 3],
    opacity: 0,
  });
});

function fadeIn(
  node: sd.SDNode,
  opts: { delay?: number; duration?: number } = {},
) {
  node
    .startAnimate({
      delay: opts.delay ?? 0,
      duration: opts.duration ?? 320,
      easing: E.easeOut,
    })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  await sd.pause();
  fadeIn(curve);
  fadeIn(label, { delay: 80 });
  await sd.pause();
  for (let i = 0; i < coefCells.length; i++) {
    fadeIn(coefCells[i], { delay: i * 70, duration: 280 });
    fadeIn(coefTexts[i], { delay: i * 70 + 40, duration: 280 });
  }
  await sd.pause();
  for (let i = 0; i < sampleCircles.length; i++) {
    fadeIn(sampleCircles[i], { delay: i * 60, duration: 260 });
  }
  await sd.pause();
  for (let i = 0; i < valueCircles.length; i++) {
    fadeIn(valueCells[i], { delay: i * 70, duration: 260 });
    fadeIn(pairLines[i], { delay: i * 70 + 80, duration: 260 });
    fadeIn(valueCircles[i], { delay: i * 70 + 180, duration: 260 });
  }
  await sd.pause();
});
