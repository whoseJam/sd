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
  "2-5": 4,
};

const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 20,
});

for (const [u, v] of edges) {
  const a = nodes.find((n) => n.id === u)!;
  const b = nodes.find((n) => n.id === v)!;
  const mx = (a.cx + b.cx) / 2;
  const my = (a.cy + b.cy) / 2;
  new sd.Text({
    targetNode: svg,
    text: String(weights[`${u}-${v}`]),
    cx: mx,
    cy: my + 10,
    fontSize: 12,
    fill: C.darkButtonGrey,
  });
}

const NEG_INF = "−∞";
const dis: Record<number, number | null> = {};
for (const n of nodes) dis[n.id] = null;
dis[1] = 0;

const order = [1, 2, 3, 4, 5];

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  for (const id of order) {
    dag.setTag(
      id,
      `dis=${dis[id] === null ? NEG_INF : String(dis[id])}`,
      id === 1 ? C.steelBlue : C.darkButtonGrey,
      { delay: 320 + id * 60 },
    );
  }
  await sd.pause();

  for (const u of order) {
    if (dis[u] === null) {
      dag.paint(u, "#f5f5f5", C.darkButtonGrey);
      await sd.pause();
      dag.fadeNode(u, 0.45);
      continue;
    }
    dag.paint(u, "#fff3e0", C.darkOrange);
    for (const [a, b] of edges) {
      if (a !== u) continue;
      const cand = dis[u]! + weights[`${u}-${b}`];
      const changed = dis[b] === null || cand > dis[b]!;
      dag.paintEdge(u, b, changed ? C.darkOrange : C.darkButtonGrey);
      if (changed) {
        dis[b] = cand;
        dag.setTag(b, `dis=${dis[b]}`, C.darkOrange);
      }
    }
    await sd.pause();
    dag.fadeNode(u, 0.45);
    for (const [a, b] of edges) {
      if (a === u) dag.fadeEdge(u, b, 0.35);
    }
  }
});
