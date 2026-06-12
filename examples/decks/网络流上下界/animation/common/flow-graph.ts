import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export interface FlowNodeSpec {
  id: string;
  cx: number;
  cy: number;
  label?: string;
}

export interface FlowEdgeSpec {
  from: string;
  to: string;
  cap: number;
}

export interface FlowGraphOpts {
  targetNode: sd.Group;
  nodes: FlowNodeSpec[];
  edges: FlowEdgeSpec[];
  radius?: number;
  fontSize?: number;
}

export class FlowGraph {
  readonly group: sd.Group;
  readonly radius: number;
  readonly nodes: Map<string, FlowNodeSpec> = new Map();
  readonly circles: Map<string, sd.Circle> = new Map();
  readonly nodeLabels: Map<string, sd.Text> = new Map();
  readonly arrows: Map<string, sd.Path> = new Map();
  readonly arrowHeads: Map<string, sd.Path> = new Map();
  readonly capLabels: Map<string, sd.Text> = new Map();

  constructor(opts: FlowGraphOpts) {
    this.group = new sd.Group({ targetNode: opts.targetNode });
    this.radius = opts.radius ?? 18;
    for (const n of opts.nodes) this.nodes.set(n.id, n);

    const fontSize = opts.fontSize ?? 13;

    for (const e of opts.edges) this.makeArrow(e.from, e.to, e.cap, fontSize);

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
      this.nodeLabels.set(
        n.id,
        new sd.Text({
          targetNode: this.group,
          text: n.label ?? n.id,
          cx: n.cx,
          cy: n.cy,
          fontSize,
          fill: C.darkButtonGrey,
          opacity: 0,
        }),
      );
    }
  }

  private makeArrow(u: string, v: string, cap: number, fontSize: number) {
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
      stroke: C.darkButtonGrey,
      strokeWidth: 1.4,
      fill: "none",
      opacity: 0,
    });
    const headSize = 7;
    const px = -uy;
    const py = ux;
    const h1x = bx - ux * headSize + px * (headSize / 2);
    const h1y = by - uy * headSize + py * (headSize / 2);
    const h2x = bx - ux * headSize - px * (headSize / 2);
    const h2y = by - uy * headSize - py * (headSize / 2);
    const head = new sd.Path({
      targetNode: this.group,
      d: `M ${bx} ${by} L ${h1x} ${h1y} L ${h2x} ${h2y} Z`,
      stroke: C.darkButtonGrey,
      strokeWidth: 1,
      fill: C.darkButtonGrey,
      opacity: 0,
    });
    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2;
    const labelOff = 14;
    const label = new sd.Text({
      targetNode: this.group,
      text: String(cap),
      cx: mx + px * labelOff,
      cy: my + py * labelOff,
      fontSize: fontSize - 1,
      fill: C.darkButtonGrey,
      opacity: 0,
    });
    const key = `${u}-${v}`;
    this.arrows.set(key, line);
    this.arrowHeads.set(key, head);
    this.capLabels.set(key, label);
  }

  fadeIn(opts?: {
    delay?: number;
    stagger?: number;
    duration?: number;
  }): number {
    const delay0 = opts?.delay ?? 0;
    const stagger = opts?.stagger ?? 24;
    const dur = opts?.duration ?? 280;
    let k = 0;
    for (const [key, arrow] of this.arrows) {
      const d = delay0 + k++ * 14;
      arrow
        .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      this.arrowHeads
        .get(key)!
        .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      this.capLabels
        .get(key)!
        .startAnimate({ delay: d + 80, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
    for (const id of this.circles.keys()) {
      const d = delay0 + k * stagger;
      this.circles
        .get(id)!
        .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      this.nodeLabels
        .get(id)!
        .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      k++;
    }
    return delay0 + k * stagger + dur;
  }

  paintEdge(
    u: string,
    v: string,
    color: sd.SDColor,
    opts?: { delay?: number; duration?: number; strokeWidth?: number },
  ) {
    const key = `${u}-${v}`;
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 260;
    const w = opts?.strokeWidth ?? 2.4;
    this.arrows
      .get(key)
      ?.startAnimate({ delay: d, duration: dur, easing: E.easeOut })
      .setStroke(color)
      .setStrokeWidth(w)
      .endAnimate();
    this.arrowHeads
      .get(key)
      ?.startAnimate({ delay: d, duration: dur, easing: E.easeOut })
      .setStroke(color)
      .setFill(color)
      .endAnimate();
  }

  fadeEdge(
    u: string,
    v: string,
    opacity: number,
    opts?: { delay?: number; duration?: number },
  ) {
    const key = `${u}-${v}`;
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 220;
    this.arrows
      .get(key)
      ?.startAnimate({ delay: d, duration: dur, easing: E.easeOut })
      .setOpacity(opacity)
      .endAnimate();
    this.arrowHeads
      .get(key)
      ?.startAnimate({ delay: d, duration: dur, easing: E.easeOut })
      .setOpacity(opacity)
      .endAnimate();
  }

  setCap(
    u: string,
    v: string,
    text: string,
    color: sd.SDColor,
    opts?: { delay?: number; duration?: number },
  ) {
    const key = `${u}-${v}`;
    const t = this.capLabels.get(key);
    if (!t) return;
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 220;
    t.startAnimate({ delay: d, duration: dur, easing: E.easeOut })
      .setText(text)
      .setFill(color)
      .endAnimate();
  }

  paintNode(
    id: string,
    fill: sd.SDColor,
    stroke: sd.SDColor,
    opts?: { delay?: number; duration?: number },
  ) {
    this.circles
      .get(id)!
      .startAnimate({
        delay: opts?.delay ?? 0,
        duration: opts?.duration ?? 240,
        easing: E.easeOut,
      })
      .setFill(fill)
      .setStroke(stroke)
      .setStrokeWidth(2.2)
      .endAnimate();
  }

  edgeEndpoints(
    u: string,
    v: string,
  ): {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    ux: number;
    uy: number;
  } {
    const a = this.nodes.get(u)!;
    const b = this.nodes.get(v)!;
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    return {
      ax: a.cx + ux * this.radius,
      ay: a.cy + uy * this.radius,
      bx: b.cx - ux * this.radius,
      by: b.cy - uy * this.radius,
      ux,
      uy,
    };
  }
}
