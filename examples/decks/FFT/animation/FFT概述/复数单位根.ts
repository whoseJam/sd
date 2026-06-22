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
  // Labels colinear with an axis (k=0 on +x, k=N/2 on -x for even N) collide
  // with the axis arrowhead, so push those down slightly off the axis line.
  const onXAxis = Math.abs(Math.sin(theta)) < 1e-6;
  const offsetY = onXAxis ? -14 : 0;
  const labelX = labelDist * Math.cos(theta);
  const labelY = labelDist * Math.sin(theta) + offsetY;
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
