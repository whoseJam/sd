import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Undirected weighted graph.
const nodes = [
  { id: 1, cx: -180, cy: 80 },
  { id: 2, cx: -60, cy: 120 },
  { id: 3, cx: 80, cy: 80 },
  { id: 4, cx: -120, cy: 0 },
  { id: 5, cx: 0, cy: 0 },
  { id: 6, cx: 140, cy: -20 },
  { id: 7, cx: -40, cy: -100 },
  { id: 8, cx: 100, cy: -100 },
];

const edges: Array<{ u: number; v: number; w: number }> = [
  { u: 1, v: 2, w: 4 }, { u: 1, v: 4, w: 3 },
  { u: 2, v: 3, w: 2 }, { u: 2, v: 5, w: 7 },
  { u: 3, v: 5, w: 5 }, { u: 3, v: 6, w: 6 },
  { u: 4, v: 5, w: 8 }, { u: 4, v: 7, w: 9 },
  { u: 5, v: 7, w: 1 }, { u: 5, v: 6, w: 4 },
  { u: 6, v: 8, w: 3 },
  { u: 7, v: 8, w: 5 },
];

const nodeMap = new Map(nodes.map((n) => [n.id, n]));
const R = 18;

// Draw nodes.
for (const n of nodes) {
  new sd.Circle({
    targetNode: svg, cx: n.cx, cy: n.cy, r: R,
    fill: C.white, stroke: C.darkButtonGrey, strokeWidth: 1.4,
  });
  new sd.Text({
    targetNode: svg, text: String(n.id),
    cx: n.cx, cy: n.cy, fontSize: 13, fill: C.darkButtonGrey,
  });
}

// Draw edges with weight labels.
const edgeLines: sd.Line[] = [];
for (const e of edges) {
  const a = nodeMap.get(e.u)!;
  const b = nodeMap.get(e.v)!;
  edgeLines.push(new sd.Line({
    targetNode: svg, x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy,
    stroke: C.silver, strokeWidth: 1.2,
  }));
  new sd.Text({
    targetNode: svg, text: String(e.w),
    cx: (a.cx + b.cx) / 2 + 6, cy: (a.cy + b.cy) / 2 - 6,
    fontSize: 11, fill: C.darkButtonGrey,
  });
}

// Kruskal: sort, then add edges not forming cycles.
function find(parent: Record<number, number>, x: number): number {
  while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
  return x;
}

const sorted = [...edges].map((e, i) => ({ ...e, idx: i })).sort((a, b) => a.w - b.w);
const parentMap: Record<number, number> = {};
for (const n of nodes) parentMap[n.id] = n.id;
const chosen: number[] = [];
for (const e of sorted) {
  const ru = find(parentMap, e.u);
  const rv = find(parentMap, e.v);
  if (ru !== rv) {
    parentMap[ru] = rv;
    chosen.push(e.idx);
  }
}

sd.main(async () => {
  await sd.pause();
  for (let k = 0; k < chosen.length; k++) {
    const line = edgeLines[chosen[k]];
    line.startAnimate({ delay: k * 220, duration: 240, easing: E.easeOut })
      .setStroke(C.darkGreen).setStrokeWidth(2.4).endAnimate();
    await sd.pause();
  }
});
