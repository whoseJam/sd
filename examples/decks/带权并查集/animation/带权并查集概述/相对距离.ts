import * as sd from "@/sd";

// A number line with x = 0 and y = 5 marked, plus the dis(x → y) = 5
// label — the canonical relative-position figure for weighted DSU.

const svg = sd.svg();
const C = sd.color();

const X0 = -180;
const X1 = 180;
const TICK_STEP = (X1 - X0) / 14; // ticks at -3..11

new sd.Line({
  targetNode: svg,
  x1: X0 - 16,
  y1: 0,
  x2: X1 + 16,
  y2: 0,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});

for (let v = -3; v <= 11; v++) {
  const x = X0 + (v + 3) * TICK_STEP;
  new sd.Line({
    targetNode: svg,
    x1: x,
    y1: -4,
    x2: x,
    y2: 4,
    stroke: C.darkButtonGrey,
    strokeWidth: 1,
  });
  if (v % 2 === 0) {
    new sd.Text({
      targetNode: svg,
      text: String(v),
      cx: x,
      cy: -12,
      fontSize: 11,
      fill: C.silver,
    });
  }
}

const xPos = X0 + (0 + 3) * TICK_STEP;
const yPos = X0 + (5 + 3) * TICK_STEP;

new sd.Circle({
  targetNode: svg,
  cx: xPos,
  cy: 0,
  r: 8,
  fill: C.steelBlue,
  stroke: C.none,
});
new sd.Text({
  targetNode: svg,
  text: "x",
  cx: xPos,
  cy: 20,
  fontSize: 14,
  fill: C.steelBlue,
});
new sd.Circle({
  targetNode: svg,
  cx: yPos,
  cy: 0,
  r: 8,
  fill: C.darkOrange,
  stroke: C.none,
});
new sd.Text({
  targetNode: svg,
  text: "y",
  cx: yPos,
  cy: 20,
  fontSize: 14,
  fill: C.darkOrange,
});

new sd.Math({
  targetNode: svg,
  text: "\\text{dis}(x \\to y) = 5",
  cx: (xPos + yPos) / 2,
  cy: 36,
  fontSize: 14,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  await sd.pause();
});
