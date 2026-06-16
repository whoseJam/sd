import * as sd from "@/sd";

import {
  classifyBackEdges,
  colorTreeEdges,
  createDirectedGraph,
  fadeInDirectedNeutral,
} from "../lib/graph-d";

const svg = sd.svg();
const E = sd.easing();

const SCC_TINT_A = "#fdecd9";
const SCC_TINT_B = "#e3f2fd";

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
  fadeInDirectedNeutral(view);
  await sd.pause();

  // Step 1: identify the DFS tree.
  colorTreeEdges(view, { stagger: 200, delay: 60 });
  await sd.pause();

  // Step 2: back edges revealed.
  classifyBackEdges(view);
  await sd.pause();

  // Step 3: SCCs identified — back edges close cycles, fixing SCCs.
  sccA
    .startAnimate({ duration: 480, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  sccB
    .startAnimate({ delay: 220, duration: 480, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
