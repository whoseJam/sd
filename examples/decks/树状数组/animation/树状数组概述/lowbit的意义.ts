import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";

// lowbit(i) = the size of the segment that BIT node i covers. Show
// six i values and the segment each one represents.

const svg = sd.svg();
const C = sd.color();

const SAMPLES: Array<[number, string, number]> = [
  [1, "0001", 1],
  [2, "0010", 2],
  [4, "0100", 4],
  [6, "0110", 2],
  [8, "1000", 8],
  [12, "1100", 4],
];

const SIZE = 28;

const rows: CharRow[] = [];
for (let r = 0; r < SAMPLES.length; r++) {
  const [i, bits, lo] = SAMPLES[r];
  const y = 100 - r * 36;
  new sd.Text({
    targetNode: svg,
    text: `i = ${i}`,
    cx: -160,
    cy: y + SIZE / 2,
    fontSize: 16,
    fill: C.darkButtonGrey,
  });
  rows.push(
    new CharRow({
      targetNode: svg,
      text: bits,
      size: SIZE,
      x: -60,
      y,
    }),
  );
  new sd.Math({
    targetNode: svg,
    text: `\\text{lowbit} = ${lo}`,
    cx: 130,
    cy: y + SIZE / 2,
    fontSize: 14,
    fill: C.darkOrange,
  });
}

sd.main(async () => {
  for (const row of rows) row.fadeIn({ delay: 0 });
  await sd.pause();
});
