import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const N = 10;
const colors = [1, 2, 1, 3, 2, 1, 2, 3, 1, 2];
const SIZE = 38;
const X0 = -(N * SIZE) / 2;
const tones: Record<number, sd.SDColor> = { 1: "#fdecd9", 2: "#dbeefd", 3: "#e8f5e9" };
const strokes: Record<number, sd.SDColor> = { 1: C.darkOrange, 2: C.steelBlue, 3: C.darkGreen };

const row = new NumRow({
  targetNode: svg, values: colors, size: SIZE,
  x: X0, y: 0, label: "color",
});

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  for (let i = 1; i <= N; i++) {
    row.paintCell(i, tones[colors[i - 1]], strokes[colors[i - 1]], { delay: 200 + i * 30, duration: 200 });
  }
  await sd.pause();
});
