import * as sd from "@/sd";

// Sample graph with planets numbered 0..6 and a handful of edges.

const svg = sd.svg();
const C = sd.color();

const R = 18;
const positions: Array<[number, number]> = [
  [-150, 60],
  [-50, 110],
  [50, 60],
  [-100, -40],
  [60, -30],
  [150, 80],
  [120, -90],
];

const nodes: Array<{ cx: number; cy: number }> = positions.map(([x, y]) => ({
  cx: x,
  cy: y,
}));

for (let i = 0; i < nodes.length; i++) {
  new sd.Circle({
    targetNode: svg,
    cx: nodes[i].cx,
    cy: nodes[i].cy,
    r: R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: String(i),
    cx: nodes[i].cx,
    cy: nodes[i].cy,
    fontSize: 14,
    fill: C.darkButtonGrey,
  });
}

const edges: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 2],
  [2, 5],
  [4, 6],
  [5, 6],
];

for (const [u, v] of edges) {
  const a = nodes[u];
  const b = nodes[v];
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const dist = Math.hypot(dx, dy) || 1;
  new sd.Line({
    targetNode: svg,
    x1: a.cx + (dx / dist) * R,
    y1: a.cy + (dy / dist) * R,
    x2: b.cx - (dx / dist) * R,
    y2: b.cy - (dy / dist) * R,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
  });
}

sd.main(async () => {
  await sd.pause();
});
