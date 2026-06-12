import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const nodes = [
  { id: 1, cx: 0, cy: 90, label: "祖" },
  { id: 2, cx: -120, cy: 20, label: "父" },
  { id: 3, cx: 120, cy: 20, label: "叔" },
  { id: 4, cx: -180, cy: -60, label: "兄" },
  { id: 5, cx: -60, cy: -60, label: "我" },
  { id: 6, cx: 60, cy: -60, label: "弟" },
  { id: 7, cx: 180, cy: -60, label: "妹" },
];

const edges: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 6],
  [3, 7],
];

const dag = new Dag({
  targetNode: svg,
  nodes,
  edges,
  radius: 22,
  fontSize: 13,
});

const SIZE = 34;
const seqGroup = new sd.Group({ targetNode: svg });

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  await sd.pause();

  const alive = new Set<number>(nodes.map((n) => n.id));
  const order: number[] = [];
  const X0 = -(nodes.length * SIZE) / 2;
  const Y = -150;
  let i = 0;
  while (alive.size > 0) {
    let pick: number | undefined;
    for (const id of [1, 2, 3, 4, 5, 6, 7]) {
      if (alive.has(id) && dag.inDegree(id, alive) === 0) {
        pick = id;
        break;
      }
    }
    if (pick === undefined) break;
    order.push(pick);
    const node = nodes.find((n) => n.id === pick)!;
    dag.paint(pick, "#fdecd9", C.darkOrange);

    const r = new sd.Rect({
      targetNode: seqGroup,
      x: X0 + i * SIZE,
      y: Y - SIZE / 2,
      width: SIZE,
      height: SIZE,
      fill: "#fdecd9",
      stroke: C.darkOrange,
      strokeWidth: 1.4,
      opacity: 0,
    });
    const t = new sd.Text({
      targetNode: seqGroup,
      text: node.label!,
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
      if (alive.has(v)) dag.fadeEdge(pick, v, 0.25);
    }
    dag.fadeNode(pick, 0.35);
    alive.delete(pick);
    i++;
    await sd.pause();
  }
});
