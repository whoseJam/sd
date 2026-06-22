import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const UNIT = 30;
const A = 3;
const B = 2;
const X_HALF = 4 * UNIT;
const Y_HALF = 2.4 * UNIT;
const HEAD_LEN = 8;
const HEAD_WIDTH = 6;

const AXIS = C.darkButtonGrey;
const HINT = C.grey;
const VEC = C.blue;

function arrow(
  targetNode: sd.Group,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: sd.SDColor,
  strokeWidth: number,
) {
  new sd.Line({ targetNode, x1, y1, x2, y2, stroke: color, strokeWidth });
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const ux = dx / dist;
  const uy = dy / dist;
  const px = -uy;
  const py = ux;
  const ax = x2 - ux * HEAD_LEN + px * (HEAD_WIDTH / 2);
  const ay = y2 - uy * HEAD_LEN + py * (HEAD_WIDTH / 2);
  const bx = x2 - ux * HEAD_LEN - px * (HEAD_WIDTH / 2);
  const by = y2 - uy * HEAD_LEN - py * (HEAD_WIDTH / 2);
  new sd.Path({
    targetNode,
    d: `M ${x2} ${y2} L ${ax} ${ay} L ${bx} ${by} Z`,
    fill: color,
    stroke: color,
    strokeWidth: 1,
  });
}

arrow(svg, -X_HALF, 0, X_HALF, 0, AXIS, 1.2);
arrow(svg, 0, -Y_HALF, 0, Y_HALF, AXIS, 1.2);

new sd.Text({
  targetNode: svg,
  text: "实轴",
  cx: X_HALF + 22,
  cy: 0,
  fontSize: 14,
  fill: AXIS,
});
new sd.Text({
  targetNode: svg,
  text: "虚轴",
  cx: 0,
  cy: Y_HALF + 14,
  fontSize: 14,
  fill: AXIS,
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
  cx: TIP_X + 24,
  cy: TIP_Y + 8,
  fontSize: 18,
  fill: VEC,
});

sd.main(async () => {
  await sd.pause();
});
