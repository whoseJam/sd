import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const data = [4, 2, 4, 5, 1, 6, 4, 5, 9, 4];
const N = data.length;
const SIZE = 44;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg,
  values: data,
  size: SIZE,
  x: X0,
  y: 0,
});

// Partition for m=7 segments greedily with max bucket sum = 9.
const M = 7;
const limit = 9;
const breaks: number[] = []; // positions BETWEEN cells (after which a break)
{
  let s = 0;
  for (let i = 0; i < N; i++) {
    if (s + data[i] > limit) {
      breaks.push(i);
      s = data[i];
    } else s += data[i];
  }
}

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();
  for (let k = 0; k < breaks.length; k++) {
    const cx = row.cellLeft(breaks[k] + 1);
    new sd.Line({
      targetNode: svg,
      x1: cx,
      y1: row.bottom() - 6,
      x2: cx,
      y2: row.top() + 6,
      stroke: C.darkOrange,
      strokeWidth: 2.4,
      opacity: 0,
    })
      .startAnimate({ delay: k * 120, duration: 220, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  new sd.Math({
    targetNode: svg,
    text: `m = ${M}`,
    cx: 0,
    cy: row.top() + 26,
    fontSize: 14,
    fill: C.darkButtonGrey,
    opacity: 0,
  })
    .startAnimate({ delay: 600, duration: 220, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
