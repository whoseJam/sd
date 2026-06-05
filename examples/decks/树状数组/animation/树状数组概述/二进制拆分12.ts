import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";

// BIT structure for n = 12: original array on the bottom, BIT nodes
// above with their covered ranges. Each BIT node i covers [i-lowbit(i)+1, i]
// — visually, a row sitting at height log2(lowbit(i)) above.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 12;
const SIZE = 36;
const X0 = -((N + 1) * SIZE) / 2 + SIZE / 2;
const ARR_Y = 0;
const ROW_GAP = 50;

const lowbit = (x: number) => x & -x;

const base = new CharRow({
  targetNode: svg,
  text: " ".repeat(N),
  size: SIZE,
  x: X0,
  y: ARR_Y,
  label: "a",
});

for (let i = 1; i <= N; i++) {
  new sd.Text({
    targetNode: svg,
    text: String(i),
    cx: base.cellCx(i),
    cy: ARR_Y - 14,
    fontSize: 11,
    fill: C.darkButtonGrey,
  });
}

const NODE_FILL = "#dde6ef";
const NODE_STROKE = C.steelBlue;

// For each BIT node i, draw a translucent block covering its range
// [i-lowbit(i)+1, i] at height log2(lowbit(i)) levels above the array.
const blocks: sd.Rect[] = [];
const labels: sd.Text[] = [];
for (let i = 1; i <= N; i++) {
  const lo = lowbit(i);
  const level = Math.log2(lo) + 1;
  const y = ARR_Y + SIZE + level * ROW_GAP;
  const l = i - lo + 1;
  const x = base.cellLeft(l);
  const width = lo * SIZE;
  const rect = new sd.Rect({
    targetNode: svg,
    x,
    y,
    width,
    height: SIZE,
    fill: NODE_FILL,
    stroke: NODE_STROKE,
    strokeWidth: 1.4,
    opacity: 0,
  });
  blocks.push(rect);
  labels.push(
    new sd.Text({
      targetNode: svg,
      text: `t${i}`,
      cx: x + width / 2,
      cy: y + SIZE / 2,
      fontSize: 13,
      fill: C.steelBlue,
      opacity: 0,
    }),
  );
}

sd.main(async () => {
  base.fadeIn({ delay: 0 });
  for (let i = 0; i < blocks.length; i++) {
    const delay = 200 + i * 80;
    blocks[i].startAnimate({ delay, duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
    labels[i].startAnimate({ delay: delay + 80, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  }
  await sd.pause();
});
