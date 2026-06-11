import * as sd from "@/sd";

import { drawAxisX, makeScene, NODE_R } from "../common/scene";
import {
  ACTIVE,
  AXIS,
  fadeIn,
  fadeOut,
  LIGHT_OFF,
  LIGHT_ON,
  NEUTRAL,
  setFill,
  setStroke,
  setStrokeWidth,
} from "../common/style";

const svg = sd.svg();
const E = sd.easing();

const lightX = [1, 2, 4, 5, 6, 8, 10];
const N = lightX.length;
const SCALE = 70;

const positions: number[] = lightX.map((x) => x - 5.5);

const scene = makeScene(svg, {
  positions,
  fill: LIGHT_ON,
  scaleX: SCALE,
  showIndex: true,
  indexStart: 1,
});

const AXIS_CY = -NODE_R - 14;

const axis = drawAxisX(svg, {
  xMin: -5.5,
  xMax: 5.5,
  cy: AXIS_CY,
  scaleX: SCALE,
});

const coordLabels = lightX.map(
  (x, i) =>
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

const START = 3;

const moves: [number, number][] = [
  [START, 2],
  [2, 4],
  [4, 1],
  [1, 5],
];

function arcD(x0: number, y0: number, x1: number, y1: number, lift: number) {
  const mx = (x0 + x1) / 2;
  const my = Math.max(y0, y1) + lift;
  return `M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`;
}

const startBadge = new sd.Text({
  targetNode: svg,
  text: "出发",
  cx: scene.cxOf(START),
  cy: scene.cyOf(START) + NODE_R + 30,
  fontSize: 12,
  fill: NEUTRAL,
  opacity: 0,
});

sd.main(async () => {
  fadeIn(axis, 0);
  for (let i = 0; i < N; i++) fadeIn(coordLabels[i], 60 + i * 35);
  scene.fadeInAll(120, 35);
  await sd.pause();

  const startCircle = scene.items[START].circle;
  if (!startCircle) return;
  startCircle
    .startAnimate({ duration: 260, easing: E.easeOut })
    .setFill(LIGHT_OFF)
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
    setFill(b.circle, LIGHT_OFF, 220);
    await sd.pause();
    fadeOut(arc, 0);
    lift += 4;
  }
  await sd.pause();
});
