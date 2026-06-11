import * as sd from "@/sd";

import { fadeIn, NEUTRAL_FILL, NEUTRAL_STROKE } from "./style";

export interface BitCell {
  bg: sd.Rect;
  text: sd.Text;
  cx: number;
  cy: number;
}

export interface BitRow {
  cells: BitCell[];
  cxOf: (i: number) => number;
  cy: number;
  cellW: number;
  cellH: number;
}

export interface BitRowOptions {
  bits: (0 | 1)[];
  cellW?: number;
  cellH?: number;
  gap?: number;
  cx?: number;
  cy?: number;
  fontSize?: number;
  fill?: string;
  stroke?: string;
  textFill?: string;
}

export function makeBits(svg: sd.SDNode, options: BitRowOptions): BitRow {
  const bits = options.bits;
  const cellW = options.cellW ?? 28;
  const cellH = options.cellH ?? 28;
  const gap = options.gap ?? 2;
  const cx0 = options.cx ?? 0;
  const cy = options.cy ?? 0;
  const fontSize = options.fontSize ?? 14;
  const fill = options.fill ?? NEUTRAL_FILL;
  const stroke = options.stroke ?? NEUTRAL_STROKE;
  const textFill = options.textFill ?? NEUTRAL_STROKE;
  const step = cellW + gap;
  const n = bits.length;
  const cxOf = (i: number) => cx0 + (i - (n - 1) / 2) * step;

  const cells: BitCell[] = [];
  for (let i = 0; i < n; i++) {
    const cx = cxOf(i);
    const bg = new sd.Rect({
      targetNode: svg,
      x: cx - cellW / 2,
      y: cy - cellH / 2,
      width: cellW,
      height: cellH,
      fill,
      stroke,
      strokeWidth: 1.2,
      opacity: 0,
    });
    const text = new sd.Text({
      targetNode: svg,
      text: String(bits[i]),
      cx,
      cy,
      fontSize,
      fill: textFill,
      opacity: 0,
    });
    cells.push({ bg, text, cx, cy });
  }
  return { cells, cxOf, cy, cellW, cellH };
}

export function fadeInBits(row: BitRow, baseDelay = 0, step = 30) {
  for (let i = 0; i < row.cells.length; i++) {
    fadeIn(row.cells[i].bg, baseDelay + i * step);
    fadeIn(row.cells[i].text, baseDelay + i * step + 30);
  }
}
