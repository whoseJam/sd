import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export interface PileOpts {
  targetNode: sd.Group;
  counts: number[];
  cx: number;
  baseY: number;
  pileGap?: number;
  stoneR?: number;
  stoneGap?: number;
}

export class StonePiles {
  readonly group: sd.Group;
  readonly stones: sd.Circle[][] = [];
  readonly labels: sd.Text[] = [];
  readonly counts: number[];
  readonly cx: number;
  readonly baseY: number;
  readonly pileGap: number;
  readonly stoneR: number;
  readonly stoneGap: number;

  constructor(opts: PileOpts) {
    this.group = new sd.Group({ targetNode: opts.targetNode });
    this.counts = [...opts.counts];
    this.cx = opts.cx;
    this.baseY = opts.baseY;
    this.pileGap = opts.pileGap ?? 60;
    this.stoneR = opts.stoneR ?? 12;
    this.stoneGap = opts.stoneGap ?? 2;

    const n = this.counts.length;
    const startX = -((n - 1) * this.pileGap) / 2;
    for (let p = 0; p < n; p++) {
      const px = startX + p * this.pileGap;
      const pile: sd.Circle[] = [];
      for (let i = 0; i < this.counts[p]; i++) {
        const cy = this.baseY + i * (2 * this.stoneR + this.stoneGap);
        pile.push(
          new sd.Circle({
            targetNode: this.group,
            cx: px,
            cy,
            r: this.stoneR,
            fill: C.lightGrey,
            stroke: C.darkButtonGrey,
            strokeWidth: 1.2,
            opacity: 0,
          }),
        );
      }
      this.stones.push(pile);
      this.labels.push(
        new sd.Text({
          targetNode: this.group,
          text: String(this.counts[p]),
          cx: px,
          cy: this.baseY - this.stoneR - 14,
          fontSize: 14,
          fill: C.darkButtonGrey,
          opacity: 0,
        }),
      );
    }
  }

  fadeIn(opts?: { delay?: number }) {
    const d0 = opts?.delay ?? 0;
    let k = 0;
    for (let p = 0; p < this.stones.length; p++) {
      for (const s of this.stones[p]) {
        s.startAnimate({ delay: d0 + k * 16, duration: 280, easing: E.easeOut })
          .setOpacity(1)
          .endAnimate();
        k++;
      }
      this.labels[p]
        .startAnimate({ delay: d0 + k * 16, duration: 280, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
  }

  removeTop(pileIdx: number, count: number, opts?: { delay?: number }) {
    const d0 = opts?.delay ?? 0;
    const pile = this.stones[pileIdx];
    const start = pile.length - count;
    for (let i = start; i < pile.length; i++) {
      pile[i]
        .startAnimate({
          delay: d0 + (i - start) * 60,
          duration: 280,
          easing: E.easeOut,
        })
        .setOpacity(0)
        .endAnimate();
    }
    this.counts[pileIdx] -= count;
    this.labels[pileIdx]
      .startAnimate({ delay: d0, duration: 240 })
      .setText(String(this.counts[pileIdx]))
      .endAnimate();
  }
}
