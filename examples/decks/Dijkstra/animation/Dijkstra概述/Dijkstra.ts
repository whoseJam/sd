import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -200, cy: 0 },
  { id: 2, cx: -80, cy: 80 },
  { id: 3, cx: -80, cy: -80 },
  { id: 4, cx: 60, cy: 80 },
  { id: 5, cx: 60, cy: -80 },
  { id: 6, cx: 200, cy: 0 },
];

const edges: Array<[number, number]> = [
  [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 6], [2, 5],
];

const weights: Record<string, number> = {
  "1-2": 4, "1-3": 2, "2-4": 3, "3-5": 6, "4-6": 2, "5-6": 3, "2-5": 1,
};

const dag = new Dag({ targetNode: svg, nodes, edges, radius: 18 });

for (const [u, v] of edges) {
  const a = nodes.find((n) => n.id === u)!;
  const b = nodes.find((n) => n.id === v)!;
  new sd.Text({
    targetNode: svg, text: String(weights[`${u}-${v}`]),
    cx: (a.cx + b.cx) / 2 + 8, cy: (a.cy + b.cy) / 2 - 8,
    fontSize: 12, fill: C.darkButtonGrey,
  });
}

// Standard Dijkstra.
const dist: Record<number, number> = {};
const visited = new Set<number>();
for (const n of nodes) dist[n.id] = Infinity;
dist[1] = 0;
const order: Array<{ id: number; dis: number }> = [];
while (true) {
  let u: number | undefined;
  let best = Infinity;
  for (const n of nodes) {
    if (!visited.has(n.id) && dist[n.id] < best) { best = dist[n.id]; u = n.id; }
  }
  if (u === undefined) break;
  visited.add(u);
  order.push({ id: u, dis: best });
  for (const [a, b] of edges) {
    if (a === u && !visited.has(b)) {
      const cand = best + weights[`${u}-${b}`];
      if (cand < dist[b]) dist[b] = cand;
    }
  }
}

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  for (const { id, dis } of order) {
    dag.paint(id, "#e8f5e9", C.darkGreen);
    dag.setTag(id, `dis=${dis}`, C.darkGreen);
    await sd.pause();
  }
});
