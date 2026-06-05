import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

// Show: jumping 2^i = jumping 2^(i-1) twice.
// Use a chain of 9 nodes and illustrate i = 3 → two 2^2 jumps stacked.
const N = 9;
const nodes = [];
const parent: Record<number, number> = {};
for (let i = 1; i <= N; i++) {
  nodes.push({ id: i, cx: 0, cy: 180 - (i - 1) * 36 });
  if (i > 1) parent[i] = i - 1;
}

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1 });

const U = N;
const MID = 5;
const TOP = 1;

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  tree.paint(U, "#dbeefd", C.steelBlue, { delay: 200 });
  tree.setTag(U, "u", C.steelBlue, { delay: 200 });
  await sd.pause();

  tree.paint(MID, "#fdecd9", C.darkOrange);
  tree.setTag(MID, "fa_{u, i-1}", C.darkOrange);
  await sd.pause();

  tree.paint(TOP, "#e8f5e9", C.darkGreen);
  tree.setTag(TOP, "fa_{u, i}", C.darkGreen);
  await sd.pause();
});
