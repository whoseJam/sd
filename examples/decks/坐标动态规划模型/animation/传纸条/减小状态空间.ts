import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const FULL_COLOR = "#888888";
const VALID_COLOR = C.darkOrange;

const FULL_W = 260;
const FULL_H = 130;
const VALID_W = 130;
const VALID_H = 60;

const fullBg = new sd.Rect({
  targetNode: svg,
  x: -FULL_W / 2,
  y: -FULL_H / 2,
  width: FULL_W,
  height: FULL_H,
  fill: "none",
  stroke: NEUTRAL,
  strokeWidth: 1.2,
  strokeDashArray: [4, 3],
  opacity: 0,
});

const fullLabel = new sd.Math({
  targetNode: svg,
  text: "f(x_1,y_1,x_2,y_2) : m \\cdot n \\cdot m \\cdot n",
  cx: 0,
  cy: FULL_H / 2 + 18,
  fontSize: 14,
  fill: FULL_COLOR,
  opacity: 0,
});

const validBg = new sd.Rect({
  targetNode: svg,
  x: -VALID_W / 2,
  y: -VALID_H / 2,
  width: VALID_W,
  height: VALID_H,
  fill: VALID_COLOR,
  stroke: "none",
  opacity: 0,
});

const validLabel = new sd.Math({
  targetNode: svg,
  text: "f(k,x_1,x_2) : (m+n) \\cdot n \\cdot n",
  cx: 0,
  cy: -FULL_H / 2 - 20,
  fontSize: 14,
  fill: VALID_COLOR,
  opacity: 0,
});

const insideTag = new sd.Text({
  targetNode: svg,
  text: "有效状态",
  cx: 0,
  cy: 0,
  fontSize: 13,
  fill: "#ffffff",
  opacity: 0,
});

const outsideTag = new sd.Text({
  targetNode: svg,
  text: "不合法",
  cx: FULL_W / 2 - 40,
  cy: -FULL_H / 2 + 14,
  fontSize: 12,
  fill: FULL_COLOR,
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
  fadeIn(fullBg, 0);
  fadeIn(fullLabel, 120);
  fadeIn(outsideTag, 200);
  await sd.pause();

  fadeIn(validBg, 0);
  fadeIn(insideTag, 120);
  fadeIn(validLabel, 200);
  await sd.pause();
});
