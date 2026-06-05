import * as sd from "@/sd";

import { Grid } from "../lib/grid";

const svg = sd.svg();
const C = sd.color();

const N = 6;
const M = 8;
const SIZE = 38;

const grid = new Grid({
  targetNode: svg,
  rows: N,
  cols: M,
  cellSize: SIZE,
  x: -(M * SIZE) / 2,
  y: -(N * SIZE) / 2,
});

const rugs: Array<{ r1: number; c1: number; r2: number; c2: number; fill: sd.SDColor; stroke: sd.SDColor }> = [
  { r1: 2, c1: 2, r2: 5, c2: 6, fill: "#fdecd9", stroke: C.darkOrange },
  { r1: 3, c1: 4, r2: 6, c2: 8, fill: "#dbeefd", stroke: C.steelBlue },
];

sd.main(async () => {
  await sd.pause();
  for (let k = 0; k < rugs.length; k++) {
    const { r1, c1, r2, c2, fill, stroke } = rugs[k];
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        const delay = ((r - r1) + (c - c1)) * 40;
        grid.paintCell(r, c, fill, { delay, duration: 200, stroke });
      }
    }
    await sd.pause();
  }
});
