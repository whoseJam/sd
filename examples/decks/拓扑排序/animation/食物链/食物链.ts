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

const indegree: Record<number, number> = {};
const outdegree: Record<number, number> = {};
for (const n of nodes) {
  indegree[n.id] = 0;
  outdegree[n.id] = 0;
}
for (const [u, v] of edges) {
  indegree[v]++;
  outdegree[u]++;
}

const f: Record<number, number> = {};
for (const n of nodes) f[n.id] = indegree[n.id] === 0 ? 1 : 0;

const order = [1, 2, 3, 4, 5, 6];

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  for (const id of order) {
    if (indegree[id] === 0) {
      dag.setTag(id, `f=1`, C.steelBlue, { delay: 320 + id * 60 });
    }
  }
  await sd.pause();

  for (const u of order) {
    dag.paint(u, "#fff3e0", C.darkOrange);
    for (const [a, b] of edges) {
      if (a !== u) continue;
      dag.paintEdge(u, b, C.darkOrange);
      f[b] += f[u];
      dag.setTag(b, `f=${f[b]}`, C.darkOrange);
    }
    await sd.pause();
    dag.fadeNode(u, 0.45);
    for (const [a, b] of edges) {
      if (a === u) dag.fadeEdge(u, b, 0.35);
    }
  }

  for (const id of order) {
    if (outdegree[id] === 0) dag.paint(id, "#e8f5e9", C.darkGreen);
  }
  await sd.pause();
});
