import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 6;
const SIZE = 36;
const X0 = -(N * SIZE) / 2;
const Y0 = -(N * SIZE) / 2;

for (let i = 0; i <= N; i++) {
  new sd.Line({
    targetNode: svg, x1: X0, y1: Y0 + i * SIZE,
    x2: X0 + N * SIZE, y2: Y0 + i * SIZE,
    stroke: C.silver, strokeWidth: 0.8,
  });
  new sd.Line({
    targetNode: svg, x1: X0 + i * SIZE, y1: Y0,
    x2: X0 + i * SIZE, y2: Y0 + N * SIZE,
    stroke: C.silver, strokeWidth: 0.8,
  });
}

// Diagonal (the touching line) at y=x; offset reflection line at y=x+1.
new sd.Line({
  targetNode: svg, x1: X0, y1: Y0,
  x2: X0 + N * SIZE, y2: Y0 + N * SIZE,
  stroke: "#d32f2f" as sd.SDColor, strokeWidth: 2,
});
new sd.Line({
  targetNode: svg, x1: X0 - SIZE, y1: Y0,
  x2: X0 + (N - 1) * SIZE, y2: Y0 + N * SIZE,
  stroke: C.steelBlue, strokeWidth: 1.4,
  strokeDashArray: [4, 3],
});

// Forbidden path that crosses the diagonal, then reflected.
const badPath: Array<[number, number]> = [
  [0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [3, 4], [4, 4], [4, 5], [5, 5], [5, 6], [6, 6],
];
const reflectedPath = badPath.map(([x, y]) => [y - 1, x + 1] as [number, number]);

const d1 = badPath.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${X0 + x * SIZE} ${Y0 + y * SIZE}`).join(" ");
const d2 = reflectedPath.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${X0 + x * SIZE} ${Y0 + y * SIZE}`).join(" ");

const badLine = new sd.Path({
  targetNode: svg, d: d1, stroke: "#d32f2f" as sd.SDColor, strokeWidth: 2, fill: "none", opacity: 0,
});
const reflLine = new sd.Path({
  targetNode: svg, d: d2, stroke: C.steelBlue, strokeWidth: 2, fill: "none", opacity: 0,
});

sd.main(async () => {
  badLine.startAnimate({ delay: 200, duration: 480, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
  reflLine.startAnimate({ duration: 480, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
});
