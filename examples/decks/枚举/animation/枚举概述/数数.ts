import * as sd from "@/sd";

import { FocusFrame } from "../focus-frame";

// Row of balls. The "red ones" (= darkOrange, our conclusion color) are
// the target of the count; everything else is neutral so the eye lands
// on the targets without scanning multiple palettes.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const TARGET = C.darkOrange;
const OTHER = C.silver;

const IS_TARGET = [
  false,
  true,
  false,
  true,
  false,
  false,
  true,
  false,
  true,
  false,
];
const RADIUS = 22;
const GAP = 14;
const FRAME_PAD = 12;
const TOTAL_W = IS_TARGET.length * (RADIUS * 2) + (IS_TARGET.length - 1) * GAP;
const ROW_CY = RADIUS + FRAME_PAD;

for (let i = 0; i < IS_TARGET.length; i++) {
  new sd.Circle({
    targetNode: svg,
    cx: FRAME_PAD + RADIUS + i * (RADIUS * 2 + GAP),
    cy: ROW_CY,
    r: RADIUS,
    fill: IS_TARGET[i] ? TARGET : OTHER,
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
