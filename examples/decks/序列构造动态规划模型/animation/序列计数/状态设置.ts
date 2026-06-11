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
const E = sd.easing();

const N = 9;
const strip = makeStrip(svg, { n: N + 1, cy: 10, emptyCells: true });

const slot = new sd.Text({
  targetNode: svg,
  text: "?",
  cx: strip.cxOf(N),
  cy: 10,
  fontSize: 18,
  fill: ACCENT_TEXT,
  opacity: 0,
});
for (let i = 0; i < N; i++) {
  strip.cells[i].content = new sd.Text({
    targetNode: svg,
    text: "?",
    cx: strip.cxOf(i),
    cy: 10,
    fontSize: 14,
    fill: "transparent",
    opacity: 0,
  });
}

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
  label: "a_1+a_2+\\cdots+a_i\\equiv j",
  labelFontSize: 15,
});
const brace2 = makeBrace(svg, strip, {
  from: 0,
  to: N,
  cy: 10 - CELL_H / 2,
  label: "a_1+a_2+\\cdots+a_{i+1}\\equiv j'",
  labelFontSize: 15,
});

const lastBg = strip.cells[N].bg;

sd.main(async () => {
  for (let i = 0; i < N; i++) fadeIn(strip.cells[i].bg, i * 30);
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
    .startAnimate({ duration: 280 })
    .setFill(ACCENT)
    .setOpacity(1)
    .endAnimate();
  fadeIn(slot, 60);
  fadeIn(brace2.path, 120);
  fadeIn(brace2.label!, 200);
  fadeIn(pointer2.arrow, 120);
  fadeIn(pointer2.label, 200);
  await sd.pause();

  for (let v = 1; v <= 9; v++) {
    slot
      .startAnimate({ duration: 200, easing: E.easeOut })
      .setText(String(v))
      .endAnimate();
    await sd.pause();
  }
  slot
    .startAnimate({ duration: 200, easing: E.easeOut })
    .setText("k")
    .endAnimate();
  await sd.pause();
});
