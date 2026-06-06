import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

// Left graph: negative edge, no cycle.
// Right graph: a negative cycle.

const leftNodes = [
  { id: 1, cx: -260, cy: 40 },
  { id: 2, cx: -180, cy: 40 },
  { id: 3, cx: -100, cy: 40 },
];
const leftEdges: Array<[number, number]> = [
  [1, 2],
  [2, 3],
];
const leftDag = new Dag({
  targetNode: svg,
  nodes: leftNodes,
  edges: leftEdges,
  radius: 16,
});
const leftWeights: Record<string, number> = { "1-2": 5, "2-3": -2 };
for (const [u, v] of leftEdges) {
  const a = leftNodes.find((n) => n.id === u)!;
  const b = leftNodes.find((n) => n.id === v)!;
  new sd.Text({
    targetNode: svg,
    text: String(leftWeights[`${u}-${v}`]),
    cx: (a.cx + b.cx) / 2,
    cy: (a.cy + b.cy) / 2 - 12,
    fontSize: 12,
    fill: leftWeights[`${u}-${v}`] < 0 ? C.darkOrange : C.darkButtonGrey,
  });
}
new sd.Text({
  targetNode: svg,
  text: "负权 / 无环",
  cx: -180,
  cy: -30,
  fontSize: 13,
  fill: C.darkButtonGrey,
});

const rightNodes = [
  { id: 4, cx: 100, cy: 80 },
  { id: 5, cx: 200, cy: 80 },
  { id: 6, cx: 150, cy: 0 },
];
const rightEdges: Array<[number, number]> = [
  [4, 5],
  [5, 6],
  [6, 4],
];
const rightDag = new Dag({
  targetNode: svg,
  nodes: rightNodes,
  edges: rightEdges,
  radius: 16,
});
const rightWeights: Record<string, number> = { "4-5": 2, "5-6": -3, "6-4": -1 };
for (const [u, v] of rightEdges) {
  const a = rightNodes.find((n) => n.id === u)!;
  const b = rightNodes.find((n) => n.id === v)!;
  new sd.Text({
    targetNode: svg,
    text: String(rightWeights[`${u}-${v}`]),
    cx: (a.cx + b.cx) / 2 + 8,
    cy: (a.cy + b.cy) / 2 - 6,
    fontSize: 12,
    fill: rightWeights[`${u}-${v}`] < 0 ? C.darkOrange : C.darkButtonGrey,
  });
}
new sd.Text({
  targetNode: svg,
  text: "负环",
  cx: 150,
  cy: -50,
  fontSize: 13,
  fill: "#d32f2f" as sd.SDColor,
});

sd.main(async () => {
  leftDag.fadeIn({ delay: 0 });
  rightDag.fadeIn({ delay: 200 });
  await sd.pause();
});
