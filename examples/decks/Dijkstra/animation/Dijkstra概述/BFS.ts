import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -200, cy: 0 },
  { id: 2, cx: -80, cy: 80 },
  { id: 3, cx: -80, cy: -80 },
  { id: 4, cx: 60, cy: 80 },
  { id: 5, cx: 60, cy: -80 },
  { id: 6, cx: 200, cy: 0 },
];

const edges: Array<[number, number]> = [
  [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 6], [2, 5],
];

const dag = new Dag({
  targetNode: svg, nodes, edges, radius: 18,
});

// All weights 1; BFS layer distances.
const dist: Record<number, number> = {};
const layers: number[][] = [[1]];
dist[1] = 0;
{
  const seen = new Set<number>([1]);
  let frontier = [1];
  while (frontier.length > 0) {
    const next: number[] = [];
    for (const u of frontier) {
      for (const [a, b] of edges) {
        if (a === u && !seen.has(b)) {
          dist[b] = dist[u] + 1;
          seen.add(b);
          next.push(b);
        }
      }
    }
    if (next.length > 0) layers.push(next);
    frontier = next;
  }
}

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  for (let L = 0; L < layers.length; L++) {
    for (const id of layers[L]) {
      const tone = L === 0 ? "#fdecd9" : "#dbeefd";
      const color = L === 0 ? C.darkOrange : C.steelBlue;
      dag.paint(id, tone, color);
      dag.setTag(id, `dis=${dist[id]}`, color);
    }
    await sd.pause();
  }
});
