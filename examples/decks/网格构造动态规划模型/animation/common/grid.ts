import * as sd from "@/sd";

import { fadeIn, NEUTRAL_FILL, NEUTRAL_STROKE } from "./style";

export interface GridCell {
  bg: sd.Rect;
  r: number;
  c: number;
  cx: number;
  cy: number;
}

export interface Grid {
  cells: GridCell[][];
  rows: number;
  cols: number;
  cellW: number;
  cellH: number;
  cxOf: (c: number) => number;
  cyOf: (r: number) => number;
}

export interface GridOptions {
  rows: number;
  cols: number;
  cellW?: number;
  cellH?: number;
  gap?: number;
  cx?: number;
  cy?: number;
  fill?: string;
  stroke?: string;
}

export function makeGrid(svg: sd.SDNode, options: GridOptions): Grid {
  const rows = options.rows;
  const cols = options.cols;
  const cellW = options.cellW ?? 30;
  const cellH = options.cellH ?? cellW;
  const gap = options.gap ?? 2;
  const cx0 = options.cx ?? 0;
  const cy0 = options.cy ?? 0;
  const stepX = cellW + gap;
  const stepY = cellH + gap;
  const fill = options.fill ?? NEUTRAL_FILL;
  const stroke = options.stroke ?? NEUTRAL_STROKE;

  const cxOf = (c: number) => cx0 + (c - (cols - 1) / 2) * stepX;
  const cyOf = (r: number) => cy0 + ((rows - 1) / 2 - r) * stepY;

  const cells: GridCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: GridCell[] = [];
    for (let c = 0; c < cols; c++) {
      const cx = cxOf(c);
      const cy = cyOf(r);
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
      row.push({ bg, r, c, cx, cy });
    }
    cells.push(row);
  }
  return { cells, rows, cols, cellW, cellH, cxOf, cyOf };
}

export function fadeInGrid(grid: Grid, baseDelay = 0, step = 18) {
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      fadeIn(grid.cells[r][c].bg, baseDelay + (r * grid.cols + c) * step);
    }
  }
}
