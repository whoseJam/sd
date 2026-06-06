import * as sd from "@/sd";

import { FTable } from "../lib/f-table";
import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const data = [2, 4, 3, 7, 4, 6, 8, 3, 1, 5];
const N = data.length;
const M = Math.floor(Math.log2(N)) + 1;
const SIZE = 36;

const a = new NumRow({
  targetNode: svg,
  values: data,
  size: SIZE,
  x: -(N * SIZE) / 2,
  y: 100,
  label: "A",
});

const F = new FTable({
  targetNode: svg,
  rows: M,
  cols: N,
  cellSize: SIZE,
  x: -(N * SIZE) / 2,
  y: 100 - 30 - M * SIZE,
  label: "F",
});

const fValues: number[][] = Array.from({ length: M }, () =>
  new Array(N).fill(0),
);
for (let i = 0; i < N; i++) fValues[0][i] = data[i];
for (let j = 1; j < M; j++) {
  for (let i = 1; i + (1 << j) - 1 <= N; i++) {
    fValues[j][i - 1] = Math.max(
      fValues[j - 1][i - 1],
      fValues[j - 1][i + (1 << (j - 1)) - 1],
    );
  }
}

const queries: Array<[number, number]> = [
  [2, 7],
  [3, 10],
];

sd.main(async () => {
  a.fadeIn({ delay: 0 });
  for (let j = 0; j < M; j++) {
    for (let i = 1; i + (1 << j) - 1 <= N; i++) {
      F.setValue(j, i, fValues[j][i - 1], { delay: 200 + (j * N + i) * 14 });
    }
  }
  await sd.pause();

  const E = sd.easing();
  let firstQuery = true;
  for (const [l, r] of queries) {
    const base = firstQuery ? 0 : 200;
    firstQuery = false;
    const k = Math.floor(Math.log2(r - l + 1));
    const lStart = l;
    const rStart = r - (1 << k) + 1;
    for (let i = l; i <= r; i++)
      a.paintCell(i, "#e8f5e9", C.darkGreen, { delay: base, duration: 180 });
    await sd.pause();

    const leftRect = new sd.Rect({
      targetNode: svg,
      x: a.cellLeft(lStart) - 3,
      y: a.bottom() - 3,
      width: (1 << k) * SIZE + 6,
      height: SIZE + 6,
      fill: "none",
      stroke: C.darkOrange,
      strokeWidth: 2.4,
      opacity: 0,
    });
    const rightRect = new sd.Rect({
      targetNode: svg,
      x: a.cellLeft(rStart) - 3,
      y: a.bottom() - 3,
      width: (1 << k) * SIZE + 6,
      height: SIZE + 6,
      fill: "none",
      stroke: C.steelBlue,
      strokeWidth: 2.4,
      opacity: 0,
    });
    leftRect
      .startAnimate({ duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    F.paintCell(k, lStart, "#fdecd9", C.darkOrange, { duration: 200 });
    rightRect
      .startAnimate({ delay: 180, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    if (rStart !== lStart)
      F.paintCell(k, rStart, "#dbeefd", C.steelBlue, {
        delay: 180,
        duration: 200,
      });
    await sd.pause();

    leftRect
      .startAnimate({ duration: 200, easing: E.easeOut })
      .setOpacity(0)
      .endAnimate();
    rightRect
      .startAnimate({ duration: 200, easing: E.easeOut })
      .setOpacity(0)
      .endAnimate();
    for (let i = l; i <= r; i++) a.clearCell(i, { duration: 160 });
    F.clearCell(k, lStart, { duration: 160 });
    if (rStart !== lStart) F.clearCell(k, rStart, { duration: 160 });
  }
  await sd.pause();
});
