import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const W = 360;
const H = 200;
const X0 = -W / 2;
const Y0 = -H / 2;

// Axes
new sd.Line({
  targetNode: svg, x1: X0, y1: Y0, x2: X0 + W, y2: Y0,
  stroke: C.darkButtonGrey, strokeWidth: 1.2,
});
new sd.Line({
  targetNode: svg, x1: X0, y1: Y0, x2: X0, y2: Y0 + H,
  stroke: C.darkButtonGrey, strokeWidth: 1.2,
});
new sd.Text({
  targetNode: svg, text: "x",
  cx: X0 + W + 12, cy: Y0, fontSize: 13, fill: C.darkButtonGrey,
});
new sd.Text({
  targetNode: svg, text: "y",
  cx: X0 - 12, cy: Y0 + H + 12, fontSize: 13, fill: C.darkButtonGrey,
});

// Random points.
const pts = [
  [40, 30], [80, 70], [120, 50], [180, 110], [220, 80], [260, 150],
  [50, 130], [150, 30], [200, 50], [280, 100],
];
for (const [px, py] of pts) {
  new sd.Circle({
    targetNode: svg, cx: X0 + px, cy: Y0 + py, r: 4,
    fill: C.darkButtonGrey, stroke: C.darkButtonGrey,
  });
}

// Query: point Q's lower-left count.
const Q: [number, number] = [220, 110];
new sd.Circle({
  targetNode: svg, cx: X0 + Q[0], cy: Y0 + Q[1], r: 6,
  fill: C.darkOrange, stroke: C.darkOrange,
});

// Shaded lower-left.
new sd.Rect({
  targetNode: svg,
  x: X0, y: Y0, width: Q[0], height: Q[1],
  fill: "#fdecd9", stroke: C.darkOrange, strokeWidth: 1.2,
  opacity: 0.6,
});

sd.main(async () => {
  await sd.pause();
});
