import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: 0, cy: 150 },
  { id: 2, cx: -120, cy: 90 },
  { id: 3, cx: 120, cy: 90 },
  { id: 4, cx: -180, cy: 30 },
  { id: 5, cx: -60, cy: 30 },
  { id: 6, cx: 60, cy: 30 },
  { id: 7, cx: 180, cy: 30 },
  { id: 8, cx: -200, cy: -40 },
  { id: 9, cx: -140, cy: -40 },
  { id: 10, cx: -60, cy: -40 },
  { id: 11, cx: 60, cy: -40 },
  { id: 12, cx: 140, cy: -40 },
  { id: 13, cx: 220, cy: -40 },
];

const parent: Record<number, number> = {
  2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3,
  8: 4, 9: 4, 10: 5, 11: 6, 12: 7, 13: 7,
};

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1 });

const A = 8;
const B = 10;
const D = 11;
const E = 13;

function pathNodes(u: number, v: number): number[] {
  const pu = tree.pathToRoot(u);
  const lca = tree.lca(u, v);
  const pv = tree.pathToRoot(v);
  const up: number[] = [];
  for (const x of pu) { up.push(x); if (x === lca) break; }
  const down: number[] = [];
  for (const x of pv) { if (x === lca) break; down.push(x); }
  return [...up, ...down.reverse()];
}

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();

  const pathAB = pathNodes(A, B);
  for (let i = 1; i < pathAB.length; i++) tree.paintEdge(pathAB[i], C.steelBlue, { delay: i * 50 });
  tree.paint(A, "#dbeefd", C.steelBlue);
  tree.setTag(A, "a", C.steelBlue);
  tree.paint(B, "#dbeefd", C.steelBlue);
  tree.setTag(B, "b", C.steelBlue);
  await sd.pause();

  const pathDE = pathNodes(D, E);
  for (let i = 1; i < pathDE.length; i++) tree.paintEdge(pathDE[i], C.darkOrange, { delay: i * 50 });
  tree.paint(D, "#fdecd9", C.darkOrange);
  tree.setTag(D, "c", C.darkOrange);
  tree.paint(E, "#fdecd9", C.darkOrange);
  tree.setTag(E, "d", C.darkOrange);
  await sd.pause();

  const lcaAB = tree.lca(A, B);
  const lcaCD = tree.lca(D, E);
  tree.paint(lcaAB, "#e8f5e9", C.darkGreen);
  tree.setTag(lcaAB, "x = LCA(a,b)", C.darkGreen);
  tree.paint(lcaCD, "#e8f5e9", C.darkGreen);
  tree.setTag(lcaCD, "y = LCA(c,d)", C.darkGreen);
  await sd.pause();
});
