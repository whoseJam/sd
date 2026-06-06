import * as sd from "@/sd";

import { createGraph, edgeKey, fadeInClassified } from "../lib/graph";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Pale tint that sits behind the {2,3,4} bcc. Created BEFORE the graph
// so it renders underneath edges and nodes.
const BCC_TINT = "#fdecd9";
const BRIDGE_COLOR = "#d6532b";

const bccTint = new sd.Ellipse({
  targetNode: svg,
  cx: -50,
  cy: -10,
  rx: 80,
  ry: 100,
  fill: BCC_TINT,
  fillOpacity: 0.65,
  stroke: "none",
  opacity: 0,
});

const view = createGraph(svg);

// Bridges identified by Tarjan: tree edge (u,v) is a bridge iff low[v] > dfn[u].
// Here: low = [_, 1, 2, 2, 2, 5, 6], dfn = [_, 1, 2, 3, 4, 5, 6]
//   (1,2): low[2]=2 > dfn[1]=1 ✓
//   (2,5): low[5]=5 > dfn[2]=2 ✓
//   (5,6): low[6]=6 > dfn[5]=5 ✓
const BRIDGES: ReadonlyArray<readonly [number, number]> = [
  [1, 2],
  [2, 5],
  [5, 6],
];

sd.main(async () => {
  fadeInClassified(view);
  await sd.pause();

  // Paint bridges with a distinct warm-red.
  for (let i = 0; i < BRIDGES.length; i++) {
    const [u, v] = BRIDGES[i];
    view.treeLines
      .get(edgeKey(u, v))!
      .startAnimate({ delay: i * 180, duration: 320, easing: E.easeOut })
      .setStroke(BRIDGE_COLOR)
      .setStrokeWidth(2.4)
      .endAnimate();
  }
  await sd.pause();

  // Shade the non-trivial 边双 {2, 3, 4} — the cycle 2-3-4-2.
  bccTint
    .startAnimate({ duration: 520, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
