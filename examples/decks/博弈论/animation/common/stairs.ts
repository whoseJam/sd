import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export interface StairsOpts {
  targetNode: sd.Group;
  counts: number[];
  stepW?: number;
  stepH?: number;
  baseY?: number;
  startX?: number;
  stoneR?: number;
}

export class Stairs {
  readonly group: sd.Group;
  readonly steps: sd.Rect[] = [];
  readonly stoneGroups: sd.Circle[][] = [];
  readonly stepW: number;
  readonly stepH: number;
  readonly baseY: number;
  readonly startX: number;
  readonly stoneR: number;
  readonly counts: number[];

  constructor(opts: StairsOpts) {
    this.group = new sd.Group({ targetNode: opts.targetNode });
    this.counts = [...opts.counts];
    this.stepW = opts.stepW ?? 110;
    this.stepH = opts.stepH ?? 30;
    this.baseY = opts.baseY ?? -130;
    this.stoneR = opts.stoneR ?? 9;
    const n = this.counts.length;
    this.startX = opts.startX ?? -(n * this.stepW) / 2;

    for (let i = 0; i < n; i++) {
      const x = this.startX + i * this.stepW;
      const h = (i + 1) * this.stepH;
      this.steps.push(
        new sd.Rect({
          targetNode: this.group,
          x,
          y: this.baseY,
          width: this.stepW,
          height: h,
          fill: "#f7f4ec" as sd.SDColor,
          stroke: C.darkButtonGrey,
          strokeWidth: 1.2,
          opacity: 0,
        }),
      );
      const stones: sd.Circle[] = [];
      const topY = this.baseY + h + this.stoneR + 2;
      for (let j = 0; j < this.counts[i]; j++) {
        stones.push(
          new sd.Circle({
            targetNode: this.group,
            cx: x + this.stepW / 2,
            cy: topY + j * (2 * this.stoneR + 2),
            r: this.stoneR,
            fill: C.lightGrey,
            stroke: C.darkButtonGrey,
            strokeWidth: 1.1,
            opacity: 0,
          }),
        );
      }
      this.stoneGroups.push(stones);
    }
  }

  fadeIn(opts?: { delay?: number }) {
    const d0 = opts?.delay ?? 0;
    let k = 0;
    for (const s of this.steps) {
      s.startAnimate({ delay: d0 + k * 30, duration: 280, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      k++;
    }
    for (let i = 0; i < this.stoneGroups.length; i++) {
      for (const c of this.stoneGroups[i]) {
        c.startAnimate({ delay: d0 + k * 16, duration: 280, easing: E.easeOut })
          .setOpacity(1)
          .endAnimate();
        k++;
      }
    }
  }
}
