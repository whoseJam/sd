import * as sd from "@/sd";

import { drawAxisX, drawAxisY, makeScene, NODE_R } from "../common/scene";
import {
  ACTIVE,
  AXIS,
  BALL,
  fadeIn,
  fadeOut,
  NEUTRAL,
  setFill,
  setStroke,
  setStrokeWidth,
  VISITED,
} from "../common/style";

const svg = sd.svg();
const E = sd.easing();

const balls: ([number, number] | null)[] = [
  [1, 5],
  [2, 4],
  null,
  [4, 6],
  [5, 1],
  [6, 5],
  [8, 3],
  [10, 4],
];
const SCALE_X = 60;
const SCALE_Y = 22;
const BASE_Y = -50;

const positions = balls.map((b) =>
  b === null ? null : ([b[0] - 5.5, b[1]] as [number, number]),
);

const scene = makeScene(svg, {
  positions,
  fill: BALL,
  scaleX: SCALE_X,
  scaleY: SCALE_Y,
  baseY: BASE_Y,
});

const AXIS_CY = BASE_Y - 14;
const xAxis = drawAxisX(svg, {
  xMin: -5.5,
  xMax: 5.5,
  cy: AXIS_CY,
  scaleX: SCALE_X,
});
const yAxis = drawAxisY(svg, {
  xMin: -5.5,
  xMax: 5.5,
  cy: AXIS_CY,
  scaleX: SCALE_X,
  yScale: SCALE_Y,
  yMax: 7,
});

const fallLines: sd.Path[] = [];
balls.forEach((b, i) => {
  if (b === null) return;
  const cx = scene.cxOf(i);
  const cy = scene.cyOf(i);
  const d = `M ${cx} ${cy - NODE_R} L ${cx} ${AXIS_CY}`;
  fallLines.push(
    new sd.Path({
      targetNode: svg,
      d,
      stroke: AXIS,
      strokeWidth: 0.8,
      fill: "none",
      strokeDashArray: "2 3",
      opacity: 0,
    }),
  );
});

const coordLabels: sd.Text[] = [];
balls.forEach((b, i) => {
  if (b === null) return;
  coordLabels.push(
    new sd.Text({
      targetNode: svg,
      text: String(b[0]),
      cx: scene.cxOf(i),
      cy: AXIS_CY - 12,
      fontSize: 11,
      fill: AXIS,
      opacity: 0,
    }),
  );
});

const START = 1;

const moves: [number, number][] = [
  [START, 0],
  [0, 3],
  [3, 4],
  [4, 5],
  [5, 6],
];

const startBadge = new sd.Text({
  targetNode: svg,
  text: "主角",
  cx: scene.cxOf(START),
  cy: scene.cyOf(START) - NODE_R - 22,
  fontSize: 12,
  fill: NEUTRAL,
  opacity: 0,
});

const GROUND_Y = AXIS_CY + 18;

function arcD(x0: number, x1: number, lift: number) {
  const mx = (x0 + x1) / 2;
  const my = GROUND_Y + lift;
  return `M ${x0} ${GROUND_Y} Q ${mx} ${my} ${x1} ${GROUND_Y}`;
}

sd.main(async () => {
  fadeIn(xAxis, 0);
  fadeIn(yAxis, 30);
  for (let i = 0; i < coordLabels.length; i++)
    fadeIn(coordLabels[i], 60 + i * 25);
  for (let i = 0; i < fallLines.length; i++) fadeIn(fallLines[i], 80 + i * 25);
  scene.fadeInAll(150, 32);
  await sd.pause();

  const startCircle = scene.items[START].circle;
  if (!startCircle) return;
  startCircle
    .startAnimate({ duration: 260, easing: E.easeOut })
    .setFill(VISITED)
    .endAnimate();
  setStroke(startCircle, ACTIVE, 60);
  setStrokeWidth(startCircle, 2.2, 60);
  fadeIn(startBadge, 80);
  await sd.pause();

  let lift = 28;
  for (const [from, to] of moves) {
    const a = scene.items[from];
    const b = scene.items[to];
    if (!a.circle || !b.circle) continue;
    const arc = new sd.Path({
      targetNode: svg,
      d: arcD(a.cx, b.cx, lift),
      stroke: ACTIVE,
      strokeWidth: 1.4,
      fill: "none",
      opacity: 0,
    });
    fadeIn(arc, 0);
    setStroke(a.circle, "#000", 220);
    setStrokeWidth(a.circle, 1.2, 220);
    setStroke(b.circle, ACTIVE, 220);
    setStrokeWidth(b.circle, 2.2, 220);
    setFill(b.circle, VISITED, 220);
    await sd.pause();
    fadeOut(arc, 0);
    lift += 5;
  }
  await sd.pause();
});
