import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -160, cy: 0, label: "1" },
  { id: 2, cx: 0, cy: 50, label: "2" },
  { id: 3, cx: 0, cy: -50, label: "3" },
  { id: 4, cx: 160, cy: 0, label: "4" },
];

const edges: Array<[number, number]> = [
  [1, 2], [1, 3], [2, 4], [3, 4],
];

const weights: Record<string, number> = {
  "1-2": 5, "1-3": 1, "2-4": 1, "3-4": 2,
};

const dag = new Dag({ targetNode: svg, nodes, edges, radius: 18 });

for (const [u, v] of edges) {
  const a = nodes.find((n) => n.id === u)!;
  const b = nodes.find((n) => n.id === v)!;
  new sd.Text({
    targetNode: svg, text: String(weights[`${u}-${v}`]),
    cx: (a.cx + b.cx) / 2, cy: (a.cy + b.cy) / 2 - 8,
    fontSize: 12, fill: C.darkButtonGrey,
  });
}

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  // Naive FIFO BFS from 1 with weights: pops 2 (dis=5) then 3 (dis=1).
  dag.paint(1, "#fdecd9", C.darkOrange);
  dag.setTag(1, "dis=0", C.darkOrange);
  await sd.pause();

  dag.paint(2, "#dbeefd", C.steelBlue);
  dag.setTag(2, "dis=5", C.steelBlue);
  dag.paint(3, "#dbeefd", C.steelBlue);
  dag.setTag(3, "dis=1", C.steelBlue);
  await sd.pause();

  // Pop 2 first (FIFO wrong order): would relax 4 with dis=6.
  dag.paint(4, "#fde9e9", "#d32f2f" as sd.SDColor);
  dag.setTag(4, "dis=6 ?", "#d32f2f" as sd.SDColor);
  await sd.pause();

  // Actual best via 3: dis=3.
  dag.setTag(4, "should be 3", C.darkGreen);
  await sd.pause();
});
