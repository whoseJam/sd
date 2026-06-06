import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const L = 16;
const SIZE = 36;
const X0 = -(L * SIZE) / 2;

const row = new NumRow({
  targetNode: svg,
  values: new Array(L).fill("●"),
  size: SIZE,
  x: X0,
  y: 0,
  label: "trees",
});

const removals: Array<[number, number]> = [
  [3, 6],
  [9, 12],
];

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();

  for (const [l, r] of removals) {
    for (let i = l; i <= r; i++) {
      row.setValue(i, " ");
      row.paintCell(i, "#f0f0f0", C.silver, { duration: 200 });
    }
    await sd.pause();
  }
});
