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
  2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3,
  8: 4, 9: 4, 10: 5, 11: 6, 12: 7, 13: 7,
};

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1 });

const X = 9; // depth 3
const Y = 6; // depth 2

function depthOf(id: number): number {
  let d = 0;
  let cur: number | undefined = id;
  while (parent[cur!] !== undefined) { cur = parent[cur!]; d++; }
  return d;
}

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();

  tree.paint(X, "#dbeefd", C.steelBlue);
  tree.setTag(X, "x", C.steelBlue);
  tree.paint(Y, "#fdecd9", C.darkOrange);
  tree.setTag(Y, "y", C.darkOrange);
  await sd.pause();

  // Step 1: lift the deeper one (X) to match depth of Y.
  let cx = X;
  let cy = Y;
  if (depthOf(cx) < depthOf(cy)) [cx, cy] = [cy, cx];
  while (depthOf(cx) > depthOf(cy)) {
    const next = parent[cx];
    tree.paint(next, "#dbeefd", C.steelBlue);
    cx = next;
  }
  await sd.pause();

  // Step 2: both jump together until meeting.
  while (cx !== cy) {
    const nx = parent[cx];
    const ny = parent[cy];
    if (nx === ny) {
      tree.paint(nx, "#e8f5e9", C.darkGreen);
      tree.setTag(nx, "LCA", C.darkGreen);
    } else {
      tree.paint(nx, "#dbeefd", C.steelBlue);
      tree.paint(ny, "#fdecd9", C.darkOrange);
    }
    cx = nx;
    cy = ny;
  }
  await sd.pause();
});
