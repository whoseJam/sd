import * as sd from "@/sd";

import { FlowGraph } from "../common/flow-graph";

const svg = sd.svg();
const C = sd.color();

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

sd.main(async () => {
  graph.fadeIn({ delay: 0 });
  await sd.pause();

  graph.paintEdge("s", "b", C.darkOrange);
  graph.paintEdge("b", "c", C.darkOrange);
  graph.paintEdge("c", "t", C.darkOrange);
  graph.setCap("s", "b", "1/1", C.darkOrange);
  graph.setCap("b", "c", "1/1", C.darkOrange);
  graph.setCap("c", "t", "1/1", C.darkOrange);
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
});
