import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const dense = [0, 0, 3, 3, 3, 3, 3, 0, 0];
const sparse = dense.map((v, i) => (i === 0 ? v : v - dense[i - 1]));

const SIZE = 44;
const X0 = -(dense.length * SIZE) / 2;

const denseRow = new NumRow({
  targetNode: svg,
  values: dense,
  size: SIZE,
  x: X0,
  y: 30,
  label: "c",
});
const sparseRow = new NumRow({
  targetNode: svg,
  values: sparse,
  size: SIZE,
  x: X0,
  y: -30 - SIZE,
  label: "D(c)",
  labelGap: 36,
});

sd.main(async () => {
  denseRow.fadeIn({ delay: 0 });
  await sd.pause();
  sparseRow.fadeIn({ delay: 0 });
  for (let i = 1; i <= sparse.length; i++) {
    if (sparse[i - 1] !== 0) {
      sparseRow.paintCell(i, "#fdecd9", C.darkOrange, { delay: 200 + i * 20, duration: 220 });
    }
  }
  await sd.pause();
});
