import * as sd from "@/sd";

import { NumRow } from "../common/num-row";

const svg = sd.svg();
const C = sd.color();

const n = 15;
const m = 3;
const SIZE = 36;
const X0 = -((n - 1) * SIZE) / 2 - SIZE / 2;

const row = new NumRow({
  targetNode: svg,
  values: Array(n).fill(""),
  size: SIZE,
  x: X0,
  y: -SIZE / 2,
  label: "f",
  labelGap: 24,
});

const idx = new NumRow({
  targetNode: svg,
  values: Array.from({ length: n }, (_, i) => i + 1),
  size: SIZE,
  x: X0,
  y: SIZE / 2 + 4,
  cellFill: C.transparent as sd.SDColor,
  cellStroke: C.transparent as sd.SDColor,
  textFill: C.darkButtonGrey,
  fontScale: 0.4,
});

const brace = new sd.Path({
  targetNode: svg,
  d: "M 0 0 L 0 0",
  stroke: C.steelBlue as sd.SDColor,
  strokeWidth: 1.4,
  fill: "none",
  opacity: 0,
});

function setBrace(l: number, r: number) {
  const xL = X0 + (l - 1) * SIZE;
  const xR = X0 + r * SIZE;
  const yT = -SIZE - 4;
  const yD = -SIZE - 12;
  brace
    .startAnimate({ duration: 200 })
    .setD(`M ${xL} ${yT} L ${xL} ${yD} L ${xR} ${yD} L ${xR} ${yT}`)
    .setOpacity(1)
    .endAnimate();
}

const f: number[] = Array(n + 1).fill(-1);
for (let i = 1; i <= m; i++) f[i] = 1;
for (let i = m + 1; i <= n; i++) {
  let flag = false;
  for (let j = i - m; j <= i - 1; j++) if (f[j] === 0) flag = true;
  f[i] = flag ? 1 : 0;
}

sd.main(async () => {
  row.fadeIn({ delay: 0, stagger: 18 });
  idx.fadeIn({ delay: 0, stagger: 18 });
  await sd.pause();
  for (let i = 1; i <= m; i++) {
    row.setValue(i, 1, { delay: (i - 1) * 80 });
    row.paintCell(i, "#e2ecf6" as sd.SDColor, C.steelBlue as sd.SDColor, {
      delay: (i - 1) * 80,
    });
  }
  await sd.pause();
  for (let i = m + 1; i <= n; i++) {
    const delay = (i - m - 1) * 180;
    setBrace(i - m, i - 1);
    row.setValue(i, f[i], { delay });
    row.paintCell(
      i,
      f[i] === 1 ? ("#e2ecf6" as sd.SDColor) : ("#fde2e2" as sd.SDColor),
      f[i] === 1 ? (C.steelBlue as sd.SDColor) : ("#c62828" as sd.SDColor),
      { delay },
    );
  }
  await sd.pause();
  brace.startAnimate({ duration: 220 }).setOpacity(0).endAnimate();
  await sd.pause();
});
