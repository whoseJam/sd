import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -120, cy: 0, label: "i" },
  { id: 2, cx: 120, cy: 0, label: "j" },
];

const edges: Array<[number, number]> = [[1, 2]];

const dag = new Dag({ targetNode: svg, nodes, edges, radius: 22 });

new sd.Math({
  targetNode: svg, text: "k",
  cx: 0, cy: -16, fontSize: 14, fill: C.darkButtonGrey,
});

new sd.Math({
  targetNode: svg, text: "x_j \\le x_i + k",
  cx: 0, cy: 60, fontSize: 16, fill: C.darkOrange,
});
new sd.Math({
  targetNode: svg, text: "dis_j \\le dis_i + w(i, j)",
  cx: 0, cy: 90, fontSize: 14, fill: C.steelBlue,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();
});
