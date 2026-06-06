import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 10;
const L = 3;
const R = 6;
const SIZE = 40;
const X0 = -(N * SIZE) / 2;

const arr = new NumRow({
  targetNode: svg,
  values: new Array(N).fill(" "),
  size: SIZE,
  x: X0,
  y: 0,
});

const lTri = new sd.Path({
  targetNode: svg,
  d: `M ${arr.cellCx(L)} ${arr.top() + 6} L ${arr.cellCx(L) - 5} ${arr.top() + 14} L ${arr.cellCx(L) + 5} ${arr.top() + 14} Z`,
  fill: C.darkButtonGrey,
  stroke: C.darkButtonGrey,
  opacity: 0,
});
const lLabel = new sd.Text({
  targetNode: svg,
  text: "l",
  cx: arr.cellCx(L),
  cy: arr.top() + 24,
  fontSize: 13,
  fill: C.darkButtonGrey,
  opacity: 0,
});

function brace(
  from: number,
  to: number,
  color: sd.SDColor,
  label: string,
  delay: number,
) {
  const y = arr.bottom() - 12;
  const p = new sd.Path({
    targetNode: svg,
    d: `M ${arr.cellLeft(from)} ${y} L ${arr.cellLeft(from)} ${y - 10} L ${arr.cellRight(to)} ${y - 10} L ${arr.cellRight(to)} ${y}`,
    stroke: color,
    strokeWidth: 1.8,
    fill: "none",
    opacity: 0,
  });
  const m = new sd.Text({
    targetNode: svg,
    text: label,
    cx: (arr.cellLeft(from) + arr.cellRight(to)) / 2,
    cy: y - 22,
    fontSize: 13,
    fill: color,
    opacity: 0,
  });
  p.startAnimate({ delay, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  m.startAnimate({ delay: delay + 80, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  arr.fadeIn({ delay: 0 });
  lTri
    .startAnimate({ delay: 200, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  lLabel
    .startAnimate({ delay: 240, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  brace(L, R, C.darkGreen, "unique", 0);
  await sd.pause();
  brace(R + 1, N, C.darkButtonGrey, "not unique", 0);
  await sd.pause();
});
