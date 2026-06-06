import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const N = 12;
const SIZE = 38;
const X0 = -(N * SIZE) / 2;

const f = new NumRow({
  targetNode: svg,
  values: new Array(N).fill(0),
  size: SIZE,
  x: X0,
  y: 0,
  label: "f",
});

const items = [
  { w: 3, v: 4 },
  { w: 4, v: 5 },
  { w: 5, v: 6 },
];

let arr = new Array(N).fill(0);

sd.main(async () => {
  f.fadeIn({ delay: 0 });
  await sd.pause();
  for (let k = 0; k < items.length; k++) {
    const { w, v } = items[k];
    const next = arr.slice();
    for (let j = N - 1; j >= w; j--) {
      if (arr[j - w] + v > next[j]) next[j] = arr[j - w] + v;
    }
    for (let j = 1; j <= N; j++) {
      if (next[j - 1] !== arr[j - 1]) {
        f.setValue(j, next[j - 1], { delay: (j - 1) * 40 });
        f.paintCell(j, "#fdecd9", C.darkOrange, {
          delay: (j - 1) * 40,
          duration: 200,
        });
      }
    }
    arr = next;
    await sd.pause();
    for (let j = 1; j <= N; j++) f.clearCell(j, { duration: 160 });
  }
});
