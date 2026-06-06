import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: 0, cy: 140 },
  { id: 2, cx: -90, cy: 80 },
  { id: 3, cx: 90, cy: 80 },
  { id: 4, cx: -140, cy: 20 },
  { id: 5, cx: -50, cy: 20 },
  { id: 6, cx: -180, cy: -40 },
  { id: 7, cx: -90, cy: -40 },
  { id: 8, cx: -210, cy: -100 },
  { id: 9, cx: -140, cy: -100 },
  { id: 10, cx: -60, cy: -100 },
  { id: 11, cx: -140, cy: -160 },
  { id: 12, cx: -60, cy: -160 },
];

const parent: Record<number, number> = {
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 4,
  7: 4,
  8: 6,
  9: 6,
  10: 7,
  11: 9,
  12: 10,
};

const tree = new TreeView({
  targetNode: svg,
  nodes,
  parent,
  root: 1,
});

const U = 9;
const V = 10;

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();

  const lca = tree.lca(U, V);

  tree.paint(U, "#dbeefd", C.steelBlue, { duration: 220 });
  tree.setTag(U, "+1", C.steelBlue);
  tree.paint(V, "#dbeefd", C.steelBlue, { duration: 220 });
  tree.setTag(V, "+1", C.steelBlue);
  await sd.pause();

  tree.paint(lca, "#fdecd9", C.darkOrange, { duration: 220 });
  tree.setTag(lca, "-2", C.darkOrange);
  await sd.pause();
});
