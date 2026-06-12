import * as sd from "@/sd";

const C = sd.color();

export interface SegLayout {
  rootCx: number;
  rootCy: number;
  layerH: number;
  leafGap: number;
  nodeW: number;
  nodeH: number;
}

export interface SegRange {
  l: number;
  r: number;
}

export interface SegNodePos extends SegRange {
  depth: number;
  cx: number;
  cy: number;
}

export interface SegTreeOpts {
  targetNode: sd.SDNode | sd.Group;
  n: number;
  layout: SegLayout;
  values?: Array<string | number | undefined>;
  fill?: string;
  stroke?: string;
  textFill?: string;
  fontSize?: number;
  visible?: (r: SegRange) => boolean;
  initiallyHidden?: boolean;
}

function leafX(layout: SegLayout, pos: number, n: number): number {
  return layout.rootCx + (pos - (n + 1) / 2) * layout.leafGap;
}

export function nodePos(
  layout: SegLayout,
  l: number,
  r: number,
  n: number,
  depth: number,
): SegNodePos {
  return {
    l,
    r,
    depth,
    cx: (leafX(layout, l, n) + leafX(layout, r, n)) / 2,
    cy: layout.rootCy - depth * layout.layerH,
  };
}

export function enumerate(n: number, layout: SegLayout): SegNodePos[] {
  const out: SegNodePos[] = [];
  function go(l: number, r: number, d: number) {
    out.push(nodePos(layout, l, r, n, d));
    if (l === r) return;
    const m = (l + r) >> 1;
    go(l, m, d + 1);
    go(m + 1, r, d + 1);
  }
  go(1, n, 0);
  return out;
}

export function pathTo(n: number, pos: number): SegRange[] {
  const out: SegRange[] = [];
  function go(l: number, r: number) {
    out.push({ l, r });
    if (l === r) return;
    const m = (l + r) >> 1;
    if (pos <= m) go(l, m);
    else go(m + 1, r);
  }
  go(1, n);
  return out;
}

export function sibling(n: number, pos: number): SegRange[] {
  const out: SegRange[] = [];
  function go(l: number, r: number) {
    if (l === r) return;
    const m = (l + r) >> 1;
    if (pos <= m) {
      out.push({ l: m + 1, r });
      go(l, m);
    } else {
      out.push({ l, r: m });
      go(m + 1, r);
    }
  }
  go(1, n);
  return out;
}

export interface SegViz {
  group: sd.Group;
  rect: Map<string, sd.Rect>;
  text: Map<string, sd.Text>;
  edge: Map<string, sd.Line>;
  nodes: SegNodePos[];
  layout: SegLayout;
  n: number;
}

function key(l: number, r: number): string {
  return `${l},${r}`;
}

function edgeKey(a: SegRange, b: SegRange): string {
  return `${key(a.l, a.r)}->${key(b.l, b.r)}`;
}

export function makeSegViz(opts: SegTreeOpts): SegViz {
  const group = new sd.Group({ targetNode: opts.targetNode });
  const { n, layout } = opts;
  const fill = opts.fill ?? C.white;
  const stroke = opts.stroke ?? C.darkButtonGrey;
  const textFill = opts.textFill ?? C.darkButtonGrey;
  const fontSize = opts.fontSize ?? 10;
  const visible = opts.visible ?? (() => true);
  const initOpacity = opts.initiallyHidden ? 0 : 1;
  const allNodes = enumerate(n, layout);
  const visibleNodes = allNodes.filter(visible);
  const rectMap = new Map<string, sd.Rect>();
  const textMap = new Map<string, sd.Text>();
  const edgeMap = new Map<string, sd.Line>();
  for (const node of visibleNodes) {
    function makeEdge(child: SegRange) {
      const childPos = nodePos(layout, child.l, child.r, n, node.depth + 1);
      const k = edgeKey(node, child);
      const line = new sd.Line({
        targetNode: group,
        x1: node.cx,
        y1: node.cy - layout.nodeH / 2,
        x2: childPos.cx,
        y2: childPos.cy + layout.nodeH / 2,
        stroke: C.silver,
        strokeWidth: 0.8,
        opacity: initOpacity,
      });
      edgeMap.set(k, line);
    }
    if (node.l !== node.r) {
      const m = (node.l + node.r) >> 1;
      const left = { l: node.l, r: m };
      const right = { l: m + 1, r: node.r };
      if (visible(left)) makeEdge(left);
      if (visible(right)) makeEdge(right);
    }
  }
  for (const node of visibleNodes) {
    const k = key(node.l, node.r);
    rectMap.set(
      k,
      new sd.Rect({
        targetNode: group,
        x: node.cx - layout.nodeW / 2,
        y: node.cy - layout.nodeH / 2,
        width: layout.nodeW,
        height: layout.nodeH,
        fill,
        stroke,
        strokeWidth: 1,
        rx: 3,
        ry: 3,
        opacity: initOpacity,
      }),
    );
    let labelText = "";
    if (opts.values && node.l === node.r) {
      const v = opts.values[node.l - 1];
      if (v !== undefined) labelText = String(v);
    } else if (!opts.values) {
      labelText = node.l === node.r ? `${node.l}` : `${node.l}-${node.r}`;
    }
    textMap.set(
      k,
      new sd.Text({
        targetNode: group,
        text: labelText,
        cx: node.cx,
        cy: node.cy - 1,
        fontSize,
        fill: textFill,
        opacity: initOpacity,
      }),
    );
  }
  return {
    group,
    rect: rectMap,
    text: textMap,
    edge: edgeMap,
    nodes: visibleNodes,
    layout,
    n,
  };
}

export function rectAt(viz: SegViz, l: number, r: number): sd.Rect | undefined {
  return viz.rect.get(key(l, r));
}
export function textAt(viz: SegViz, l: number, r: number): sd.Text | undefined {
  return viz.text.get(key(l, r));
}
export function edgeAt(
  viz: SegViz,
  parent: SegRange,
  child: SegRange,
): sd.Line | undefined {
  return viz.edge.get(edgeKey(parent, child));
}

export function centerOf(
  viz: SegViz,
  l: number,
  r: number,
): { cx: number; cy: number } | undefined {
  const node = viz.nodes.find((n) => n.l === l && n.r === r);
  if (!node) return undefined;
  return { cx: node.cx, cy: node.cy };
}
