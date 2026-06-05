import * as sd from "@/sd";

import { Axis, bracePath } from "../lib/axis";

const svg = sd.svg();
const C = sd.color();

const TICKS = 10;
const GAP = 40;
const X0 = -(TICKS * GAP) / 2;

const axis = new Axis({
  targetNode: svg, ticks: TICKS, gap: GAP,
  x: X0, y: 0, label: "x",
});

for (let i = 1; i <= TICKS; i++) {
  new sd.Math({
    targetNode: svg,
    text: String(i ** 3),
    cx: axis.tickX(i), cy: axis.y - 14,
    fontSize: 11, fill: C.darkButtonGrey,
  });
}

new sd.Text({
  targetNode: svg, text: "x^3",
  cx: X0 - 24, cy: -14,
  fontSize: 13, fill: C.darkButtonGrey,
});

const n = 60;
const k = Math.floor(Math.cbrt(n));
const aBrace = bracePath({
  targetNode: svg,
  fromX: axis.tickX(0), toX: axis.tickX(k),
  y: 20,
  color: C.darkOrange,
  label: "x^3 \\le n",
});
const bBrace = bracePath({
  targetNode: svg,
  fromX: axis.tickX(k + 1), toX: axis.tickX(TICKS),
  y: 20,
  color: C.darkGreen,
  label: "x^3 > n",
});

new sd.Math({
  targetNode: svg, text: `n = ${n}`,
  cx: 0, cy: -50,
  fontSize: 14, fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  axis.fadeIn({ delay: 0 });
  aBrace.show({ delay: 500 });
  bBrace.show({ delay: 600 });
  await sd.pause();
});
