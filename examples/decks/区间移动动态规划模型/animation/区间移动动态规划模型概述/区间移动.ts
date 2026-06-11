import * as sd from "@/sd";

import { makeScene, NODE_R } from "../common/scene";
import {
  ACTIVE,
  fadeIn,
  fadeOut,
  LIGHT_OFF,
  LIGHT_ON,
  setFill,
  setStroke,
  setStrokeWidth,
} from "../common/style";

const svg = sd.svg();
const E = sd.easing();

const N = 10;
const positions: number[] = [];
for (let i = 0; i < N; i++) positions.push(i - (N - 1) / 2);

const scene = makeScene(svg, {
  positions,
  fill: LIGHT_ON,
  showIndex: true,
  indexStart: 1,
});

const START = 4;

const moves: [number, number][] = [
  [START, START - 1],
  [START - 1, START + 1],
  [START + 1, START - 2],
  [START - 2, START + 2],
];

function arcD(x0: number, y0: number, x1: number, y1: number, lift: number) {
  const mx = (x0 + x1) / 2;
  const my = Math.max(y0, y1) + lift;
  return `M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`;
}

sd.main(async () => {
  scene.fadeInAll(0, 32);
  await sd.pause();

  const startCircle = scene.items[START].circle;
  if (!startCircle) return;
  startCircle
    .startAnimate({ duration: 260, easing: E.easeOut })
    .setFill(LIGHT_OFF)
    .endAnimate();
  setStroke(startCircle, ACTIVE, 60);
  setStrokeWidth(startCircle, 2.2, 60);
  await sd.pause();

  let lift = 22;
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
    setStroke(a.circle, "#000", 200);
    setStrokeWidth(a.circle, 1.2, 200);
    setStroke(b.circle, ACTIVE, 200);
    setStrokeWidth(b.circle, 2.2, 200);
    setFill(b.circle, LIGHT_OFF, 200);
    await sd.pause();
    fadeOut(arc, 0);
    lift += 6;
  }
  await sd.pause();
});
