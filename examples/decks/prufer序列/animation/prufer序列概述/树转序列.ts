import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";
import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

// Concrete tree: edges (3,4) (4,5) (5,6) (2,5) (1,4) — 6 nodes.
// Adj: 1-4, 2-5, 3-4, 4-5, 5-6.
const nodes = [
  { id: 1, cx: -180, cy: 60 },
  { id: 2, cx: 60, cy: 120 },
  { id: 3, cx: -180, cy: -80 },
  { id: 4, cx: -60, cy: 20 },
  { id: 5, cx: 60, cy: 0 },
  { id: 6, cx: 180, cy: -40 },
];

const parent: Record<number, number> = {
  1: 4, 3: 4, 4: 5, 2: 5, 6: 5,
};

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 5, radius: 18 });

// Simulate Prufer:
// Removal sequence + parent recorded.
// Tree:  1-4, 3-4, 4-5, 2-5, 5-6.
// Leaves (deg=1): 1, 2, 3, 6. Smallest: 1. Record fa[1]=4. Now 1 gone, 4's deg: 2.
// Now leaves: 2, 3, 6. Smallest: 2. Record fa[2]=5. 5's deg drops.
// Now leaves: 3, 6. Smallest: 3. Record fa[3]=4. 4's deg drops to 1.
// Now leaves: 4, 6. Smallest: 4. Record fa[4]=5.
// 2 remaining: 5, 6.
// Prufer = [4, 5, 4, 5].

const prufer = [4, 5, 4, 5];

const seqRow = new NumRow({
  targetNode: svg,
  values: new Array(prufer.length).fill(" "),
  size: 40,
  x: -(prufer.length * 40) / 2,
  y: -160,
  label: "prufer",
  labelGap: 40,
});

const removalOrder = [1, 2, 3, 4];

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  seqRow.fadeIn({ delay: 200 });
  await sd.pause();
  for (let i = 0; i < removalOrder.length; i++) {
    const removed = removalOrder[i];
    tree.paint(removed, "#fde9e9", "#d32f2f" as sd.SDColor);
    tree.setTag(removed, "remove", "#d32f2f" as sd.SDColor);
    seqRow.setValue(i + 1, prufer[i], { delay: 200 });
    seqRow.paintCell(i + 1, "#fdecd9", C.darkOrange, { delay: 200, duration: 200 });
    await sd.pause();
  }
});
