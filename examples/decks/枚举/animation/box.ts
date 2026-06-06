import * as sd from "@/sd";

// Rect-with-centered-content: text or LaTeX. Used as the unit cell for
// every sample-space diagram in this deck.
//
// Coordinates are math-y. `x, y` is the math-y BOTTOM-LEFT corner of the
// box (matches how sd.Rect.y is the math-y bottom).

const C = sd.color();

export interface BoxOpts {
  targetNode: sd.Group;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  fontSize?: number;
  fill?: sd.SDColor;
  stroke?: sd.SDColor;
  textFill?: sd.SDColor;
  /** When true, render the text as MathJax. */
  math?: boolean;
  opacity?: number;
}

export class Box {
  readonly group: sd.Group;
  readonly rect: sd.Rect;
  readonly textNode?: sd.Text | sd.Math;
  readonly width: number;
  readonly height: number;
  readonly x: number;
  readonly y: number;

  constructor(opts: BoxOpts) {
    this.width = opts.width;
    this.height = opts.height;
    this.x = opts.x;
    this.y = opts.y;
    this.group = new sd.Group({
      targetNode: opts.targetNode,
      opacity: opts.opacity ?? 1,
    });

    this.rect = new sd.Rect({
      targetNode: this.group,
      x: opts.x,
      y: opts.y,
      width: opts.width,
      height: opts.height,
      fill: opts.fill ?? C.white,
      stroke: opts.stroke ?? C.darkButtonGrey,
      strokeWidth: 1.2,
    });

    if (opts.text) {
      const fontSize = opts.fontSize ?? Math.min(opts.height * 0.55, 18);
      const textFill = opts.textFill ?? C.darkButtonGrey;
      const cx = opts.x + opts.width / 2;
      const cy = opts.y + opts.height / 2;
      if (opts.math) {
        this.textNode = new sd.Math({
          targetNode: this.group,
          text: opts.text,
          cx,
          cy,
          fontSize,
          fill: textFill,
        });
      } else {
        this.textNode = new sd.Text({
          targetNode: this.group,
          text: opts.text,
          cx,
          cy,
          fontSize,
          fill: textFill,
        });
      }
    }
  }

  cx(): number {
    return this.x + this.width / 2;
  }
  cy(): number {
    return this.y + this.height / 2;
  }
  left(): number {
    return this.x;
  }
  right(): number {
    return this.x + this.width;
  }
  bottom(): number {
    return this.y;
  }
  top(): number {
    return this.y + this.height;
  }
}
