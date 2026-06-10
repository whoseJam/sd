import * as sd from "@/sd";

import {
  HIGHLIGHT,
  fadeIn,
  fadeInBits,
  fadeInRow,
  makeBitset,
  setOff,
  setOn,
} from "../common/bitset";

const svg = sd.svg();

const N = 5;
const S0 = 0b10110;
const REMOVE_BIT = 1;
const view = makeBitset(svg, { n: N });

const arrow = new sd.Path({
  targetNode: svg,
  d: `M ${view.cxOf(REMOVE_BIT)} ${view.cellY + 36} L ${view.cxOf(REMOVE_BIT) - 6} ${view.cellY + 48} L ${view.cxOf(REMOVE_BIT) + 6} ${view.cellY + 48} Z`,
  fill: HIGHLIGHT,
  stroke: "none",
  opacity: 0,
});

sd.main(async () => {
  fadeInRow(view);
  fadeInBits(view, 200);
  for (let i = 0; i < N; i++) {
    if ((S0 >> i) & 1) setOn(view, i, 300 + i * 20);
  }
  await sd.pause();

  fadeIn(arrow);
  await sd.pause();

  setOff(view, REMOVE_BIT);
  await sd.pause();
});
