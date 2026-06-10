import * as sd from "@/sd";

import {
  DUR,
  HIGHLIGHT,
  fadeIn,
  fadeInBits,
  fadeInRow,
  makeBitset,
  setOn,
} from "../common/bitset";

const svg = sd.svg();
const E = sd.easing();

const N = 5;
const S0 = 0b10110;
const view = makeBitset(svg, { n: N });

function arrowPath(cx: number, cellY: number) {
  return `M ${cx} ${cellY + 36} L ${cx - 6} ${cellY + 48} L ${cx + 6} ${cellY + 48} Z`;
}

const pointer = new sd.Path({
  targetNode: svg,
  d: arrowPath(view.cxOf(0), view.cellY),
  fill: HIGHLIGHT,
  stroke: "none",
  opacity: 0,
});

sd.main(async () => {
  fadeInRow(view);
  fadeInBits(view, 200);
  for (let i = 0; i < N; i++) {
    if ((S0 >> i) & 1) setOn(view, i, 300 + (N - 1 - i) * 25);
  }
  fadeIn(pointer, 500);
  await sd.pause();

  for (let i = 0; i < N; i++) {
    pointer
      .startAnimate({ duration: DUR, easing: E.easeOut })
      .setD(arrowPath(view.cxOf(i), view.cellY))
      .endAnimate();
    await sd.pause();
  }
});
