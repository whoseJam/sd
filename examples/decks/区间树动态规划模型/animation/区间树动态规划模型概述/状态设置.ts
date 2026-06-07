import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const TREE = C.steelBlue;
const ACCENT = C.darkOrange;

const W = 280;
const H = 110;
const BAR_H = 6;
const CX = 0;
const CY = 0;

const body = new sd.Rect({
  targetNode: svg,
  x: CX - W / 2,
  y: CY - H / 2,
  width: W,
  height: H - BAR_H,
  fill: "none",
  stroke: NEUTRAL,
  strokeWidth: 1,
  strokeDashArray: [4, 3],
  opacity: 0,
});

const bar = new sd.Rect({
  targetNode: svg,
  x: CX - W / 2,
  y: CY + H / 2 - BAR_H,
  width: W,
  height: BAR_H,
  fill: TREE,
  stroke: "none",
  opacity: 0,
});

const lLabel = new sd.Math({
  targetNode: svg,
  text: "l",
  cx: CX - W / 2 - 12,
  cy: CY + H / 2 - BAR_H / 2,
  fontSize: 16,
  fill: NEUTRAL,
  opacity: 0,
});

const rLabel = new sd.Math({
  targetNode: svg,
  text: "r",
  cx: CX + W / 2 + 12,
  cy: CY + H / 2 - BAR_H / 2,
  fontSize: 16,
  fill: NEUTRAL,
  opacity: 0,
});

const q = new sd.Text({
  targetNode: svg,
  text: "?",
  cx: CX,
  cy: CY - BAR_H / 2,
  fontSize: 36,
  fill: ACCENT,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  fadeIn(body, 0);
  fadeIn(bar, 80);
  fadeIn(lLabel, 200);
  fadeIn(rLabel, 200);
  await sd.pause();
  fadeIn(q, 0);
  await sd.pause();
});
