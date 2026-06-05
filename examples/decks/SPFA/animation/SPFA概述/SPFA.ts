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
  [1, 2], [1, 3], [2, 4], [3, 5], [2, 5], [4, 6], [5, 6],
];

const weights: Record<string, number> = {
  "1-2": 4, "1-3": 2, "2-4": -1, "3-5": 3, "2-5": 5, "4-6": 2, "5-6": 1,
};

const dag = new Dag({ targetNode: svg, nodes, edges, radius: 18 });

for (const [u, v] of edges) {
  const a = nodes.find((n) => n.id === u)!;
  const b = nodes.find((n) => n.id === v)!;
  new sd.Text({
    targetNode: svg, text: String(weights[`${u}-${v}`]),
    cx: (a.cx + b.cx) / 2 + 8, cy: (a.cy + b.cy) / 2 - 8,
    fontSize: 12, fill: weights[`${u}-${v}`] < 0 ? C.darkOrange : C.darkButtonGrey,
  });
}

// Run SPFA from 1.
const dist: Record<number, number> = {};
for (const n of nodes) dist[n.id] = Infinity;
dist[1] = 0;
const inq = new Set<number>([1]);
const q: number[] = [1];
const trace: Array<{ pop: number; dis: number }> = [];

while (q.length > 0) {
  const u = q.shift()!;
  inq.delete(u);
  trace.push({ pop: u, dis: dist[u] });
  for (const [a, b] of edges) {
    if (a === u) {
      const cand = dist[u] + weights[`${u}-${b}`];
      if (cand < dist[b]) {
        dist[b] = cand;
        if (!inq.has(b)) { q.push(b); inq.add(b); }
      }
    }
  }
}

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  const seenColor: Record<number, sd.SDColor> = {};
  for (const { pop } of trace) {
    seenColor[pop] = C.darkGreen;
  }
  for (const { pop } of trace) {
    dag.paint(pop, "#e8f5e9", seenColor[pop]);
    dag.setTag(pop, `dis=${dist[pop]}`, C.darkGreen);
    await sd.pause();
  }
});
