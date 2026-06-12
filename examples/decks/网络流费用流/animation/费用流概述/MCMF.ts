import * as sd from "@/sd";

import { FlowGraph } from "../common/flow-graph";

const svg = sd.svg();
const C = sd.color();

interface EdgeInfo {
  cap: number;
  cost: number;
  flow: number;
}
const edgeInfo: Record<string, EdgeInfo> = {
  "s-a": { cap: 2, cost: 1, flow: 0 },
  "s-b": { cap: 1, cost: 4, flow: 0 },
  "a-t": { cap: 1, cost: 1, flow: 0 },
  "a-b": { cap: 1, cost: 1, flow: 0 },
  "b-t": { cap: 2, cost: 1, flow: 0 },
};

const graph = new FlowGraph({
  targetNode: svg,
  nodes: [
    { id: "s", cx: -160, cy: 0, label: "s" },
    { id: "a", cx: -30, cy: 70, label: "A" },
    { id: "b", cx: -30, cy: -70, label: "B" },
    { id: "t", cx: 160, cy: 0, label: "t" },
  ],
  edges: [
    { from: "s", to: "a", cap: 2 },
    { from: "s", to: "b", cap: 1 },
    { from: "a", to: "t", cap: 1 },
    { from: "a", to: "b", cap: 1 },
    { from: "b", to: "t", cap: 2 },
  ],
  radius: 20,
});

function edgeLabel(key: string): string {
  const e = edgeInfo[key];
  return `${e.flow}/${e.cap}·${e.cost}`;
}

for (const key of Object.keys(edgeInfo)) {
  const [u, v] = key.split("-");
  graph.setCap(u, v, edgeLabel(key), C.darkButtonGrey);
}

function augment(path: string[], add: number) {
  for (let i = 0; i + 1 < path.length; i++) {
    const key = `${path[i]}-${path[i + 1]}`;
    edgeInfo[key].flow += add;
  }
}

function highlightPath(path: string[], color: sd.SDColor) {
  for (let i = 0; i + 1 < path.length; i++) {
    graph.paintEdge(path[i], path[i + 1], color, { strokeWidth: 2.6 });
  }
}

function fadePath(path: string[], opacity: number) {
  for (let i = 0; i + 1 < path.length; i++) {
    graph.fadeEdge(path[i], path[i + 1], opacity);
  }
}

sd.main(async () => {
  graph.fadeIn({ delay: 0 });
  await sd.pause();

  const augPaths: string[][] = [
    ["s", "a", "t"],
    ["s", "a", "b", "t"],
    ["s", "b", "t"],
  ];

  for (const path of augPaths) {
    highlightPath(path, C.darkOrange);
    await sd.pause();

    augment(path, 1);
    for (let j = 0; j + 1 < path.length; j++) {
      const key = `${path[j]}-${path[j + 1]}`;
      graph.setCap(path[j], path[j + 1], edgeLabel(key), C.steelBlue);
    }
    fadePath(path, 0.35);
    await sd.pause();
  }
});
