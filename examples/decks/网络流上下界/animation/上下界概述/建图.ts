import * as sd from "@/sd";

import { FlowGraph } from "../common/flow-graph";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const graph = new FlowGraph({
  targetNode: svg,
  nodes: [
    { id: "u", cx: -160, cy: 0, label: "u" },
    { id: "v", cx: 160, cy: 0, label: "v" },
    { id: "S", cx: 160, cy: 100, label: "S'" },
    { id: "T", cx: -160, cy: -100, label: "T'" },
  ],
  edges: [
    { from: "u", to: "v", cap: 5 },
    { from: "S", to: "v", cap: 2 },
    { from: "u", to: "T", cap: 2 },
  ],
  radius: 22,
});

function fadeNodeIn(id: string, delay = 0) {
  graph.circles
    .get(id)!
    .startAnimate({ delay, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  graph.nodeLabels
    .get(id)!
    .startAnimate({ delay, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function fadeEdgeIn(key: string, delay = 0) {
  graph.arrows
    .get(key)!
    .startAnimate({ delay, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  graph.arrowHeads
    .get(key)!
    .startAnimate({ delay, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  graph.capLabels
    .get(key)!
    .startAnimate({ delay: delay + 80, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  graph.setCap("u", "v", "[2, 5]", C.darkButtonGrey);
  fadeNodeIn("u");
  fadeNodeIn("v");
  fadeEdgeIn("u-v", 120);
  await sd.pause();

  graph.setCap("u", "v", "3", C.darkOrange);
  graph.paintEdge("u", "v", C.darkOrange, { strokeWidth: 2.2 });
  await sd.pause();

  fadeNodeIn("S");
  fadeEdgeIn("S-v", 120);
  graph.setCap("S", "v", "2", C.steelBlue);
  graph.paintEdge("S", "v", C.steelBlue, { strokeWidth: 2.2 });
  await sd.pause();

  fadeNodeIn("T");
  fadeEdgeIn("u-T", 120);
  graph.setCap("u", "T", "2", C.darkGreen);
  graph.paintEdge("u", "T", C.darkGreen, { strokeWidth: 2.2 });
  await sd.pause();
});
