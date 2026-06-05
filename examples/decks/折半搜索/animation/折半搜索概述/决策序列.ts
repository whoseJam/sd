import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

// One decision sequence with binary choices shown.
const N = 8;
const choices = [0, 1, 1, 0, 1, 0, 0, 1];
const SIZE = 44;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg, values: choices.map((c) => c === 0 ? "0" : "1"), size: SIZE,
  x: X0, y: 0, label: "决策",
});

new sd.Math({
  targetNode: svg, text: `2^{${N}} = ${1 << N} \\text{ 种可能}`,
  cx: 0, cy: -SIZE - 30,
  fontSize: 14, fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  for (let i = 1; i <= N; i++) {
    row.paintCell(i, choices[i - 1] === 0 ? "#dbeefd" : "#fdecd9",
      choices[i - 1] === 0 ? C.steelBlue : C.darkOrange,
      { delay: 200 + i * 60, duration: 200 });
  }
  await sd.pause();
});
