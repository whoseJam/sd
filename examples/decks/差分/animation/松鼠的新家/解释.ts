import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: 0, cy: 110 },
  { id: 2, cx: -120, cy: 50 },
  { id: 3, cx: -160, cy: -10 },
  { id: 4, cx: -200, cy: -70 },
  { id: 5, cx: -120, cy: -70 },
  { id: 6, cx: 0, cy: 50 },
  { id: 7, cx: -40, cy: -10 },
  { id: 8, cx: 40, cy: -10 },
  { id: 9, cx: 120, cy: 50 },
];

const parent: Record<number, number> = {
  2: 1,
  3: 2,
  4: 3,
  5: 3,
  6: 1,
  7: 6,
  8: 6,
  9: 1,
};

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1 });

function pathBetween(u: number, v: number): number[] {
  const pu = tree.pathToRoot(u);
  const lca = tree.lca(u, v);
  const pv = tree.pathToRoot(v);
  const upPart: number[] = [];
  for (const x of pu) {
    upPart.push(x);
    if (x === lca) break;
  }
  const downPart: number[] = [];
  for (const x of pv) {
    if (x === lca) break;
    downPart.push(x);
  }
  return [...upPart, ...downPart.reverse()];
}

const visits = [9, 2, 8];
const counts: Map<number, number> = new Map();
for (const id of nodes.map((n) => n.id)) counts.set(id, 0);

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();

  for (let s = 1; s < visits.length; s++) {
    const a = visits[s - 1];
    const b = visits[s];
    const path = pathBetween(a, b);
    for (let k = 0; k < path.length; k++) {
      const id = path[k];
      const next = counts.get(id)! + 1;
      counts.set(id, next);
      tree.paint(id, "#dbeefd", C.steelBlue, { delay: k * 80, duration: 200 });
      tree.setTag(id, String(next), C.steelBlue, { delay: k * 80 });
    }
    await sd.pause();
  }
});
