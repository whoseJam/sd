import * as sd from "@/sd";

// Side view of the cheese: rectangle, top + bottom slabs, a few
// circular holes overlapping into a path from bottom to top.

const svg = sd.svg();
const C = sd.color();

const W = 320;
const H = 220;

new sd.Rect({
  targetNode: svg,
  x: -W / 2,
  y: -H / 2,
  width: W,
  height: H,
  fill: "#fdf3c8",
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});

const holes: Array<[number, number, number]> = [
  [-60, -70, 36],
  [10, -10, 38],
  [40, 60, 32],
  [-80, 70, 30],
];

for (const [cx, cy, r] of holes) {
  new sd.Circle({
    targetNode: svg,
    cx,
    cy,
    r,
    fill: "#fff8e0",
    stroke: C.darkOrange,
    strokeWidth: 1.4,
  });
}

new sd.Text({
  targetNode: svg,
  text: "底",
  cx: -W / 2 - 18,
  cy: -H / 2 + 8,
  fontSize: 14,
  fill: C.darkButtonGrey,
});
new sd.Text({
  targetNode: svg,
  text: "顶",
  cx: -W / 2 - 18,
  cy: H / 2 - 8,
  fontSize: 14,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  await sd.pause();
});
