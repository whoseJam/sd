import * as sd from "@/sd";

import {
  centerOf,
  enumerate,
  makeSegViz,
  rectAt,
  textAt,
} from "../common/persistent-segtree";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Value domain {1..4}; prefix arrays produce counts.
const N = 4;
const LAYER_H = 50;
const LEAF_GAP = 28;
const NODE_W = 28;
const NODE_H = 18;

const TREE_SPACING = 280;
const ROOT_Y = 80;
const LX = -TREE_SPACING / 2;
const RX = TREE_SPACING / 2;

// Values at positions 1..6 of the sequence. Query: [l=2, r=5], kth = 2.
const seq = [3, 1, 4, 1, 2, 4];
const ql = 2;
const qr = 5;
const k = 2;

function countInPrefix(p: number): number[] {
  const c = [0, 0, 0, 0];
  for (let i = 0; i < p; i++) c[seq[i] - 1]++;
  return c;
}

function countSubtree(prefix: number, valL: number, valR: number): number {
  const c = countInPrefix(prefix);
  let s = 0;
  for (let v = valL; v <= valR; v++) s += c[v - 1];
  return s;
}

const layoutL = {
  rootCx: LX,
  rootCy: ROOT_Y,
  layerH: LAYER_H,
  leafGap: LEAF_GAP,
  nodeW: NODE_W,
  nodeH: NODE_H,
};
const layoutR = {
  rootCx: RX,
  rootCy: ROOT_Y,
  layerH: LAYER_H,
  leafGap: LEAF_GAP,
  nodeW: NODE_W,
  nodeH: NODE_H,
};

const treeL = makeSegViz({
  targetNode: svg,
  n: N,
  layout: layoutL,
  fontSize: 9,
  initiallyHidden: true,
});
const treeR = makeSegViz({
  targetNode: svg,
  n: N,
  layout: layoutR,
  fontSize: 9,
  initiallyHidden: true,
});

const allNodes = enumerate(N, layoutL);
for (const node of allNodes) {
  const cL = countSubtree(ql - 1, node.l, node.r);
  const cR = countSubtree(qr, node.l, node.r);
  textAt(treeL, node.l, node.r)?.setText(String(cL));
  textAt(treeR, node.l, node.r)?.setText(String(cR));
}

const focusL = new sd.Rect({
  targetNode: svg,
  x: -1000,
  y: -1000,
  width: NODE_W + 6,
  height: NODE_H + 6,
  fill: C.transparent,
  stroke: C.steelBlue,
  strokeWidth: 1.6,
  rx: 4,
  ry: 4,
  opacity: 0,
});
const focusR = new sd.Rect({
  targetNode: svg,
  x: -1000,
  y: -1000,
  width: NODE_W + 6,
  height: NODE_H + 6,
  fill: C.transparent,
  stroke: C.steelBlue,
  strokeWidth: 1.6,
  rx: 4,
  ry: 4,
  opacity: 0,
});

async function fadeInTree(tree: ReturnType<typeof makeSegViz>, baseDelay = 0) {
  let i = 0;
  for (const node of tree.nodes) {
    const d = baseDelay + node.depth * 100 + i * 12;
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

function moveFocus(
  focus: sd.Rect,
  tree: ReturnType<typeof makeSegViz>,
  l: number,
  r: number,
) {
  const c = centerOf(tree, l, r);
  if (!c) return;
  focus
    .startAnimate({ duration: 260, easing: E.easeOut })
    .setX(c.cx - (NODE_W + 6) / 2)
    .setY(c.cy - (NODE_H + 6) / 2)
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  fadeInTree(treeL);
  fadeInTree(treeR, 200);
  await sd.pause();

  // Binary search down the diff: target kth smallest in [l, r] of seq.
  let l = 1,
    r = N,
    kk = k;
  while (l < r) {
    moveFocus(focusL, treeL, l, r);
    moveFocus(focusR, treeR, l, r);
    await sd.pause();
    const m = (l + r) >> 1;
    const leftDiff = countSubtree(qr, l, m) - countSubtree(ql - 1, l, m);
    if (kk <= leftDiff) {
      r = m;
    } else {
      kk -= leftDiff;
      l = m + 1;
    }
  }
  moveFocus(focusL, treeL, l, r);
  moveFocus(focusR, treeR, l, r);
  await sd.pause();
});
