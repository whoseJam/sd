import * as sd from "@/sd";

import { arrow, AXIS_COLOR } from "../common/coord";

const svg = sd.svg();
const C = sd.color();

const UNIT = 30;
const A = 3;
const B = 2;
const X_HALF = 4 * UNIT;
const Y_HALF = 2.4 * UNIT;

const HINT = C.grey;
const VEC = C.blue;

arrow(svg, -X_HALF, 0, X_HALF, 0, AXIS_COLOR);
arrow(svg, 0, -Y_HALF, 0, Y_HALF, AXIS_COLOR);

new sd.Text({
  targetNode: svg,
  text: "Re",
  cx: X_HALF + 22,
  cy: 0,
  fontSize: 14,
  fill: AXIS_COLOR,
});
new sd.Text({
  targetNode: svg,
  text: "Im",
  cx: 0,
  cy: Y_HALF + 16,
  fontSize: 14,
  fill: AXIS_COLOR,
});

const TIP_X = A * UNIT;
const TIP_Y = B * UNIT;

new sd.Line({
  targetNode: svg,
  x1: TIP_X,
  y1: 0,
  x2: TIP_X,
  y2: TIP_Y,
  stroke: HINT,
  strokeWidth: 1,
  strokeDashArray: [4, 4],
});

new sd.Math({
  targetNode: svg,
  text: "a",
  cx: TIP_X / 2,
  cy: -16,
  fontSize: 18,
});
new sd.Math({
  targetNode: svg,
  text: "b",
  cx: -16,
  cy: TIP_Y / 2,
  fontSize: 18,
});

arrow(svg, 0, 0, TIP_X, TIP_Y, VEC, 1.8);

new sd.Math({
  targetNode: svg,
  text: "a+bi",
  cx: TIP_X + 16,
  cy: TIP_Y + 6,
  fontSize: 16,
  fill: VEC,
});

sd.main(async () => {
  await sd.pause();
});
