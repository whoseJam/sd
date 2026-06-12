import * as sd from "@/sd";

const C = sd.color();

export interface TrieLayout {
  rootCx: number;
  rootCy: number;
  layerH: number;
  leafSpan: number;
  bits: number;
  nodeR: number;
}

export function prefixCx(layout: TrieLayout, prefix: string): number {
  if (prefix === "") return layout.rootCx;
  const d = prefix.length;
  const p = parseInt(prefix, 2);
  const slots = 1 << d;
  const slotW = layout.leafSpan / slots;
  return layout.rootCx + (p + 0.5) * slotW - layout.leafSpan / 2;
}

export function prefixCy(layout: TrieLayout, depth: number): number {
  return layout.rootCy - depth * layout.layerH;
}

export function valueBits(value: number, bits: number): string {
  return value.toString(2).padStart(bits, "0");
}

export function pathPrefixes(value: number, bits: number): string[] {
  const bs = valueBits(value, bits);
  const out = [""];
  for (let i = 1; i <= bits; i++) out.push(bs.slice(0, i));
  return out;
}

export interface TrieNode {
  prefix: string;
  depth: number;
  cx: number;
  cy: number;
  circle: sd.Circle;
  edge?: sd.Line;
}

export interface TrieViz {
  group: sd.Group;
  layout: TrieLayout;
  nodes: Map<string, TrieNode>;
}

export function makeTrieViz(opts: {
  targetNode: sd.SDNode | sd.Group;
  layout: TrieLayout;
}): TrieViz {
  const group = new sd.Group({ targetNode: opts.targetNode });
  return { group, layout: opts.layout, nodes: new Map() };
}

export function addPath(
  viz: TrieViz,
  value: number,
  opts: { stroke?: string; fill?: string; opacity?: number } = {},
): TrieNode[] {
  const stroke = opts.stroke ?? C.darkButtonGrey;
  const fill = opts.fill ?? C.white;
  const initOpacity = opts.opacity ?? 0;
  const prefixes = pathPrefixes(value, viz.layout.bits);
  const out: TrieNode[] = [];
  for (let i = 0; i < prefixes.length; i++) {
    const prefix = prefixes[i];
    if (viz.nodes.has(prefix)) {
      out.push(viz.nodes.get(prefix)!);
      continue;
    }
    const cx = prefixCx(viz.layout, prefix);
    const cy = prefixCy(viz.layout, i);
    const circle = new sd.Circle({
      targetNode: viz.group,
      cx,
      cy,
      r: viz.layout.nodeR,
      fill,
      stroke,
      strokeWidth: 1,
      opacity: initOpacity,
    });
    let edge: sd.Line | undefined;
    if (i > 0) {
      const parentPrefix = prefixes[i - 1];
      const parent = viz.nodes.get(parentPrefix);
      if (parent) {
        edge = new sd.Line({
          targetNode: viz.group,
          x1: parent.cx,
          y1: parent.cy - viz.layout.nodeR,
          x2: cx,
          y2: cy + viz.layout.nodeR,
          stroke: C.silver,
          strokeWidth: 0.8,
          opacity: initOpacity,
        });
      }
    }
    const node: TrieNode = { prefix, depth: i, cx, cy, circle, edge };
    viz.nodes.set(prefix, node);
    out.push(node);
  }
  return out;
}

export function get(viz: TrieViz, prefix: string): TrieNode | undefined {
  return viz.nodes.get(prefix);
}
