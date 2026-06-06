import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: 0, cy: 140 },
  { id: 2, cx: -120, cy: 80 },
  { id: 3, cx: 0, cy: 80 },
  { id: 4, cx: 120, cy: 80 },
  { id: 5, cx: -180, cy: 20 },
  { id: 6, cx: -60, cy: 20 },
  { id: 7, cx: 80, cy: 20 },
  { id: 8, cx: 160, cy: 20 },
  { id: 9, cx: -210, cy: -40 },
  { id: 10, cx: -150, cy: -40 },
  { id: 11, cx: -60, cy: -40 },
  { id: 12, cx: 60, cy: -40 },
];

const parent: Record<number, number> = {
  2: 1,
  3: 1,
  4: 1,
  5: 2,
  6: 2,
  7: 4,
  8: 4,
  9: 5,
  10: 5,
  11: 6,
  12: 7,
};

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1 });

const paths: Array<{
  a: number;
  b: number;
  color: sd.SDColor;
  len: number;
  tone: sd.SDColor;
}> = [
  { a: 10, b: 6, color: C.darkOrange, len: 5, tone: "#fdecd9" },
  { a: 8, b: 3, color: C.steelBlue, len: 4, tone: "#dbeefd" },
  { a: 11, b: 12, color: C.darkGreen, len: 6, tone: "#e8f5e9" },
];

function pathNodes(u: number, v: number): number[] {
  const pu = tree.pathToRoot(u);
  const lca = tree.lca(u, v);
  const pv = tree.pathToRoot(v);
  const up: number[] = [];
  for (const x of pu) {
    up.push(x);
    if (x === lca) break;
  }
  const down: number[] = [];
  for (const x of pv) {
    if (x === lca) break;
    down.push(x);
  }
  return [...up, ...down.reverse()];
}

const sidebarX = 240;
const sidebarY0 = 80;
const sidebarStep = 36;
for (let i = 0; i < paths.length; i++) {
  const p = paths[i];
  new sd.Line({
    targetNode: svg,
    x1: sidebarX,
    y1: sidebarY0 - i * sidebarStep,
    x2: sidebarX + 40,
    y2: sidebarY0 - i * sidebarStep,
    stroke: p.color,
    strokeWidth: 3,
  });
  new sd.Text({
    targetNode: svg,
    text: String(p.len),
    cx: sidebarX + 60,
    cy: sidebarY0 - i * sidebarStep,
    fontSize: 14,
    fill: p.color,
  });
}

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();

  for (let k = 0; k < paths.length; k++) {
    const p = paths[k];
    const path = pathNodes(p.a, p.b);
    for (let i = 1; i < path.length; i++)
      tree.paintEdge(path[i], p.color, { delay: i * 60 });
    tree.paint(p.a, p.tone, p.color, { duration: 220 });
    tree.paint(p.b, p.tone, p.color, { duration: 220 });
    await sd.pause();
  }
});
