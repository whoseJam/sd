import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

// Light states 0/1 across N positions.
const N = 8;
const SIZE = 40;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg,
  values: new Array(N).fill(0),
  size: SIZE,
  x: X0,
  y: 0,
  label: "灯",
});

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();
  // Goal: turn all to 1.
  for (let i = 1; i <= N; i++) {
    row.setValue(i, 1, { delay: i * 80 });
    row.paintCell(i, "#fdecd9", C.darkOrange, { delay: i * 80, duration: 200 });
  }
  await sd.pause();
});
