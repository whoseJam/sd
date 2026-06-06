import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export interface NodeSpec {
  id: number;
  cx: number;
  cy: number;
}

// Shared 6-node graph used across all 无向图 Tarjan anims.
// Symmetric DFS tree: 1-2 as spine, 2 forks to 3 (left) and 5 (right),
// each with one descendant (4 under 3, 6 under 5). The lone back edge
// 2-4 cuts diagonally across the left subtree — visually it is the only
// element that breaks the tree's symmetry.
export const GRAPH_NODES: NodeSpec[] = [
  { id: 1, cx: 0, cy: 130 },
  { id: 2, cx: 0, cy: 60 },
  { id: 3, cx: -100, cy: -10 },
  { id: 4, cx: -100, cy: -80 },
  { id: 5, cx: 100, cy: -10 },
  { id: 6, cx: 100, cy: -80 },
];

export const TREE_EDGES: ReadonlyArray<readonly [number, number]> = [
  [1, 2],
  [2, 3],
  [3, 4],
  [2, 5],
  [5, 6],
];

export const BACK_EDGE: readonly [number, number] = [2, 4];

export const DFS_ORDER = [1, 2, 3, 4, 5, 6] as const;

export const NODE_RADIUS = 16;
export const NEUTRAL_COLOR = C.silver;
export const TREE_COLOR = C.darkButtonGrey;
export const BACK_COLOR = C.darkOrange;
export const DFN_COLOR = C.steelBlue;
export const LOW_COLOR = C.darkOrange;

export function nodeOf(id: number): NodeSpec {
  return GRAPH_NODES.find((n) => n.id === id)!;
}

export function edgeKey(u: number, v: number): string {
  return `${Math.min(u, v)}-${Math.max(u, v)}`;
}

export interface GraphView {
  treeLines: Map<string, sd.Line>;
  backLine: sd.Line;
  backDashed: sd.Line;
  circles: Map<number, sd.Circle>;
  labels: Map<number, sd.Text>;
}

export function createGraph(target: sd.Group): GraphView {
  const treeLines = new Map<string, sd.Line>();
  for (const [u, v] of TREE_EDGES) {
    const a = nodeOf(u);
    const b = nodeOf(v);
    treeLines.set(
      edgeKey(u, v),
      new sd.Line({
        targetNode: target,
        x1: a.cx,
        y1: a.cy,
        x2: b.cx,
        y2: b.cy,
        stroke: NEUTRAL_COLOR,
        strokeWidth: 1,
        opacity: 0,
      }),
    );
  }
  const ba = nodeOf(BACK_EDGE[0]);
  const bb = nodeOf(BACK_EDGE[1]);
  const backLine = new sd.Line({
    targetNode: target,
    x1: ba.cx,
    y1: ba.cy,
    x2: bb.cx,
    y2: bb.cy,
    stroke: NEUTRAL_COLOR,
    strokeWidth: 1,
    opacity: 0,
  });
  const backDashed = new sd.Line({
    targetNode: target,
    x1: ba.cx,
    y1: ba.cy,
    x2: bb.cx,
    y2: bb.cy,
    stroke: BACK_COLOR,
    strokeWidth: 1.6,
    strokeDashArray: [5, 4],
    opacity: 0,
  });
  const circles = new Map<number, sd.Circle>();
  const labels = new Map<number, sd.Text>();
  for (const n of GRAPH_NODES) {
    circles.set(
      n.id,
      new sd.Circle({
        targetNode: target,
        cx: n.cx,
        cy: n.cy,
        r: NODE_RADIUS,
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
  return { treeLines, backLine, backDashed, circles, labels };
}

// All nodes + all edges (back edge as plain grey solid).
export function fadeInNeutral(
  view: GraphView,
  opts?: { delay?: number },
): void {
  const d0 = opts?.delay ?? 0;
  for (const line of view.treeLines.values()) {
    line
      .startAnimate({ delay: d0, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  view.backLine
    .startAnimate({ delay: d0, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  let k = 0;
  for (const id of DFS_ORDER) {
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

// All nodes + tree edges already in dark grey + back edge as dashed orange.
// Use for anims downstream of 边分类 that should start from the "classified" state.
export function fadeInClassified(
  view: GraphView,
  opts?: { delay?: number },
): void {
  const d0 = opts?.delay ?? 0;
  for (const line of view.treeLines.values()) {
    line
      .startAnimate({ delay: d0, duration: 320, easing: E.easeOut })
      .setStroke(TREE_COLOR)
      .setStrokeWidth(1.8)
      .setOpacity(1)
      .endAnimate();
  }
  view.backDashed
    .startAnimate({ delay: d0, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  let k = 0;
  for (const id of DFS_ORDER) {
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
