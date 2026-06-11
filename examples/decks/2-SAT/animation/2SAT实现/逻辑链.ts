import * as sd from "@/sd";

import { Dag } from "../common/dag";

const svg = sd.svg();

const nodes = [
  { id: 1, cx: -200, cy: 0, label: "V_1" },
  { id: 2, cx: -100, cy: 0, label: "V_2" },
  { id: 3, cx: 0, cy: 0, label: "V_3" },
  { id: 4, cx: 100, cy: 0, label: "V_4" },
  { id: 5, cx: 200, cy: 0, label: "V_m" },
];
const edges: Array<[number, number]> = [
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
];
const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 22,
  mathLabel: true,
  fontSize: 15,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();
});
