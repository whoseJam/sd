import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export interface TreeNodeSpec {
  id: number;
  cx: number;
  cy: number;
}

export interface TreeViewOpts {
  targetNode: sd.Group;
  nodes: TreeNodeSpec[];
  parent: Record<number, number>;
  root: number;
  radius?: number;
  fontSize?: number;
}

export class TreeView {
  readonly group: sd.Group;
  readonly radius: number;
  readonly nodes: Map<number, TreeNodeSpec> = new Map();
  readonly parent: Record<number, number>;
  readonly root: number;
  readonly circles: Map<number, sd.Circle> = new Map();
  readonly labels: Map<number, sd.Text> = new Map();
  readonly edges: Map<number, sd.Line> = new Map();
  readonly tags: Map<number, sd.Text> = new Map();

  constructor(opts: TreeViewOpts) {
    this.group = new sd.Group({ targetNode: opts.targetNode });
    this.radius = opts.radius ?? 16;
    this.parent = opts.parent;
    this.root = opts.root;
    for (const n of opts.nodes) this.nodes.set(n.id, n);

    const fontSize = opts.fontSize ?? 13;

    for (const n of opts.nodes) {
      const p = this.parent[n.id];
      if (p !== undefined) {
        const pp = this.nodes.get(p)!;
        const dx = pp.cx - n.cx;
        const dy = pp.cy - n.cy;
        const dist = Math.hypot(dx, dy) || 1;
        this.edges.set(
          n.id,
          new sd.Line({
            targetNode: this.group,
            x1: n.cx + (dx / dist) * this.radius,
            y1: n.cy + (dy / dist) * this.radius,
            x2: pp.cx - (dx / dist) * this.radius,
            y2: pp.cy - (dy / dist) * this.radius,
            stroke: C.darkButtonGrey,
            strokeWidth: 1.2,
            opacity: 0,
          }),
        );
      }
    }

    for (const n of opts.nodes) {
      this.circles.set(
        n.id,
        new sd.Circle({
          targetNode: this.group,
          cx: n.cx,
          cy: n.cy,
          r: this.radius,
          fill: C.white,
          stroke: C.darkButtonGrey,
          strokeWidth: 1.4,
          opacity: 0,
        }),
      );
      this.labels.set(
        n.id,
        new sd.Text({
          targetNode: this.group,
          text: String(n.id),
          cx: n.cx,
          cy: n.cy,
          fontSize,
          fill: C.darkButtonGrey,
          opacity: 0,
        }),
      );
    }
  }

  fadeIn(opts?: { delay?: number; stagger?: number; duration?: number }): number {
    const delay0 = opts?.delay ?? 0;
    const stagger = opts?.stagger ?? 28;
    const dur = opts?.duration ?? 280;
    let k = 0;
    for (const id of this.circles.keys()) {
      const d = delay0 + k * stagger;
      this.circles.get(id)!.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(1).endAnimate();
      this.labels.get(id)!.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(1).endAnimate();
      const e = this.edges.get(id);
      if (e) e.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(1).endAnimate();
      k++;
    }
    return delay0 + k * stagger + dur;
  }

  paint(id: number, fill: sd.SDColor, stroke: sd.SDColor, opts?: { delay?: number; duration?: number }) {
    this.circles.get(id)!
      .startAnimate({ delay: opts?.delay ?? 0, duration: opts?.duration ?? 240, easing: E.easeOut })
      .setFill(fill)
      .setStroke(stroke)
      .setStrokeWidth(2.2)
      .endAnimate();
  }

  paintEdge(child: number, color: sd.SDColor, opts?: { delay?: number; duration?: number }) {
    const e = this.edges.get(child);
    if (!e) return;
    e.startAnimate({ delay: opts?.delay ?? 0, duration: opts?.duration ?? 240, easing: E.easeOut })
      .setStroke(color)
      .setStrokeWidth(2.4)
      .endAnimate();
  }

  setTag(id: number, text: string, color: sd.SDColor, opts?: { delay?: number; duration?: number }) {
    const n = this.nodes.get(id)!;
    let t = this.tags.get(id);
    if (!t) {
      t = new sd.Text({
        targetNode: this.group,
        text,
        cx: n.cx + this.radius + 14,
        cy: n.cy,
        fontSize: 13,
        fill: color,
        opacity: 0,
      });
      this.tags.set(id, t);
    } else {
      t.startAnimate({ delay: opts?.delay ?? 0, duration: 200 }).setText(text).setFill(color).endAnimate();
    }
    t.startAnimate({ delay: opts?.delay ?? 0, duration: opts?.duration ?? 260, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }

  pathToRoot(id: number): number[] {
    const path: number[] = [];
    let cur: number | undefined = id;
    while (cur !== undefined) {
      path.push(cur);
      cur = this.parent[cur];
    }
    return path;
  }

  lca(u: number, v: number): number {
    const pu = new Set(this.pathToRoot(u));
    let cur: number | undefined = v;
    while (cur !== undefined) {
      if (pu.has(cur)) return cur;
      cur = this.parent[cur];
    }
    return this.root;
  }
}
