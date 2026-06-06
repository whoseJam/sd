import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const N = 9;
const dValues = new Array(N).fill(0);
const aValues = new Array(N).fill(0);

const SIZE = 44;
const X0 = -(N * SIZE) / 2;

const d = new NumRow({
  targetNode: svg,
  values: dValues,
  size: SIZE,
  x: X0,
  y: 30,
  label: "d",
});

const a = new NumRow({
  targetNode: svg,
  values: aValues,
  size: SIZE,
  x: X0,
  y: -30 - SIZE,
  label: "a",
});

const tweaks: Array<{ index: number; delta: number }> = [
  { index: 3, delta: 2 },
  { index: 6, delta: -1 },
];

sd.main(async () => {
  d.fadeIn({ delay: 0 });
  a.fadeIn({ delay: 200 });
  await sd.pause();

  for (let t = 0; t < tweaks.length; t++) {
    const { index, delta } = tweaks[t];
    const base = t === 0 ? 0 : 220;
    dValues[index - 1] += delta;
    d.setValue(index, dValues[index - 1], { delay: base });
    d.paintCell(index, "#fdecd9", C.darkOrange, { delay: base, duration: 200 });
    for (let k = index; k <= N; k++) {
      aValues[k - 1] += delta;
      a.setValue(k, aValues[k - 1], { delay: base + 120 + (k - index) * 40 });
      a.paintCell(k, "#dbeefd", C.steelBlue, {
        delay: base + 120 + (k - index) * 40,
        duration: 200,
      });
    }
    await sd.pause();
    for (let k = index; k <= N; k++) a.clearCell(k, { duration: 180 });
    d.clearCell(index, { duration: 180 });
  }
  await sd.pause();
});
