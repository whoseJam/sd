import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

// Binary tree: DFS visits in order.
const nodes = [
  { id: 1, cx: 0, cy: 120 },
  { id: 2, cx: -80, cy: 60 },
  { id: 3, cx: 80, cy: 60 },
  { id: 4, cx: -120, cy: 0 },
  { id: 5, cx: -40, cy: 0 },
  { id: 6, cx: 40, cy: 0 },
  { id: 7, cx: 120, cy: 0 },
];

const parent: Record<number, number> = { 2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3 };

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1, radius: 18 });

const dfsOrder = [1, 2, 4, 5, 3, 6, 7];

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();
  for (let i = 0; i < dfsOrder.length; i++) {
    tree.paint(dfsOrder[i], "#fdecd9", C.darkOrange, { delay: i * 280, duration: 240 });
    tree.setTag(dfsOrder[i], String(i + 1), C.darkOrange, { delay: i * 280 });
  }
  await sd.pause();
});
