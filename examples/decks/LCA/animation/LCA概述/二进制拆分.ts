import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Decompose d = 13 = 8 + 4 + 1 = 2^3 + 2^2 + 2^0.
const D = 13;
const bits = D.toString(2).split("").map(Number);
const SIZE = 44;
const N = bits.length;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg,
  values: bits,
  size: SIZE,
  x: X0,
  y: 0,
  label: `${D}_{(2)}`,
});

new sd.Math({
  targetNode: svg,
  text: `${D} = 2^3 + 2^2 + 2^0`,
  cx: 0, cy: row.top() + 26,
  fontSize: 16, fill: C.darkButtonGrey,
  opacity: 0,
}).startAnimate({ delay: 600, duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  for (let i = 0; i < N; i++) {
    if (bits[i] === 1) {
      row.paintCell(i + 1, "#fdecd9", C.darkOrange, { delay: 200 + i * 80, duration: 220 });
    }
  }
  await sd.pause();
});
