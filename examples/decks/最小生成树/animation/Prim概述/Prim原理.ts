import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// Show "growing tree" with one node in tree, others outside.
const nodes = [
  { id: 1, cx: 0, cy: 60, inTree: true },
  { id: 2, cx: -100, cy: 0, inTree: false },
  { id: 3, cx: 100, cy: 0, inTree: false },
  { id: 4, cx: -50, cy: -80, inTree: false },
  { id: 5, cx: 50, cy: -80, inTree: false },
];

for (const n of nodes) {
  new sd.Circle({
    targetNode: svg,
    cx: n.cx,
    cy: n.cy,
    r: 18,
    fill: n.inTree ? "#e8f5e9" : C.white,
    stroke: n.inTree ? C.darkGreen : C.darkButtonGrey,
    strokeWidth: n.inTree ? 2.2 : 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: String(n.id),
    cx: n.cx,
    cy: n.cy,
    fontSize: 14,
    fill: C.darkButtonGrey,
  });
}

// Connections from tree (node 1) to each outside node with weights.
const cands = [
  { v: 2, w: 5 },
  { v: 3, w: 3 },
  { v: 4, w: 4 },
  { v: 5, w: 6 },
];

for (const c of cands) {
  const target = nodes.find((n) => n.id === c.v)!;
  new sd.Line({
    targetNode: svg,
    x1: 0,
    y1: 60,
    x2: target.cx,
    y2: target.cy,
    stroke: C.silver,
    strokeWidth: 1,
    strokeDashArray: [4, 3],
  });
  new sd.Text({
    targetNode: svg,
    text: String(c.w),
    cx: target.cx / 2 + 8,
    cy: (60 + target.cy) / 2 - 6,
    fontSize: 11,
    fill: C.darkButtonGrey,
  });
}

new sd.Text({
  targetNode: svg,
  text: "MST",
  cx: 0,
  cy: 90,
  fontSize: 13,
  fill: C.darkGreen,
});

sd.main(async () => {
  await sd.pause();
});
