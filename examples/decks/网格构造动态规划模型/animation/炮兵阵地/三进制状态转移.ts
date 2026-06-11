import * as sd from "@/sd";

import { fadeIn, NEUTRAL, NEUTRAL_FILL, NEUTRAL_STROKE } from "../common/style";

const svg = sd.svg();

const CELL = 36;
const GAP = 3;
const N = 6;

const S = [2, 1, 0, 2, 1, 0];
const T = [0, 0, 0, 1, 0, 2];

const digitColor = ["#a89c8e", "#b4884a", "#8b3a3a"];

interface Bit {
  bg: sd.Rect;
  text: sd.Text;
}

function makeRow(digits: number[], cy: number): Bit[] {
  const step = CELL + GAP;
  const n = digits.length;
  return digits.map((d, i) => {
    const cx = (i - (n - 1) / 2) * step;
    const bg = new sd.Rect({
      targetNode: svg,
      x: cx - CELL / 2,
      y: cy - CELL / 2,
      width: CELL,
      height: CELL,
      fill: NEUTRAL_FILL,
      stroke: NEUTRAL_STROKE,
      strokeWidth: 1.2,
      opacity: 0,
    });
    const text = new sd.Text({
      targetNode: svg,
      text: String(d),
      cx,
      cy,
      fontSize: 16,
      fill: digitColor[d],
      opacity: 0,
    });
    return { bg, text };
  });
}

const rowS = makeRow(S, 22);
const rowT = makeRow(T, -22);

const labelS = new sd.Math({
  targetNode: svg,
  text: "S",
  cx: -((N + 1) / 2) * (CELL + GAP),
  cy: 22,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});
const labelT = new sd.Math({
  targetNode: svg,
  text: "T",
  cx: -((N + 1) / 2) * (CELL + GAP),
  cy: -22,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});

const legendY = -CELL * 1.4 - 22;
const legendStep = 80;

function legendItem(idx: number, digit: number, text: string) {
  const cx = -legendStep + idx * legendStep;
  const swatch = new sd.Rect({
    targetNode: svg,
    x: cx - 30,
    y: legendY - 8,
    width: 16,
    height: 16,
    fill: digitColor[digit],
    stroke: digitColor[digit],
    strokeWidth: 1,
    opacity: 0,
  });
  const label = new sd.Math({
    targetNode: svg,
    text,
    cx: cx + 4,
    cy: legendY,
    fontSize: 13,
    fill: NEUTRAL,
    opacity: 0,
  });
  return { swatch, label };
}

const legend = [
  legendItem(0, 2, "2\\ \\text{炮兵}"),
  legendItem(1, 1, "1\\ \\text{下方一格}"),
  legendItem(2, 0, "0\\ \\text{其它}"),
];

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(rowS[i].bg, i * 25);
    fadeIn(rowS[i].text, i * 25 + 30);
  }
  fadeIn(labelS, 100);
  for (let i = 0; i < legend.length; i++) {
    fadeIn(legend[i].swatch, 200 + i * 80);
    fadeIn(legend[i].label, 230 + i * 80);
  }
  await sd.pause();

  for (let i = 0; i < N; i++) {
    fadeIn(rowT[i].bg, i * 25);
    fadeIn(rowT[i].text, i * 25 + 30);
  }
  fadeIn(labelT, 100);
  await sd.pause();
});
