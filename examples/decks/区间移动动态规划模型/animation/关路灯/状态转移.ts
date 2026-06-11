import * as sd from "@/sd";

import {
  fadeInBrace,
  fadeInEndpoint,
  makeBrace,
  makeEndpoint,
} from "../common/marker";
import { drawAxisX, makeScene, NODE_R } from "../common/scene";
import { AXIS, fadeIn, LIGHT_ON, VISITED } from "../common/style";
import { playTrans } from "../common/trans";

const svg = sd.svg();

const lightX = [1, 2, 4, 5, 6, 8, 10];
const N = lightX.length;
const SCALE = 70;

const positions: number[] = lightX.map((x) => x - 5.5);

const scene = makeScene(svg, {
  positions,
  fill: LIGHT_ON,
  scaleX: SCALE,
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

const L = 2;
const R = 4;

const brace = makeBrace(svg, scene, {
  from: L,
  to: R,
  label: "\\text{已关}",
  liftAboveTop: 22,
});

const leftEp = makeEndpoint(svg, scene, { idx: L, label: "l", cyOffset: 10 });
const rightEp = makeEndpoint(svg, scene, { idx: R, label: "r", cyOffset: 10 });

for (let i = L; i <= R; i++) scene.items[i].circle?.setFill(VISITED);

sd.main(async () => {
  fadeIn(axis, 0);
  for (let i = 0; i < N; i++) fadeIn(coordLabels[i], 60 + i * 30);
  scene.fadeInAll(120, 30);
  fadeInBrace(brace, 380);
  fadeInEndpoint(leftEp, 440);
  fadeInEndpoint(rightEp, 480);
  await sd.pause();

  await playTrans(svg, scene, {
    from: L,
    to: L - 1,
    label: "d_l - d_{l-1}",
  });
  await playTrans(svg, scene, {
    from: L,
    to: R + 1,
    label: "d_{r+1} - d_l",
    arcOffset: 34,
  });
  await playTrans(svg, scene, {
    from: R,
    to: L - 1,
    label: "d_r - d_{l-1}",
    arcOffset: 46,
  });
  await playTrans(svg, scene, {
    from: R,
    to: R + 1,
    label: "d_{r+1} - d_r",
  });
  await sd.pause();
});
