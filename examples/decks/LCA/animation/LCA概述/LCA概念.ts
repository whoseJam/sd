import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: 0, cy: 150 },
  { id: 2, cx: -130, cy: 75 },
  { id: 3, cx: 130, cy: 75 },
  { id: 4, cx: -200, cy: 0 },
  { id: 5, cx: -60, cy: 0 },
  { id: 6, cx: 60, cy: 0 },
  { id: 7, cx: 200, cy: 0 },
  { id: 8, cx: -240, cy: -75 },
  { id: 9, cx: -160, cy: -75 },
  { id: 10, cx: -60, cy: -75 },
  { id: 11, cx: 60, cy: -75 },
  { id: 12, cx: 160, cy: -75 },
  { id: 13, cx: 240, cy: -75 },
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
  12: 7,
  13: 7,
};

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1 });

const X = 8;
const Y = 11;

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();

  tree.paint(X, "#dbeefd", C.steelBlue);
  tree.setTag(X, "x", C.steelBlue);
  tree.paint(Y, "#dbeefd", C.steelBlue);
  tree.setTag(Y, "y", C.steelBlue);
  await sd.pause();

  // Common ancestors of x=8 and y=11: 1 (only, since LCA(8,11) = 1).
  const lca = tree.lca(X, Y);
  for (const id of tree.pathToRoot(X)) {
    const pyAncestors = new Set(tree.pathToRoot(Y));
    if (pyAncestors.has(id)) {
      tree.paint(id, "#fdecd9", C.darkOrange);
      tree.setTag(id, id === lca ? "LCA" : "公共祖先", C.darkOrange);
    }
  }
  await sd.pause();
});
