import * as sd from "@/sd";

import { arrow } from "../lib/arrow";

// Left column: objects o_1..o_n. Right column: hashes h_1..h_n. The
// f function maps objects to hashes; comparing objects via their
// hashes is cheap because numbers are easy to compare.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const n = 6;
const R = 18;
const GAP_X = 220;
const GAP_Y = 50;

interface Node {
  cx: number;
  cy: number;
  circle: sd.Circle;
}

function makeColumn(side: "left" | "right", prefix: string): Node[] {
  const x = side === "left" ? -GAP_X / 2 : GAP_X / 2;
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const cy = -((n - 1) / 2) * GAP_Y + i * GAP_Y;
    const circle = new sd.Circle({
      targetNode: svg,
      cx: x,
      cy,
      r: R,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.4,
      opacity: 0,
    });
    new sd.Math({
      targetNode: svg,
      text: `${prefix}_${i + 1}`,
      cx: x,
      cy,
      fontSize: 14,
      fill: C.darkButtonGrey,
    });
    out.push({ cx: x, cy, circle });
  }
  return out;
}

const left = makeColumn("left", "o");
const right = makeColumn("right", "h");

const arrows: sd.Group[] = [];
for (let i = 0; i < n; i++) {
  arrows.push(
    arrow(svg, {
      from: { x: left[i].cx + R, y: left[i].cy },
      to: { x: right[i].cx - R, y: right[i].cy },
      stroke: C.silver,
      opacity: 0,
    }),
  );
}
new sd.Math({
  targetNode: svg,
  text: "f",
  cx: 0,
  cy: -((n - 1) / 2) * GAP_Y - 20,
  fontSize: 16,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  for (let i = 0; i < n; i++) {
    left[i].circle
      .startAnimate({ delay: i * 80, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
  for (let i = 0; i < n; i++) {
    arrows[i]
      .startAnimate({ delay: i * 80, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    right[i].circle
      .startAnimate({ delay: 100 + i * 80, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});
