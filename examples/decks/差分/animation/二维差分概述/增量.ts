import * as sd from "@/sd";

import { Grid } from "../lib/grid";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 4;
const M = 6;
const I = 3;
const J = 4;
const SIZE = 44;

const grid = new Grid({
  targetNode: svg,
  rows: N,
  cols: M,
  cellSize: SIZE,
  rowLabels: ["1", "2", "3", "4"],
  colLabels: ["1", "2", "3", "4", "5", "6"],
});

const focus = new sd.Rect({
  targetNode: svg,
  x: grid.left(),
  y: grid.bottom(),
  width: SIZE * M,
  height: SIZE * N,
  fill: "none",
  stroke: C.darkOrange,
  strokeWidth: 2.4,
  opacity: 0,
});

const label = new sd.Math({
  targetNode: svg,
  text: `d_{${I},${J}}`,
  cx: 0,
  cy: grid.bottom() - 30,
  fontSize: 16,
  fill: C.darkButtonGrey,
  opacity: 0,
});

function setFocus(rows: number, cols: number, delay = 0) {
  const x = grid.left();
  const y = grid.top() - rows * SIZE;
  const w = cols * SIZE;
  const h = rows * SIZE;
  focus
    .startAnimate({ delay, duration: 320, easing: E.easeOut })
    .setX(x)
    .setY(y)
    .setWidth(w)
    .setHeight(h)
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  label
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
  setFocus(I, J);
  await sd.pause();
  setFocus(I - 1, J);
  await sd.pause();
  setFocus(I, J - 1);
  await sd.pause();
  setFocus(I - 1, J - 1);
  await sd.pause();
});
