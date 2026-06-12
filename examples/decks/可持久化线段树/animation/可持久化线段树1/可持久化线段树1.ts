import * as sd from "@/sd";

import {
  centerOf,
  makeSegViz,
  pathTo,
  rectAt,
  sibling,
  textAt,
} from "../common/persistent-segtree";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 4;
const LAYER_H = 50;
const LEAF_GAP = 22;
const NODE_W = 20;
const NODE_H = 14;

const TREE_GAP = 130;
const ROOT_Y = 80;

const initial = [3, 2, 4, 1];
const ops = [
  { pos: 1, value: 1 },
  { pos: 2, value: 3 },
  { pos: 3, value: 2 },
  { pos: 4, value: 3 },
];

const treeLayouts = Array.from({ length: ops.length + 1 }, (_, i) => ({
  rootCx: -(ops.length * TREE_GAP) / 2 + i * TREE_GAP,
  rootCy: ROOT_Y,
  layerH: LAYER_H,
  leafGap: LEAF_GAP,
  nodeW: NODE_W,
  nodeH: NODE_H,
}));

const trees: ReturnType<typeof makeSegViz>[] = [];
const versions: number[][] = [initial];
for (let v = 1; v <= ops.length; v++) {
  const op = ops[v - 1];
  const prev = versions[v - 1];
  const next = [...prev];
  next[op.pos - 1] = op.value;
  versions.push(next);
}

trees.push(
  makeSegViz({
    targetNode: svg,
    n: N,
    layout: treeLayouts[0],
    values: initial,
    fontSize: 9,
    initiallyHidden: true,
  }),
);
for (let v = 1; v <= ops.length; v++) {
  const op = ops[v - 1];
  const path = new Set(pathTo(N, op.pos).map((r) => `${r.l},${r.r}`));
  trees.push(
    makeSegViz({
      targetNode: svg,
      n: N,
      layout: treeLayouts[v],
      values: versions[v],
      fontSize: 9,
      visible: (r) => path.has(`${r.l},${r.r}`),
      initiallyHidden: true,
    }),
  );
}

interface BorrowLink {
  line: sd.Line;
}
const borrowLinks: BorrowLink[][] = [[]];

for (let v = 1; v <= ops.length; v++) {
  const op = ops[v - 1];
  const siblings = sibling(N, op.pos);
  const links: BorrowLink[] = [];
  for (const sib of siblings) {
    const parent = pathTo(N, op.pos).find((p) => {
      const m = (p.l + p.r) >> 1;
      return (
        (p.l === sib.l && m === sib.r) || (m + 1 === sib.l && p.r === sib.r)
      );
    });
    if (!parent) continue;
    const parentCenter = centerOf(trees[v], parent.l, parent.r);
    let targetCenter: { cx: number; cy: number } | undefined;
    for (let w = v - 1; w >= 0; w--) {
      targetCenter = centerOf(trees[w], sib.l, sib.r);
      if (targetCenter) break;
    }
    if (!parentCenter || !targetCenter) continue;
    const line = new sd.Line({
      targetNode: svg,
      x1: parentCenter.cx,
      y1: parentCenter.cy - NODE_H / 2,
      x2: targetCenter.cx,
      y2: targetCenter.cy + NODE_H / 2,
      stroke: C.textBlue,
      strokeWidth: 0.9,
      strokeDashArray: [3, 3],
      opacity: 0,
    });
    links.push({ line });
  }
  borrowLinks.push(links);
}

async function fadeInTree(treeIdx: number, baseDelay = 0) {
  const tree = trees[treeIdx];
  let i = 0;
  for (const node of tree.nodes) {
    const d = baseDelay + node.depth * 120 + i * 20;
    rectAt(tree, node.l, node.r)
      ?.startAnimate({ delay: d, duration: 220, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    textAt(tree, node.l, node.r)
      ?.startAnimate({ delay: d + 60, duration: 220, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    i++;
  }
  for (const edge of tree.edge.values()) {
    edge
      .startAnimate({ delay: baseDelay + 60, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
}

sd.main(async () => {
  fadeInTree(0);
  await sd.pause();

  for (let v = 1; v <= ops.length; v++) {
    fadeInTree(v);
    for (const { line } of borrowLinks[v]) {
      line
        .startAnimate({ delay: 240, duration: 320, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
    await sd.pause();
  }
});
