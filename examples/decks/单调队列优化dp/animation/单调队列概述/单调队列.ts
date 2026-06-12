import * as sd from "@/sd";

import { NumRow } from "../common/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const data = [3, 1, 4, 1, 5, 9, 2];
const N = data.length;
const K = 3;
const SIZE = 44;
const X0 = -(N * SIZE) / 2;

const arr = new NumRow({
  targetNode: svg,
  values: data,
  size: SIZE,
  x: X0,
  y: 30,
  label: "A",
});

const DEQUE_Y = -50;
const dqCells: sd.Rect[] = [];
const dqGlyphs: sd.Text[] = [];
for (let i = 0; i < N; i++) {
  const cellX = X0 + i * SIZE;
  dqCells.push(
    new sd.Rect({
      targetNode: svg,
      x: cellX,
      y: DEQUE_Y,
      width: SIZE,
      height: SIZE,
      fill: C.white,
      stroke: C.silver,
      strokeWidth: 1,
      opacity: 0,
    }),
  );
  dqGlyphs.push(
    new sd.Text({
      targetNode: svg,
      text: "",
      cx: cellX + SIZE / 2,
      cy: DEQUE_Y + SIZE / 2,
      fontSize: 18,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

const dqLabel = new sd.Text({
  targetNode: svg,
  text: "deque",
  cx: X0 - 28,
  cy: DEQUE_Y + SIZE / 2,
  fontSize: 14,
  fill: C.darkButtonGrey,
  opacity: 0,
});

function fade(el: sd.SDNode, delay: number, dur = 260) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  arr.fadeIn({ delay: 0 });
  fade(dqLabel, 320);
  await sd.pause();

  const deque: number[] = [];
  for (let i = 0; i < N; i++) {
    arr.paintCell(i + 1, "#dbeefd", C.steelBlue, { duration: 180 });

    while (deque.length > 0 && deque[0] <= i - K) deque.shift();
    while (deque.length > 0 && data[deque[deque.length - 1]] <= data[i])
      deque.pop();
    deque.push(i);

    for (let pos = 0; pos < N; pos++) {
      if (pos < deque.length) {
        const v = data[deque[pos]];
        const isMax = pos === 0;
        dqCells[pos]
          .startAnimate({ delay: 160, duration: 200, easing: E.easeOut })
          .setFill(isMax ? "#fdecd9" : C.white)
          .setStroke(isMax ? C.darkOrange : C.silver)
          .setOpacity(1)
          .endAnimate();
        dqGlyphs[pos]
          .startAnimate({ delay: 200, duration: 200, easing: E.easeOut })
          .setText(String(v))
          .setFill(isMax ? C.darkOrange : C.darkButtonGrey)
          .setOpacity(1)
          .endAnimate();
      } else {
        dqCells[pos]
          .startAnimate({ delay: 160, duration: 200, easing: E.easeOut })
          .setOpacity(0)
          .endAnimate();
        dqGlyphs[pos]
          .startAnimate({ delay: 160, duration: 200, easing: E.easeOut })
          .setOpacity(0)
          .endAnimate();
      }
    }
    await sd.pause();
    arr.clearCell(i + 1, { duration: 160 });
  }
});
