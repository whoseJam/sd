import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Same graph as Kruskal anim, run Prim from node 1.
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

const R = 18;
const circles = new Map<number, sd.Circle>();
for (const n of nodes) {
  circles.set(n.id, new sd.Circle({
    targetNode: svg, cx: n.cx, cy: n.cy, r: R,
    fill: C.white, stroke: C.darkButtonGrey, strokeWidth: 1.4,
  }));
  new sd.Text({
    targetNode: svg, text: String(n.id),
    cx: n.cx, cy: n.cy, fontSize: 13, fill: C.darkButtonGrey,
  });
}

const edgeLines = new Map<string, sd.Line>();
for (const e of edges) {
  const a = nodes.find((n) => n.id === e.u)!;
  const b = nodes.find((n) => n.id === e.v)!;
  edgeLines.set(`${e.u}-${e.v}`, new sd.Line({
    targetNode: svg, x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy,
    stroke: C.silver, strokeWidth: 1.2,
  }));
  new sd.Text({
    targetNode: svg, text: String(e.w),
    cx: (a.cx + b.cx) / 2 + 6, cy: (a.cy + b.cy) / 2 - 6,
    fontSize: 11, fill: C.darkButtonGrey,
  });
}

function keyOf(u: number, v: number) {
  return edgeLines.has(`${u}-${v}`) ? `${u}-${v}` : `${v}-${u}`;
}

// Prim from 1.
const inTree = new Set<number>([1]);
const adj: Record<number, Array<{ to: number; w: number; key: string }>> = {};
for (const n of nodes) adj[n.id] = [];
for (const e of edges) {
  adj[e.u].push({ to: e.v, w: e.w, key: `${e.u}-${e.v}` });
  adj[e.v].push({ to: e.u, w: e.w, key: `${e.u}-${e.v}` });
}
const picks: Array<{ key: string; to: number }> = [];
while (inTree.size < nodes.length) {
  let bestW = Infinity;
  let bestKey = "";
  let bestTo = -1;
  for (const u of inTree) {
    for (const { to, w, key } of adj[u]) {
      if (!inTree.has(to) && w < bestW) { bestW = w; bestKey = key; bestTo = to; }
    }
  }
  if (bestTo === -1) break;
  inTree.add(bestTo);
  picks.push({ key: bestKey, to: bestTo });
}

sd.main(async () => {
  await sd.pause();
  circles.get(1)!.startAnimate({ duration: 200 }).setFill("#e8f5e9").setStroke(C.darkGreen).endAnimate();
  for (let k = 0; k < picks.length; k++) {
    const { key, to } = picks[k];
    edgeLines.get(keyOf(...key.split("-").map(Number) as [number, number]))!
      .startAnimate({ delay: k * 220, duration: 240, easing: E.easeOut })
      .setStroke(C.darkGreen).setStrokeWidth(2.4).endAnimate();
    circles.get(to)!
      .startAnimate({ delay: k * 220 + 100, duration: 200 })
      .setFill("#e8f5e9").setStroke(C.darkGreen).endAnimate();
    await sd.pause();
  }
});
