import * as sd from "@/sd";

import { Dag } from "../common/dag";

const svg = sd.svg();

const n = 6;
const COL_X = 140;
const ROW_GAP = 40;
const TOP_Y = ((n - 1) * ROW_GAP) / 2;

const T = (i: number) => i;
const F = (i: number) => i + n;

type Node = { id: number; cx: number; cy: number; label: string };
const nodes: Node[] = [];
for (let i = 1; i <= n; i++) {
  const y = TOP_Y - (i - 1) * ROW_GAP;
  nodes.push({ id: T(i), cx: -COL_X, cy: y, label: `T_${i}` });
  nodes.push({ id: F(i), cx: COL_X, cy: y, label: `F_${i}` });
}
const edges: Array<[number, number]> = [];
for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= n; j++) {
    if (i === j) continue;
    edges.push([T(i), F(j)]);
  }
}

const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 16,
  mathLabel: true,
  fontSize: 12,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0, stagger: 10 });
  await sd.pause();
});
