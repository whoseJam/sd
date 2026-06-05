import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -140, cy: 0, label: "i" },
  { id: 2, cx: 0, cy: 60, label: "k" },
  { id: 3, cx: 140, cy: 0, label: "j" },
];
const edges: Array<[number, number]> = [[1, 2], [2, 3], [1, 3]];

const dag = new Dag({ targetNode: svg, nodes, edges, radius: 22 });

new sd.Math({
  targetNode: svg,
  text: "d_{ij} = \\min(d_{ij}, d_{ik} + d_{kj})",
  cx: 0, cy: -60,
  fontSize: 16, fill: C.darkOrange,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();
});
