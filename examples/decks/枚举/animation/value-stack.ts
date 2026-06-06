import * as sd from "@/sd";

import { Box } from "./box";

// Vertical stack of equal-sized boxes with optional "..." separator. Used
// to render a sample-space column. The string sentinel "..." between two
// items is drawn as a small text (not a box) — matches the "想象有省略
// 的中间" reading of an enumerated range.
//
// Math-y: `topY` is the math-y TOP of the stack. Stack grows downward
// (decreasing math y) so the visual layout matches a "list from top to
// bottom".

const C = sd.color();
const DOTS = "...";

export interface ValueStackOpts {
  targetNode: sd.Group;
  /** Items; the literal string "..." is rendered as a gap separator. */
  items: ReadonlyArray<string>;
  /** Math-y center-x of the column. */
  cx: number;
  /** Math-y top of the column. */
  topY: number;
  elementWidth: number;
  elementHeight: number;
  gap?: number;
  math?: boolean;
  /** Optional column label printed above the first box. */
  label?: string;
  labelGap?: number;
  labelFontSize?: number;
}

export class ValueStack {
  readonly group: sd.Group;
  readonly boxes: Array<Box | sd.Text>;
  readonly cx: number;
  readonly topY: number;
  readonly bottomY: number;
  readonly elementWidth: number;
  readonly elementHeight: number;
  readonly labelText?: sd.Text;

  constructor(opts: ValueStackOpts) {
    this.cx = opts.cx;
    this.topY = opts.topY;
    this.elementWidth = opts.elementWidth;
    this.elementHeight = opts.elementHeight;
    this.group = new sd.Group({ targetNode: opts.targetNode });

    const gap = opts.gap ?? 6;
    const x = opts.cx - opts.elementWidth / 2;
    const dotsHeight = Math.max(12, opts.elementHeight * 0.5);
    let cursorTop = opts.topY;
    this.boxes = [];

    for (const item of opts.items) {
      if (item === DOTS) {
        // Gap separator: thin Text "..." occupying dotsHeight visually.
        const yBottom = cursorTop - dotsHeight;
        this.boxes.push(
          new sd.Text({
            targetNode: this.group,
            text: DOTS,
            cx: opts.cx,
            cy: cursorTop - dotsHeight / 2,
            fontSize: dotsHeight * 0.7,
            fill: C.darkButtonGrey,
          }),
        );
        cursorTop = yBottom - gap;
      } else {
        const yBottom = cursorTop - opts.elementHeight;
        this.boxes.push(
          new Box({
            targetNode: this.group,
            x,
            y: yBottom,
            width: opts.elementWidth,
            height: opts.elementHeight,
            text: item,
            math: opts.math,
          }),
        );
        cursorTop = yBottom - gap;
      }
    }
    this.bottomY = cursorTop + gap; // last gap wasn't actually consumed

    if (opts.label) {
      this.labelText = new sd.Text({
        targetNode: this.group,
        text: opts.label,
        cx: opts.cx,
        cy: opts.topY + (opts.labelGap ?? 14),
        fontSize: opts.labelFontSize ?? 16,
        fill: C.darkButtonGrey,
      });
    }
  }

  left(): number {
    return this.cx - this.elementWidth / 2;
  }
  right(): number {
    return this.cx + this.elementWidth / 2;
  }
  midY(): number {
    return (this.topY + this.bottomY) / 2;
  }
}
