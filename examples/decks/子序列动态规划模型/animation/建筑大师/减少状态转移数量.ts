import * as sd from "@/sd";

import { arrowedArc } from "../common/arrow";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;
const VAL_COLORS = [C.red, C.darkOrange, C.green, C.steelBlue];

const data = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4];
const N = data.length;
const I = N - 1;
const valueTypes = [1, 2, 3, 4];

const CELL_W = 30;
const CELL_GAP = 2;
const CELL_H = 26;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

const cells: sd.Rect[] = data.map((v, i) => {
  const cx = cxOf(i);
  return new sd.Rect({
    targetNode: svg,
    x: cx - CELL_W / 2,
    y: 0,
    width: CELL_W,
    height: CELL_H,
    fill: VAL_COLORS[v - 1],
    stroke: NEUTRAL,
    strokeWidth: 1,
    opacity: 0,
  });
});

const cellTexts: sd.Text[] = data.map((v, i) => {
  return new sd.Text({
    targetNode: svg,
    text: String(v),
    cx: cxOf(i),
    cy: CELL_H / 2,
    fontSize: 12,
    fill: "#ffffff",
    opacity: 0,
  });
});

const iLabel = new sd.Math({
  targetNode: svg,
  text: "i",
  cx: cxOf(I),
  cy: -14,
  fontSize: 14,
  fill: I_HL,
  opacity: 0,
});

const BUCKET_W = 26;
const BUCKET_H = 22;
const BUCKET_X = cxOf(N - 1) + CELL_W / 2 + 36;
const BUCKET_Y0 = CELL_H + 8;

interface Bucket {
  bg: sd.Rect;
  label: sd.Text;
}
const buckets: Bucket[] = valueTypes.map((v, idx) => {
  const yB = BUCKET_Y0 + (valueTypes.length - 1 - idx) * (BUCKET_H + 2);
  return {
    bg: new sd.Rect({
      targetNode: svg,
      x: BUCKET_X - BUCKET_W / 2,
      y: yB,
      width: BUCKET_W,
      height: BUCKET_H,
      fill: VAL_COLORS[v - 1],
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    label: new sd.Text({
      targetNode: svg,
      text: String(v),
      cx: BUCKET_X + BUCKET_W / 2 + 14,
      cy: yB + BUCKET_H / 2,
      fontSize: 12,
      fill: NEUTRAL,
      opacity: 0,
    }),
  };
});

const bucketTitle = new sd.Text({
  targetNode: svg,
  text: "桶 (按值)",
  cx: BUCKET_X + 5,
  cy: 0,
  fontSize: 12,
  fill: NEUTRAL,
  opacity: 0,
});

const seen = new Set<number>();
const validJ: number[] = [];
for (let j = I - 1; j >= 0; j--) {
  if (seen.has(data[j])) continue;
  seen.add(data[j]);
  validJ.push(j);
}

const arrows = validJ.map((j) => {
  const v = data[j];
  const colorIdx = valueTypes.indexOf(v);
  const fromX = cxOf(j);
  const fromY = CELL_H;
  const toX = BUCKET_X - BUCKET_W / 2;
  const toY =
    BUCKET_Y0 +
    (valueTypes.length - 1 - colorIdx) * (BUCKET_H + 2) +
    BUCKET_H / 2;
  return arrowedArc(svg, fromX, fromY, toX, toY, VAL_COLORS[v - 1], 14);
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Path;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i], i * 20);
    fadeIn(cellTexts[i], i * 20 + 30);
  }
  fadeIn(iLabel, 250);
  await sd.pause();

  fadeIn(bucketTitle, 0);
  for (let k = 0; k < buckets.length; k++) {
    fadeIn(buckets[k].bg, k * 60);
    fadeIn(buckets[k].label, k * 60 + 40);
  }
  await sd.pause();

  for (let k = 0; k < arrows.length; k++) {
    fadeIn(arrows[k].arc, k * 120);
    fadeIn(arrows[k].head, k * 120 + 80);
  }
  await sd.pause();
});
