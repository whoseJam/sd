import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";

// BIT point update: add d to a[5] propagates to BIT nodes 5, 6, 8 —
// at each step i += lowbit(i). Same layout as 求和; visited blocks
// light up green this time.

const svg = sd.svg();
const C = sd.color();

const N = 12;
const SIZE = 36;
const X0 = -(N * SIZE) / 2;
const ARR_Y = 0;
const ROW_GAP = 50;
const POS = 5;

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

interface Block { rect: sd.Rect; label: sd.Text }
const blocks = new Map<number, Block>();
for (let i = 1; i <= N; i++) {
  const lo = lowbit(i);
  const level = Math.log2(lo) + 1;
  const y = ARR_Y + SIZE + level * ROW_GAP;
  const l = i - lo + 1;
  const x = base.cellLeft(l);
  const width = lo * SIZE;
  blocks.set(i, {
    rect: new sd.Rect({
      targetNode: svg,
      x,
      y,
      width,
      height: SIZE,
      fill: "#dde6ef",
      stroke: C.steelBlue,
      strokeWidth: 1.4,
    }),
    label: new sd.Text({
      targetNode: svg,
      text: `t${i}`,
      cx: x + width / 2,
      cy: y + SIZE / 2,
      fontSize: 13,
      fill: C.steelBlue,
    }),
  });
}

const HIT_FILL = "#cfead0";
const HIT_STROKE = C.darkGreen;

const visitedIds: number[] = [];
{
  let i = POS;
  while (i <= N) {
    visitedIds.push(i);
    i += lowbit(i);
  }
}

sd.main(async () => {
  base.fadeIn({ delay: 0 });
  base.paintCell(POS, HIT_FILL, HIT_STROKE, { delay: 240 });
  await sd.pause();

  for (let k = 0; k < visitedIds.length; k++) {
    const id = visitedIds[k];
    const block = blocks.get(id);
    if (!block) continue;
    block.rect
      .startAnimate({ delay: k * 280, duration: 320 })
      .setFill(HIT_FILL)
      .setStroke(HIT_STROKE)
      .setStrokeWidth(2.4)
      .endAnimate();
  }
  await sd.pause();
});
