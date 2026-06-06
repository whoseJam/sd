import * as sd from "@/sd";

// Dashed rounded rectangle that highlights a region as the "sample space"
// callout. Optional label sits centered above the top edge.

const C = sd.color();

export interface FocusFrameOpts {
  targetNode: sd.Group;
  /** Math-y bottom-left of the framed region. */
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  labelGap?: number;
  labelFontSize?: number;
  stroke?: sd.SDColor;
  strokeWidth?: number;
  opacity?: number;
  cornerRadius?: number;
}

export class FocusFrame {
  readonly group: sd.Group;
  readonly rect: sd.Rect;
  readonly labelText?: sd.Text;

  constructor(opts: FocusFrameOpts) {
    const stroke = opts.stroke ?? C.darkButtonGrey;
    const strokeWidth = opts.strokeWidth ?? 1.2;
    const cornerRadius = opts.cornerRadius ?? 6;

    this.group = new sd.Group({
      targetNode: opts.targetNode,
      opacity: opts.opacity ?? 0,
    });
    this.rect = new sd.Rect({
      targetNode: this.group,
      x: opts.x,
      y: opts.y,
      width: opts.width,
      height: opts.height,
      rx: cornerRadius,
      ry: cornerRadius,
      fill: C.none,
      stroke,
      strokeWidth,
      strokeDashArray: [6, 4],
    });
    if (opts.label) {
      this.labelText = new sd.Text({
        targetNode: this.group,
        text: opts.label,
        cx: opts.x + opts.width / 2,
        cy: opts.y + opts.height + (opts.labelGap ?? 14),
        fontSize: opts.labelFontSize ?? 16,
        fill: stroke,
      });
    }
  }
}
