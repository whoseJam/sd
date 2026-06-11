import * as sd from "@/sd";

import { fadeIn, NEUTRAL, NEUTRAL_FILL, NEUTRAL_STROKE } from "./style";

export const CELL_W = 44;
export const CELL_H = 36;
export const CELL_GAP = 6;
export const STEP = CELL_W + CELL_GAP;

export interface StripCell {
  bg: sd.Rect;
  content: sd.Text | sd.Circle | sd.Math | null;
}

export interface Strip {
  cells: StripCell[];
  cxOf: (idx: number) => number;
  cy: number;
}

export interface StripOptions {
  n: number;
  cy?: number;
  start?: number;
  emptyCells?: boolean;
}

export function makeStrip(svg: sd.SDNode, opts: StripOptions): Strip {
  const n = opts.n;
  const cy = opts.cy ?? 0;
  const start = opts.start ?? 1;
  const cxOf = (idx: number) => (idx - (n - 1) / 2) * STEP;

  const cells: StripCell[] = [];
  for (let i = 0; i < n; i++) {
    const cx = cxOf(i);
    const bg = new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: cy - CELL_H / 2,
      width: CELL_W,
      height: CELL_H,
      fill: NEUTRAL_FILL,
      stroke: NEUTRAL_STROKE,
      strokeWidth: 1.2,
      opacity: 0,
    });
    let content: sd.Text | null = null;
    if (!opts.emptyCells) {
      content = new sd.Text({
        targetNode: svg,
        text: String(start + i),
        cx,
        cy,
        fontSize: 14,
        fill: NEUTRAL_STROKE,
        opacity: 0,
      });
    }
    cells.push({ bg, content });
  }

  return { cells, cxOf, cy };
}

export function fadeInStrip(strip: Strip, baseDelay = 0, step = 35) {
  for (let i = 0; i < strip.cells.length; i++) {
    fadeIn(strip.cells[i].bg, baseDelay + i * step);
    if (strip.cells[i].content)
      fadeIn(strip.cells[i].content!, baseDelay + i * step + 40);
  }
}

export interface BraceOptions {
  from: number;
  to: number;
  cy: number;
  label?: string;
  labelFontSize?: number;
}

export interface Brace {
  path: sd.Path;
  label: sd.Math | null;
}

export function makeBrace(
  svg: sd.SDNode,
  strip: Strip,
  opts: BraceOptions,
): Brace {
  const left = strip.cxOf(opts.from) - CELL_W / 2;
  const right = strip.cxOf(opts.to) + CELL_W / 2;
  const cx = (left + right) / 2;
  const y = opts.cy;
  const tab = 5;
  const drop = 6;
  const d = [
    `M ${left} ${y}`,
    `L ${left} ${y - drop}`,
    `L ${cx - tab} ${y - drop}`,
    `L ${cx} ${y - drop - tab}`,
    `L ${cx + tab} ${y - drop}`,
    `L ${right} ${y - drop}`,
    `L ${right} ${y}`,
  ].join(" ");
  const path = new sd.Path({
    targetNode: svg,
    d,
    stroke: NEUTRAL,
    strokeWidth: 1.2,
    fill: "none",
    opacity: 0,
  });
  let label: sd.Math | null = null;
  if (opts.label) {
    label = new sd.Math({
      targetNode: svg,
      text: opts.label,
      cx,
      cy: y - drop - tab - 14,
      fontSize: opts.labelFontSize ?? 14,
      fill: NEUTRAL,
      opacity: 0,
    });
  }
  return { path, label };
}

export interface PointerOptions {
  idx: number;
  cy: number;
  label: string;
  fontSize?: number;
}

export interface Pointer {
  arrow: sd.Path;
  label: sd.Math;
}

export function makePointer(
  svg: sd.SDNode,
  strip: Strip,
  opts: PointerOptions,
): Pointer {
  const cx = strip.cxOf(opts.idx);
  const y = opts.cy;
  const arrow = new sd.Path({
    targetNode: svg,
    d: `M ${cx} ${y} L ${cx - 5} ${y + 10} L ${cx + 5} ${y + 10} Z`,
    fill: NEUTRAL,
    stroke: "none",
    opacity: 0,
  });
  const label = new sd.Math({
    targetNode: svg,
    text: opts.label,
    cx,
    cy: y + 22,
    fontSize: opts.fontSize ?? 14,
    fill: NEUTRAL,
    opacity: 0,
  });
  return { arrow, label };
}
