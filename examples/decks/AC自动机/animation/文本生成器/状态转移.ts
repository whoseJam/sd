import * as sd from "@/sd";

import { arrow } from "../../../枚举/animation/arrow";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const R = 18;
const u = new sd.Circle({
  targetNode: svg,
  cx: -60,
  cy: 0,
  r: R,
  fill: C.white,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});
new sd.Text({ targetNode: svg, text: "u", cx: -60, cy: 0, fontSize: 16, fill: C.darkButtonGrey });
const v = new sd.Circle({
  targetNode: svg,
  cx: 60,
  cy: 0,
  r: R,
  fill: C.white,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});
new sd.Text({ targetNode: svg, text: "v", cx: 60, cy: 0, fontSize: 16, fill: C.darkButtonGrey });
arrow(svg, {
  from: { x: -60 + R, y: 0 },
  to: { x: 60 - R, y: 0 },
});
new sd.Math({
  targetNode: svg,
  text: "\\text{isEnd}(v)?",
  cx: 60,
  cy: -28,
  fontSize: 14,
  fill: C.darkButtonGrey,
});

const iLabel = new sd.Text({
  targetNode: svg,
  text: "i",
  cx: -60,
  cy: 32,
  fontSize: 14,
  fill: C.steelBlue,
  opacity: 0,
});
const i1Label = new sd.Text({
  targetNode: svg,
  text: "i + 1",
  cx: 60,
  cy: 32,
  fontSize: 14,
  fill: C.steelBlue,
  opacity: 0,
});

void u;
void v;

sd.main(async () => {
  await sd.pause();
  iLabel.startAnimate({ duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
  i1Label.startAnimate({ duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
});
