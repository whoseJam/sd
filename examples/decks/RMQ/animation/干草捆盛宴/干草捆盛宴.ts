import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const F = [2, 3, 2, 1, 4, 2, 4, 3, 1];
const S = [4, 1, 2, 3, 6, 4, 7, 8, 5];
const N = F.length;
const M = 6;
const SIZE = 44;
const X0 = -(N * SIZE) / 2;

const fRow = new NumRow({
  targetNode: svg, values: F, size: SIZE,
  x: X0, y: 30, label: "F",
});
const sRow = new NumRow({
  targetNode: svg, values: S, size: SIZE,
  x: X0, y: -30 - SIZE, label: "S",
});

function pointerOn(row: NumRow, idx: number, label: string, color: sd.SDColor) {
  const tri = new sd.Path({
    targetNode: svg,
    d: `M ${row.cellCx(idx)} ${row.top() + 6} L ${row.cellCx(idx) - 5} ${row.top() + 14} L ${row.cellCx(idx) + 5} ${row.top() + 14} Z`,
    fill: color, stroke: color, opacity: 0,
  });
  const lab = new sd.Text({
    targetNode: svg, text: label,
    cx: row.cellCx(idx), cy: row.top() + 24,
    fontSize: 13, fill: color, opacity: 0,
  });
  return { tri, lab, idx };
}

sd.main(async () => {
  fRow.fadeIn({ delay: 0 });
  sRow.fadeIn({ delay: 200 });
  await sd.pause();

  let j = 0;
  let sum = 0;
  let firstStep = true;
  for (let i = 0; i < N; i++) {
    const base = firstStep ? 0 : 220;
    firstStep = false;
    if (i > 0) sum -= F[i - 1];
    while (j < N && sum < M) {
      sum += F[j];
      j++;
    }
    if (sum < M) continue;
    for (let k = i + 1; k <= j; k++) {
      fRow.paintCell(k, "#e8f5e9", C.darkGreen, { delay: base, duration: 200 });
      sRow.paintCell(k, "#fdecd9", C.darkOrange, { delay: base, duration: 200 });
    }
    new sd.Text({
      targetNode: svg, text: `[${i + 1}, ${j}]`,
      cx: 0, cy: sRow.top() + 22, fontSize: 13, fill: C.darkButtonGrey,
      opacity: 0,
    }).startAnimate({ delay: base + 200, duration: 240, easing: E.easeOut }).setOpacity(1).endAnimate();
    await sd.pause();
    for (let k = i + 1; k <= j; k++) {
      fRow.clearCell(k, { duration: 160 });
      sRow.clearCell(k, { duration: 160 });
    }
  }
  void pointerOn;
  await sd.pause();
});
