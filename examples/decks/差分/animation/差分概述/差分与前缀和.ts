import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const aData = [1, 3, 2, 3, 2];
const dData = aData.map((v, i) => (i === 0 ? v : v - aData[i - 1]));

const SIZE = 44;
const X0 = -(aData.length * SIZE) / 2;

const a = new NumRow({
  targetNode: svg,
  values: aData,
  size: SIZE,
  x: X0,
  y: 30,
  label: "a",
});

const d = new NumRow({
  targetNode: svg,
  values: dData,
  size: SIZE,
  x: X0,
  y: -30 - SIZE,
  label: "d",
});

const topArrow = new sd.Math({
  targetNode: svg,
  text: "D",
  cx: X0 + aData.length * SIZE + 60,
  cy: 30 + SIZE / 2,
  fontSize: 18,
  fill: C.darkOrange,
  opacity: 0,
});
const botArrow = new sd.Math({
  targetNode: svg,
  text: "S",
  cx: X0 + aData.length * SIZE + 60,
  cy: -30 - SIZE / 2,
  fontSize: 18,
  fill: C.steelBlue,
  opacity: 0,
});

const arrowDown = new sd.Path({
  targetNode: svg,
  d: `M ${X0 + aData.length * SIZE + 40} ${30 + SIZE / 2 - 6} L ${X0 + aData.length * SIZE + 40} ${-30 - SIZE / 2 + 6}`,
  stroke: C.darkOrange,
  strokeWidth: 1.8,
  fill: "none",
  opacity: 0,
});
const arrowUp = new sd.Path({
  targetNode: svg,
  d: `M ${X0 + aData.length * SIZE + 80} ${-30 - SIZE / 2 + 6} L ${X0 + aData.length * SIZE + 80} ${30 + SIZE / 2 - 6}`,
  stroke: C.steelBlue,
  strokeWidth: 1.8,
  fill: "none",
  opacity: 0,
});

sd.main(async () => {
  a.fadeIn({ delay: 0 });
  await sd.pause();

  d.fadeIn({ delay: 0 });
  arrowDown.startAnimate({ delay: 100, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  topArrow.startAnimate({ delay: 180, duration: 220, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();

  arrowUp.startAnimate({ duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  botArrow.startAnimate({ delay: 80, duration: 220, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
});
