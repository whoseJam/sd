import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Reduce "bomb / walk-edge / stay-put" to a single "walk one edge":
//   p1 — original undirected 3-node graph
//   p2 — add virtual node B with directed edges u→B (bomb becomes
//        "walk to B")
//   p3 — add self loops u→u on every original node (staying put becomes
//        "walk the self loop")

const NEUTRAL = C.darkButtonGrey;
const BOMB = "#d34d2e";
const LOOP_HL = C.darkOrange;

const NODE_R = 12;
const LOOP_R = 22;

// Original nodes in the middle. B sits ABOVE so its bomb edges fan
// upward, leaving the area below each node clear for self loops.
const NODES = [
  { x: -70, y: -5 },
  { x: 0, y: -5 },
  { x: 70, y: -5 },
];
const B_POS = { x: 0, y: 65 };

interface NodeVis {
  c: sd.Circle;
  t: sd.Text;
}
function makeNode(label: string, x: number, y: number): NodeVis {
  return {
    c: new sd.Circle({
      targetNode: svg,
      cx: x,
      cy: y,
      r: NODE_R,
      fill: C.white,
      stroke: NEUTRAL,
      strokeWidth: 1.4,
      opacity: 0,
    }),
    t: new sd.Text({
      targetNode: svg,
      text: label,
      cx: x,
      cy: y,
      fontSize: 13,
      fill: NEUTRAL,
      opacity: 0,
    }),
  };
}

function makeUndirectedEdge(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
): sd.Line {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return new sd.Line({
    targetNode: svg,
    x1: p1.x + ux * NODE_R,
    y1: p1.y + uy * NODE_R,
    x2: p2.x - ux * NODE_R,
    y2: p2.y - uy * NODE_R,
    stroke: NEUTRAL,
    strokeWidth: 1.2,
    opacity: 0,
  });
}

interface DirEdge {
  line: sd.Line;
  arrow: sd.Path;
}
function makeDirectedEdge(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  color: string,
): DirEdge {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = p1.x + ux * NODE_R;
  const sy = p1.y + uy * NODE_R;
  const ex = p2.x - ux * (NODE_R + 1);
  const ey = p2.y - uy * (NODE_R + 1);
  const aSize = 4.5;
  const px = -uy;
  const py = ux;
  const a1x = ex - ux * aSize + px * aSize * 0.5;
  const a1y = ey - uy * aSize + py * aSize * 0.5;
  const a2x = ex - ux * aSize - px * aSize * 0.5;
  const a2y = ey - uy * aSize - py * aSize * 0.5;
  return {
    line: new sd.Line({
      targetNode: svg,
      x1: sx,
      y1: sy,
      x2: ex - ux * aSize,
      y2: ey - uy * aSize,
      stroke: color,
      strokeWidth: 1.2,
      opacity: 0,
    }),
    arrow: new sd.Path({
      targetNode: svg,
      d: `M ${ex} ${ey} L ${a1x} ${a1y} L ${a2x} ${a2y} Z`,
      stroke: color,
      fill: color,
      opacity: 0,
    }),
  };
}

function makeSelfLoop(n: { x: number; y: number }): sd.Path {
  // Loop sits BELOW the node, anchored INTO the node: loop top edge
  // coincides with the node's center. Half of the loop ends up hidden
  // behind the node — that's why these are created first (lowest
  // SVG z-order).
  const lcx = n.x;
  const lcy = n.y - LOOP_R;
  const startX = lcx - LOOP_R;
  return new sd.Path({
    targetNode: svg,
    d:
      `M ${startX} ${lcy} ` +
      `A ${LOOP_R} ${LOOP_R} 0 1 1 ${lcx + LOOP_R} ${lcy} ` +
      `A ${LOOP_R} ${LOOP_R} 0 1 1 ${startX} ${lcy}`,
    stroke: LOOP_HL,
    strokeWidth: 1.6,
    fill: "none",
    opacity: 0,
  });
}

// === Creation order matters for z-order: earlier = lower layer ===
const selfLoops = NODES.map(makeSelfLoop);
const origEdges = [
  makeUndirectedEdge(NODES[0], NODES[1]),
  makeUndirectedEdge(NODES[1], NODES[2]),
];
const bombEdges = NODES.map((n) => makeDirectedEdge(n, B_POS, BOMB));
const nodes = NODES.map((n, i) => makeNode(String(i + 1), n.x, n.y));
const bNode = makeNode("B", B_POS.x, B_POS.y);

const DUR = 280;
type AnyEl = sd.Circle | sd.Text | sd.Line | sd.Path;

function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  // p1: original undirected 3-node graph.
  for (let i = 0; i < nodes.length; i++) {
    fadeIn(nodes[i].c, i * 60);
    fadeIn(nodes[i].t, 50 + i * 60);
  }
  for (let i = 0; i < origEdges.length; i++) {
    fadeIn(origEdges[i], 250 + i * 60);
  }
  await sd.pause();

  // p2: virtual node B + bomb edges from each original node.
  fadeIn(bNode.c);
  fadeIn(bNode.t, 80);
  for (let i = 0; i < bombEdges.length; i++) {
    fadeIn(bombEdges[i].line, 250 + i * 80);
    fadeIn(bombEdges[i].arrow, 280 + i * 80);
  }
  await sd.pause();

  // p3: self loops on every original node.
  for (let i = 0; i < selfLoops.length; i++) {
    fadeIn(selfLoops[i], i * 100);
  }
  await sd.pause();
});
