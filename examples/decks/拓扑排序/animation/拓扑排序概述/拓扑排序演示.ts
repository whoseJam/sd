import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -180, cy: 80 },
  { id: 2, cx: -60, cy: 80 },
  { id: 3, cx: 60, cy: 80 },
  { id: 4, cx: -120, cy: -10 },
  { id: 5, cx: 0, cy: -10 },
  { id: 6, cx: 120, cy: -10 },
];

const edges: Array<[number, number]> = [
  [1, 4], [2, 4], [2, 5], [3, 5], [3, 6], [4, 5], [5, 6],
];

const dag = new Dag({
  targetNode: svg, nodes, edges, radius: 18,
});

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  // Kahn's algorithm: peel off in-degree-0 one at a time.
  const alive = new Set<number>(nodes.map((n) => n.id));
  const order: number[] = [];
  while (alive.size > 0) {
    // Find any in-degree-0 vertex.
    let pick: number | undefined;
    for (const id of alive) {
      if (dag.inDegree(id, alive) === 0) { pick = id; break; }
    }
    if (pick === undefined) break;
    order.push(pick);
    dag.paint(pick, "#e8f5e9", C.darkGreen);
    dag.setTag(pick, `${order.length}`, C.darkGreen);
    for (const v of dag.outNeighbors(pick)) {
      if (alive.has(v)) dag.fadeEdge(pick, v, 0.2);
    }
    dag.fadeNode(pick, 0.35);
    alive.delete(pick);
    await sd.pause();
  }
});
