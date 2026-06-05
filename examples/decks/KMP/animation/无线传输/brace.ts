import * as sd from "@/sd";

// Small bracket: horizontal bar, two end ticks pointing toward the row
// being annotated, and a center tick + label on the far side.
//
// Local helper for the 无线传输 sub-section. Both anims (周期串 and
// 非完整周期串) need two of these per slide; inlining drifts.

const C = sd.color();

export interface BraceOpts {
  targetNode?: sd.Group;
  xL: number;
  xR: number;
  y: number;
  rowSide: "above" | "below";
  label?: string;
  tick?: number;
  labelGap?: number;
  fontSize?: number;
  stroke?: sd.SDColor;
  strokeWidth?: number;
}

export function makeBrace(svg: sd.Group, opts: BraceOpts): sd.Group {
  const { xL, xR, y, rowSide, label } = opts;
  const tick = opts.tick ?? 6;
  const labelGap = opts.labelGap ?? 12;
  const fontSize = opts.fontSize ?? 16;
  const stroke = opts.stroke ?? C.darkButtonGrey;
  const strokeWidth = opts.strokeWidth ?? 1.3;

  const towardRow = rowSide === "above" ? +tick : -tick;
  const awayRow = -towardRow;
  const g = new sd.Group({ targetNode: opts.targetNode ?? svg, opacity: 0 });

  new sd.Line({ targetNode: g, x1: xL, y1: y, x2: xR, y2: y, stroke, strokeWidth });
  new sd.Line({ targetNode: g, x1: xL, y1: y, x2: xL, y2: y + towardRow, stroke, strokeWidth });
  new sd.Line({ targetNode: g, x1: xR, y1: y, x2: xR, y2: y + towardRow, stroke, strokeWidth });
  new sd.Line({
    targetNode: g,
    x1: (xL + xR) / 2,
    y1: y,
    x2: (xL + xR) / 2,
    y2: y + awayRow,
    stroke,
    strokeWidth,
  });
  if (label) {
    new sd.Text({
      targetNode: g,
      text: label,
      cx: (xL + xR) / 2,
      cy: y + awayRow + (rowSide === "above" ? -labelGap : labelGap),
      fontSize,
      fill: stroke,
    });
  }
  return g;
}
