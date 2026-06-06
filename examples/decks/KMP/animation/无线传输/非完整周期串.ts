import * as sd from "@/sd";

import { CharRow } from "../char-row";
import { makeBrace } from "./brace";

// Incomplete periodic string: the period (n − len[n]) only divides
// part of A; the trailing prefix is shorter than one full period.
// "cabcabcabcabca" — len[14] = 11, period = 3, complete periods cover
// cells 1..12, cells 13..14 are an incomplete tail. The animation
// reuses the same two-brace + period-band reading; the tail is left
// unmarked on purpose so the asymmetry is visible.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const aStr = "cabcabcabcabca";
const N = aStr.length;
const LEN = 11;
const PERIOD = N - LEN;
const FULL_PERIODS = Math.floor(N / PERIOD);

const SIZE = 30;
const TOTAL_W = N * SIZE;
const X0 = -TOTAL_W / 2;
const ARR_Y = 0;
const BRACE_GAP = 10;

// Bands only over full periods; trailing partial period (cells 13..14)
// is left uncoloured to make the "incomplete" part visually obvious.
const bands: sd.Rect[] = [];
for (let p = 0; p < FULL_PERIODS; p += 2) {
  bands.push(
    new sd.Rect({
      targetNode: svg,
      x: X0 + p * PERIOD * SIZE,
      y: ARR_Y,
      width: PERIOD * SIZE,
      height: SIZE,
      fill: C.silver,
      fillOpacity: 0.32,
      stroke: C.none,
      opacity: 0,
    }),
  );
}

const arr = new CharRow({
  targetNode: svg,
  text: aStr,
  size: SIZE,
  x: X0,
  y: ARR_Y,
  label: "A",
  cellFill: C.none,
});

const bottomBrace = makeBrace(svg, {
  xL: X0,
  xR: X0 + LEN * SIZE,
  y: ARR_Y - BRACE_GAP,
  rowSide: "above",
  label: `prefix · len = ${LEN}`,
});
const topBrace = makeBrace(svg, {
  xL: X0 + PERIOD * SIZE,
  xR: X0 + N * SIZE,
  y: ARR_Y + SIZE + BRACE_GAP,
  rowSide: "below",
  label: `suffix · len = ${LEN}`,
});

const formula = new sd.Text({
  targetNode: svg,
  text: `T = n − len = ${PERIOD}`,
  cx: 0,
  cy: ARR_Y + SIZE + BRACE_GAP + 50,
  fontSize: 18,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  arr.fadeIn({ delay: 0 });
  bottomBrace
    .startAnimate({ delay: 380, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  topBrace
    .startAnimate({ delay: 540, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  for (let i = 0; i < bands.length; i++) {
    bands[i]
      .startAnimate({ delay: i * 120, duration: 360, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  formula
    .startAnimate({
      delay: bands.length * 120 + 180,
      duration: 320,
      easing: E.easeOut,
    })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
