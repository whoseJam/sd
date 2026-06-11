import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();

const n = 6;
const COLS = [-280, -90, 90, 280];
const ROW_GAP = 50;
const TOP_Y = ((n - 1) * ROW_GAP) / 2;

const T = (i: number) => i;
const P = (i: number) => i + n;
const S = (i: number) => i + 2 * n;
const F = (i: number) => i + 3 * n;

type Node = { id: number; cx: number; cy: number; label: string };
const nodes: Node[] = [];
for (let i = 1; i <= n; i++) {
  const cy = TOP_Y - (i - 1) * ROW_GAP;
  nodes.push({ id: T(i), cx: COLS[0], cy, label: `T_${i}` });
  nodes.push({ id: P(i), cx: COLS[1], cy, label: `P_${i}` });
  nodes.push({ id: S(i), cx: COLS[2], cy, label: `S_${i}` });
  nodes.push({ id: F(i), cx: COLS[3], cy, label: `F_${i}` });
}

const edges: Array<[number, number]> = [];
for (let i = 1; i <= n; i++) {
  if (i > 1) edges.push([P(i), P(i - 1)]);
  if (i < n) edges.push([S(i), S(i + 1)]);
}
for (let i = 1; i <= n; i++) {
  edges.push([P(i), F(i)]);
  edges.push([S(i), F(i)]);
}

const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 17,
  mathLabel: true,
  fontSize: 13,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0, stagger: 6 });
  await sd.pause();
});
