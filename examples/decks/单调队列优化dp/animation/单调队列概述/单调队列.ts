import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Sliding-window maximum.
const data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
const N = data.length;
const K = 4;
const SIZE = 40;
const X0 = -(N * SIZE) / 2;

const arr = new NumRow({
  targetNode: svg, values: data, size: SIZE,
  x: X0, y: -50, label: "A",
});

const dqY = 50;
const dqCells: sd.Rect[] = [];
const dqGlyphs: sd.Text[] = [];
for (let i = 0; i < N; i++) {
  const cellX = X0 + i * SIZE;
  dqCells.push(new sd.Rect({
    targetNode: svg, x: cellX, y: dqY, width: SIZE, height: SIZE,
    fill: C.white, stroke: C.silver, strokeWidth: 1, opacity: 0,
  }));
  dqGlyphs.push(new sd.Text({
    targetNode: svg, text: "",
    cx: cellX + SIZE / 2, cy: dqY + SIZE / 2,
    fontSize: 16, fill: C.darkButtonGrey, opacity: 0,
  }));
}
new sd.Text({
  targetNode: svg, text: "deque",
  cx: X0 - 30, cy: dqY + SIZE / 2,
  fontSize: 13, fill: C.darkButtonGrey,
});

sd.main(async () => {
  arr.fadeIn({ delay: 0 });
  await sd.pause();

  // Deque of indices; back = stack-like push; front = pop when out of window.
  const deque: number[] = [];
  for (let i = 0; i < N; i++) {
    arr.paintCell(i + 1, "#dbeefd", C.steelBlue, { duration: 180 });

    // Pop from front if out of window.
    while (deque.length > 0 && deque[0] <= i - K) {
      deque.shift();
      // Shift remaining cells visually: re-render the deque from scratch.
    }

    // Pop from back while smaller than current.
    let popped = 0;
    while (deque.length > 0 && data[deque[deque.length - 1]] <= data[i]) {
      deque.pop();
      popped++;
    }

    deque.push(i);

    // Re-render deque from position 0.
    for (let pos = 0; pos < N; pos++) {
      if (pos < deque.length) {
        const v = data[deque[pos]];
        const delay = popped > 0 ? 220 : 120;
        dqCells[pos].startAnimate({ delay, duration: 200, easing: E.easeOut })
          .setFill("#fdecd9").setStroke(C.darkOrange).setOpacity(1).endAnimate();
        dqGlyphs[pos].startAnimate({ delay: delay + 40, duration: 200, easing: E.easeOut })
          .setText(String(v)).setOpacity(1).endAnimate();
      } else {
        dqCells[pos].startAnimate({ duration: 200, easing: E.easeOut }).setOpacity(0).endAnimate();
        dqGlyphs[pos].startAnimate({ duration: 200, easing: E.easeOut }).setOpacity(0).endAnimate();
      }
    }
    await sd.pause();
    arr.clearCell(i + 1, { duration: 160 });
  }
});
