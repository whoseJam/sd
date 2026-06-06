import * as sd from "@/sd";

// Abstract sketch: a root node with three subtrees represented by
// triangles, each carrying a label. Three case-distinction visual for
// the auto-complete recursion.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const ROOT_R = 18;
const SUB_W = 90;
const SUB_H = 110;
const GAP = 30;

new sd.Circle({
  targetNode: svg,
  cx: 0,
  cy: 0,
  r: ROOT_R,
  fill: C.white,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.6,
});
new sd.Text({
  targetNode: svg,
  text: "u",
  cx: 0,
  cy: 0,
  fontSize: 16,
  fill: C.darkButtonGrey,
});

const positions = [-1, 0, 1];
for (let i = 0; i < positions.length; i++) {
  const offsetX = positions[i] * (SUB_W + GAP);
  const topY = -ROOT_R - 6;
  const bottomY = topY - SUB_H;
  // Triangle apex at u's edge, base below.
  new sd.Polygon({
    targetNode: svg,
    points: [
      [offsetX, topY],
      [offsetX - SUB_W / 2, bottomY],
      [offsetX + SUB_W / 2, bottomY],
    ],
    fill: "#f6f4ec",
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
  });
  new sd.Line({
    targetNode: svg,
    x1: 0,
    y1: -ROOT_R,
    x2: offsetX,
    y2: topY,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
  });
  new sd.Text({
    targetNode: svg,
    text: ["case 1", "case 2", "case 3"][i],
    cx: offsetX,
    cy: bottomY + SUB_H / 2,
    fontSize: 14,
    fill: C.darkButtonGrey,
  });
}

sd.main(async () => {
  await sd.pause();
  void E;
});
