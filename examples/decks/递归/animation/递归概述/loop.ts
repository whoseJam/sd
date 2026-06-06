import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

// loop(3) -> for ... { loop(2) -> for ... { loop(1) -> for ... } }
const nodes = [
  { id: 3, cx: 0, cy: 80, label: "loop(3)" },
  { id: 2, cx: 0, cy: 0, label: "loop(2)" },
  { id: 1, cx: 0, cy: -80, label: "loop(1)" },
];

const parent: Record<number, number> = { 2: 3, 1: 2 };

const tree = new TreeView({
  targetNode: svg,
  nodes,
  parent,
  root: 3,
  radius: 32,
  fontSize: 11,
});

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();
  tree.setTag(3, "for i in 1..n:", C.steelBlue);
  tree.setTag(2, "for j in 1..n:", C.steelBlue);
  tree.setTag(1, "for k in 1..n:", C.steelBlue);
  await sd.pause();
});
