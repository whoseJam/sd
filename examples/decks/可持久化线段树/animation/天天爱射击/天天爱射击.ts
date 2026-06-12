import * as sd from "@/sd";

import {
  makeSegViz,
  pathTo,
  rectAt,
  textAt,
} from "../common/persistent-segtree";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 4;
const LAYER_H = 50;
const LEAF_GAP = 36;
const NODE_W = 30;
const NODE_H = 18;

const TREE_X = 0;
const ROOT_Y = 30;
const BULLETS_Y = ROOT_Y + 2.5 * LAYER_H;

// Bullets: (time, position). Positions in {1..4}.
const bullets = [
  { t: 1, x: 2 },
  { t: 2, x: 4 },
  { t: 3, x: 1 },
  { t: 4, x: 4 },
  { t: 5, x: 2 },
  { t: 6, x: 3 },
];

const layout = {
  rootCx: TREE_X,
  rootCy: ROOT_Y,
  layerH: LAYER_H,
  leafGap: LEAF_GAP,
  nodeW: NODE_W,
  nodeH: NODE_H,
};

const tree = makeSegViz({
  targetNode: svg,
  n: N,
  layout,
  values: [0, 0, 0, 0],
  fontSize: 11,
  initiallyHidden: true,
});

// Fill interior nodes with 0 too.
for (const node of tree.nodes) {
  textAt(tree, node.l, node.r)?.setText("0");
}

const bulletCircles: sd.Circle[] = [];
for (let i = 0; i < bullets.length; i++) {
  const cx = layout.rootCx + (i - (bullets.length - 1) / 2) * 40;
  bulletCircles.push(
    new sd.Circle({
      targetNode: svg,
      cx,
      cy: BULLETS_Y,
      r: 8,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1,
      opacity: 0,
    }),
  );
}

const counts = [0, 0, 0, 0];
function subtreeCount(l: number, r: number): number {
  let s = 0;
  for (let v = l; v <= r; v++) s += counts[v - 1];
  return s;
}

sd.main(async () => {
  let i = 0;
  for (const node of tree.nodes) {
    const d = node.depth * 100 + i * 12;
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
      .startAnimate({ delay: 60, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  for (let i = 0; i < bullets.length; i++) {
    const d = 200 + i * 70;
    bulletCircles[i]
      .startAnimate({ delay: d, duration: 220, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  const FADE_DELAY = 800;
  const FADE_DURATION = 280;
  for (let i = 0; i < bullets.length; i++) {
    const b = bullets[i];
    bulletCircles[i]
      .startAnimate({ duration: 200, easing: E.easeOut })
      .setFill(C.steelBlue)
      .setStroke(C.steelBlue)
      .endAnimate();
    bulletCircles[i]
      .startAnimate({
        delay: FADE_DELAY,
        duration: FADE_DURATION,
        easing: E.easeOut,
      })
      .setFill(C.silver)
      .setStroke(C.silver)
      .endAnimate();
    counts[b.x - 1]++;
    const path = pathTo(N, b.x);
    for (const range of path) {
      const cnt = subtreeCount(range.l, range.r);
      textAt(tree, range.l, range.r)
        ?.startAnimate({ duration: 220, easing: E.easeOut })
        .setText(String(cnt))
        .setFill(C.steelBlue)
        .endAnimate();
      textAt(tree, range.l, range.r)
        ?.startAnimate({
          delay: FADE_DELAY,
          duration: FADE_DURATION,
          easing: E.easeOut,
        })
        .setFill(C.darkButtonGrey)
        .endAnimate();
      rectAt(tree, range.l, range.r)
        ?.startAnimate({ duration: 220, easing: E.easeOut })
        .setStroke(C.steelBlue)
        .endAnimate();
      rectAt(tree, range.l, range.r)
        ?.startAnimate({
          delay: FADE_DELAY,
          duration: FADE_DURATION,
          easing: E.easeOut,
        })
        .setStroke(C.darkButtonGrey)
        .endAnimate();
    }
    await sd.pause();
  }
  await sd.pause();
});
