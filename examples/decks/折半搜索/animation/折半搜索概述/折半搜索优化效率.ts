import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 8;
const SIZE = 44;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg, values: new Array(N).fill(" "), size: SIZE,
  x: X0, y: 0, label: "决策",
});

const midX = X0 + (N / 2) * SIZE;
const splitter = new sd.Line({
  targetNode: svg, x1: midX, y1: row.bottom() - 8, x2: midX, y2: row.top() + 8,
  stroke: C.darkOrange, strokeWidth: 2.4, opacity: 0,
});

const leftLabel = new sd.Math({
  targetNode: svg, text: `2^{${N / 2}} \\text{ 种}`,
  cx: X0 + (N / 4) * SIZE, cy: row.top() + 22,
  fontSize: 14, fill: C.steelBlue, opacity: 0,
});
const rightLabel = new sd.Math({
  targetNode: svg, text: `2^{${N / 2}} \\text{ 种}`,
  cx: X0 + (3 * N / 4) * SIZE, cy: row.top() + 22,
  fontSize: 14, fill: C.darkOrange, opacity: 0,
});

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();

  splitter.startAnimate({ duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  for (let i = 1; i <= N / 2; i++) row.paintCell(i, "#dbeefd", C.steelBlue, { delay: i * 60, duration: 200 });
  for (let i = N / 2 + 1; i <= N; i++) row.paintCell(i, "#fdecd9", C.darkOrange, { delay: i * 60, duration: 200 });
  leftLabel.startAnimate({ delay: 400, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  rightLabel.startAnimate({ delay: 500, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
});
