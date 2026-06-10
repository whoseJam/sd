import * as sd from "@/sd";

import {
  HIGHLIGHT,
  fadeIn,
  fadeInBits,
  fadeInRow,
  makeBitset,
  setOn,
} from "../common/bitset";

const svg = sd.svg();

const N = 5;
const S0 = 0b10100;
const ADD_BIT = 0;
const view = makeBitset(svg, { n: N });

const arrow = new sd.Path({
  targetNode: svg,
  d: `M ${view.cxOf(ADD_BIT)} ${view.cellY + 36} L ${view.cxOf(ADD_BIT) - 6} ${view.cellY + 48} L ${view.cxOf(ADD_BIT) + 6} ${view.cellY + 48} Z`,
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

  setOn(view, ADD_BIT);
  await sd.pause();
});
