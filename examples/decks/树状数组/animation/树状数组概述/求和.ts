import * as sd from "@/sd";

import { CharRow } from "../../../KMP/animation/char-row";

// BIT prefix-sum query: sum(1..7) visits BIT nodes 7, 6, 4 — at each
// step i -= lowbit(i). Visualised on a 12-element array with the BIT
// blocks above; the visited blocks light up orange.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 12;
const SIZE = 36;
const X0 = -(N * SIZE) / 2;
const ARR_Y = 0;
const ROW_GAP = 50;
const Q = 7;

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

interface Block {
  rect: sd.Rect;
  label: sd.Text;
}
const blocks = new Map<number, Block>();
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
    fill: "#dde6ef",
    stroke: C.steelBlue,
    strokeWidth: 1.4,
  });
  const label = new sd.Text({
    targetNode: svg,
    text: `t${i}`,
    cx: x + width / 2,
    cy: y + SIZE / 2,
    fontSize: 13,
    fill: C.steelBlue,
  });
  blocks.set(i, { rect, label });
}

const HIT_FILL = "#fce4a0";
const HIT_STROKE = C.darkOrange;

const visitedIds: number[] = [];
{
  let i = Q;
  while (i > 0) {
    visitedIds.push(i);
    i -= lowbit(i);
  }
}

sd.main(async () => {
  base.fadeIn({ delay: 0 });
  // Highlight the queried range [1, Q] on the bottom array.
  for (let k = 1; k <= Q; k++) base.paintCell(k, "#fcf3d6", C.darkOrange, { delay: 220 + k * 30 });
  await sd.pause();

  for (let k = 0; k < visitedIds.length; k++) {
    const id = visitedIds[k];
    const block = blocks.get(id);
    if (!block) continue;
    block.rect
      .startAnimate({ delay: k * 280, duration: 320, easing: E.easeOut })
      .setFill(HIT_FILL)
      .setStroke(HIT_STROKE)
      .setStrokeWidth(2.4)
      .endAnimate();
  }
  await sd.pause();

  void E;
});
