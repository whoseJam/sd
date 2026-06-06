import * as sd from "@/sd";

import { createDirectedGraph, fadeInDirectedClassified } from "../lib/graph-d";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const SCC_TINT_A = "#fdecd9";
const SCC_TINT_B = "#e3f2fd";

// Backgrounds created BEFORE the graph so they sit behind edges and nodes.
const sccA = new sd.Ellipse({
  targetNode: svg,
  cx: -30,
  cy: 40,
  rx: 80,
  ry: 95,
  fill: SCC_TINT_A,
  fillOpacity: 0.65,
  stroke: "none",
  opacity: 0,
});

const sccB = new sd.Ellipse({
  targetNode: svg,
  cx: 90,
  cy: -65,
  rx: 38,
  ry: 60,
  fill: SCC_TINT_B,
  fillOpacity: 0.65,
  stroke: "none",
  opacity: 0,
});

const view = createDirectedGraph(svg);

sd.main(async () => {
  fadeInDirectedClassified(view);
  await sd.pause();

  // 强连通分量 A: {1, 2, 3} — cycle closes via back edge 3→1.
  sccA
    .startAnimate({ duration: 480, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  // 强连通分量 B: {4, 5} — cycle closes via back edge 5→4.
  sccB
    .startAnimate({ duration: 480, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
