import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Concave (^-shaped) curve: y = -(x - 5)^2 + 10
const W = 480;
const H = 200;
const X_MIN = 0;
const X_MAX = 10;
function f(x: number) {
  return -((x - 5) ** 2) + 10;
}
function px(x: number) {
  return -W / 2 + ((x - X_MIN) / (X_MAX - X_MIN)) * W;
}
function py(y: number) {
  return -H / 2 + (y / 10) * H;
}

// Axes
new sd.Line({
  targetNode: svg, x1: -W / 2 - 10, y1: -H / 2, x2: W / 2 + 10, y2: -H / 2,
  stroke: C.darkButtonGrey, strokeWidth: 1.2,
});
new sd.Line({
  targetNode: svg, x1: -W / 2, y1: -H / 2 - 10, x2: -W / 2, y2: H / 2 + 10,
  stroke: C.darkButtonGrey, strokeWidth: 1.2,
});

// Curve
{
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= 100; i++) {
    const x = X_MIN + (i / 100) * (X_MAX - X_MIN);
    pts.push([px(x), py(f(x))]);
  }
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  new sd.Path({
    targetNode: svg, d,
    stroke: C.darkButtonGrey, strokeWidth: 1.6, fill: "none",
  });
}

const peakX = 5;
const peakMark = new sd.Circle({
  targetNode: svg, cx: px(peakX), cy: py(f(peakX)), r: 5,
  fill: C.darkOrange, stroke: C.darkOrange,
  opacity: 0,
});

sd.main(async () => {
  await sd.pause();

  // Ternary search with a few iterations.
  let l = 0;
  let r = 10;
  for (let iter = 0; iter < 5; iter++) {
    const ml = l + (r - l) / 3;
    const mr = r - (r - l) / 3;
    new sd.Line({
      targetNode: svg, x1: px(ml), y1: -H / 2, x2: px(ml), y2: py(f(ml)),
      stroke: C.steelBlue, strokeWidth: 1, opacity: 0,
    }).startAnimate({ delay: iter * 280, duration: 240, easing: E.easeOut }).setOpacity(0.6).endAnimate();
    new sd.Line({
      targetNode: svg, x1: px(mr), y1: -H / 2, x2: px(mr), y2: py(f(mr)),
      stroke: C.darkOrange, strokeWidth: 1, opacity: 0,
    }).startAnimate({ delay: iter * 280 + 60, duration: 240, easing: E.easeOut }).setOpacity(0.6).endAnimate();
    if (f(mr) > f(ml)) l = ml; else r = mr;
  }
  peakMark.startAnimate({ delay: 1600, duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
});
