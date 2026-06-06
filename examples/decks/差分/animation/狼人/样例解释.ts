import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const v = 3;
const data = [
  0, 0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1, 0, 1, 2, 3, 2, 1, 0, 0, 0,
];
const pIndex0 = 10;

const SIZE = 30;
const X0 = -(data.length * SIZE) / 2;

const arr = new NumRow({
  targetNode: svg,
  values: data,
  size: SIZE,
  x: X0,
  y: 0,
  label: "c",
  labelGap: 18,
});

const pTri = new sd.Path({
  targetNode: svg,
  d: `M ${arr.cellCx(pIndex0 + 1)} ${arr.bottom() - 6} L ${arr.cellCx(pIndex0 + 1) - 5} ${arr.bottom() - 14} L ${arr.cellCx(pIndex0 + 1) + 5} ${arr.bottom() - 14} Z`,
  fill: C.darkOrange,
  stroke: C.darkOrange,
  opacity: 0,
});
const pLabel = new sd.Math({
  targetNode: svg,
  text: "pos",
  cx: arr.cellCx(pIndex0 + 1),
  cy: arr.bottom() - 26,
  fontSize: 12,
  fill: C.darkOrange,
  opacity: 0,
});

const ranges: Array<{ from: number; to: number; color: sd.SDColor }> = [
  {
    from: pIndex0 + 1 - 3 * v + 1,
    to: pIndex0 + 1 - 2 * v,
    color: C.steelBlue,
  },
  { from: pIndex0 + 1 - 2 * v + 1, to: pIndex0 + 1 - v, color: C.steelBlue },
  { from: pIndex0 + 1 - v + 1, to: pIndex0 + 1, color: C.darkOrange },
  { from: pIndex0 + 1 + 1, to: pIndex0 + 1 + v, color: C.darkOrange },
  { from: pIndex0 + 1 + v + 1, to: pIndex0 + 1 + 2 * v, color: C.steelBlue },
  {
    from: pIndex0 + 1 + 2 * v + 1,
    to: pIndex0 + 1 + 3 * v,
    color: C.steelBlue,
  },
];

sd.main(async () => {
  arr.fadeIn({ delay: 0 });
  pTri
    .startAnimate({ delay: 240, duration: 260, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  pLabel
    .startAnimate({ delay: 280, duration: 220, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  for (let k = 0; k < ranges.length; k++) {
    const { from, to, color } = ranges[k];
    const tone = color === C.darkOrange ? "#fdecd9" : "#dbeefd";
    for (let i = from; i <= to; i++) {
      arr.paintCell(i, tone, color, { delay: (i - from) * 30, duration: 200 });
    }
    await sd.pause();
  }
});
