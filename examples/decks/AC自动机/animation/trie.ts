import * as sd from "@/sd";

// Multi-pattern Trie with AC-style fail links. Top-down layout (root at
// math-y top, depth grows downward). nodes 0..N-1 with parent[i] and
// edgeChar[i]; fail[i] is filled in by buildFail().

const C = sd.color();
const E = sd.easing();

export interface TrieOpts {
  targetNode?: sd.Group;
  patterns: ReadonlyArray<string>;
  /** Math-y top center of the layout. */
  cx?: number;
  topY?: number;
  layerHeight?: number;
  nodeRadius?: number;
  siblingGap?: number;
  nodeFill?: sd.SDColor;
  nodeStroke?: sd.SDColor;
  edgeStroke?: sd.SDColor;
}

export interface TrieNode {
  id: number;
  parent: number;
  edgeChar: string;
  depth: number;
  prefix: string;
  cx: number;
  cy: number;
  isEnd: boolean;
  circle: sd.Circle;
  charText: sd.Text;
  edgeLine?: sd.Line;
}

export class Trie {
  readonly group: sd.Group;
  readonly nodes: TrieNode[] = [];
  readonly children: Map<number, Map<string, number>> = new Map();
  readonly fail: number[] = [];
  readonly layerHeight: number;
  readonly nodeRadius: number;

  constructor(svg: sd.Group, opts: TrieOpts) {
    this.layerHeight = opts.layerHeight ?? 70;
    this.nodeRadius = opts.nodeRadius ?? 16;
    this.group = new sd.Group({ targetNode: svg });

    const siblingGap = opts.siblingGap ?? 50;
    const nodeFill = opts.nodeFill ?? C.white;
    const nodeStroke = opts.nodeStroke ?? C.darkButtonGrey;
    const edgeStroke = opts.edgeStroke ?? C.silver;

    this.children.set(0, new Map());
    this.nodes.push({
      id: 0,
      parent: -1,
      edgeChar: "",
      depth: 0,
      prefix: "",
      cx: 0,
      cy: 0,
      isEnd: false,
      circle: undefined as unknown as sd.Circle,
      charText: undefined as unknown as sd.Text,
    });

    for (const pattern of opts.patterns) {
      let u = 0;
      for (const ch of pattern) {
        const childMap = this.children.get(u);
        let next = childMap?.get(ch);
        if (next === undefined) {
          next = this.nodes.length;
          childMap?.set(ch, next);
          this.children.set(next, new Map());
          this.nodes.push({
            id: next,
            parent: u,
            edgeChar: ch,
            depth: this.nodes[u].depth + 1,
            prefix: this.nodes[u].prefix + ch,
            cx: 0,
            cy: 0,
            isEnd: false,
            circle: undefined as unknown as sd.Circle,
            charText: undefined as unknown as sd.Text,
          });
        }
        u = next;
      }
      this.nodes[u].isEnd = true;
    }

    // Tidy top-down layout: leaves get sequential x, internal nodes get
    // their children's x-average.
    const cxOf = new Array<number>(this.nodes.length).fill(0);
    const cyOf = new Array<number>(this.nodes.length).fill(0);
    let cursor = 0;
    const layoutDfs = (u: number) => {
      const kids = [...(this.children.get(u)?.values() ?? [])];
      cyOf[u] = -this.nodes[u].depth * this.layerHeight;
      if (kids.length === 0) {
        cxOf[u] = cursor * siblingGap;
        cursor++;
        return;
      }
      for (const k of kids) layoutDfs(k);
      cxOf[u] = (cxOf[kids[0]] + cxOf[kids[kids.length - 1]]) / 2;
    };
    layoutDfs(0);

    const centerCx = opts.cx ?? 0;
    const topY = opts.topY ?? 0;
    const minCx = Math.min(...cxOf);
    const maxCx = Math.max(...cxOf);
    const offsetX = centerCx - (minCx + maxCx) / 2;
    const offsetY = topY;

    for (const node of this.nodes) {
      node.cx = cxOf[node.id] + offsetX;
      node.cy = cyOf[node.id] + offsetY;
    }

    for (const node of this.nodes) {
      node.circle = new sd.Circle({
        targetNode: this.group,
        cx: node.cx,
        cy: node.cy,
        r: this.nodeRadius,
        fill: nodeFill,
        stroke: nodeStroke,
        strokeWidth: 1.4,
        opacity: 0,
      });
      node.charText = new sd.Text({
        targetNode: this.group,
        text: node.id === 0 ? "ε" : node.edgeChar,
        cx: node.cx,
        cy: node.cy,
        fontSize: this.nodeRadius * 0.95,
        fill: C.darkButtonGrey,
        opacity: 0,
      });
    }

    for (const node of this.nodes) {
      if (node.parent < 0) continue;
      const p = this.nodes[node.parent];
      const dx = node.cx - p.cx;
      const dy = node.cy - p.cy;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      node.edgeLine = new sd.Line({
        targetNode: this.group,
        x1: p.cx + ux * this.nodeRadius,
        y1: p.cy + uy * this.nodeRadius,
        x2: node.cx - ux * this.nodeRadius,
        y2: node.cy - uy * this.nodeRadius,
        stroke: edgeStroke,
        strokeWidth: 1.2,
        opacity: 0,
      });
    }
  }

  buildFail(): void {
    const n = this.nodes.length;
    this.fail.length = 0;
    for (let i = 0; i < n; i++) this.fail.push(0);
    const queue: number[] = [];
    const rootChildren = this.children.get(0);
    if (rootChildren) for (const c of rootChildren.values()) queue.push(c);
    while (queue.length > 0) {
      const u = queue.shift() as number;
      const uChildren = this.children.get(u);
      if (!uChildren) continue;
      for (const [ch, v] of uChildren) {
        let f = this.fail[u];
        while (f !== 0 && !this.children.get(f)?.has(ch)) f = this.fail[f];
        const fChild = this.children.get(f)?.get(ch);
        this.fail[v] = fChild !== undefined && fChild !== v ? fChild : 0;
        queue.push(v);
      }
    }
  }

  fadeIn(opts?: { delay?: number; stagger?: number; duration?: number }): number {
    const delay0 = opts?.delay ?? 0;
    const stagger = opts?.stagger ?? 70;
    const duration = opts?.duration ?? 320;
    const byDepth: number[][] = [];
    for (const node of this.nodes) (byDepth[node.depth] ??= []).push(node.id);
    let t = delay0;
    for (const layer of byDepth) {
      for (const id of layer) {
        this.nodes[id].circle
          .startAnimate({ delay: t, duration, easing: E.easeOut })
          .setOpacity(1)
          .endAnimate();
        this.nodes[id].charText
          .startAnimate({ delay: t, duration, easing: E.easeOut })
          .setOpacity(1)
          .endAnimate();
        const edge = this.nodes[id].edgeLine;
        if (edge) {
          edge
            .startAnimate({ delay: t, duration, easing: E.easeOut })
            .setOpacity(1)
            .endAnimate();
        }
      }
      t += stagger;
    }
    return t + duration;
  }

  paintNode(i: number, fill: sd.SDColor, stroke: sd.SDColor, opts?: { delay?: number; duration?: number; strokeWidth?: number }) {
    this.nodes[i].circle
      .startAnimate({ delay: opts?.delay ?? 0, duration: opts?.duration ?? 240, easing: E.easeOut })
      .setFill(fill)
      .setStroke(stroke)
      .setStrokeWidth(opts?.strokeWidth ?? 2.4)
      .endAnimate();
  }

  /** Draw a curved dashed fail-link arrow from `from` to `to`. Starts at opacity 0. */
  failLink(from: number, to: number, opts?: { stroke?: sd.SDColor; bending?: number }): sd.Path {
    const a = this.nodes[from];
    const b = this.nodes[to];
    const stroke = opts?.stroke ?? C.darkButtonGrey;
    const bending = opts?.bending ?? 0.25;
    const mx = (a.cx + b.cx) / 2;
    const my = (a.cy + b.cy) / 2;
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    const nx = -dy;
    const ny = dx;
    const len = Math.hypot(nx, ny) || 1;
    const cx = mx + (nx / len) * bending * len;
    const cy = my + (ny / len) * bending * len;
    return new sd.Path({
      targetNode: this.group,
      d: `M ${a.cx} ${a.cy} Q ${cx} ${cy} ${b.cx} ${b.cy}`,
      stroke,
      strokeWidth: 1.4,
      strokeDashArray: [5, 4],
      fill: C.none,
      opacity: 0,
    });
  }

  pathToRoot(i: number): number[] {
    const out: number[] = [];
    let cur = i;
    while (cur >= 0) {
      out.push(cur);
      if (cur === 0) break;
      cur = this.nodes[cur].parent;
    }
    return out;
  }

  /** Walk text on the AC automaton (requires buildFail() first). */
  walk(text: string): Array<{ i: number; ch: string; from: number; to: number }> {
    const steps: Array<{ i: number; ch: string; from: number; to: number }> = [];
    let cur = 0;
    for (let i = 1; i <= text.length; i++) {
      const ch = text[i - 1];
      let f = cur;
      while (f !== 0 && !this.children.get(f)?.has(ch)) f = this.fail[f];
      const next = this.children.get(f)?.get(ch) ?? 0;
      steps.push({ i, ch, from: cur, to: next });
      cur = next;
    }
    return steps;
  }

  failChain(i: number): number[] {
    const out: number[] = [];
    let cur = i;
    while (true) {
      out.push(cur);
      if (cur === 0) break;
      cur = this.fail[cur];
    }
    return out;
  }
}
