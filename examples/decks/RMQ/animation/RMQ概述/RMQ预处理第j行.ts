import * as sd from "@/sd";

import { FTable } from "../lib/f-table";
import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const data = [2, 4, 3, 7, 4, 6, 8, 3];
const N = data.length;
const M = Math.floor(Math.log2(N)) + 1;
const SIZE = 38;

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

const fValues: number[][] = Array.from({ length: M }, () => new Array(N).fill(0));
for (let i = 0; i < N; i++) fValues[0][i] = data[i];

sd.main(async () => {
  a.fadeIn({ delay: 0 });
  for (let i = 1; i <= N; i++) F.setValue(0, i, data[i - 1], { delay: 200 + i * 30 });
  await sd.pause();

  let isFirst = true;
  for (let j = 1; j < M; j++) {
    for (let i = 1; i + (1 << j) - 1 <= N; i++) {
      const len = 1 << (j - 1);
      const iLeft = i;
      const iRight = i + len;
      const v = Math.max(fValues[j - 1][iLeft - 1], fValues[j - 1][iRight - 1]);
      fValues[j][i - 1] = v;
      const base = isFirst ? 0 : 200;
      isFirst = false;
      F.paintCell(j - 1, iLeft, "#fdecd9", C.darkOrange, { delay: base, duration: 180 });
      F.paintCell(j - 1, iRight, "#dbeefd", C.steelBlue, { delay: base, duration: 180 });
      F.paintCell(j, i, "#e8f5e9", C.darkGreen, { delay: base + 140, duration: 200 });
      F.setValue(j, i, v, { delay: base + 200 });
      await sd.pause();
      F.clearCell(j - 1, iLeft, { duration: 160 });
      F.clearCell(j - 1, iRight, { duration: 160 });
      F.clearCell(j, i, { duration: 160 });
    }
  }
  await sd.pause();
});
