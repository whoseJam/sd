import * as sd from "@/sd";

import { CharRow } from "../char-row";
import { makeBrace } from "./brace";

// Complete periodic string: A = BBBBB with |B| = 4. The KMP fail array
// gives len[20] = 16, so n - len[n] = 4 = period length. The two braces
// (prefix [1..len] below, matching suffix [period+1..n] above) shift past
// each other by exactly the period. Alternating bands fade in last so
// the period count reads at a glance.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 20;
const LEN = 16;
const PERIOD = N - LEN;

const SIZE = 28;
const TOTAL_W = N * SIZE;
const X0 = -TOTAL_W / 2;
const ARR_Y = 0;
const BRACE_GAP = 10;

const bands: sd.Rect[] = [];
for (let p = 0; p < N / PERIOD; p += 2) {
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
  text: " ".repeat(N),
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
