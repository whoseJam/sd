import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const nodes = [
  { id: 1, cx: -180, cy: 80 },
  { id: 2, cx: -60, cy: 80 },
  { id: 3, cx: 60, cy: 80 },
  { id: 4, cx: -120, cy: -10 },
  { id: 5, cx: 0, cy: -10 },
  { id: 6, cx: 120, cy: -10 },
];

const edges: Array<[number, number]> = [
  [1, 4],
  [2, 4],
  [2, 5],
  [3, 5],
  [3, 6],
  [4, 5],
  [5, 6],
];

const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 18,
});

const SIZE = 30;
const Y = -100;
const seqGroup = new sd.Group({ targetNode: svg });

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  const alive = new Set<number>(nodes.map((n) => n.id));
  const order: number[] = [];
  const X0 = -(nodes.length * SIZE) / 2;
  let i = 0;
  while (alive.size > 0) {
    let pick: number | undefined;
    for (const id of alive) {
      if (dag.inDegree(id, alive) === 0) {
        pick = id;
        break;
      }
    }
    if (pick === undefined) break;
    order.push(pick);
    dag.paint(pick, "#e8f5e9", C.darkGreen);

    const r = new sd.Rect({
      targetNode: seqGroup,
      x: X0 + i * SIZE,
      y: Y - SIZE / 2,
      width: SIZE,
      height: SIZE,
      fill: "#e8f5e9",
      stroke: C.darkGreen,
      strokeWidth: 1.4,
      opacity: 0,
    });
    const t = new sd.Text({
      targetNode: seqGroup,
      text: String(pick),
      cx: X0 + (i + 0.5) * SIZE,
      cy: Y,
      fontSize: 14,
      fill: C.darkButtonGrey,
      opacity: 0,
    });
    r.startAnimate({ duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    t.startAnimate({ delay: 80, duration: 200, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();

    for (const v of dag.outNeighbors(pick)) {
      if (alive.has(v)) dag.fadeEdge(pick, v, 0.2);
    }
    dag.fadeNode(pick, 0.35);
    alive.delete(pick);
    i++;
    await sd.pause();
  }
});
