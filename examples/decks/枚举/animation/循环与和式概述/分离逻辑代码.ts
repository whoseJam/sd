import * as sd from "@/sd";

import { arrow } from "../arrow";

// One ∑ → two equivalent implementations with different big-O. Beat 1
// fades in the arrows, beat 2 hangs a complexity label on each.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const FONT = 22;
const CODE_FONT = 14;
const ROW_GAP = 90;

const sumNode = new sd.Math({
  targetNode: svg,
  text: "\\sum_{1 \\le i \\le n} i\\, [i \\text{ is prime}]",
  cx: 0,
  cy: 0,
  fontSize: FONT,
  fill: C.darkButtonGrey,
});

// sd.Text is single-line — render each block as one descriptive line
// rather than a multi-line code listing.
const sieveNode = new sd.Text({
  targetNode: svg,
  text: "线性筛预处理质数表",
  cx: -180,
  cy: -ROW_GAP,
  fontSize: CODE_FONT,
  fill: C.darkButtonGrey,
});
const naiveNode = new sd.Text({
  targetNode: svg,
  text: "逐个 isPrime(i) 判定",
  cx: 180,
  cy: -ROW_GAP,
  fontSize: CODE_FONT,
  fill: C.darkButtonGrey,
});

const arr1 = arrow(svg, {
  from: { x: -40, y: -10 },
  to: { x: -180, y: -ROW_GAP + 20 },
  opacity: 0,
});
const arr2 = arrow(svg, {
  from: { x: 40, y: -10 },
  to: { x: 180, y: -ROW_GAP + 20 },
  opacity: 0,
});

const cost1 = new sd.Math({
  targetNode: svg,
  text: "O(n)",
  cx: -130,
  cy: -ROW_GAP / 2,
  fontSize: FONT * 0.7,
  fill: C.darkButtonGrey,
  opacity: 0,
});
const cost2 = new sd.Math({
  targetNode: svg,
  text: "O(n\\sqrt{n})",
  cx: 130,
  cy: -ROW_GAP / 2,
  fontSize: FONT * 0.7,
  fill: C.darkButtonGrey,
  opacity: 0,
});

void sumNode;
void sieveNode;
void naiveNode;

sd.main(async () => {
  await sd.pause();
  arr1.startAnimate({ duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  arr2.startAnimate({ delay: 120, duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
  cost1.startAnimate({ duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  cost2.startAnimate({ delay: 120, duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
});
