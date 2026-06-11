import * as sd from "@/sd";

import { fadeIn, NEUTRAL, NEUTRAL_FILL, NEUTRAL_STROKE } from "./style";

export const V_CELL_W = 36;
export const V_CELL_H = 28;
export const V_GAP = 4;
export const V_STEP = V_CELL_H + V_GAP;

export interface VectorCell {
  bg: sd.Rect;
  index: sd.Text;
}

export interface VectorView {
  cells: VectorCell[];
  cx: number;
  cyOf: (i: number) => number;
  label: sd.Math;
}

export interface VectorOptions {
  n: number;
  cx: number;
  cy?: number;
  labelTeX: string;
  indexSide: "l" | "r";
  indexStart?: number;
}

export function makeVector(svg: sd.SDNode, options: VectorOptions): VectorView {
  const n = options.n;
  const cx = options.cx;
  const cy = options.cy ?? 0;
  const indexStart = options.indexStart ?? 0;

  const cyOf = (i: number) => cy + ((n - 1) / 2 - i) * V_STEP;

  const cells: VectorCell[] = [];
  for (let i = 0; i < n; i++) {
    const cellCy = cyOf(i);
    const indexCx =
      options.indexSide === "l"
        ? cx - V_CELL_W / 2 - 14
        : cx + V_CELL_W / 2 + 14;
    cells.push({
      bg: new sd.Rect({
        targetNode: svg,
        x: cx - V_CELL_W / 2,
        y: cellCy - V_CELL_H / 2,
        width: V_CELL_W,
        height: V_CELL_H,
        fill: NEUTRAL_FILL,
        stroke: NEUTRAL_STROKE,
        strokeWidth: 1.2,
        opacity: 0,
      }),
      index: new sd.Text({
        targetNode: svg,
        text: String(indexStart + i),
        cx: indexCx,
        cy: cellCy,
        fontSize: 12,
        fill: NEUTRAL,
        opacity: 0,
      }),
    });
  }

  const topY = cyOf(0) + V_CELL_H / 2 + 16;
  const label = new sd.Math({
    targetNode: svg,
    text: options.labelTeX,
    cx,
    cy: topY,
    fontSize: 16,
    fill: NEUTRAL,
    opacity: 0,
  });

  return { cells, cx, cyOf, label };
}

export function fadeInVector(view: VectorView, baseDelay = 0, step = 25) {
  fadeIn(view.label, baseDelay);
  for (let i = 0; i < view.cells.length; i++) {
    fadeIn(view.cells[i].bg, baseDelay + 80 + i * step);
    fadeIn(view.cells[i].index, baseDelay + 100 + i * step);
  }
}
