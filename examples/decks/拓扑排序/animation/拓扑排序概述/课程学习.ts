import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();

const nodes = [
  { id: 1, cx: -180, cy: 60, label: "数学" },
  { id: 2, cx: -60, cy: 60, label: "数据结构" },
  { id: 3, cx: 60, cy: 60, label: "算法" },
  { id: 4, cx: 180, cy: 60, label: "图论" },
  { id: 5, cx: -120, cy: -40, label: "线代" },
  { id: 6, cx: 0, cy: -40, label: "ML" },
  { id: 7, cx: 120, cy: -40, label: "CV" },
];

const edges: Array<[number, number]> = [
  [1, 2], [1, 5], [2, 3], [3, 4], [5, 6], [3, 6], [6, 7],
];

const dag = new Dag({
  targetNode: svg, nodes, edges, radius: 28, fontSize: 12,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();
});
