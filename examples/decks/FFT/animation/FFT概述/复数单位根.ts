import * as sd from "@/sd";

import { arrow, AXIS_COLOR } from "../common/coord";

const svg = sd.svg();
const C = sd.color();

const RADIUS = 90;
const N = 6;

const ROOT_COLORS: sd.SDColor[] = [
  C.blue,
  C.red,
  C.darkOrange,
  C.green,
  "#9b59b6",
  "#16a085",
];

arrow(svg, -RADIUS - 24, 0, RADIUS + 24, 0, AXIS_COLOR);
arrow(svg, 0, -RADIUS - 24, 0, RADIUS + 24, AXIS_COLOR);

new sd.Text({
  targetNode: svg,
  text: "实",
  cx: RADIUS + 40,
  cy: 0,
  fontSize: 13,
  fill: AXIS_COLOR,
});
new sd.Text({
  targetNode: svg,
  text: "虚",
  cx: 0,
  cy: RADIUS + 40,
  fontSize: 13,
  fill: AXIS_COLOR,
});

new sd.Circle({
  targetNode: svg,
  cx: 0,
  cy: 0,
  r: RADIUS,
  fill: "none",
  stroke: AXIS_COLOR,
  strokeWidth: 1,
  strokeDashArray: [4, 4],
  opacity: 0.6,
});

for (let k = 0; k < N; k++) {
  const theta = (2 * Math.PI * k) / N;
  const x = RADIUS * Math.cos(theta);
  const y = RADIUS * Math.sin(theta);
  const color = ROOT_COLORS[k];
  arrow(svg, 0, 0, x, y, color, 1.6);

  const labelDist = RADIUS + 22;
  const labelX = labelDist * Math.cos(theta);
  const labelY = labelDist * Math.sin(theta);
  new sd.Math({
    targetNode: svg,
    text: `w_${N}^{${k}}`,
    cx: labelX,
    cy: labelY,
    fontSize: 14,
    fill: color,
  });
}

new sd.Math({
  targetNode: svg,
  text: `n=${N}`,
  cx: -RADIUS - 50,
  cy: RADIUS - 20,
  fontSize: 18,
  fill: AXIS_COLOR,
});

sd.main(async () => {
  await sd.pause();
});
