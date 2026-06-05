import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 10;
const log2: number[] = [0];
for (let i = 1; i <= N; i++) log2.push(Math.floor(Math.log2(i)));

const SIZE = 44;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg,
  values: new Array(N).fill(" "),
  size: SIZE,
  x: X0,
  y: -SIZE / 2,
  label: "Log₂",
});

for (let i = 1; i <= N; i++) {
  new sd.Text({
    targetNode: svg, text: String(i),
    cx: row.cellCx(i), cy: row.top() + 14,
    fontSize: 12, fill: C.darkButtonGrey,
  });
}

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();

  row.setValue(1, 0);
  row.paintCell(1, "#fdecd9", C.darkOrange, { duration: 200 });
  await sd.pause();
  row.clearCell(1, { duration: 160 });

  for (let i = 2; i <= N; i++) {
    const src = i >> 1;
    const base = 200;
    row.paintCell(src, "#fdecd9", C.darkOrange, { delay: base, duration: 180 });
    row.setValue(i, log2[i], { delay: base + 120 });
    row.paintCell(i, "#dbeefd", C.steelBlue, { delay: base + 120, duration: 180 });
    const arc = new sd.Path({
      targetNode: svg,
      d: `M ${row.cellCx(src)} ${row.top() - 4} Q ${(row.cellCx(src) + row.cellCx(i)) / 2} ${row.top() + Math.abs(i - src) * 12} ${row.cellCx(i)} ${row.top() - 4}`,
      stroke: C.darkOrange, strokeWidth: 1.4, fill: "none", opacity: 0,
    });
    arc.startAnimate({ delay: base, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
    await sd.pause();
    arc.startAnimate({ duration: 200, easing: E.easeOut }).setOpacity(0).endAnimate();
    row.clearCell(src, { duration: 160 });
    row.clearCell(i, { duration: 160 });
  }
  await sd.pause();
});
