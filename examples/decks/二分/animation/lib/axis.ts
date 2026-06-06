import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export interface AxisOpts {
  targetNode: sd.Group;
  ticks: number;
  gap: number;
  x: number;
  y: number;
  label?: string;
}

export class Axis {
  readonly group: sd.Group;
  readonly ticks: number;
  readonly gap: number;
  readonly x: number;
  readonly y: number;
  readonly line: sd.Line;
  readonly tickMarks: sd.Line[] = [];
  readonly tickLabels: sd.Text[] = [];

  constructor(opts: AxisOpts) {
    this.group = new sd.Group({ targetNode: opts.targetNode });
    this.ticks = opts.ticks;
    this.gap = opts.gap;
    this.x = opts.x;
    this.y = opts.y;

    this.line = new sd.Line({
      targetNode: this.group,
      x1: opts.x,
      y1: opts.y,
      x2: opts.x + opts.ticks * opts.gap,
      y2: opts.y,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.2,
      opacity: 0,
    });

    for (let i = 0; i <= opts.ticks; i++) {
      const tx = opts.x + i * opts.gap;
      this.tickMarks.push(
        new sd.Line({
          targetNode: this.group,
          x1: tx,
          y1: opts.y - 4,
          x2: tx,
          y2: opts.y + 4,
          stroke: C.darkButtonGrey,
          strokeWidth: 1,
          opacity: 0,
        }),
      );
      this.tickLabels.push(
        new sd.Text({
          targetNode: this.group,
          text: String(i),
          cx: tx,
          cy: opts.y + 14,
          fontSize: 10,
          fill: C.darkButtonGrey,
          opacity: 0,
        }),
      );
    }

    if (opts.label) {
      new sd.Text({
        targetNode: this.group,
        text: opts.label,
        cx: opts.x - 20,
        cy: opts.y,
        fontSize: 14,
        fill: C.darkButtonGrey,
      });
    }
  }

  tickX(i: number): number {
    return this.x + i * this.gap;
  }

  fadeIn(opts?: { delay?: number; duration?: number }) {
    const delay = opts?.delay ?? 0;
    const dur = opts?.duration ?? 280;
    this.line
      .startAnimate({ delay, duration: dur, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    for (let i = 0; i < this.tickMarks.length; i++) {
      const d = delay + i * 12;
      this.tickMarks[i]
        .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      this.tickLabels[i]
        .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
  }
}

export interface BraceOpts {
  targetNode: sd.Group;
  fromX: number;
  toX: number;
  y: number;
  height?: number;
  color: sd.SDColor;
  label?: string;
  fontSize?: number;
}

export function bracePath(opts: BraceOpts) {
  const h = opts.height ?? 10;
  const path = new sd.Path({
    targetNode: opts.targetNode,
    d: `M ${opts.fromX} ${opts.y} L ${opts.fromX} ${opts.y + h} L ${opts.toX} ${opts.y + h} L ${opts.toX} ${opts.y}`,
    stroke: opts.color,
    strokeWidth: 1.8,
    fill: "none",
    opacity: 0,
  });
  let label: sd.Text | sd.Math | undefined;
  if (opts.label) {
    const looksMathy = /[\\^_]|\\ge|\\le|\\lt|\\gt/.test(opts.label);
    const Cls = looksMathy ? sd.Math : sd.Text;
    label = new Cls({
      targetNode: opts.targetNode,
      text: opts.label,
      cx: (opts.fromX + opts.toX) / 2,
      cy: opts.y + h + 14,
      fontSize: opts.fontSize ?? 13,
      fill: opts.color,
      opacity: 0,
    });
  }
  return {
    show(opts2?: { delay?: number; duration?: number }) {
      const delay = opts2?.delay ?? 0;
      const dur = opts2?.duration ?? 320;
      path
        .startAnimate({ delay, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      label
        ?.startAnimate({ delay: delay + 80, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    },
  };
}

export function pointer(
  targetNode: sd.Group,
  cx: number,
  y: number,
  label: string,
  color: sd.SDColor,
  opts?: { above?: boolean },
) {
  const above = opts?.above ?? false;
  const tipY = y + (above ? 4 : -4);
  const baseY = y + (above ? 12 : -12);
  const tri = new sd.Path({
    targetNode,
    d: `M ${cx} ${tipY} L ${cx - 5} ${baseY} L ${cx + 5} ${baseY} Z`,
    fill: color,
    stroke: color,
    opacity: 0,
  });
  const labY = baseY + (above ? 12 : -12);
  const lab = new sd.Text({
    targetNode,
    text: label,
    cx,
    cy: labY,
    fontSize: 12,
    fill: color,
    opacity: 0,
  });
  return {
    show(d = 0) {
      tri
        .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      lab
        .startAnimate({ delay: d + 60, duration: 200, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    },
    moveTo(newCx: number, d = 0) {
      const newTri = `M ${newCx} ${tipY} L ${newCx - 5} ${baseY} L ${newCx + 5} ${baseY} Z`;
      tri
        .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
        .setD(newTri)
        .endAnimate();
      lab
        .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
        .setCx(newCx)
        .endAnimate();
    },
    hide(d = 0) {
      tri
        .startAnimate({ delay: d, duration: 200, easing: E.easeOut })
        .setOpacity(0)
        .endAnimate();
      lab
        .startAnimate({ delay: d, duration: 200, easing: E.easeOut })
        .setOpacity(0)
        .endAnimate();
    },
  };
}
