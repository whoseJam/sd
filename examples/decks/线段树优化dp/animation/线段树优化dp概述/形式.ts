import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 12;
const SIZE = 38;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg, values: new Array(N).fill(" "), size: SIZE,
  x: X0, y: 0, label: "f",
});

const i = 10;
const l = 4;
const r = 9;

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();
  for (let j = l; j <= r; j++) row.paintCell(j, "#dbeefd", C.steelBlue, { delay: (j - l) * 60, duration: 200 });
  row.paintCell(i, "#fdecd9", C.darkOrange, { delay: 400, duration: 240 });
  new sd.Math({
    targetNode: svg, text: "f[i] \\leftarrow \\max_{j \\in [l, r]} f[j] + g(j, i)",
    cx: 0, cy: -50, fontSize: 14, fill: C.darkButtonGrey, opacity: 0,
  }).startAnimate({ delay: 600, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
});
