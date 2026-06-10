import * as sd from "@/sd";

import { applyMask, fadeInBits, fadeInRow, makeBitset } from "../common/bitset";

const svg = sd.svg();

const N = 5;
const view = makeBitset(svg, { n: N });

const SUBSETS = [0b10110, 0b11111, 0b01001, 0b10001];

sd.main(async () => {
  fadeInRow(view);
  fadeInBits(view, 200);
  await sd.pause();

  for (const S of SUBSETS) {
    applyMask(view, S);
    await sd.pause();
  }
});
