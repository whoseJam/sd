import * as sd from "@/sd";

// Simple arrow: line from `from` to `to` plus a small triangular head at
// `to`. Returns a Group containing both, so the caller can fade or
// transform them together.

const C = sd.color();

export interface ArrowOpts {
  targetNode?: sd.Group;
  from: { x: number; y: number };
  to: { x: number; y: number };
  stroke?: sd.SDColor;
  strokeWidth?: number;
  headSize?: number;
  opacity?: number;
}

export function arrow(svg: sd.Group, opts: ArrowOpts): sd.Group {
  const stroke = opts.stroke ?? C.darkButtonGrey;
  const strokeWidth = opts.strokeWidth ?? 1.2;
  const headSize = opts.headSize ?? 7;
  const target = opts.targetNode ?? svg;

  const dx = opts.to.x - opts.from.x;
  const dy = opts.to.y - opts.from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  // Rotated 90deg from the direction unit vector.
  const nx = -uy;
  const ny = ux;
  // Shaft ends just before the head's base so the head's tip = opts.to.
  const baseX = opts.to.x - ux * headSize;
  const baseY = opts.to.y - uy * headSize;

  const g = new sd.Group({ targetNode: target, opacity: opts.opacity ?? 1 });
  new sd.Line({
    targetNode: g,
    x1: opts.from.x,
    y1: opts.from.y,
    x2: baseX,
    y2: baseY,
    stroke,
    strokeWidth,
  });
  new sd.Polygon({
    targetNode: g,
    points: [
      [opts.to.x, opts.to.y],
      [baseX + nx * headSize * 0.5, baseY + ny * headSize * 0.5],
      [baseX - nx * headSize * 0.5, baseY - ny * headSize * 0.5],
    ],
    fill: stroke,
    stroke: C.none,
  });
  return g;
}
