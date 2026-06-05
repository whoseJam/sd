import * as sd from "@/sd";

import { TreeView } from "../lib/tree-view";

const svg = sd.svg();
const C = sd.color();

// Two long branches meeting at LCA so the distance has visible length.
const nodes = [
  { id: 1, cx: 0, cy: 160 },
  { id: 2, cx: 0, cy: 100 },
  { id: 3, cx: 0, cy: 40 },
  { id: 4, cx: -70, cy: -20 },
  { id: 5, cx: -70, cy: -80 },
  { id: 6, cx: -70, cy: -140 },
  { id: 7, cx: 70, cy: -20 },
  { id: 8, cx: 70, cy: -80 },
  { id: 9, cx: 70, cy: -140 },
];

const parent: Record<number, number> = {
  2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 3, 8: 7, 9: 8,
};

const tree = new TreeView({ targetNode: svg, nodes, parent, root: 1 });

const X = 6;
const Y = 9;

function depthOf(id: number): number {
  let d = 0;
  let cur: number | undefined = id;
  while (parent[cur!] !== undefined) { cur = parent[cur!]; d++; }
  return d;
}

const formula = new sd.Math({
  targetNode: svg,
  text: "d(x, y) = dep_x + dep_y - 2\\,dep_{LCA}",
  cx: 160, cy: 0, fontSize: 14, fill: C.darkButtonGrey, opacity: 0,
});

sd.main(async () => {
  tree.fadeIn({ delay: 0 });
  await sd.pause();

  tree.paint(X, "#dbeefd", C.steelBlue);
  tree.setTag(X, "x", C.steelBlue);
  tree.paint(Y, "#fdecd9", C.darkOrange);
  tree.setTag(Y, "y", C.darkOrange);
  await sd.pause();

  const lca = tree.lca(X, Y);
  tree.paint(lca, "#e8f5e9", C.darkGreen);
  tree.setTag(lca, "LCA", C.darkGreen);

  const px = tree.pathToRoot(X);
  const py = tree.pathToRoot(Y);
  let i = 0;
  for (const id of px) {
    if (id === lca) break;
    tree.paintEdge(id, C.steelBlue, { delay: i * 60 });
    i++;
  }
  i = 0;
  for (const id of py) {
    if (id === lca) break;
    tree.paintEdge(id, C.darkOrange, { delay: i * 60 });
    i++;
  }

  const E = sd.easing();
  formula.startAnimate({ delay: 400, duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();

  void depthOf;
  await sd.pause();
});
