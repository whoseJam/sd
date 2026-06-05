import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const left = [0, 3, 5, 8, 11];
const right = [0, 2, 7, 9, 12];
const W = 15;

const SIZE = 40;
const X0 = -(Math.max(left.length, right.length) * SIZE) / 2;

const lRow = new NumRow({
  targetNode: svg, values: left, size: SIZE,
  x: X0, y: 30, label: "L",
});
const rRow = new NumRow({
  targetNode: svg, values: right, size: SIZE,
  x: X0, y: -30 - SIZE, label: "R",
});

new sd.Math({
  targetNode: svg, text: `W = ${W}`,
  cx: -150, cy: 0, fontSize: 14, fill: C.darkButtonGrey,
});

// Two-pointer scan: i forward, j backward.
sd.main(async () => {
  lRow.fadeIn({ delay: 0 });
  rRow.fadeIn({ delay: 200 });
  await sd.pause();

  let j = right.length;
  let best = 0;
  for (let i = 1; i <= left.length; i++) {
    while (j > 0 && left[i - 1] + right[j - 1] > W) {
      rRow.clearCell(j, { duration: 140 });
      j--;
    }
    if (j > 0) {
      const sum = left[i - 1] + right[j - 1];
      if (sum > best) best = sum;
      lRow.paintCell(i, "#fdecd9", C.darkOrange, { duration: 180 });
      rRow.paintCell(j, "#dbeefd", C.steelBlue, { duration: 180 });
      await sd.pause();
      lRow.clearCell(i, { duration: 140 });
    }
  }
  new sd.Math({
    targetNode: svg, text: `best = ${best}`,
    cx: 150, cy: 0, fontSize: 14, fill: C.darkGreen, opacity: 0,
  }).startAnimate({ duration: 280 }).setOpacity(1).endAnimate();
  await sd.pause();
});
