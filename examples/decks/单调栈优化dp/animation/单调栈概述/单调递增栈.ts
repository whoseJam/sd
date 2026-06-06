import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const data = [2, 4, 1, 3, 6, 5];
const N = data.length;
const SIZE = 44;
const X0 = -(N * SIZE) / 2;

const arr = new NumRow({
  targetNode: svg,
  values: data,
  size: SIZE,
  x: X0,
  y: -50,
  label: "A",
});

// Stack row mirrors A row; cells become visible as values are pushed.
const stackY = 50;
const stackCells: sd.Rect[] = [];
const stackGlyphs: sd.Text[] = [];
for (let i = 0; i < N; i++) {
  const cellX = X0 + i * SIZE;
  stackCells.push(
    new sd.Rect({
      targetNode: svg,
      x: cellX,
      y: stackY,
      width: SIZE,
      height: SIZE,
      fill: C.white,
      stroke: C.silver,
      strokeWidth: 1,
      opacity: 0,
    }),
  );
  stackGlyphs.push(
    new sd.Text({
      targetNode: svg,
      text: "",
      cx: cellX + SIZE / 2,
      cy: stackY + SIZE / 2,
      fontSize: 16,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}
new sd.Text({
  targetNode: svg,
  text: "stack",
  cx: X0 - 26,
  cy: stackY + SIZE / 2,
  fontSize: 13,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  arr.fadeIn({ delay: 0 });
  await sd.pause();

  // Monotone increasing stack stores indices.
  const stack: number[] = [];
  for (let i = 0; i < N; i++) {
    arr.paintCell(i + 1, "#dbeefd", C.steelBlue, { duration: 180 });
    let popped = 0;
    while (stack.length > 0 && data[stack[stack.length - 1]] >= data[i]) {
      stack.pop();
      const pos = stack.length;
      stackCells[pos]
        .startAnimate({ duration: 200, easing: E.easeOut })
        .setOpacity(0)
        .endAnimate();
      stackGlyphs[pos]
        .startAnimate({ duration: 200, easing: E.easeOut })
        .setOpacity(0)
        .endAnimate();
      popped++;
    }
    const pushDelay = popped > 0 ? 220 : 120;
    const pos = stack.length;
    stackCells[pos]
      .startAnimate({ delay: pushDelay, duration: 200, easing: E.easeOut })
      .setFill("#fdecd9")
      .setStroke(C.darkOrange)
      .setOpacity(1)
      .endAnimate();
    stackGlyphs[pos]
      .startAnimate({ delay: pushDelay + 40, duration: 200, easing: E.easeOut })
      .setText(String(data[i]))
      .setOpacity(1)
      .endAnimate();
    stack.push(i);
    await sd.pause();
    arr.clearCell(i + 1, { duration: 160 });
  }
  await sd.pause();
});
