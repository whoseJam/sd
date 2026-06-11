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
];
const PEARL_SEQ = [0, 1, 2, 1, 0, 2, 1, 0];

const N = PEARL_SEQ.length;
const CY = 14;
const strip = makeStrip(svg, { n: N + 1, cy: CY, emptyCells: true });

const pearls: sd.Circle[] = [];
for (let i = 0; i < N; i++) {
  pearls.push(
    new sd.Circle({
      targetNode: svg,
      cx: strip.cxOf(i),
      cy: CY,
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
  cy: CY,
  r: 11,
  fill: NEUTRAL_FILL,
  stroke: NEUTRAL_STROKE,
  strokeWidth: 1.0,
  opacity: 0,
});

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
  label: "\\text{used } j \\text{ kinds}",
  labelFontSize: 13,
});

const lastBg = strip.cells[N].bg;

const branchLabelJ = new sd.Math({
  targetNode: svg,
  text: "j",
  cx: strip.cxOf(N),
  cy: POINTER_Y + 22,
  fontSize: 16,
  fill: ACCENT,
  opacity: 0,
});
const branchLabelComplement = new sd.Math({
  targetNode: svg,
  text: "K-j",
  cx: strip.cxOf(N),
  cy: POINTER_Y + 22,
  fontSize: 16,
  fill: ACCENT,
  opacity: 0,
});

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(strip.cells[i].bg, i * 30);
    fadeIn(pearls[i], i * 30 + 60);
  }
  fadeIn(brace.path, N * 30 + 80);
  fadeIn(brace.label!, N * 30 + 160);
  fadeIn(pointerI.arrow, N * 30 + 80);
  fadeIn(pointerI.label, N * 30 + 160);
  await sd.pause();

  setStroke(lastBg, ACCENT, 0);
  lastBg
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  fadeIn(newPearl, 60);

  const newLeft = strip.cxOf(0) - CELL_W / 2;
  const newRight = strip.cxOf(N) + CELL_W / 2;
  const newCenter = (newLeft + newRight) / 2;
  brace.path
    .startAnimate({ duration: 380, easing: E.easeInOut })
    .setD(braceD(newLeft, newRight, BRACE_Y))
    .endAnimate();
  brace
    .label!.startAnimate({ delay: 80, duration: 320, easing: E.easeInOut })
    .setCx(newCenter)
    .endAnimate();

  fadeOpacity(pointerI.arrow, 0);
  fadeOpacity(pointerI.label, 0);
  fadeIn(pointerIPlus1.arrow, 80);
  fadeIn(pointerIPlus1.label, 160);
  await sd.pause();

  newPearl
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setFill(PALETTE[0])
    .endAnimate();
  fadeIn(branchLabelJ, 80);
  await sd.pause();

  fadeOpacity(branchLabelJ, 0);
  newPearl
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setFill(PALETTE[3])
    .endAnimate();
  fadeIn(branchLabelComplement, 120);
  await sd.pause();
});
