import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

// Chain of 10 nodes — pathological for the naive lift-by-one LCA.
const N = 10;
const nodes = [];
const parent: Record<number, number> = {};
for (let i = 1; i <= N; i++) {
  nodes.push({ id: i, cx: 0, cy: 180 - (i - 1) * 40 });
  if (i > 1) parent[i] = i - 1;
}

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1 });

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();

  tree.paint(N, "#dbeefd", C.steelBlue);
  tree.setTag(N, "x", C.steelBlue);
  tree.paint(N - 1, "#fdecd9", C.darkOrange);
  tree.setTag(N - 1, "y", C.darkOrange);
  await sd.pause();

  // x climbs all the way up — chain forces O(n).
  for (let cur = N - 1; cur > 1; cur--) {
    tree.paint(cur, "#dbeefd", C.steelBlue, { delay: (N - 1 - cur) * 120, duration: 200 });
  }
  await sd.pause();
});
