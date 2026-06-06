import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 6;
const SIZE = 36;
const X0 = -(N * SIZE) / 2;
const Y0 = -(N * SIZE) / 2;

// Grid
for (let i = 0; i <= N; i++) {
  new sd.Line({
    targetNode: svg,
    x1: X0,
    y1: Y0 + i * SIZE,
    x2: X0 + N * SIZE,
    y2: Y0 + i * SIZE,
    stroke: C.silver,
    strokeWidth: 0.8,
  });
  new sd.Line({
    targetNode: svg,
    x1: X0 + i * SIZE,
    y1: Y0,
    x2: X0 + i * SIZE,
    y2: Y0 + N * SIZE,
    stroke: C.silver,
    strokeWidth: 0.8,
  });
}

// Diagonal (forbidden line above): y = x.
new sd.Line({
  targetNode: svg,
  x1: X0,
  y1: Y0,
  x2: X0 + N * SIZE,
  y2: Y0 + N * SIZE,
  stroke: "#d32f2f" as sd.SDColor,
  strokeWidth: 2,
});

// Start and end markers.
new sd.Circle({
  targetNode: svg,
  cx: X0,
  cy: Y0,
  r: 5,
  fill: C.steelBlue,
  stroke: C.steelBlue,
});
new sd.Text({
  targetNode: svg,
  text: "start",
  cx: X0 - 24,
  cy: Y0 - 12,
  fontSize: 12,
  fill: C.steelBlue,
});
new sd.Circle({
  targetNode: svg,
  cx: X0 + N * SIZE,
  cy: Y0 + N * SIZE,
  r: 5,
  fill: C.darkGreen,
  stroke: C.darkGreen,
});
new sd.Text({
  targetNode: svg,
  text: "end",
  cx: X0 + N * SIZE + 22,
  cy: Y0 + N * SIZE + 12,
  fontSize: 12,
  fill: C.darkGreen,
});

// Sample path: never above diagonal.
const path: Array<[number, number]> = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
  [3, 1],
  [3, 2],
  [4, 2],
  [4, 3],
  [5, 3],
  [5, 4],
  [6, 4],
  [6, 5],
  [6, 6],
];

const d = path
  .map(
    ([x, y], i) => `${i === 0 ? "M" : "L"} ${X0 + x * SIZE} ${Y0 + y * SIZE}`,
  )
  .join(" ");
const pathLine = new sd.Path({
  targetNode: svg,
  d,
  stroke: C.darkOrange,
  strokeWidth: 2,
  fill: "none",
  opacity: 0,
});

sd.main(async () => {
  pathLine
    .startAnimate({ delay: 200, duration: 800, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
