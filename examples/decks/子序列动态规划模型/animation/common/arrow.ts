import * as sd from "@/sd";

export interface ArrowedArc {
  arc: sd.Path;
  head: sd.Path;
}

export function arrowedArc(
  targetNode: sd.SDNode,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  arcOffset = 18,
  headSize = 6,
  headWidth = 3,
): ArrowedArc {
  const cxC = (x1 + x2) / 2;
  const cyC = (y1 + y2) / 2 + arcOffset;
  const arc = new sd.Path({
    targetNode,
    d: `M ${x1} ${y1} Q ${cxC} ${cyC} ${x2} ${y2}`,
    stroke: color,
    strokeWidth: 1.4,
    fill: "none",
    opacity: 0,
  });
  const dx = x2 - cxC;
  const dy = y2 - cyC;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x2 - ux * headSize;
  const by = y2 - uy * headSize;
  const lx = bx + -uy * headWidth;
  const ly = by + ux * headWidth;
  const rx = bx - -uy * headWidth;
  const ry = by - ux * headWidth;
  const head = new sd.Path({
    targetNode,
    d: `M ${x2} ${y2} L ${lx} ${ly} L ${rx} ${ry} Z`,
    stroke: "none",
    fill: color,
    opacity: 0,
  });
  return { arc, head };
}
