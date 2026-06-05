import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -80, cy: 0, label: "Y_i" },
  { id: 2, cx: 80, cy: 0, label: "N_i" },
];
const edges: Array<[number, number]> = [[1, 2], [2, 1]];
const dag = new Dag({ targetNode: svg, nodes, edges, radius: 24 });

new sd.Text({
  targetNode: svg,
  text: "Y_i ↔ N_i 同一 SCC → 无解",
  cx: 0, cy: -60, fontSize: 13, fill: "#d32f2f" as sd.SDColor,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();
});
