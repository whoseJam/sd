import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const N = 12;
const SIZE = 36;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg, values: new Array(N).fill(0), size: SIZE,
  x: X0, y: 0, label: "T",
});

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();

  // Test 1: remove [3, 6], mark T=1.
  for (let i = 3; i <= 6; i++) row.setValue(i, 1, { delay: (i - 3) * 80 });
  for (let i = 3; i <= 6; i++) row.paintCell(i, "#fdecd9", C.darkOrange, { delay: (i - 3) * 80, duration: 200 });
  await sd.pause();
  // Test 2: T=2; remove [5, 9].
  for (let i = 5; i <= 9; i++) row.setValue(i, 2, { delay: (i - 5) * 80 });
  for (let i = 5; i <= 9; i++) row.paintCell(i, "#dbeefd", C.steelBlue, { delay: (i - 5) * 80, duration: 200 });
  await sd.pause();
});
