import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const colors = [1, 2, 2, 3, 1, 1, 2, 1, 3, 3];
const N = colors.length;
const SIZE = 38;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg, values: colors, size: SIZE,
  x: X0, y: 30, label: "col",
});

// pos[c] = list of positions.
const tones: Record<number, string> = {
  1: "#fdecd9",
  2: "#dbeefd",
  3: "#e8f5e9",
};
const strokes: Record<number, sd.SDColor> = {
  1: C.darkOrange,
  2: C.steelBlue,
  3: C.darkGreen,
};

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  for (let i = 1; i <= N; i++) {
    row.paintCell(i, tones[colors[i - 1]] as sd.SDColor, strokes[colors[i - 1]], { delay: 200 + i * 30, duration: 220 });
  }
  await sd.pause();

  // Merge color 1 -> color 2.
  for (let i = 1; i <= N; i++) {
    if (colors[i - 1] === 1) {
      row.setValue(i, 2, { delay: i * 80 });
      row.paintCell(i, tones[2] as sd.SDColor, strokes[2], { delay: i * 80, duration: 220 });
    }
  }
  await sd.pause();
});
