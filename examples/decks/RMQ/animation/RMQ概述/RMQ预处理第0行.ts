import * as sd from "@/sd";

import { FTable } from "../lib/f-table";
import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const data = [2, 4, 3, 7, 4];
const N = data.length;
const M = Math.floor(Math.log2(N)) + 1;
const SIZE = 44;

const a = new NumRow({
  targetNode: svg,
  values: data,
  size: SIZE,
  x: -(N * SIZE) / 2,
  y: 80,
  label: "A",
});

const F = new FTable({
  targetNode: svg,
  rows: M,
  cols: N,
  cellSize: SIZE,
  x: -(N * SIZE) / 2,
  y: 80 - 24 - M * SIZE,
  label: "F",
});

sd.main(async () => {
  a.fadeIn({ delay: 0 });
  await sd.pause();

  for (let i = 1; i <= N; i++) {
    a.paintCell(i, "#fdecd9", C.darkOrange, { duration: 180 });
    F.paintCell(0, i, "#fdecd9", C.darkOrange, { delay: 120 });
    F.setValue(0, i, data[i - 1], { delay: 160 });
    await sd.pause();
    a.clearCell(i, { duration: 160 });
    F.clearCell(0, i);
  }
  await sd.pause();
});
