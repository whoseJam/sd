import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -200, cy: 0, label: "1" },
  { id: 2, cx: -80, cy: 60, label: "2" },
  { id: 3, cx: -80, cy: -60, label: "3" },
  { id: 4, cx: 60, cy: 0, label: "4" },
  { id: 5, cx: 200, cy: 0, label: "5" },
];

const edges: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [4, 5],
  [2, 5],
];

const weights: Record<string, number> = {
  "1-2": 3,
  "1-3": 5,
  "2-4": 4,
  "3-4": 1,
  "4-5": 2,
  "2-5": 9,
};

const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 20,
});

// Add edge weight labels.
for (const [u, v] of edges) {
  const a = nodes.find((n) => n.id === u)!;
  const b = nodes.find((n) => n.id === v)!;
  const mx = (a.cx + b.cx) / 2;
  const my = (a.cy + b.cy) / 2;
  new sd.Text({
    targetNode: svg,
    text: String(weights[`${u}-${v}`]),
    cx: mx,
    cy: my,
    fontSize: 12,
    fill: C.darkButtonGrey,
  });
}

// Longest path 1 → ...
const dist: Record<number, number> = { 1: 0 };
const order = [1, 2, 3, 4, 5];
for (const u of order) {
  for (const [a, b] of edges) {
    if (a === u && dist[u] !== undefined) {
      const cand = dist[u] + weights[`${u}-${b}`];
      if (dist[b] === undefined || cand > dist[b]) dist[b] = cand;
    }
  }
}

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  for (const u of order) {
    dag.setTag(u, `dis=${dist[u] ?? "?"}`, C.darkGreen, {
      delay: 300 + u * 120,
    });
  }
  await sd.pause();
});
