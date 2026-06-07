import * as sd from "@/sd";

import { arrowedArc } from "../_/arrow";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;

const PALETTE: Record<string, string> = {
  R: C.red,
  B: C.steelBlue,
  G: C.green,
};

const pattern = "RRBGGRGG".split("");
const colorOrder = ["R", "B", "G"];
const N = pattern.length;
const I = N - 1;

const CELL_W = 36;
const CELL_GAP = 2;
const CELL_H = 30;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

const cells: sd.Rect[] = pattern.map((ch, i) => {
  const cx = cxOf(i);
  return new sd.Rect({
    targetNode: svg,
    x: cx - CELL_W / 2,
    y: 0,
    width: CELL_W,
    height: CELL_H,
    fill: PALETTE[ch],
    stroke: NEUTRAL,
    strokeWidth: 1,
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

const BUCKET_W = 24;
const BUCKET_H = 22;
const BUCKET_X = cxOf(I) + CELL_W / 2 + 40;
const BUCKET_Y0 = CELL_H + 8;

interface Bucket {
  bg: sd.Rect;
  label: sd.Text;
}
const buckets: Bucket[] = colorOrder.map((c, idx) => {
  const yB = BUCKET_Y0 + (colorOrder.length - 1 - idx) * (BUCKET_H + 2);
  return {
    bg: new sd.Rect({
      targetNode: svg,
      x: BUCKET_X - BUCKET_W / 2,
      y: yB,
      width: BUCKET_W,
      height: BUCKET_H,
      fill: PALETTE[c],
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    label: new sd.Text({
      targetNode: svg,
      text: c,
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
  text: "桶 (按颜色)",
  cx: BUCKET_X + 5,
  cy: BUCKET_Y0 - 8,
  fontSize: 12,
  fill: NEUTRAL,
  opacity: 0,
});

const seen = new Set<string>();
const validJ: number[] = [];
for (let j = I - 1; j >= 0; j--) {
  if (seen.has(pattern[j])) continue;
  seen.add(pattern[j]);
  validJ.push(j);
}

const arrows = validJ.map((j) => {
  const fromX = cxOf(j);
  const fromY = CELL_H;
  const colorIdx = colorOrder.indexOf(pattern[j]);
  const toX = BUCKET_X - BUCKET_W / 2;
  const toY =
    BUCKET_Y0 +
    (colorOrder.length - 1 - colorIdx) * (BUCKET_H + 2) +
    BUCKET_H / 2;
  return arrowedArc(svg, fromX, fromY, toX, toY, PALETTE[pattern[j]], 16);
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Path;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) fadeIn(cells[i], i * 30);
  fadeIn(iLabel, 250);
  await sd.pause();

  fadeIn(bucketTitle, 0);
  for (let k = 0; k < buckets.length; k++) {
    fadeIn(buckets[k].bg, k * 80);
    fadeIn(buckets[k].label, k * 80 + 50);
  }
  await sd.pause();

  for (let k = 0; k < arrows.length; k++) {
    fadeIn(arrows[k].arc, k * 150);
    fadeIn(arrows[k].head, k * 150 + 80);
  }
  await sd.pause();
});
