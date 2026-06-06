import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const data = [-1, -1, -1, -1, 2, 2, 3, 3, 3, 3, 3, 4, 5, 5, 6, 6, 6, 6];
const N = data.length;
const SIZE = 32;
const X0 = -(N * SIZE) / 2;

const arr = new NumRow({
  targetNode: svg,
  values: data,
  size: SIZE,
  x: X0,
  y: 0,
  label: "A",
});

// Group boundaries.
const groups: Array<{ from: number; to: number; count: number }> = [];
{
  let l = 0;
  while (l < N) {
    let r = l;
    while (r + 1 < N && data[r + 1] === data[l]) r++;
    groups.push({ from: l + 1, to: r + 1, count: r - l + 1 });
    l = r + 1;
  }
}

const queryL = 5;
const queryR = 14;

const queryBrace = new sd.Path({
  targetNode: svg,
  d: `M ${arr.cellLeft(queryL)} ${arr.bottom() - 12} L ${arr.cellLeft(queryL)} ${arr.bottom() - 22} L ${arr.cellRight(queryR)} ${arr.bottom() - 22} L ${arr.cellRight(queryR)} ${arr.bottom() - 12}`,
  stroke: C.darkOrange,
  strokeWidth: 1.8,
  fill: "none",
  opacity: 0,
});
const queryLabel = new sd.Text({
  targetNode: svg,
  text: "query",
  cx: (arr.cellLeft(queryL) + arr.cellRight(queryR)) / 2,
  cy: arr.bottom() - 36,
  fontSize: 14,
  fill: C.darkOrange,
  opacity: 0,
});

sd.main(async () => {
  arr.fadeIn({ delay: 0 });
  queryBrace
    .startAnimate({ delay: 360, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  queryLabel
    .startAnimate({ delay: 420, duration: 220, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  // Highlight each group inside the query window.
  let bestCount = 0;
  let bestGroup = -1;
  for (let g = 0; g < groups.length; g++) {
    const { from, to } = groups[g];
    const lo = Math.max(from, queryL);
    const hi = Math.min(to, queryR);
    if (lo > hi) continue;
    const cnt = hi - lo + 1;
    if (cnt > bestCount) {
      bestCount = cnt;
      bestGroup = g;
    }
    for (let i = lo; i <= hi; i++)
      arr.paintCell(i, "#dbeefd", C.steelBlue, {
        delay: g * 60,
        duration: 200,
      });
  }
  await sd.pause();

  if (bestGroup >= 0) {
    const { from, to } = groups[bestGroup];
    const lo = Math.max(from, queryL);
    const hi = Math.min(to, queryR);
    for (let i = lo; i <= hi; i++)
      arr.paintCell(i, "#fdecd9", C.darkOrange, { duration: 200 });
    new sd.Text({
      targetNode: svg,
      text: `mode count = ${bestCount}`,
      cx: 0,
      cy: arr.top() + 22,
      fontSize: 14,
      fill: C.darkOrange,
    });
  }
  await sd.pause();
});
