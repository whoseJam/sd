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

const pattern = "RRBGGRGGRRRR".split("");
const N = pattern.length;
const I = 7;

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

const seenColors = new Set<string>();
const validJ: number[] = [];
for (let j = I - 1; j >= 0; j--) {
  if (seenColors.has(pattern[j])) continue;
  seenColors.add(pattern[j]);
  validJ.push(j);
}

const arcs = validJ.map((j) =>
  arrowedArc(
    svg,
    cxOf(j),
    CELL_H,
    cxOf(I),
    CELL_H,
    PALETTE[pattern[j]],
    16 + (I - j) * 4,
  ),
);

const iTick = new sd.Line({
  targetNode: svg,
  x1: cxOf(I),
  y1: 0,
  x2: cxOf(I),
  y2: -6,
  stroke: I_HL,
  strokeWidth: 2,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Line | sd.Path;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) fadeIn(cells[i], i * 30);
  await sd.pause();

  fadeIn(iLabel, 0);
  fadeIn(iTick, 0);
  await sd.pause();

  for (let k = 0; k < arcs.length; k++) {
    fadeIn(arcs[k].arc, k * 150);
    fadeIn(arcs[k].head, k * 150 + 80);
  }
  await sd.pause();
});
