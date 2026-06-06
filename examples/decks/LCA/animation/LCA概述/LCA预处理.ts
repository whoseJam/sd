import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

// Single column chain to illustrate fa[u][i] = fa[u]'s 2^i ancestor.
const N = 9;
const nodes = [];
const parent: Record<number, number> = {};
for (let i = 1; i <= N; i++) {
  nodes.push({ id: i, cx: 0, cy: 180 - (i - 1) * 36 });
  if (i > 1) parent[i] = i - 1;
}

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1 });

const U = N;
const jumps: Array<{
  j: number;
  from: number;
  to: number;
  color: sd.SDColor;
  tone: string;
}> = [
  { j: 0, from: 9, to: 8, color: C.darkOrange, tone: "#fdecd9" },
  { j: 1, from: 9, to: 7, color: C.steelBlue, tone: "#dbeefd" },
  { j: 2, from: 9, to: 5, color: C.darkGreen, tone: "#e8f5e9" },
  { j: 3, from: 9, to: 1, color: "#7c4dff" as sd.SDColor, tone: "#ead4fb" },
];

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  tree.paint(U, "#dbeefd", C.steelBlue, { delay: 200 });
  tree.setTag(U, "u", C.steelBlue, { delay: 200 });
  await sd.pause();

  for (const { j, to, color, tone } of jumps) {
    tree.paint(to, tone as sd.SDColor, color);
    tree.setTag(to, `fa_{u, ${j}}`, color);
    await sd.pause();
  }
});
