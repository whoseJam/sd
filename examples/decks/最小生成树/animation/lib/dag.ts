import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export interface DagNodeSpec {
  id: number;
  cx: number;
  cy: number;
  label?: string;
}

export interface DagOpts {
  targetNode: sd.Group;
  nodes: DagNodeSpec[];
  edges: Array<[number, number]>;
  radius?: number;
  fontSize?: number;
}

export class Dag {
  readonly group: sd.Group;
  readonly radius: number;
  readonly nodes: Map<number, DagNodeSpec> = new Map();
  readonly edges: ReadonlyArray<readonly [number, number]>;
  readonly circles: Map<number, sd.Circle> = new Map();
  readonly labels: Map<number, sd.Text> = new Map();
  readonly arrows: Map<string, sd.Path> = new Map();
  readonly arrowHeads: Map<string, sd.Path> = new Map();
  readonly tags: Map<number, sd.Text> = new Map();

  constructor(opts: DagOpts) {
    this.group = new sd.Group({ targetNode: opts.targetNode });
    this.radius = opts.radius ?? 16;
    this.edges = opts.edges;
    for (const n of opts.nodes) this.nodes.set(n.id, n);

    const fontSize = opts.fontSize ?? 13;

    for (const [u, v] of opts.edges) this.makeArrow(u, v);

    for (const n of opts.nodes) {
      this.circles.set(
        n.id,
        new sd.Circle({
          targetNode: this.group, cx: n.cx, cy: n.cy, r: this.radius,
          fill: C.white, stroke: C.darkButtonGrey, strokeWidth: 1.4,
          opacity: 0,
        }),
      );
      this.labels.set(
        n.id,
        new sd.Text({
          targetNode: this.group, text: n.label ?? String(n.id),
          cx: n.cx, cy: n.cy,
          fontSize, fill: C.darkButtonGrey, opacity: 0,
        }),
      );
    }
  }

  private makeArrow(u: number, v: number) {
    const a = this.nodes.get(u)!;
    const b = this.nodes.get(v)!;
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    const ax = a.cx + ux * this.radius;
    const ay = a.cy + uy * this.radius;
    const bx = b.cx - ux * this.radius;
    const by = b.cy - uy * this.radius;
    const line = new sd.Path({
      targetNode: this.group,
      d: `M ${ax} ${ay} L ${bx} ${by}`,
      stroke: C.darkButtonGrey, strokeWidth: 1.2, fill: "none",
      opacity: 0,
    });
    const headSize = 6;
    const px = -uy;
    const py = ux;
    const h1x = bx - ux * headSize + px * (headSize / 2);
    const h1y = by - uy * headSize + py * (headSize / 2);
    const h2x = bx - ux * headSize - px * (headSize / 2);
    const h2y = by - uy * headSize - py * (headSize / 2);
    const head = new sd.Path({
      targetNode: this.group,
      d: `M ${bx} ${by} L ${h1x} ${h1y} L ${h2x} ${h2y} Z`,
      stroke: C.darkButtonGrey, strokeWidth: 1, fill: C.darkButtonGrey,
      opacity: 0,
    });
    this.arrows.set(`${u}-${v}`, line);
    this.arrowHeads.set(`${u}-${v}`, head);
  }

  fadeIn(opts?: { delay?: number; stagger?: number; duration?: number }): number {
    const delay0 = opts?.delay ?? 0;
    const stagger = opts?.stagger ?? 24;
    const dur = opts?.duration ?? 280;
    let k = 0;
    for (const id of this.circles.keys()) {
      const d = delay0 + k * stagger;
      this.circles.get(id)!.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(1).endAnimate();
      this.labels.get(id)!.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(1).endAnimate();
      k++;
    }
    for (const [key, arrow] of this.arrows) {
      const d = delay0 + (k++) * 14;
      arrow.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(1).endAnimate();
      const head = this.arrowHeads.get(key)!;
      head.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(1).endAnimate();
    }
    return delay0 + k * stagger + dur;
  }

  paint(id: number, fill: sd.SDColor, stroke: sd.SDColor, opts?: { delay?: number; duration?: number }) {
    this.circles.get(id)!
      .startAnimate({ delay: opts?.delay ?? 0, duration: opts?.duration ?? 240, easing: E.easeOut })
      .setFill(fill).setStroke(stroke).setStrokeWidth(2.2).endAnimate();
  }

  fadeNode(id: number, opacity: number, opts?: { delay?: number; duration?: number }) {
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 220;
    this.circles.get(id)!.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(opacity).endAnimate();
    this.labels.get(id)!.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(opacity).endAnimate();
  }

  paintEdge(u: number, v: number, color: sd.SDColor, opts?: { delay?: number; duration?: number }) {
    const a = this.arrows.get(`${u}-${v}`);
    const h = this.arrowHeads.get(`${u}-${v}`);
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 240;
    a?.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setStroke(color).setStrokeWidth(2).endAnimate();
    h?.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setFill(color).setStroke(color).endAnimate();
  }

  fadeEdge(u: number, v: number, opacity: number, opts?: { delay?: number; duration?: number }) {
    const a = this.arrows.get(`${u}-${v}`);
    const h = this.arrowHeads.get(`${u}-${v}`);
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 220;
    a?.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(opacity).endAnimate();
    h?.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(opacity).endAnimate();
  }

  setTag(id: number, text: string, color: sd.SDColor, opts?: { delay?: number; duration?: number }) {
    const n = this.nodes.get(id)!;
    let t = this.tags.get(id);
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 260;
    if (!t) {
      t = new sd.Text({
        targetNode: this.group, text,
        cx: n.cx + this.radius + 14, cy: n.cy,
        fontSize: 13, fill: color, opacity: 0,
      });
      this.tags.set(id, t);
    } else {
      t.startAnimate({ delay: d, duration: 200 }).setText(text).setFill(color).endAnimate();
    }
    t.startAnimate({ delay: d, duration: dur, easing: E.easeOut }).setOpacity(1).endAnimate();
  }

  inDegree(id: number, alive?: Set<number>): number {
    let cnt = 0;
    for (const [u, v] of this.edges) {
      if (v === id && (alive === undefined || alive.has(u))) cnt++;
    }
    return cnt;
  }

  outNeighbors(id: number): number[] {
    return this.edges.filter(([u]) => u === id).map(([, v]) => v);
  }
}
