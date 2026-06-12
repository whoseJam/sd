import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NODE_R = 18;

interface Node {
  id: number;
  cx: number;
  cy: number;
}

const nodes: Node[] = [
  { id: 1, cx: -180, cy: 0 },
  { id: 2, cx: -75, cy: 50 },
  { id: 3, cx: -75, cy: -50 },
  { id: 4, cx: 60, cy: 0 },
  { id: 5, cx: 170, cy: 0 },
];

const idMap = new Map(nodes.map((n) => [n.id, n]));

const edges: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [4, 5],
];

const matchedEdges: Set<string> = new Set(["1-2", "2-4", "4-5"]);
const edgeKey = (u: number, v: number) => `${u}-${v}`;

interface ArrowHandle {
  line: sd.Path;
  head: sd.Path;
}

function makeArrow(u: number, v: number): ArrowHandle {
  const a = idMap.get(u)!;
  const b = idMap.get(v)!;
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const ax = a.cx + ux * NODE_R;
  const ay = a.cy + uy * NODE_R;
  const bx = b.cx - ux * NODE_R;
  const by = b.cy - uy * NODE_R;
  const line = new sd.Path({
    targetNode: svg,
    d: `M ${ax} ${ay} L ${bx} ${by}`,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.3,
    fill: "none",
    opacity: 0,
  });
  const hs = 7;
  const px = -uy;
  const py = ux;
  const h1x = bx - ux * hs + px * (hs / 2);
  const h1y = by - uy * hs + py * (hs / 2);
  const h2x = bx - ux * hs - px * (hs / 2);
  const h2y = by - uy * hs - py * (hs / 2);
  const head = new sd.Path({
    targetNode: svg,
    d: `M ${bx} ${by} L ${h1x} ${h1y} L ${h2x} ${h2y} Z`,
    stroke: C.darkButtonGrey,
    fill: C.darkButtonGrey,
    strokeWidth: 1,
    opacity: 0,
  });
  return { line, head };
}

const arrows: Map<string, ArrowHandle> = new Map();
for (const [u, v] of edges) arrows.set(edgeKey(u, v), makeArrow(u, v));

interface NodeHandle {
  circle: sd.Circle;
  label: sd.Text;
}

const nodeHandles: NodeHandle[] = nodes.map((n) => ({
  circle: new sd.Circle({
    targetNode: svg,
    cx: n.cx,
    cy: n.cy,
    r: NODE_R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
    opacity: 0,
  }),
  label: new sd.Text({
    targetNode: svg,
    text: String(n.id),
    cx: n.cx,
    cy: n.cy,
    fontSize: 13,
    fill: C.darkButtonGrey,
    opacity: 0,
  }),
}));

const PATH1_NODES = new Set([1, 2, 4, 5]);
const PATH2_NODES = new Set([3]);
const PATH1_FILL = "#d6e7f2";
const PATH1_STROKE = C.steelBlue;
const PATH2_FILL = "#dff0d8";
const PATH2_STROKE = C.darkGreen;

const matchedCaption = new sd.Math({
  targetNode: svg,
  text: "|M| = 3",
  cx: 0,
  cy: -100,
  fontSize: 14,
  fill: C.darkOrange,
  opacity: 0,
});
const resultCaption = new sd.Math({
  targetNode: svg,
  text: "\\text{paths} = n - |M| = 5 - 3 = 2",
  cx: 0,
  cy: -128,
  fontSize: 14,
  fill: C.darkButtonGrey,
  opacity: 0,
});

function fade(el: sd.SDNode, delay: number, dur = 260) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function paintArrow(u: number, v: number, color: string, delay: number) {
  const a = arrows.get(edgeKey(u, v))!;
  a.line
    .startAnimate({ delay, duration: 280, easing: E.easeOut })
    .setStroke(color)
    .setStrokeWidth(2.4)
    .endAnimate();
  a.head
    .startAnimate({ delay, duration: 280, easing: E.easeOut })
    .setFill(color)
    .setStroke(color)
    .endAnimate();
}

function paintNode(idx: number, fill: string, stroke: string, delay: number) {
  nodeHandles[idx].circle
    .startAnimate({ delay, duration: 280, easing: E.easeOut })
    .setFill(fill)
    .setStroke(stroke)
    .setStrokeWidth(2.2)
    .endAnimate();
}

sd.main(async () => {
  for (const a of arrows.values()) {
    fade(a.line, 0);
    fade(a.head, 60);
  }
  for (let i = 0; i < nodeHandles.length; i++) {
    fade(nodeHandles[i].circle, 200 + i * 50);
    fade(nodeHandles[i].label, 260 + i * 50);
  }
  await sd.pause();

  let d = 0;
  for (const [u, v] of edges) {
    if (matchedEdges.has(edgeKey(u, v))) {
      paintArrow(u, v, C.darkOrange, d);
      d += 160;
    }
  }
  fade(matchedCaption, d + 60);
  await sd.pause();

  for (let i = 0; i < nodes.length; i++) {
    if (PATH1_NODES.has(nodes[i].id))
      paintNode(i, PATH1_FILL, PATH1_STROKE, i * 80);
    else if (PATH2_NODES.has(nodes[i].id))
      paintNode(i, PATH2_FILL, PATH2_STROKE, i * 80);
  }
  fade(resultCaption, nodes.length * 80 + 80);
  await sd.pause();
});
