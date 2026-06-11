import * as sd from "@/sd";

import { CELL_H, makeBrace, makePointer, makeStrip } from "../common/strip";
import {
  ACCENT,
  ACCENT_TEXT,
  fadeIn,
  fadeOpacity,
  setStroke,
} from "../common/style";

const svg = sd.svg();

const N = 9;
const strip = makeStrip(svg, { n: N + 1, cy: 10 });
const lastBg = strip.cells[N].bg;
const lastText = strip.cells[N].content!;

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
  label: "?",
  labelFontSize: 18,
});
const brace2 = makeBrace(svg, strip, {
  from: 0,
  to: N,
  cy: 10 - CELL_H / 2,
  label: "?",
  labelFontSize: 18,
});

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(strip.cells[i].bg, i * 35);
    fadeIn(strip.cells[i].content!, i * 35 + 50);
  }
  fadeIn(brace1.path, 300);
  fadeIn(brace1.label!, 380);
  fadeIn(pointer1.arrow, 300);
  fadeIn(pointer1.label, 380);
  await sd.pause();

  fadeOpacity(brace1.path, 0);
  fadeOpacity(brace1.label!, 0);
  fadeOpacity(pointer1.arrow, 0);
  fadeOpacity(pointer1.label, 0);

  setStroke(lastBg, ACCENT, 0);
  lastBg
    .startAnimate({ delay: 0, duration: 280 })
    .setFill(ACCENT)
    .setOpacity(1)
    .endAnimate();
  lastText
    .startAnimate({ delay: 60, duration: 280 })
    .setFill(ACCENT_TEXT)
    .setOpacity(1)
    .endAnimate();

  fadeIn(brace2.path, 120);
  fadeIn(brace2.label!, 200);
  fadeIn(pointer2.arrow, 120);
  fadeIn(pointer2.label, 200);
  await sd.pause();
});
