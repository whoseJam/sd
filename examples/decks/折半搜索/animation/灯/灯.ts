import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

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

new sd.Math({
  targetNode: svg,
  text: `\\text{第一半 switches: } 2^{${N / 2}}`,
  cx: X0 + (N / 4) * SIZE,
  cy: row.top() + 36,
  fontSize: 13,
  fill: C.steelBlue,
});
new sd.Math({
  targetNode: svg,
  text: `\\text{第二半 switches: } 2^{${N / 2}}`,
  cx: X0 + ((3 * N) / 4) * SIZE,
  cy: row.top() + 36,
  fontSize: 13,
  fill: C.darkOrange,
});

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();
  for (let i = 1; i <= N / 2; i++)
    row.paintCell(i, "#dbeefd", C.steelBlue, { delay: i * 60, duration: 200 });
  await sd.pause();
  for (let i = N / 2 + 1; i <= N; i++)
    row.paintCell(i, "#fdecd9", C.darkOrange, { delay: i * 60, duration: 200 });
  await sd.pause();
});
