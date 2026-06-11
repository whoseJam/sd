import * as sd from "@/sd";

import { Dag } from "../common/dag";

const svg = sd.svg();

const nodes = [
  { id: 1, cx: -60, cy: 0, label: "u" },
  { id: 2, cx: 60, cy: 0, label: "v" },
];
const edges: Array<[number, number]> = [[1, 2]];
const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 22,
  mathLabel: true,
  fontSize: 16,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();
});
