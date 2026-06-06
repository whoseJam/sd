import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export interface DNodeSpec {
  id: number;
  cx: number;
  cy: number;
}

// Shared 5-node directed graph for the SCC anims.
// DFS tree: 1 → 2 → {3, 4}, 4 → 5
// Back edges: 3 → 1, 5 → 4
// SCCs: {1, 2, 3} (via 3→1) and {4, 5} (via 5→4).
export const D_NODES: DNodeSpec[] = [
  { id: 1, cx: 0, cy: 110 },
  { id: 2, cx: 0, cy: 40 },
  { id: 3, cx: -90, cy: -30 },
  { id: 4, cx: 90, cy: -30 },
  { id: 5, cx: 90, cy: -100 },
];

export const D_TREE_EDGES: ReadonlyArray<readonly [number, number]> = [
  [1, 2],
  [2, 3],
  [2, 4],
  [4, 5],
];

export const D_BACK_EDGES: ReadonlyArray<readonly [number, number]> = [
  [3, 1],
  [5, 4],
];

export const D_DFS_ORDER = [1, 2, 3, 4, 5] as const;

export const D_RADIUS = 16;
export const D_NEUTRAL = C.silver;
export const D_TREE_COLOR = C.darkButtonGrey;
export const D_BACK_COLOR = C.darkOrange;

export function dnodeOf(id: number): DNodeSpec {
  return D_NODES.find((n) => n.id === id)!;
}

export function dedgeKey(u: number, v: number): string {
  return `${u}->${v}`;
}

export interface DEdge {
  line: sd.Line;
  head: sd.Path;
}

export interface DirectedView {
  treeEdges: Map<string, DEdge>;
  backEdges: Map<string, DEdge>; // neutral grey solid
  backDashed: Map<string, DEdge>; // orange dashed (crossfade overlay)
  circles: Map<number, sd.Circle>;
  labels: Map<number, sd.Text>;
}

function makeArrow(
  target: sd.Group,
  u: number,
  v: number,
  color: string,
  opts: { dashed?: boolean; width?: number } = {},
): DEdge {
  const a = dnodeOf(u);
  const b = dnodeOf(v);
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const sx = a.cx + ux * D_RADIUS;
  const sy = a.cy + uy * D_RADIUS;
  const ex = b.cx - ux * D_RADIUS;
  const ey = b.cy - uy * D_RADIUS;

  const line = new sd.Line({
    targetNode: target,
    x1: sx,
    y1: sy,
    x2: ex,
    y2: ey,
    stroke: color,
    strokeWidth: opts.width ?? 1.4,
    strokeDashArray: opts.dashed ? [5, 4] : undefined,
    opacity: 0,
  });

  const headLen = 7.5;
  const headHalf = 3.2;
  const px = -uy;
  const py = ux;
  const h1x = ex - ux * headLen + px * headHalf;
  const h1y = ey - uy * headLen + py * headHalf;
  const h2x = ex - ux * headLen - px * headHalf;
  const h2y = ey - uy * headLen - py * headHalf;
  const head = new sd.Path({
    targetNode: target,
    d: `M ${ex} ${ey} L ${h1x} ${h1y} L ${h2x} ${h2y} Z`,
    stroke: color,
    strokeWidth: 0.6,
    fill: color,
    opacity: 0,
  });

  return { line, head };
}

export function createDirectedGraph(target: sd.Group): DirectedView {
  const treeEdges = new Map<string, DEdge>();
  for (const [u, v] of D_TREE_EDGES) {
    treeEdges.set(dedgeKey(u, v), makeArrow(target, u, v, D_NEUTRAL));
  }
  const backEdges = new Map<string, DEdge>();
  const backDashed = new Map<string, DEdge>();
  for (const [u, v] of D_BACK_EDGES) {
    backEdges.set(dedgeKey(u, v), makeArrow(target, u, v, D_NEUTRAL));
    backDashed.set(
      dedgeKey(u, v),
      makeArrow(target, u, v, D_BACK_COLOR, { dashed: true, width: 1.6 }),
    );
  }
  const circles = new Map<number, sd.Circle>();
  const labels = new Map<number, sd.Text>();
  for (const n of D_NODES) {
    circles.set(
      n.id,
      new sd.Circle({
        targetNode: target,
        cx: n.cx,
        cy: n.cy,
        r: D_RADIUS,
        fill: C.white,
        stroke: C.darkButtonGrey,
        strokeWidth: 1.4,
        opacity: 0,
      }),
    );
    labels.set(
      n.id,
      new sd.Text({
        targetNode: target,
        text: String(n.id),
        cx: n.cx,
        cy: n.cy,
        fontSize: 13,
        fill: C.darkButtonGrey,
        opacity: 0,
      }),
    );
  }
  return { treeEdges, backEdges, backDashed, circles, labels };
}

function fadeEdge(
  edge: DEdge,
  opacity: number,
  opts: { delay?: number; duration?: number } = {},
): void {
  const delay = opts.delay ?? 0;
  const duration = opts.duration ?? 320;
  edge.line
    .startAnimate({ delay, duration, easing: E.easeOut })
    .setOpacity(opacity)
    .endAnimate();
  edge.head
    .startAnimate({ delay, duration, easing: E.easeOut })
    .setOpacity(opacity)
    .endAnimate();
}

export function fadeInDirectedNeutral(
  view: DirectedView,
  opts?: { delay?: number },
): void {
  const d0 = opts?.delay ?? 0;
  for (const edge of view.treeEdges.values()) fadeEdge(edge, 1, { delay: d0 });
  for (const edge of view.backEdges.values()) fadeEdge(edge, 1, { delay: d0 });
  let k = 0;
  for (const id of D_DFS_ORDER) {
    const d = d0 + 120 + k++ * 70;
    view.circles
      .get(id)!
      .startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    view.labels
      .get(id)!
      .startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
}

export function fadeInDirectedClassified(
  view: DirectedView,
  opts?: { delay?: number },
): void {
  const d0 = opts?.delay ?? 0;
  for (const edge of view.treeEdges.values()) {
    fadeEdge(edge, 1, { delay: d0 });
    edge.line
      .startAnimate({ delay: d0, duration: 320, easing: E.easeOut })
      .setStroke(D_TREE_COLOR)
      .setStrokeWidth(1.8)
      .endAnimate();
    edge.head
      .startAnimate({ delay: d0, duration: 320, easing: E.easeOut })
      .setStroke(D_TREE_COLOR)
      .setFill(D_TREE_COLOR)
      .endAnimate();
  }
  for (const edge of view.backDashed.values()) fadeEdge(edge, 1, { delay: d0 });
  let k = 0;
  for (const id of D_DFS_ORDER) {
    const d = d0 + 120 + k++ * 70;
    view.circles
      .get(id)!
      .startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    view.labels
      .get(id)!
      .startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
}

// Crossfade neutral back edges → orange-dashed back edges.
export function classifyBackEdges(
  view: DirectedView,
  opts?: { delay?: number; duration?: number },
): void {
  const delay = opts?.delay ?? 0;
  const duration = opts?.duration ?? 360;
  for (const edge of view.backEdges.values())
    fadeEdge(edge, 0, { delay, duration });
  for (const edge of view.backDashed.values())
    fadeEdge(edge, 1, { delay, duration });
}

export function colorTreeEdges(
  view: DirectedView,
  opts?: { delay?: number; duration?: number; stagger?: number },
): void {
  const d0 = opts?.delay ?? 0;
  const duration = opts?.duration ?? 320;
  const stagger = opts?.stagger ?? 180;
  let k = 0;
  for (const edge of view.treeEdges.values()) {
    const delay = d0 + k++ * stagger;
    edge.line
      .startAnimate({ delay, duration, easing: E.easeOut })
      .setStroke(D_TREE_COLOR)
      .setStrokeWidth(1.8)
      .endAnimate();
    edge.head
      .startAnimate({ delay, duration, easing: E.easeOut })
      .setStroke(D_TREE_COLOR)
      .setFill(D_TREE_COLOR)
      .endAnimate();
  }
}
