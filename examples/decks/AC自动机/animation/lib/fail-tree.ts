import * as sd from "@/sd";

function buildLen(t: string): number[] {
  const n = t.length - 1;
  const len = new Array(n + 1).fill(0);
  let j = 0;
  for (let i = 2; i <= n; i++) {
    while (j > 0 && t[j + 1] !== t[i]) j = len[j];
    if (t[j + 1] === t[i]) j++;
    len[i] = j;
  }
  return len;
}

// Layout + render helpers for the KMP "fail tree" — one node per prefix of
// the pattern (0..n), an edge i -> len[i] from each prefix to its longest
// proper border. The tree is laid out with depth on the X axis (root at
// left) and a tidy in-order DFS for Y. Y-up math: tidy() emits positive y
// for "above center"; the renderer flips for SVG.

const C = sd.color();
const E = sd.easing();

export interface FailTreeOpts {
  /** Pattern string (NOT 1-padded — we pad internally). */
  pattern: string;
  /** Math-y top-left of the layout box. */
  x: number;
  y: number;
  layerWidth: number;
  nodeRadius: number;
  nodeGap: number;
  rootLabel?: string;
  nodeFill?: sd.SDColor;
  nodeStroke?: sd.SDColor;
  edgeStroke?: sd.SDColor;
  textFill?: sd.SDColor;
}

export interface FailTreeNode {
  i: number;
  depth: number;
  parent: number;
  /** math-y center coordinates */
  cx: number;
  cy: number;
  circle: sd.Circle;
  text: sd.Text;
}

export interface FailTreeEdge {
  from: number;
  to: number;
  line: sd.Line;
}

export class FailTree {
  readonly group: sd.Group;
  readonly len: number[];
  readonly nodes: FailTreeNode[] = [];
  readonly edges: FailTreeEdge[] = [];
  readonly nodeRadius: number;
  readonly layerWidth: number;

  constructor(svg: sd.Group, opts: FailTreeOpts) {
    this.nodeRadius = opts.nodeRadius;
    this.layerWidth = opts.layerWidth;
    this.group = new sd.Group({ targetNode: svg });

    const tPadded = " " + opts.pattern;
    const n = tPadded.length - 1;
    this.len = buildLen(tPadded);

    // children[p] = list of nodes whose parent is p
    const children: number[][] = Array.from({ length: n + 1 }, () => []);
    for (let i = 1; i <= n; i++) children[this.len[i]].push(i);

    const depth = new Array<number>(n + 1).fill(0);
    const yPos = new Array<number>(n + 1).fill(0);
    let yCursor = 0;

    // Tidy DFS: leaves get sequential y, internal nodes get the average of
    // their children's y. Output is "logical" 0-based y indices.
    const dfs = (u: number, d: number): void => {
      depth[u] = d;
      if (children[u].length === 0) {
        yPos[u] = yCursor++;
        return;
      }
      let yMin = Infinity;
      let yMax = -Infinity;
      for (const c of children[u]) {
        dfs(c, d + 1);
        if (yPos[c] < yMin) yMin = yPos[c];
        if (yPos[c] > yMax) yMax = yPos[c];
      }
      yPos[u] = (yMin + yMax) / 2;
    };
    dfs(0, 0);

    // Center the layout vertically around opts.y so root's column sits at x.
    const maxY = yCursor === 0 ? 0 : yCursor - 1;
    const halfH = (maxY * opts.nodeGap) / 2;

    const nodeFill = opts.nodeFill ?? C.white;
    const nodeStroke = opts.nodeStroke ?? C.darkButtonGrey;
    const edgeStroke = opts.edgeStroke ?? C.silver;
    const textFill = opts.textFill ?? C.darkButtonGrey;

    for (let i = 0; i <= n; i++) {
      const cx = opts.x + depth[i] * opts.layerWidth;
      const cy = opts.y + halfH - yPos[i] * opts.nodeGap;
      const circle = new sd.Circle({
        targetNode: this.group,
        cx,
        cy,
        r: opts.nodeRadius,
        fill: nodeFill,
        stroke: nodeStroke,
        strokeWidth: 1.4,
        opacity: 0,
      });
      const text = new sd.Text({
        targetNode: this.group,
        text: String(i),
        cx,
        cy,
        fontSize: opts.nodeRadius * 1.0,
        fill: textFill,
        opacity: 0,
      });
      this.nodes.push({
        i,
        depth: depth[i],
        parent: i === 0 ? -1 : this.len[i],
        cx,
        cy,
        circle,
        text,
      });
    }

    // Edges: i -> len[i]. Drawn child -> parent.
    for (let i = 1; i <= n; i++) {
      const from = this.nodes[i];
      const to = this.nodes[this.len[i]];
      const dx = to.cx - from.cx;
      const dy = to.cy - from.cy;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const x1 = from.cx + ux * opts.nodeRadius;
      const y1 = from.cy + uy * opts.nodeRadius;
      const x2 = to.cx - ux * opts.nodeRadius;
      const y2 = to.cy - uy * opts.nodeRadius;
      const line = new sd.Line({
        targetNode: this.group,
        x1,
        y1,
        x2,
        y2,
        stroke: edgeStroke,
        strokeWidth: 1.2,
        opacity: 0,
      });
      this.edges.push({ from: i, to: this.len[i], line });
    }

    if (opts.rootLabel !== undefined) {
      this.nodes[0].text.setText(opts.rootLabel);
    }
  }

  /** Walk root-to-leaves; fade in each node and the edge into it together. */
  fadeIn(opts?: {
    delay?: number;
    stagger?: number;
    duration?: number;
  }): number {
    const delay0 = opts?.delay ?? 0;
    const stagger = opts?.stagger ?? 60;
    const dur = opts?.duration ?? 320;
    // Group by depth so nodes appear left-to-right.
    const byDepth: number[][] = [];
    for (const n of this.nodes) {
      (byDepth[n.depth] ??= []).push(n.i);
    }
    let t = delay0;
    for (const layer of byDepth) {
      for (const i of layer) {
        this.nodes[i].circle
          .startAnimate({ delay: t, duration: dur, easing: E.easeOut })
          .setOpacity(1)
          .endAnimate();
        this.nodes[i].text
          .startAnimate({ delay: t, duration: dur, easing: E.easeOut })
          .setOpacity(1)
          .endAnimate();
        const e = this.edges.find((ed) => ed.from === i);
        if (e) {
          e.line
            .startAnimate({ delay: t, duration: dur, easing: E.easeOut })
            .setOpacity(1)
            .endAnimate();
        }
      }
      t += stagger;
    }
    return t + dur;
  }

  /** Highlight a node circle (animate fill / stroke / strokeWidth). */
  paintNode(
    i: number,
    fill: sd.SDColor,
    stroke: sd.SDColor,
    opts?: { delay?: number; duration?: number; strokeWidth?: number },
  ): void {
    const dur = opts?.duration ?? 260;
    const sw = opts?.strokeWidth ?? 2.4;
    this.nodes[i].circle
      .startAnimate({
        delay: opts?.delay ?? 0,
        duration: dur,
        easing: E.easeOut,
      })
      .setFill(fill)
      .setStroke(stroke)
      .setStrokeWidth(sw)
      .endAnimate();
  }

  /** Highlight one edge (the one whose child is `i`). */
  paintEdge(
    i: number,
    stroke: sd.SDColor,
    opts?: { delay?: number; duration?: number; strokeWidth?: number },
  ): void {
    const e = this.edges.find((ed) => ed.from === i);
    if (!e) return;
    const dur = opts?.duration ?? 260;
    e.line
      .startAnimate({
        delay: opts?.delay ?? 0,
        duration: dur,
        easing: E.easeOut,
      })
      .setStroke(stroke)
      .setStrokeWidth(opts?.strokeWidth ?? 2.4)
      .endAnimate();
  }

  /** Walk ancestors from node i up to (and including) `stop`. */
  ancestors(i: number, stop = 0): number[] {
    const out: number[] = [];
    let cur = i;
    while (cur !== stop) {
      out.push(cur);
      cur = this.len[cur];
    }
    out.push(stop);
    return out;
  }
}
