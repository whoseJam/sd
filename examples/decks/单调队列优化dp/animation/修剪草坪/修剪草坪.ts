import * as sd from "@/sd";

import { NumRow } from "../common/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const Eff = [3, 7, 2, 5, 1, 4, 6, 8];
const N = Eff.length;
const K = 3;

const S = [0];
for (let i = 0; i < N; i++) S.push(S[i] + Eff[i]);

const g = [0];
const f = [0];
for (let i = 1; i <= N; i++) {
  let bestAux = -Infinity;
  for (let j = Math.max(0, i - K); j <= i - 1; j++)
    bestAux = Math.max(bestAux, g[j] - S[j]);
  f.push(bestAux + S[i]);
  g.push(Math.max(f[i - 1], g[i - 1]));
}
const aux = g.map((gv, j) => gv - S[j]);

const SIZE = 40;
const X_E = -(N * SIZE) / 2;
const X_AUX = X_E - SIZE;
const E_Y = 50;
const AUX_Y = -10;

const eRow = new NumRow({
  targetNode: svg,
  values: Eff,
  size: SIZE,
  x: X_E,
  y: E_Y,
  label: "E",
});

const auxRow = new NumRow({
  targetNode: svg,
  values: aux.map((v) => String(v)),
  size: SIZE,
  x: X_AUX,
  y: AUX_Y,
  label: "g-S",
  labelGap: 30,
});

const jLabels = aux.map(
  (_, j) =>
    new sd.Math({
      targetNode: svg,
      text: `j{=}${j}`,
      cx: X_AUX + (j + 0.5) * SIZE,
      cy: AUX_Y - 14,
      fontSize: 10,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
);

const I_TARGET = 5;
const winLeft = Math.max(0, I_TARGET - K);
const winRight = I_TARGET - 1;
let bestJ = winLeft;
for (let j = winLeft + 1; j <= winRight; j++)
  if (aux[j] > aux[bestJ]) bestJ = j;

const winBox = new sd.Rect({
  targetNode: svg,
  x: X_AUX + winLeft * SIZE - 4,
  y: AUX_Y - 4,
  width: (winRight - winLeft + 1) * SIZE + 8,
  height: SIZE + 8,
  fill: "none",
  stroke: C.darkOrange,
  strokeWidth: 2,
  opacity: 0,
});

const formula = new sd.Math({
  targetNode: svg,
  text: `f(${I_TARGET}) = S(${I_TARGET}) + \\max_{j} (g{-}S) = ${S[I_TARGET]} + (${aux[bestJ]}) = ${S[I_TARGET] + aux[bestJ]}`,
  cx: 0,
  cy: -90,
  fontSize: 14,
  fill: C.darkOrange,
  opacity: 0,
});

function fade(el: sd.SDNode, delay: number, dur = 260) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  eRow.fadeIn({ delay: 0 });
  auxRow.fadeIn({ delay: 280 });
  jLabels.forEach((l, j) => fade(l, 500 + j * 24));
  await sd.pause();

  fade(winBox, 0);
  for (let j = winLeft; j <= winRight; j++)
    auxRow.paintCell(j + 1, "#fff3e0", C.darkOrange, {
      delay: 80 + (j - winLeft) * 60,
      duration: 220,
    });
  await sd.pause();

  auxRow.paintCell(bestJ + 1, "#f5b97a", C.darkOrange, { duration: 240 });
  eRow.paintCell(I_TARGET, "#dbeefd", C.steelBlue, { duration: 240 });
  await sd.pause();

  fade(formula, 0);
  await sd.pause();
});
