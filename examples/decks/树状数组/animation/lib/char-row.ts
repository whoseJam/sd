import * as sd from "@/sd";

// Horizontal row of fixed-size square cells, 1-indexed to match the deck
// notation (s[1..n], t[1..n]).
//
// Highlight design: each cell carries a separate inset overlay rect that
// the paint methods animate, instead of changing the cell's own fill.
// Two consequences worth keeping in mind:
//   1. Adjacent highlighted cells stay visually distinct because the inset
//      leaves a visible gap of base grid between their colored boxes — no
//      z-order tricks needed, and N adjacent highlights all read clearly.
//   2. The base grid never changes color, so the cell's identity (white
//      square with light border) is stable through the whole animation.
//
// Coordinates are math-y: `y` is the math-y BOTTOM of the row.

const C = sd.color();
const E = sd.easing();

const HL_INSET = 3;
const PAINT_DUR = 240;

export interface CharRowOpts {
  targetNode: sd.Group;
  text: string;
  size: number;
  x: number;
  y: number;
  label?: string;
  labelGap?: number;
  cellFill?: sd.SDColor;
  cellStroke?: sd.SDColor;
  textFill?: sd.SDColor;
}

export class CharRow {
  readonly group: sd.Group;
  readonly size: number;
  readonly x: number;
  readonly y: number;
  readonly chars: string[];
  readonly cells: sd.Rect[] = [];
  readonly overlays: sd.Rect[] = [];
  readonly glyphs: sd.Text[] = [];
  readonly labelText?: sd.Text;

  constructor(opts: CharRowOpts) {
    this.size = opts.size;
    this.x = opts.x;
    this.y = opts.y;
    this.chars = [...opts.text];

    this.group = new sd.Group({ targetNode: opts.targetNode });

    const cellFill = opts.cellFill ?? C.white;
    const cellStroke = opts.cellStroke ?? C.silver;
    const textFill = opts.textFill ?? C.darkButtonGrey;
    const fontSize = opts.size * 0.55;

    for (let i = 0; i < this.chars.length; i++) {
      const cellX = opts.x + i * opts.size;
      this.cells.push(
        new sd.Rect({
          targetNode: this.group,
          x: cellX,
          y: opts.y,
          width: opts.size,
          height: opts.size,
          fill: cellFill,
          stroke: cellStroke,
          strokeWidth: 1,
          opacity: 0,
        }),
      );
      this.overlays.push(
        new sd.Rect({
          targetNode: this.group,
          x: cellX + HL_INSET,
          y: opts.y + HL_INSET,
          width: opts.size - 2 * HL_INSET,
          height: opts.size - 2 * HL_INSET,
          fill: C.white,
          stroke: C.silver,
          strokeWidth: 1.4,
          opacity: 0,
        }),
      );
      this.glyphs.push(
        new sd.Text({
          targetNode: this.group,
          text: this.chars[i],
          cx: cellX + opts.size / 2,
          cy: opts.y + opts.size / 2,
          fontSize,
          fill: textFill,
          opacity: 0,
        }),
      );
    }

    if (opts.label) {
      this.labelText = new sd.Text({
        targetNode: this.group,
        text: opts.label,
        cx: opts.x - (opts.labelGap ?? 20),
        cy: opts.y + opts.size / 2,
        fontSize: opts.size * 0.55,
        fill: textFill,
        opacity: 0,
      });
    }
  }

  // 1-indexed center-x of cell i (relative to row.group's local frame).
  cellCx(i: number): number {
    return this.x + (i - 0.5) * this.size;
  }
  cellLeft(i: number): number {
    return this.x + (i - 1) * this.size;
  }
  cellRight(i: number): number {
    return this.x + i * this.size;
  }
  // Math-y top of the row.
  top(): number {
    return this.y + this.size;
  }
  bottom(): number {
    return this.y;
  }
  length(): number {
    return this.chars.length;
  }

  // Staggered fade-in over all cells / glyphs / label. Returns the total
  // delay consumed so the caller can chain follow-up animations.
  fadeIn(opts?: {
    delay?: number;
    stagger?: number;
    duration?: number;
  }): number {
    const delay0 = opts?.delay ?? 0;
    const stagger = opts?.stagger ?? 22;
    const dur = opts?.duration ?? 300;
    if (this.labelText) {
      this.labelText
        .startAnimate({ delay: delay0, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
    for (let i = 0; i < this.cells.length; i++) {
      const d = delay0 + (i + 1) * stagger;
      this.cells[i]
        .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      this.glyphs[i]
        .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
    return delay0 + this.cells.length * stagger + dur;
  }

  paintCell(
    i: number,
    fill: sd.SDColor,
    stroke: sd.SDColor,
    opts?: { delay?: number; duration?: number },
  ) {
    this.overlays[i - 1]
      .startAnimate({
        delay: opts?.delay ?? 0,
        duration: opts?.duration ?? PAINT_DUR,
        easing: E.easeOut,
      })
      .setFill(fill)
      .setStroke(stroke)
      .setOpacity(1)
      .endAnimate();
  }

  clearCell(i: number, opts?: { delay?: number; duration?: number }) {
    this.overlays[i - 1]
      .startAnimate({
        delay: opts?.delay ?? 0,
        duration: opts?.duration ?? PAINT_DUR,
        easing: E.easeOut,
      })
      .setOpacity(0)
      .endAnimate();
  }
}
