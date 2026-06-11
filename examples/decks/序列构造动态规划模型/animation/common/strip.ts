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

export function makeStrip(svg: sd.SDNode, options: StripOptions): Strip {
  const n = options.n;
  const cy = options.cy ?? 0;
  const start = options.start ?? 1;
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
    if (!options.emptyCells) {
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
  cy: number;
  labelCy: number;
}

const BRACE_TAB = 5;
const BRACE_DROP = 6;
const BRACE_LABEL_GAP = 14;

export function braceD(left: number, right: number, cy: number): string {
  const cx = (left + right) / 2;
  return [
    `M ${left} ${cy}`,
    `L ${left} ${cy - BRACE_DROP}`,
    `L ${cx - BRACE_TAB} ${cy - BRACE_DROP}`,
    `L ${cx} ${cy - BRACE_DROP - BRACE_TAB}`,
    `L ${cx + BRACE_TAB} ${cy - BRACE_DROP}`,
    `L ${right} ${cy - BRACE_DROP}`,
    `L ${right} ${cy}`,
  ].join(" ");
}

export function braceLabelCy(cy: number): number {
  return cy - BRACE_DROP - BRACE_TAB - BRACE_LABEL_GAP;
}

export function makeBrace(
  svg: sd.SDNode,
  strip: Strip,
  options: BraceOptions,
): Brace {
  const left = strip.cxOf(options.from) - CELL_W / 2;
  const right = strip.cxOf(options.to) + CELL_W / 2;
  const cx = (left + right) / 2;
  const cy = options.cy;
  const labelCy = braceLabelCy(cy);
  const path = new sd.Path({
    targetNode: svg,
    d: braceD(left, right, cy),
    stroke: NEUTRAL,
    strokeWidth: 1.2,
    fill: "none",
    opacity: 0,
  });
  let label: sd.Math | null = null;
  if (options.label) {
    label = new sd.Math({
      targetNode: svg,
      text: options.label,
      cx,
      cy: labelCy,
      fontSize: options.labelFontSize ?? 14,
      fill: NEUTRAL,
      opacity: 0,
    });
  }
  return { path, label, cy, labelCy };
}

export interface PointerOptions {
  idx: number;
  cy: number;
  label: string;
  fontSize?: number;
}

export interface Pointer {
  arrow: sd.Path;
  label: sd.Text;
}

export function pointerArrowD(cx: number, cy: number): string {
  return `M ${cx} ${cy} L ${cx - 5} ${cy + 10} L ${cx + 5} ${cy + 10} Z`;
}

export function makePointer(
  svg: sd.SDNode,
  strip: Strip,
  options: PointerOptions,
): Pointer {
  const cx = strip.cxOf(options.idx);
  const y = options.cy;
  const arrow = new sd.Path({
    targetNode: svg,
    d: pointerArrowD(cx, y),
    fill: NEUTRAL,
    stroke: "none",
    opacity: 0,
  });
  const label = new sd.Text({
    targetNode: svg,
    text: options.label,
    cx,
    cy: y + 22,
    fontSize: options.fontSize ?? 14,
    fill: NEUTRAL,
    opacity: 0,
  });
  return { arrow, label };
}
