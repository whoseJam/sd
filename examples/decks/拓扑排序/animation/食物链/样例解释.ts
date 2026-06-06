import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -180, cy: 80, label: "草" },
  { id: 2, cx: -180, cy: -40, label: "树" },
  { id: 3, cx: -40, cy: 80, label: "兔" },
  { id: 4, cx: -40, cy: -40, label: "鼠" },
  { id: 5, cx: 100, cy: 30, label: "蛇" },
  { id: 6, cx: 220, cy: 30, label: "鹰" },
];

const edges: Array<[number, number]> = [
  [1, 3],
  [1, 4],
  [2, 4],
  [3, 5],
  [4, 5],
  [3, 6],
  [5, 6],
];

const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 22,
  fontSize: 13,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  // Highlight in-degree-0 (源) and out-degree-0 (汇).
  dag.paint(1, "#dbeefd", C.steelBlue);
  dag.paint(2, "#dbeefd", C.steelBlue);
  dag.setTag(1, "ind=0", C.steelBlue);
  dag.setTag(2, "ind=0", C.steelBlue);
  dag.paint(6, "#fdecd9", C.darkOrange);
  dag.setTag(6, "oud=0", C.darkOrange);
  await sd.pause();
});
