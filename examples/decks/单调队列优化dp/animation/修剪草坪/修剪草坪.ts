import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const E_arr = [3, 7, 2, 5, 1, 4, 6, 8, 2, 4];
const N = E_arr.length;
const K = 4;
const SIZE = 38;
const X0 = -(N * SIZE) / 2;

const eRow = new NumRow({
  targetNode: svg, values: E_arr, size: SIZE,
  x: X0, y: 60, label: "E",
});

// g(j) - S(j) values for some j. Sliding window of length K.
const aux: number[] = [];
{
  let s = 0;
  let g = 0;
  for (let i = 0; i < N; i++) {
    s += E_arr[i];
    g = Math.max(g, s - 5); // placeholder values just for display
    aux.push(s - g);
  }
}

const auxRow = new NumRow({
  targetNode: svg, values: aux, size: SIZE,
  x: X0, y: 0, label: "g-S",
  labelGap: 30,
});

const Ei = 6;

const win = new sd.Rect({
  targetNode: svg,
  x: X0 + (Ei - K) * SIZE - 3,
  y: auxRow.bottom() - 3,
  width: K * SIZE + 6,
  height: SIZE + 6,
  fill: "none", stroke: C.darkOrange, strokeWidth: 2,
  opacity: 0,
});
const E = sd.easing();

sd.main(async () => {
  eRow.fadeIn({ delay: 0 });
  auxRow.fadeIn({ delay: 200 });
  await sd.pause();

  win.startAnimate({ duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  for (let i = Ei - K; i < Ei; i++) auxRow.paintCell(i + 1, "#fdecd9", C.darkOrange, { duration: 200 });
  new sd.Text({
    targetNode: svg,
    text: `query: max over last ${K}`,
    cx: 0, cy: -60 - SIZE,
    fontSize: 12, fill: C.darkOrange,
    opacity: 0,
  }).startAnimate({ delay: 300, duration: 240, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
});
