import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

// Fibonacci recursion tree for f(5).
type N = { id: number; cx: number; cy: number; label: string };
const nodes: N[] = [];
const parent: Record<number, number> = {};
let counter = 1;

function build(k: number, depth: number, x: number, width: number): number {
  const id = counter++;
  const y = 160 - depth * 60;
  nodes.push({ id, cx: x, cy: y, label: `f(${k})` });
  if (k > 2) {
    const left = build(k - 1, depth + 1, x - width / 2, width / 2);
    const right = build(k - 2, depth + 1, x + width / 2, width / 2);
    parent[left] = id;
    parent[right] = id;
  }
  return id;
}

build(5, 0, 0, 280);

const tree = new TreeView({
  targetNode: svg, nodes, parent, root: 1, radius: 18, fontSize: 11,
});

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();
  // Highlight leaves (f(1) and f(2)).
  for (const n of nodes) {
    if (n.label === "f(1)" || n.label === "f(2)") {
      tree.paint(n.id, "#fdecd9", C.darkOrange);
    }
  }
  await sd.pause();
});
