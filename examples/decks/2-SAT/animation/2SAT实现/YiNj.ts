import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -80, cy: 60, label: "Y_i" },
  { id: 2, cx: 80, cy: 60, label: "N_i" },
  { id: 3, cx: -80, cy: -60, label: "Y_j" },
  { id: 4, cx: 80, cy: -60, label: "N_j" },
];
const edges: Array<[number, number]> = [[1, 4]];
const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 24,
  mathLabel: true,
  fontSize: 16,
});

new sd.Text({
  targetNode: svg,
  text: "i 取 Y，则 j 必须取 N",
  cx: 0,
  cy: -130,
  fontSize: 16,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();
});
