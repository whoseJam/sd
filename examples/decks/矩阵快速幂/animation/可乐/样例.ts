import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// 3-node line graph 1 - 2 - 3 used as the running sample. Node 1 is
// highlighted as the robot's starting position.

const NEUTRAL = C.darkButtonGrey;
const START_HL = C.darkOrange;
const HL_BG = "#fdecd9";

const NODE_R = 16;
const NODES = [
  { x: -55, y: 0, label: "1" },
  { x: 0, y: 0, label: "2" },
  { x: 55, y: 0, label: "3" },
];

const edges: sd.Line[] = [];
for (let i = 0; i < NODES.length - 1; i++) {
  const a = NODES[i];
  const b = NODES[i + 1];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  edges.push(
    new sd.Line({
      targetNode: svg,
      x1: a.x + ux * NODE_R,
      y1: a.y + uy * NODE_R,
      x2: b.x - ux * NODE_R,
      y2: b.y - uy * NODE_R,
      stroke: NEUTRAL,
      strokeWidth: 1.4,
      opacity: 0,
    }),
  );
}

interface NodeVis {
  c: sd.Circle;
  t: sd.Text;
}
const nodes: NodeVis[] = NODES.map((n) => ({
  c: new sd.Circle({
    targetNode: svg,
    cx: n.x,
    cy: n.y,
    r: NODE_R,
    fill: C.white,
    stroke: NEUTRAL,
    strokeWidth: 1.4,
    opacity: 0,
  }),
  t: new sd.Text({
    targetNode: svg,
    text: n.label,
    cx: n.x,
    cy: n.y,
    fontSize: 15,
    fill: NEUTRAL,
    opacity: 0,
  }),
}));

const DUR = 280;
type AnyEl = sd.Circle | sd.Text | sd.Line;

function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  // Edges + nodes appear, then node 1 (the start) gets highlighted.
  for (let i = 0; i < nodes.length; i++) {
    fadeIn(nodes[i].c, i * 60);
    fadeIn(nodes[i].t, 50 + i * 60);
  }
  for (let i = 0; i < edges.length; i++) fadeIn(edges[i], 150 + i * 60);
  nodes[0].c
    .startAnimate({ delay: 400, duration: DUR, easing: E.easeOut })
    .setStroke(START_HL)
    .setStrokeWidth(2.2)
    .setFill(HL_BG)
    .endAnimate();
  nodes[0].t
    .startAnimate({ delay: 400, duration: DUR, easing: E.easeOut })
    .setFill(START_HL)
    .endAnimate();
  await sd.pause();
});
