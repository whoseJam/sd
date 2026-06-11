import * as sd from "@/sd";

import { Dag } from "../lib/dag";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const BLOB_R = 42;

const nodes = [
  { id: 1, cx: 0, cy: 100, label: "" },
  { id: 2, cx: -220, cy: 0, label: "" },
  { id: 3, cx: 220, cy: 0, label: "" },
  { id: 4, cx: 0, cy: -100, label: "" },
];
const edges: Array<[number, number]> = [
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 4],
];

const dag = new Dag({ targetNode: svg, nodes, edges, radius: BLOB_R });

function makeTinyCycle(cx: number, cy: number, count: number) {
  const innerR = BLOB_R * 0.55;
  const dotR = 5;
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    const ang = -Math.PI / 2 + (i / count) * 2 * Math.PI;
    pts.push({
      x: cx + innerR * Math.cos(ang),
      y: cy + innerR * Math.sin(ang),
    });
  }
  const elems: sd.SDNode[] = [];
  for (let i = 0; i < count; i++) {
    elems.push(
      new sd.Circle({
        targetNode: svg,
        cx: pts[i].x,
        cy: pts[i].y,
        r: dotR,
        fill: C.darkButtonGrey,
        stroke: C.darkButtonGrey,
        strokeWidth: 0,
        opacity: 0,
      }),
    );
  }
  for (let i = 0; i < count; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % count];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    const ax = a.x + ux * dotR;
    const ay = a.y + uy * dotR;
    const bx = b.x - ux * dotR;
    const by = b.y - uy * dotR;
    elems.push(
      new sd.Path({
        targetNode: svg,
        d: `M ${ax} ${ay} L ${bx} ${by}`,
        stroke: C.darkButtonGrey,
        strokeWidth: 0.8,
        fill: "none",
        opacity: 0,
      }),
    );
  }
  return elems;
}

const tinies: sd.SDNode[] = [];
for (const n of nodes) tinies.push(...makeTinyCycle(n.cx, n.cy, 4));

sd.main(async () => {
  dag.fadeIn({ delay: 0 });
  for (let i = 0; i < tinies.length; i++) {
    tinies[i]
      .startAnimate({ delay: 100 + i * 10, duration: 260, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
  dag.setTag(1, "bel=4", C.darkOrange as sd.SDColor, { delay: 0 });
  dag.setTag(2, "bel=3", C.darkOrange as sd.SDColor, { delay: 120 });
  dag.setTag(3, "bel=2", C.darkOrange as sd.SDColor, { delay: 240 });
  dag.setTag(4, "bel=1", C.darkOrange as sd.SDColor, { delay: 360 });
  await sd.pause();
});
