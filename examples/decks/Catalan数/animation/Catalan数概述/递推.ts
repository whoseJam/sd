import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Show splitting sequence of length 2n with first matched pair at position 2i.
const N = 6;
const split = 3;
const TOTAL = 2 * N;
const SIZE = 38;
const X0 = -(TOTAL * SIZE) / 2;

const row = new NumRow({
  targetNode: svg,
  values: new Array(TOTAL).fill(" "),
  size: SIZE,
  x: X0,
  y: 0,
});

// First A at pos 1, matching B at 2*split.
// Inside [2, 2*split-1] there's H_{i-1} arrangement;
// After 2*split there's H_{n-i}.

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();
  row.paintCell(1, "#dbeefd", C.steelBlue, { duration: 200 });
  row.setValue(1, "A");
  row.paintCell(2 * split, "#dbeefd", C.steelBlue, {
    duration: 200,
    delay: 80,
  });
  row.setValue(2 * split, "B");
  await sd.pause();
  for (let i = 2; i <= 2 * split - 1; i++) {
    row.paintCell(i, "#fdecd9", C.darkOrange, { delay: i * 30, duration: 200 });
  }
  new sd.Math({
    targetNode: svg,
    text: `H_{${split - 1}}`,
    cx: (row.cellLeft(2) + row.cellRight(2 * split - 1)) / 2,
    cy: row.top() + 22,
    fontSize: 14,
    fill: C.darkOrange,
    opacity: 0,
  })
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
  for (let i = 2 * split + 1; i <= TOTAL; i++) {
    row.paintCell(i, "#e8f5e9", C.darkGreen, {
      delay: (i - 2 * split) * 30,
      duration: 200,
    });
  }
  new sd.Math({
    targetNode: svg,
    text: `H_{${N - split}}`,
    cx: (row.cellLeft(2 * split + 1) + row.cellRight(TOTAL)) / 2,
    cy: row.top() + 22,
    fontSize: 14,
    fill: C.darkGreen,
    opacity: 0,
  })
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
