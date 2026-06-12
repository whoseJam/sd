import * as sd from "@/sd";

import { NumRow } from "../common/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const G = [4, 7, 2, 8, 5, 9];
const N = G.length;
const T = 2;
const SIZE = 44;
const X0 = -(N * SIZE) / 2;
const G_Y = 30;
const F_Y = -50;

const gRow = new NumRow({
  targetNode: svg,
  values: G,
  size: SIZE,
  x: X0,
  y: G_Y,
  label: "G(j)",
});

const fRow = new NumRow({
  targetNode: svg,
  values: Array(N).fill(""),
  size: SIZE,
  x: X0,
  y: F_Y,
  label: "f(i)",
});

const winBox = new sd.Rect({
  targetNode: svg,
  x: X0 - 4,
  y: G_Y - 4,
  width: SIZE + 8,
  height: SIZE + 8,
  fill: "none",
  stroke: C.darkOrange,
  strokeWidth: 2,
  opacity: 0,
});

function computeBest(
  left: number,
  right: number,
): { val: number; idx: number } {
  let best = G[left - 1];
  let bestIdx = left;
  for (let j = left + 1; j <= right; j++) {
    if (G[j - 1] > best) {
      best = G[j - 1];
      bestIdx = j;
    }
  }
  return { val: best, idx: bestIdx };
}

sd.main(async () => {
  gRow.fadeIn({ delay: 0 });
  fRow.fadeIn({ delay: 280 });
  await sd.pause();

  for (let i = 1; i <= N; i++) {
    const winLeft = Math.max(1, i - T);
    const winRight = i;
    const winWidth = (winRight - winLeft + 1) * SIZE + 8;
    const winX = X0 + (winLeft - 1) * SIZE - 4;

    winBox
      .startAnimate({ duration: 260, easing: E.easeOut })
      .setX(winX)
      .setWidth(winWidth)
      .setOpacity(1)
      .endAnimate();

    const { val, idx } = computeBest(winLeft, winRight);
    gRow.paintCell(idx, "#fdecd9", C.darkOrange, { delay: 220, duration: 220 });
    fRow.setValue(i, val, { delay: 380 });
    fRow.paintCell(i, "#dbeefd", C.steelBlue, { delay: 380, duration: 220 });

    await sd.pause();
    gRow.clearCell(idx, { duration: 180 });
  }
});
