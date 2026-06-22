import * as sd from "@/sd";

const C = sd.color();

export const AXIS_COLOR = C.darkButtonGrey;
export const HEAD_LEN = 8;
export const HEAD_WIDTH = 6;

// Build a line + arrowhead as two SVG paths under `targetNode`. The line is
// an sd.Line so it interpolates between math-coord endpoints; the head is a
// triangle sd.Path anchored at (x2, y2) pointing along the (x1,y1)→(x2,y2)
// direction.
export function arrow(
  targetNode: sd.Group,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: sd.SDColor,
  strokeWidth = 1.2,
): { line: sd.Line; head: sd.Path } {
  const line = new sd.Line({
    targetNode,
    x1,
    y1,
    x2,
    y2,
    stroke: color,
    strokeWidth,
  });
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const px = -uy;
  const py = ux;
  const ax = x2 - ux * HEAD_LEN + px * (HEAD_WIDTH / 2);
  const ay = y2 - uy * HEAD_LEN + py * (HEAD_WIDTH / 2);
  const bx = x2 - ux * HEAD_LEN - px * (HEAD_WIDTH / 2);
  const by = y2 - uy * HEAD_LEN - py * (HEAD_WIDTH / 2);
  const head = new sd.Path({
    targetNode,
    d: `M ${x2} ${y2} L ${ax} ${ay} L ${bx} ${by} Z`,
    fill: color,
    stroke: color,
    strokeWidth: 1,
  });
  return { line, head };
}

// Draw an x-axis and y-axis centered at the origin with arrowheads at the
// positive ends. xHalf / yHalf are half-extents in math coordinates.
export function axes(
  targetNode: sd.Group,
  xHalf: number,
  yHalf: number,
  color: sd.SDColor = AXIS_COLOR,
) {
  arrow(targetNode, -xHalf - 4, 0, xHalf + 4, 0, color);
  arrow(targetNode, 0, -yHalf - 4, 0, yHalf + 4, color);
}

// Sample fn over [xLo, xHi] and build an sd.Path. Splits the path at gaps
// where the function value is non-finite or exceeds |yLimit|, so a single
// Path covers visually-disconnected segments. unitX / unitY scale math
// coordinates to pixel-ish units. opacity=0 by default so callers can fade
// the curve in.
export function plot(
  targetNode: sd.Group,
  fn: (x: number) => number,
  xLo: number,
  xHi: number,
  unitX: number,
  unitY: number,
  yLimit: number,
  color: sd.SDColor,
  opts: { strokeWidth?: number; opacity?: number; steps?: number } = {},
): sd.Path {
  const steps = opts.steps ?? 240;
  let d = "";
  let pen = false;
  for (let i = 0; i <= steps; i++) {
    const x = xLo + ((xHi - xLo) * i) / steps;
    const y = fn(x);
    if (!Number.isFinite(y) || Math.abs(y) > yLimit) {
      pen = false;
      continue;
    }
    d += (pen ? "L " : "M ") + x * unitX + " " + y * unitY + " ";
    pen = true;
  }
  return new sd.Path({
    targetNode,
    d,
    fill: "none",
    stroke: color,
    strokeWidth: opts.strokeWidth ?? 1.8,
    opacity: opts.opacity ?? 0,
  });
}
