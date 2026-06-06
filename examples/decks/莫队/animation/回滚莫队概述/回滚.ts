import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const N = 12;
const SIZE = 40;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg,
  values: new Array(N).fill(" "),
  size: SIZE,
  x: X0,
  y: 0,
});

const B = 3;
const blockStart = 4; // 1-indexed start of the block we're in
const blockEnd = blockStart + B - 1;

// Reset position before each query: r at blockEnd
const queryL = 3;
const queryR = 10;

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();

  // Snapshot point: between blockEnd and r expansion.
  for (let i = blockStart; i <= blockEnd; i++)
    row.paintCell(i, "#fdecd9", C.darkOrange, { duration: 200 });
  await sd.pause();

  // Expand r rightward (append-only).
  for (let i = blockEnd + 1; i <= queryR; i++) {
    row.paintCell(i, "#dbeefd", C.steelBlue, {
      delay: (i - blockEnd) * 80,
      duration: 180,
    });
  }
  await sd.pause();

  // Expand l leftward (append-only) — saved before this; will rollback after.
  for (let i = blockStart - 1; i >= queryL; i--) {
    row.paintCell(i, "#e8f5e9", C.darkGreen, {
      delay: (blockStart - i) * 80,
      duration: 180,
    });
  }
  new sd.Text({
    targetNode: svg,
    text: "rollback ↶",
    cx: 0,
    cy: 50,
    fontSize: 14,
    fill: C.darkButtonGrey,
    opacity: 0,
  })
    .startAnimate({ delay: 600, duration: 280 })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
