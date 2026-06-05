import * as sd from "@/sd";

import { Grid } from "../../../枚举/animation/grid";

// 5×5 grid with X^i row labels and Y^j column labels — the 2D RK
// hash weights each cell by X^i · Y^j, building a 2D prefix hash.

const svg = sd.svg();
const C = sd.color();

const N = 5;
const SIZE = 50;

const grid = new Grid({
  targetNode: svg,
  rows: N,
  cols: N,
  cellSize: SIZE,
});

const LABEL_FONT = 14;
for (let i = 1; i <= N; i++) {
  new sd.Math({
    targetNode: svg,
    text: `X^{${N - i}}`,
    cx: grid.left() - 22,
    cy: grid.cellCy(i, 1),
    fontSize: LABEL_FONT,
    fill: C.darkButtonGrey,
  });
}
for (let j = 1; j <= N; j++) {
  new sd.Math({
    targetNode: svg,
    text: `Y^{${N - j}}`,
    cx: grid.cellCx(1, j),
    cy: grid.top() + 22,
    fontSize: LABEL_FONT,
    fill: C.darkButtonGrey,
  });
}

sd.main(async () => {
  await sd.pause();
});
