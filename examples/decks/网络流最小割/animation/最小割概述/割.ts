import * as sd from "@/sd";

import { FlowGraph } from "../common/flow-graph";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const sRegion = new sd.Rect({
  targetNode: svg,
  x: -210,
  y: -110,
  width: 230,
  height: 220,
  rx: 28,
  fill: C.steelBlue,
  stroke: C.steelBlue,
  strokeWidth: 1.2,
  strokeDashArray: [6, 4],
  opacity: 0,
});

const tRegion = new sd.Rect({
  targetNode: svg,
  x: 110,
  y: -60,
  width: 100,
  height: 120,
  rx: 24,
  fill: C.darkOrange,
  stroke: C.darkOrange,
  strokeWidth: 1.2,
  strokeDashArray: [6, 4],
  opacity: 0,
});

const sTag = new sd.Text({
  targetNode: svg,
  text: "S",
  cx: -190,
  cy: 92,
  fontSize: 16,
  fill: C.steelBlue,
  opacity: 0,
});
const tTag = new sd.Text({
  targetNode: svg,
  text: "T",
  cx: 190,
  cy: 48,
  fontSize: 16,
  fill: C.darkOrange,
  opacity: 0,
});

const graph = new FlowGraph({
  targetNode: svg,
  nodes: [
    { id: "s", cx: -160, cy: 0, label: "s" },
    { id: "a", cx: -30, cy: 70, label: "A" },
    { id: "b", cx: -30, cy: -70, label: "B" },
    { id: "t", cx: 160, cy: 0, label: "t" },
  ],
  edges: [
    { from: "s", to: "a", cap: 10 },
    { from: "s", to: "b", cap: 10 },
    { from: "a", to: "b", cap: 5 },
    { from: "a", to: "t", cap: 3 },
    { from: "b", to: "t", cap: 4 },
  ],
  radius: 20,
});

sd.main(async () => {
  graph.fadeIn({ delay: 0 });
  await sd.pause();

  graph.setCap("s", "a", "3/10", C.steelBlue);
  graph.setCap("s", "b", "4/10", C.steelBlue);
  graph.setCap("a", "b", "0/5", C.steelBlue);
  graph.setCap("a", "t", "3/3", C.steelBlue);
  graph.setCap("b", "t", "4/4", C.steelBlue);
  graph.paintEdge("s", "a", C.steelBlue, { strokeWidth: 1.8 });
  graph.paintEdge("s", "b", C.steelBlue, { strokeWidth: 1.8 });
  graph.paintEdge("a", "t", C.steelBlue, { strokeWidth: 1.8 });
  graph.paintEdge("b", "t", C.steelBlue, { strokeWidth: 1.8 });
  await sd.pause();

  sRegion
    .startAnimate({ duration: 400, easing: E.easeOut })
    .setOpacity(0.12)
    .endAnimate();
  tRegion
    .startAnimate({ delay: 120, duration: 400, easing: E.easeOut })
    .setOpacity(0.12)
    .endAnimate();
  sTag
    .startAnimate({ delay: 200, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  tTag
    .startAnimate({ delay: 200, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  graph.fadeEdge("s", "a", 0.2);
  graph.fadeEdge("s", "b", 0.2);
  graph.fadeEdge("a", "b", 0.2);
  graph.paintEdge("a", "t", C.red, { strokeWidth: 2.8 });
  graph.paintEdge("b", "t", C.red, { strokeWidth: 2.8 });
  await sd.pause();
});
