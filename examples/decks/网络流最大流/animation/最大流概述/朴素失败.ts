import * as sd from "@/sd";

import { FlowGraph } from "../common/flow-graph";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const graph = new FlowGraph({
  targetNode: svg,
  nodes: [
    { id: "s", cx: -160, cy: 0, label: "s" },
    { id: "b", cx: 0, cy: 70, label: "B" },
    { id: "c", cx: 0, cy: -70, label: "C" },
    { id: "t", cx: 160, cy: 0, label: "t" },
  ],
  edges: [
    { from: "s", to: "b", cap: 1 },
    { from: "s", to: "c", cap: 1 },
    { from: "b", to: "c", cap: 1 },
    { from: "b", to: "t", cap: 1 },
    { from: "c", to: "t", cap: 1 },
  ],
  radius: 20,
});

const flowText = new sd.Text({
  targetNode: svg,
  text: "|f| = 0",
  cx: 0,
  cy: -130,
  fontSize: 14,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  graph.fadeIn({ delay: 0 });
  flowText
    .startAnimate({ delay: 320, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  graph.paintEdge("s", "b", C.darkOrange);
  graph.paintEdge("b", "c", C.darkOrange);
  graph.paintEdge("c", "t", C.darkOrange);
  graph.setCap("s", "b", "1/1", C.darkOrange);
  graph.setCap("b", "c", "1/1", C.darkOrange);
  graph.setCap("c", "t", "1/1", C.darkOrange);
  flowText
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setText("|f| = 1")
    .setFill(C.darkOrange)
    .endAnimate();
  await sd.pause();

  graph.fadeEdge("s", "b", 0.3);
  graph.fadeEdge("b", "c", 0.3);
  graph.fadeEdge("c", "t", 0.3);
  graph.paintEdge("s", "c", C.darkButtonGrey, { strokeWidth: 1.8 });
  await sd.pause();

  graph.paintEdge("c", "t", C.red, { strokeWidth: 2.2 });
  await sd.pause();

  graph.fadeEdge("s", "c", 0.3);
  graph.fadeEdge("c", "t", 0.3);
  graph.paintEdge("s", "b", C.red, { strokeWidth: 2.2 });
  await sd.pause();

  const stuckText = new sd.Text({
    targetNode: svg,
    text: "卡死 · 真实最大流 = 2",
    cx: 0,
    cy: 130,
    fontSize: 13,
    fill: C.red,
    opacity: 0,
  });
  stuckText
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
