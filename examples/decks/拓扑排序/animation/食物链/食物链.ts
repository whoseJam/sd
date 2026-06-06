import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -180, cy: 80, label: "1" },
  { id: 2, cx: -180, cy: -40, label: "2" },
  { id: 3, cx: -40, cy: 80, label: "3" },
  { id: 4, cx: -40, cy: -40, label: "4" },
  { id: 5, cx: 100, cy: 30, label: "5" },
  { id: 6, cx: 220, cy: 30, label: "6" },
];

const edges: Array<[number, number]> = [
  [1, 3],
  [1, 4],
  [2, 4],
  [3, 5],
  [4, 5],
  [3, 6],
  [5, 6],
];

const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 22,
});

// f(u) = sum of f(v) over predecessors v; initialize sources to 1.
const f: Record<number, number> = {};
const indegree: Record<number, number> = {};
for (const n of nodes) indegree[n.id] = 0;
for (const [_u, v] of edges) indegree[v]++;
const order = [1, 2, 3, 4, 5, 6];
for (const u of order) {
  if (indegree[u] === 0) f[u] = 1;
  else f[u] = 0;
}
for (const u of order) {
  for (const [a, b] of edges) {
    if (a === u) f[b] = (f[b] ?? 0) + (f[u] ?? 0);
  }
}

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  for (const id of order) {
    dag.setTag(
      id,
      `f=${f[id]}`,
      indegree[id] === 0 ? C.steelBlue : C.darkOrange,
      { delay: 300 + id * 80 },
    );
  }
  await sd.pause();
});
