import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const N = 12;
const SIZE = 36;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg, values: Array.from({ length: N }, (_, i) => i + 1), size: SIZE,
  x: X0, y: 0,
});

const targetIdx = 7;

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  row.paintCell(targetIdx, "#fdecd9", C.darkOrange, { delay: 400, duration: 240 });
  await sd.pause();
});
