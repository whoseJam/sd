import * as sd from "@/sd";

import { CELL_H, makeBrace, makePointer, makeStrip } from "../common/strip";
import {
  ACCENT,
  fadeIn,
  fadeOpacity,
  NEUTRAL_FILL,
  NEUTRAL_STROKE,
  setStroke,
} from "../common/style";

const svg = sd.svg();
const E = sd.easing();
const C = sd.color();

const PALETTE = [
  C.steelBlue,
  C.darkOrange,
  C.green,
  "#9b59b6",
  "#16a085",
  "#c0392b",
  "#2980b9",
  "#d35400",
  "#7f8c8d",
];
const PEARL_SEQ = [0, 1, 2, 1, 0, 2, 1, 0]; // 8 pearls using 3 unique colors

const N = PEARL_SEQ.length;
const strip = makeStrip(svg, { n: N + 1, cy: 10, emptyCells: true });

const pearls: sd.Circle[] = [];
for (let i = 0; i < N; i++) {
  pearls.push(
    new sd.Circle({
      targetNode: svg,
      cx: strip.cxOf(i),
      cy: 10,
      r: 11,
      fill: PALETTE[PEARL_SEQ[i]],
      stroke: NEUTRAL_STROKE,
      strokeWidth: 1.0,
      opacity: 0,
    }),
  );
}

const newPearl = new sd.Circle({
  targetNode: svg,
  cx: strip.cxOf(N),
  cy: 10,
  r: 11,
  fill: NEUTRAL_FILL,
  stroke: NEUTRAL_STROKE,
  strokeWidth: 1.0,
  opacity: 0,
});

const pointer1 = makePointer(svg, strip, {
  idx: N - 1,
  cy: 10 + CELL_H / 2 + 8,
  label: "i",
});
const pointer2 = makePointer(svg, strip, {
  idx: N,
  cy: 10 + CELL_H / 2 + 8,
  label: "i+1",
});
const brace1 = makeBrace(svg, strip, {
  from: 0,
  to: N - 1,
  cy: 10 - CELL_H / 2,
  label: "\\text{used } j \\text{ kinds}",
  labelFontSize: 14,
});

const lastBg = strip.cells[N].bg;

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(strip.cells[i].bg, i * 30);
    fadeIn(pearls[i], i * 30 + 60);
  }
  fadeIn(brace1.path, N * 30 + 80);
  fadeIn(brace1.label!, N * 30 + 160);
  fadeIn(pointer1.arrow, N * 30 + 80);
  fadeIn(pointer1.label, N * 30 + 160);
  await sd.pause();

  fadeOpacity(pointer1.arrow, 0);
  fadeOpacity(pointer1.label, 0);
  setStroke(lastBg, ACCENT, 0);
  lastBg.startAnimate({ duration: 280 }).setOpacity(1).endAnimate();
  fadeIn(newPearl, 60);
  fadeIn(pointer2.arrow, 120);
  fadeIn(pointer2.label, 200);
  await sd.pause();

  newPearl
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setFill(PALETTE[0])
    .endAnimate();
  await sd.pause();

  newPearl
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setFill(PALETTE[3])
    .endAnimate();
  await sd.pause();
});
