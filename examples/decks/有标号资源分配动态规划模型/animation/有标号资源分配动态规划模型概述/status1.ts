import * as sd from "@/sd";

import { fadeInBits, fadeInRow, makeBitset, setOn } from "../common/bitset";

const svg = sd.svg();

const N = 5;
const view = makeBitset(svg, { n: N });

sd.main(async () => {
  fadeInRow(view);
  fadeInBits(view, 200);
  await sd.pause();

  for (let i = 0; i < N; i++) setOn(view, i, i * 80);
  await sd.pause();
});
