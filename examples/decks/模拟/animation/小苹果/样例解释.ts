import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const N = 12;
const SIZE = 36;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg, values: new Array(N).fill("●"), size: SIZE,
  x: X0, y: 0, label: "apples",
});

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();

  // Discard 1 of every 3.
  for (let i = 1; i <= N; i += 3) {
    row.setValue(i, " ");
    row.paintCell(i, "#fde9e9", "#d32f2f" as sd.SDColor, { duration: 200 });
  }
  await sd.pause();
});
