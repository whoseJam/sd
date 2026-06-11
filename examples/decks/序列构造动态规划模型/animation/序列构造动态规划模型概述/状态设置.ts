import * as sd from "@/sd";

import {
  braceD,
  CELL_H,
  CELL_W,
  makeBrace,
  makePointer,
  makeStrip,
} from "../common/strip";
import {
  ACCENT,
  ACCENT_FILL,
  ACCENT_TEXT,
  fadeIn,
  fadeOpacity,
  setStroke,
} from "../common/style";

const svg = sd.svg();
const E = sd.easing();

const N = 9;
const CY = 10;
const strip = makeStrip(svg, { n: N + 1, cy: CY });

const lastBg = strip.cells[N].bg;
const lastText = strip.cells[N].content!;

const POINTER_Y = CY + CELL_H / 2 + 8;
const pointerI = makePointer(svg, strip, {
  idx: N - 1,
  cy: POINTER_Y,
  label: "i",
});
const pointerIPlus1 = makePointer(svg, strip, {
  idx: N,
  cy: POINTER_Y,
  label: "i+1",
});

const BRACE_Y = CY - CELL_H / 2;
const brace = makeBrace(svg, strip, {
  from: 0,
  to: N - 1,
  cy: BRACE_Y,
  label: "?",
  labelFontSize: 18,
});

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(strip.cells[i].bg, i * 35);
    fadeIn(strip.cells[i].content!, i * 35 + 50);
  }
  fadeIn(brace.path, 300);
  fadeIn(brace.label!, 380);
  fadeIn(pointerI.arrow, 300);
  fadeIn(pointerI.label, 380);
  await sd.pause();

  setStroke(lastBg, ACCENT, 0);
  lastBg
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setFill(ACCENT_FILL)
    .setOpacity(1)
    .endAnimate();
  lastText
    .startAnimate({ delay: 60, duration: 320, easing: E.easeOut })
    .setFill(ACCENT_TEXT)
    .setOpacity(1)
    .endAnimate();

  const newLeft = strip.cxOf(0) - CELL_W / 2;
  const newRight = strip.cxOf(N) + CELL_W / 2;
  const newCenter = (newLeft + newRight) / 2;
  brace.path
    .startAnimate({ duration: 380, easing: E.easeInOut })
    .setD(braceD(newLeft, newRight, BRACE_Y))
    .endAnimate();
  brace
    .label!.startAnimate({ duration: 380, easing: E.easeInOut })
    .setCx(newCenter)
    .endAnimate();

  fadeOpacity(pointerI.arrow, 0);
  fadeOpacity(pointerI.label, 0);
  fadeIn(pointerIPlus1.arrow, 80);
  fadeIn(pointerIPlus1.label, 160);
  await sd.pause();
});
