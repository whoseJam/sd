import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const W = 220;
const H = 160;

new sd.Rect({
  targetNode: svg,
  x: -W / 2,
  y: -H / 2,
  width: W,
  height: H,
  fill: "none",
  stroke: C.darkButtonGrey,
  strokeWidth: 1.2,
});

new sd.Math({
  targetNode: svg,
  text: "T(e, f)",
  cx: 0,
  cy: -H / 2 - 26,
  fontSize: 16,
  fill: C.darkButtonGrey,
});
new sd.Math({
  targetNode: svg,
  text: "e",
  cx: W / 2 + 14,
  cy: 0,
  fontSize: 14,
  fill: C.darkButtonGrey,
});
new sd.Math({
  targetNode: svg,
  text: "f",
  cx: 0,
  cy: H / 2 + 18,
  fontSize: 14,
  fill: C.darkButtonGrey,
});

// Outer ternary on e: pick two vertical lines.
const eMinX = -W / 4;
const eMaxX = W / 4;
new sd.Line({
  targetNode: svg,
  x1: eMinX,
  y1: -H / 2,
  x2: eMinX,
  y2: H / 2,
  stroke: C.darkOrange,
  strokeWidth: 1.4,
  opacity: 0,
})
  .startAnimate({ delay: 200, duration: 320, easing: E.easeOut })
  .setOpacity(0.7)
  .endAnimate();
new sd.Line({
  targetNode: svg,
  x1: eMaxX,
  y1: -H / 2,
  x2: eMaxX,
  y2: H / 2,
  stroke: C.darkOrange,
  strokeWidth: 1.4,
  opacity: 0,
})
  .startAnimate({ delay: 300, duration: 320, easing: E.easeOut })
  .setOpacity(0.7)
  .endAnimate();

// Inner ternary along each vertical line.
for (const x of [eMinX, eMaxX]) {
  new sd.Circle({
    targetNode: svg,
    cx: x,
    cy: -20,
    r: 3,
    fill: C.steelBlue,
    stroke: C.steelBlue,
    opacity: 0,
  })
    .startAnimate({ delay: 500, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  new sd.Circle({
    targetNode: svg,
    cx: x,
    cy: 20,
    r: 3,
    fill: C.steelBlue,
    stroke: C.steelBlue,
    opacity: 0,
  })
    .startAnimate({ delay: 600, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  await sd.pause();
});
