import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// Simple bivariate plot: 2D heat-style grid (no actual heatmap; just label).
const W = 220;
const H = 160;

// Frame
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

// Concentric ellipses suggest the unique minimum.
for (let k = 1; k <= 3; k++) {
  new sd.Ellipse({
    targetNode: svg,
    cx: 20,
    cy: -10,
    rx: 20 * k,
    ry: 14 * k,
    fill: "none",
    stroke: C.darkOrange,
    strokeWidth: 1,
    opacity: 0.5,
  });
}
new sd.Circle({
  targetNode: svg,
  cx: 20,
  cy: -10,
  r: 4,
  fill: C.darkOrange,
  stroke: C.darkOrange,
});

sd.main(async () => {
  await sd.pause();
});
