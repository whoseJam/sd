import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -160, cy: 80 },
  { id: 2, cx: 0, cy: 80 },
  { id: 3, cx: 160, cy: 80 },
  { id: 4, cx: 0, cy: -10 },
  { id: 5, cx: -80, cy: -100 },
  { id: 6, cx: 80, cy: -100 },
];

const edges: Array<[number, number]> = [
  [1, 4], [2, 4], [3, 4], [4, 5], [4, 6],
];

const dag = new Dag({
  targetNode: svg, nodes, edges, radius: 18,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  dag.paint(4, "#dbeefd", C.steelBlue);
  for (const u of [1, 2, 3]) dag.paintEdge(u, 4, C.steelBlue);
  dag.setTag(4, "ind(4) = 3", C.steelBlue);
  await sd.pause();

  for (const v of [5, 6]) dag.paintEdge(4, v, C.darkOrange);
  dag.setTag(4, "oud(4) = 2", C.darkOrange);
  await sd.pause();
});
