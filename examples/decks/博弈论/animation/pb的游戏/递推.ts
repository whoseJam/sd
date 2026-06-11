import * as sd from "@/sd";

import { NumRow } from "../common/num-row";

const svg = sd.svg();
const C = sd.color();

const n = 10;
const SIZE = 44;
const X0 = -((n - 1) * SIZE) / 2 - SIZE / 2;

const row = new NumRow({
  targetNode: svg,
  values: Array(n).fill(""),
  size: SIZE,
  x: X0,
  y: -SIZE / 2,
  label: "f",
  labelGap: 28,
});

const idx = new NumRow({
  targetNode: svg,
  values: Array.from({ length: n }, (_, i) => i + 1),
  size: SIZE,
  x: X0,
  y: SIZE / 2 + 4,
  cellFill: C.transparent as sd.SDColor,
  cellStroke: C.transparent as sd.SDColor,
  fontScale: 0.4,
});

const f: number[] = Array(n + 1).fill(0);
f[1] = 0;
for (let i = 2; i <= n; i++) {
  let canWin = false;
  for (let j = 1; j <= i >> 1; j++) {
    if (f[j] === 0 && f[i - j] === 0) {
      canWin = true;
      break;
    }
  }
  f[i] = canWin ? 1 : 0;
}

sd.main(async () => {
  row.fadeIn({ delay: 0, stagger: 20 });
  idx.fadeIn({ delay: 0, stagger: 20 });
  await sd.pause();
  row.setValue(1, 0);
  row.paintCell(1, "#fde2e2" as sd.SDColor, "#c62828" as sd.SDColor);
  await sd.pause();
  for (let i = 2; i <= n; i++) {
    const delay = (i - 2) * 200;
    row.setValue(i, f[i], { delay });
    row.paintCell(
      i,
      f[i] === 1 ? ("#e2ecf6" as sd.SDColor) : ("#fde2e2" as sd.SDColor),
      f[i] === 1 ? (C.steelBlue as sd.SDColor) : ("#c62828" as sd.SDColor),
      { delay },
    );
  }
  await sd.pause();
});
