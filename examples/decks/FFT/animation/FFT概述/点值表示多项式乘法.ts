import * as sd from "@/sd";

import { arrow, AXIS_COLOR, plot } from "../common/coord";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const UNIT_X = 40;
const UNIT_Y = 8;
const X_LO = -2.6;
const X_HI = 2.6;
const Y_LIMIT = 14;

const A_FN = (x: number) => x - 1.5;
const B_FN = (x: number) => 0.5 * x + 4;
const P_FN = (x: number) => A_FN(x) * B_FN(x);

const SAMPLES_X = [-2, 0, 2];
// Three layers of saturation, weakest to strongest: A/B are background
// context, samples are connectors, the product is the conclusion. Only
// the product gets the warm accent.
const A_COLOR = C.darkButtonGrey;
const B_COLOR = C.steelBlue;
const SAMPLE_COLOR = C.darkButtonGrey;
const P_COLOR = C.darkOrange;

arrow(svg, X_LO * UNIT_X - 6, 0, X_HI * UNIT_X + 6, 0, AXIS_COLOR);
arrow(svg, 0, -Y_LIMIT * UNIT_Y - 4, 0, Y_LIMIT * UNIT_Y + 4, AXIS_COLOR);

const curveA = plot(svg, A_FN, X_LO, X_HI, UNIT_X, UNIT_Y, Y_LIMIT, A_COLOR);
const curveB = plot(svg, B_FN, X_LO, X_HI, UNIT_X, UNIT_Y, Y_LIMIT, B_COLOR);
const curveP = plot(svg, P_FN, X_LO, X_HI, UNIT_X, UNIT_Y, Y_LIMIT, P_COLOR);

const LABEL_X = X_HI * UNIT_X + 60;
const labelA = new sd.Math({
  targetNode: svg,
  text: "A(x)",
  cx: LABEL_X,
  cy: A_FN(X_HI) * UNIT_Y,
  fontSize: 18,
  fill: A_COLOR,
  opacity: 0,
});
const labelB = new sd.Math({
  targetNode: svg,
  text: "B(x)",
  cx: LABEL_X,
  cy: B_FN(X_HI) * UNIT_Y,
  fontSize: 18,
  fill: B_COLOR,
  opacity: 0,
});
const labelP = new sd.Math({
  targetNode: svg,
  text: "A(x)\\,B(x)",
  cx: LABEL_X,
  cy: -55,
  fontSize: 18,
  fill: P_COLOR,
  opacity: 0,
});

function sampleDots(fn: (x: number) => number, color: sd.SDColor): sd.Circle[] {
  return SAMPLES_X.map(
    (x) =>
      new sd.Circle({
        targetNode: svg,
        cx: x * UNIT_X,
        cy: fn(x) * UNIT_Y,
        r: 5,
        fill: color,
        opacity: 0,
      }),
  );
}

const dotsA = sampleDots(A_FN, SAMPLE_COLOR);
const dotsB = sampleDots(B_FN, SAMPLE_COLOR);
const dotsP = sampleDots(P_FN, P_COLOR);

// Faint vertical guides through each sample x value, so the "same x is
// sampled on A, B, and A·B" relationship reads visually. They fade in
// when the first set of samples lands and stay visible through the
// product reveal.
const guideTopY = (Y_LIMIT - 1) * UNIT_Y;
const guideBotY = -(Y_LIMIT - 1) * UNIT_Y;
const guides: sd.Line[] = SAMPLES_X.map(
  (x) =>
    new sd.Line({
      targetNode: svg,
      x1: x * UNIT_X,
      y1: guideBotY,
      x2: x * UNIT_X,
      y2: guideTopY,
      stroke: AXIS_COLOR,
      strokeWidth: 0.7,
      strokeDashArray: [3, 3],
      opacity: 0,
    }),
);

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

function fadeInGroup(nodes: sd.SDNode[], stagger = 60, duration = 280) {
  for (let i = 0; i < nodes.length; i++) {
    fadeIn(nodes[i], { delay: i * stagger, duration });
  }
}

sd.main(async () => {
  await sd.pause();
  fadeIn(curveA);
  fadeIn(labelA, { delay: 80 });
  await sd.pause();
  fadeIn(curveB);
  fadeIn(labelB, { delay: 80 });
  await sd.pause();
  fadeInGroup(guides, 40, 240);
  fadeInGroup(dotsA);
  await sd.pause();
  fadeInGroup(dotsB);
  await sd.pause();
  fadeIn(curveP);
  fadeIn(labelP, { delay: 80 });
  fadeInGroup(dotsP, 60, 280);
  await sd.pause();
});
