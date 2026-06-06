import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 12;
const B = 3; // block size
const SIZE = 40;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg,
  values: new Array(N).fill(" "),
  size: SIZE,
  x: X0,
  y: 0,
});

// Block dividers
sd.main(async () => {
  row.fadeIn({ delay: 0 });
  for (let b = 0; b * B < N; b++) {
    new sd.Rect({
      targetNode: svg,
      x: X0 + b * B * SIZE - 2,
      y: -SIZE / 2 - 6,
      width: B * SIZE + 4,
      height: SIZE + 12,
      fill: "none",
      stroke: b % 2 === 0 ? C.steelBlue : C.darkOrange,
      strokeWidth: 1.8,
      opacity: 0,
    })
      .startAnimate({ delay: 300 + b * 120, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    new sd.Text({
      targetNode: svg,
      text: `block ${b + 1}`,
      cx: X0 + (b * B + B / 2) * SIZE,
      cy: -SIZE / 2 - 18,
      fontSize: 12,
      fill: b % 2 === 0 ? C.steelBlue : C.darkOrange,
      opacity: 0,
    })
      .startAnimate({ delay: 380 + b * 120, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});
