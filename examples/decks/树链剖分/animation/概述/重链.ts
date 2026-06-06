import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: 0, cy: 140 },
  { id: 2, cx: -100, cy: 60 },
  { id: 3, cx: 100, cy: 60 },
  { id: 4, cx: -180, cy: -20 },
  { id: 5, cx: -40, cy: -20 },
  { id: 6, cx: 80, cy: -20 },
  { id: 7, cx: 180, cy: -20 },
  { id: 8, cx: -220, cy: -100 },
  { id: 9, cx: -140, cy: -100 },
  { id: 10, cx: -40, cy: -100 },
  { id: 11, cx: 80, cy: -100 },
];

const parent: Record<number, number> = {
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 3,
  7: 3,
  8: 4,
  9: 4,
  10: 5,
  11: 6,
};

const tree = new TreeView({
  targetNode: svg,
  nodes,
  parent,
  root: 1,
  radius: 18,
});

// Heavy chain: each node's heavy child = the child with max subtree size.
// Heavy edges (manually chosen): 1-2, 2-4, 4-8 (one heavy path from root).
const heavyEdges: Array<[number, number]> = [
  [1, 2],
  [2, 4],
  [4, 8],
];

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();
  for (let i = 0; i < heavyEdges.length; i++) {
    const [_, child] = heavyEdges[i];
    tree.paintEdge(child, C.darkOrange, { delay: i * 220, duration: 240 });
    tree.paint(child, "#fdecd9", C.darkOrange, { delay: i * 220 });
  }
  tree.paint(1, "#fdecd9", C.darkOrange);
  await sd.pause();
});
