import * as sd from "@/sd";

import { drawAxisX, makeScene, NODE_R } from "../common/scene";
import {
  ACTIVE,
  AXIS,
  fadeIn,
  fadeOut,
  NEUTRAL,
  setFill,
  setStroke,
  setStrokeWidth,
  VISITED,
  WATER,
} from "../common/style";

const svg = sd.svg();
const E = sd.easing();

const dropX = [1, 2, null, 4, 5, 6, 8, 10];
const SCALE = 60;

const positions = dropX.map((x) => (x === null ? null : x - 5.5));

const scene = makeScene(svg, {
  positions,
  fill: WATER,
  scaleX: SCALE,
});

const AXIS_CY = -NODE_R - 14;
const axis = drawAxisX(svg, {
  xMin: -5.5,
  xMax: 5.5,
  cy: AXIS_CY,
  scaleX: SCALE,
});

const coordLabels: sd.Text[] = [];
dropX.forEach((x, i) => {
  if (x === null) return;
  coordLabels.push(
    new sd.Text({
      targetNode: svg,
      text: String(x),
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
];

const startBadge = new sd.Text({
  targetNode: svg,
  text: "甲虫",
  cx: scene.cxOf(START),
  cy: scene.cyOf(START) + NODE_R + 30,
  fontSize: 12,
  fill: NEUTRAL,
  opacity: 0,
});

function arcD(x0: number, y0: number, x1: number, y1: number, lift: number) {
  const mx = (x0 + x1) / 2;
  const my = Math.max(y0, y1) + lift;
  return `M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`;
}

sd.main(async () => {
  fadeIn(axis, 0);
  for (let i = 0; i < coordLabels.length; i++)
    fadeIn(coordLabels[i], 60 + i * 30);
  scene.fadeInAll(120, 32);
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

  let lift = 26;
  for (const [from, to] of moves) {
    const a = scene.items[from];
    const b = scene.items[to];
    if (!a.circle || !b.circle) continue;
    const arc = new sd.Path({
      targetNode: svg,
      d: arcD(a.cx, a.cy + NODE_R, b.cx, b.cy + NODE_R, lift),
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
    lift += 4;
  }
  await sd.pause();
});
