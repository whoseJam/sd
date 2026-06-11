import * as sd from "@/sd";

import { Grid } from "../common/grid";

const svg = sd.svg();
const C = sd.color();

const n = 6;
const SIZE = 50;
const X0 = -((n - 1) * SIZE) / 2 - SIZE / 2;
const Y0 = ((n - 1) * SIZE) / 2 + SIZE / 2;

const grid = new Grid({
  targetNode: svg,
  rows: n,
  cols: n,
  size: SIZE,
  x: X0,
  y: Y0,
  showRowIndex: true,
  showColIndex: true,
});

function mex(arr: number[]): number {
  const set = new Set(arr);
  for (let i = 0; ; i++) if (!set.has(i)) return i;
}

const palette = [
  "#e2ecf6",
  "#d4eaf7",
  "#cce7e1",
  "#fdecd9",
  "#fde2e2",
] as sd.SDColor[];
const strokes = [
  C.steelBlue,
  C.steelBlue,
  C.darkButtonGrey,
  C.darkOrange,
  "#c62828",
] as sd.SDColor[];

const table: number[][] = Array.from({ length: n + 1 }, () =>
  Array(n + 1).fill(0),
);
for (let s = 2; s <= 2 * n; s++) {
  for (let i = 1; i <= Math.min(n, s - 1); i++) {
    const j = s - i;
    if (j > n) continue;
    if (i === j && i === 1) continue;
    const arr: number[] = [];
    for (let k = 1; k < i; k++) arr.push(table[k][i - k]);
    for (let k = 1; k < j; k++) arr.push(table[j - k][k]);
    table[i][j] = mex(arr);
  }
}

sd.main(async () => {
  grid.fadeIn();
  await sd.pause();
  grid.setValue(1, 1, 0);
  let delay = 0;
  for (let s = 2; s <= 2 * n; s++) {
    for (let i = 1; i <= Math.min(n, s - 1); i++) {
      const j = s - i;
      if (j > n) continue;
      if (i === j && i === 1) continue;
      grid.setValue(i, j, table[i][j], { delay });
      const v = table[i][j];
      const p = palette[Math.min(v, palette.length - 1)];
      const k = strokes[Math.min(v, strokes.length - 1)];
      grid.paintCell(i, j, p, k, { delay });
      delay += 90;
    }
  }
  await sd.pause();
});
