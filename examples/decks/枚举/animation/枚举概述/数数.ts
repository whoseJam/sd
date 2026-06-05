import * as sd from "@/sd";

import { FocusFrame } from "../focus-frame";

// Row of n colored balls; the focus frame appears on the first beat so
// the viewer can read "all balls = sample space" without ambiguity.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Hand-picked palette so the picture reads as random without us shipping
// a PRNG seed. Keep a few red balls visible so "count the red" has work.
const COLORS = [
  C.green,
  C.red,
  C.blue,
  C.red,
  C.green,
  C.blue,
  C.red,
  C.green,
  C.blue,
  C.red,
];
const RADIUS = 22;
const GAP = 14;
const FRAME_PAD = 12;
// sd-element auto-fits viewBox, so we just place everything in the
// positive quadrant from (0, 0) — no centering math.
const TOTAL_W = COLORS.length * (RADIUS * 2) + (COLORS.length - 1) * GAP;
const ROW_CY = RADIUS + FRAME_PAD;

for (let i = 0; i < COLORS.length; i++) {
  new sd.Circle({
    targetNode: svg,
    cx: FRAME_PAD + RADIUS + i * (RADIUS * 2 + GAP),
    cy: ROW_CY,
    r: RADIUS,
    fill: COLORS[i],
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
  });
}

const frame = new FocusFrame({
  targetNode: svg,
  x: 0,
  y: 0,
  width: TOTAL_W + FRAME_PAD * 2,
  height: RADIUS * 2 + FRAME_PAD * 2,
  label: "样本空间",
});

sd.main(async () => {
  frame.group
    .startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
