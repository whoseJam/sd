import * as sd from "@/sd";

import { arrow, AXIS_COLOR, plot } from "../common/coord";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const UNIT_X = 30;
const UNIT_Y = 20;
const X_LO = -4.2;
const X_HI = 4.2;
const Y_LIMIT = 3.2;

const LABEL_X = X_HI * UNIT_X + 120;

arrow(svg, X_LO * UNIT_X - 6, 0, X_HI * UNIT_X + 6, 0, AXIS_COLOR);
arrow(svg, 0, -Y_LIMIT * UNIT_Y - 6, 0, Y_LIMIT * UNIT_Y + 6, AXIS_COLOR);

const plotA = plot(
  svg,
  (x) => x * x + 3 * x + 2,
  X_LO,
  X_HI,
  UNIT_X,
  UNIT_Y,
  Y_LIMIT,
  C.blue,
);
const plotB = plot(
  svg,
  (x) => -0.5 * x * x + 1,
  X_LO,
  X_HI,
  UNIT_X,
  UNIT_Y,
  Y_LIMIT,
  C.darkOrange,
);
const plotC = plot(
  svg,
  (x) => -x - 3,
  X_LO,
  X_HI,
  UNIT_X,
  UNIT_Y,
  Y_LIMIT,
  C.green,
);

const labelA = new sd.Math({
  targetNode: svg,
  text: "A(x)=x^2+3x+2",
  cx: LABEL_X,
  cy: 40,
  fontSize: 18,
  fill: C.blue,
  opacity: 0,
});
const labelB = new sd.Math({
  targetNode: svg,
  text: "B(x)=-\\frac{1}{2}x^2+1",
  cx: LABEL_X,
  cy: 0,
  fontSize: 18,
  fill: C.darkOrange,
  opacity: 0,
});
const labelC = new sd.Math({
  targetNode: svg,
  text: "C(x)=-x-3",
  cx: LABEL_X,
  cy: -40,
  fontSize: 18,
  fill: C.green,
  opacity: 0,
});

function reveal(curve: sd.Path, label: sd.Math) {
  curve
    .startAnimate({ duration: 380, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  label
    .startAnimate({ duration: 380, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  await sd.pause();
  reveal(plotA, labelA);
  await sd.pause();
  reveal(plotB, labelB);
  await sd.pause();
  reveal(plotC, labelC);
  await sd.pause();
});
