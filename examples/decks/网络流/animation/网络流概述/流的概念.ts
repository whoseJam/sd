import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NODE_R = 18;
const ARROW_HEAD = 8;

interface Node {
  id: string;
  x: number;
  y: number;
}
const NODES: Node[] = [
  { id: "s", x: -100, y: 0 },
  { id: "a", x: 0, y: 60 },
  { id: "b", x: 0, y: -60 },
  { id: "t", x: 100, y: 0 },
];

const nodeOf = (id: string) => NODES.find((n) => n.id === id)!;

interface Edge {
  from: string;
  to: string;
  cap: number;
  flow: number;
}
// A max flow of 4 with caps below: s-a-t=2 + s-b-t=2.
const EDGES: Edge[] = [
  { from: "s", to: "a", cap: 3, flow: 2 },
  { from: "s", to: "b", cap: 2, flow: 2 },
  { from: "a", to: "t", cap: 3, flow: 2 },
  { from: "b", to: "t", cap: 2, flow: 2 },
];

function makeArrow(from: string, to: string): { line: sd.Line; head: sd.Path } {
  const a = nodeOf(from);
  const b = nodeOf(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const ux = dx / dist;
  const uy = dy / dist;
  const sx = a.x + ux * NODE_R;
  const sy = a.y + uy * NODE_R;
  const ex = b.x - ux * NODE_R;
  const ey = b.y - uy * NODE_R;
  const px = -uy;
  const py = ux;
  const hL = ARROW_HEAD;
  const hHalf = 3.5;
  const h1x = ex - ux * hL + px * hHalf;
  const h1y = ey - uy * hL + py * hHalf;
  const h2x = ex - ux * hL - px * hHalf;
  const h2y = ey - uy * hL - py * hHalf;
  const line = new sd.Line({
    targetNode: svg,
    x1: sx,
    y1: sy,
    x2: ex,
    y2: ey,
    stroke: C.silver,
    strokeWidth: 1.4,
    opacity: 0,
  });
  const head = new sd.Path({
    targetNode: svg,
    d: `M ${ex} ${ey} L ${h1x} ${h1y} L ${h2x} ${h2y} Z`,
    stroke: C.silver,
    fill: C.silver,
    opacity: 0,
  });
  return { line, head };
}

// Build edges (arrows) before nodes so nodes render on top.
const arrows = EDGES.map((e) => ({ ...e, arrow: makeArrow(e.from, e.to) }));

// Labels at edge midpoint, offset perpendicular so they don't sit on the line.
const labels = arrows.map(({ from, to, cap }) => {
  const a = nodeOf(from);
  const b = nodeOf(to);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const ux = -dy / dist;
  const uy = dx / dist;
  const off = 14;
  return new sd.Text({
    targetNode: svg,
    text: `${cap}`,
    cx: mx + ux * off,
    cy: my + uy * off - 1,
    fontSize: 11,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
});

// Nodes (circles + labels).
const circles = NODES.map(
  (n) =>
    new sd.Circle({
      targetNode: svg,
      cx: n.x,
      cy: n.y,
      r: NODE_R,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.4,
      opacity: 0,
    }),
);
const nodeLabels = NODES.map(
  (n) =>
    new sd.Text({
      targetNode: svg,
      text: n.id,
      cx: n.x,
      cy: n.y - 1,
      fontSize: 13,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
);

const FLOW_COLOR = C.steelBlue;

sd.main(async () => {
  // p1: graph + capacity labels appear
  for (let i = 0; i < arrows.length; i++) {
    const { arrow } = arrows[i];
    const d = i * 80;
    arrow.line
      .startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    arrow.head
      .startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    labels[i]
      .startAnimate({ delay: d + 120, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  for (let i = 0; i < NODES.length; i++) {
    const d = i * 60;
    circles[i]
      .startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    nodeLabels[i]
      .startAnimate({ delay: d + 60, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  // p2: assign a valid flow; labels become "f/c" and edges color blue.
  for (let i = 0; i < arrows.length; i++) {
    const { flow, cap, arrow } = arrows[i];
    const d = i * 150;
    arrow.line
      .startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setStroke(FLOW_COLOR)
      .setStrokeWidth(2.2)
      .endAnimate();
    arrow.head
      .startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setStroke(FLOW_COLOR)
      .setFill(FLOW_COLOR)
      .endAnimate();
    labels[i]
      .startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setText(`${flow}/${cap}`)
      .setFill(FLOW_COLOR)
      .endAnimate();
  }
  await sd.pause();
});
