import * as sd from "@/sd";

// N rows × M columns grid of equal-sized square cells, 1-indexed (row, col).
// Row 1 sits at the top of the math-y range; row N at the bottom. cellRect
// gives back the underlying Rect so callers can animate fill / stroke
// directly without going through an inset overlay (grids are visually
// flat regions, not sequences of distinct chips like CharRow's cells).

const C = sd.color();
const E = sd.easing();

export interface GridOpts {
  targetNode: sd.Group;
  rows: number;
  cols: number;
  cellSize: number;
  /** Math-y bottom-left of the grid. */
  x?: number;
  y?: number;
  cellFill?: sd.SDColor;
  cellStroke?: sd.SDColor;
  cellStrokeWidth?: number;
  rowLabels?: ReadonlyArray<string>;
  colLabels?: ReadonlyArray<string>;
  labelGap?: number;
  labelFontSize?: number;
}

export class Grid {
  readonly group: sd.Group;
  readonly rows: number;
  readonly cols: number;
  readonly cellSize: number;
  readonly x0: number;
  readonly y0: number;
  /** cells[r-1][c-1] for r ∈ [1, rows], c ∈ [1, cols]. */
  readonly cells: sd.Rect[][];

  constructor(opts: GridOpts) {
    this.rows = opts.rows;
    this.cols = opts.cols;
    this.cellSize = opts.cellSize;
    this.x0 = opts.x ?? 0;
    this.y0 = opts.y ?? 0;
    this.group = new sd.Group({ targetNode: opts.targetNode });

    const fill = opts.cellFill ?? C.white;
    const stroke = opts.cellStroke ?? C.silver;
    const strokeWidth = opts.cellStrokeWidth ?? 1;

    this.cells = [];
    for (let r = 1; r <= opts.rows; r++) {
      const row: sd.Rect[] = [];
      for (let c = 1; c <= opts.cols; c++) {
        row.push(
          new sd.Rect({
            targetNode: this.group,
            x: this.x0 + (c - 1) * opts.cellSize,
            // Row 1 at top: its math-y bottom is total height minus 1 * size.
            y: this.y0 + (opts.rows - r) * opts.cellSize,
            width: opts.cellSize,
            height: opts.cellSize,
            fill,
            stroke,
            strokeWidth,
          }),
        );
      }
      this.cells.push(row);
    }

    const labelGap = opts.labelGap ?? 14;
    const labelFontSize = opts.labelFontSize ?? 14;
    if (opts.rowLabels) {
      for (let r = 1; r <= Math.min(opts.rowLabels.length, opts.rows); r++) {
        new sd.Text({
          targetNode: this.group,
          text: opts.rowLabels[r - 1],
          cx: this.x0 - labelGap,
          cy: this.cellCy(r, 1),
          fontSize: labelFontSize,
          fill: C.darkButtonGrey,
        });
      }
    }
    if (opts.colLabels) {
      for (let c = 1; c <= Math.min(opts.colLabels.length, opts.cols); c++) {
        new sd.Text({
          targetNode: this.group,
          text: opts.colLabels[c - 1],
          cx: this.cellCx(1, c),
          cy: this.y0 + opts.rows * opts.cellSize + labelGap,
          fontSize: labelFontSize,
          fill: C.darkButtonGrey,
        });
      }
    }
  }

  cellRect(r: number, c: number): sd.Rect {
    return this.cells[r - 1][c - 1];
  }

  cellCx(_r: number, c: number): number {
    return this.x0 + (c - 0.5) * this.cellSize;
  }

  cellCy(r: number, _c: number): number {
    return this.y0 + (this.rows - r + 0.5) * this.cellSize;
  }

  width(): number {
    return this.cols * this.cellSize;
  }

  height(): number {
    return this.rows * this.cellSize;
  }

  left(): number {
    return this.x0;
  }
  right(): number {
    return this.x0 + this.width();
  }
  bottom(): number {
    return this.y0;
  }
  top(): number {
    return this.y0 + this.height();
  }

  paintCell(
    r: number,
    c: number,
    fill: sd.SDColor,
    opts?: { delay?: number; duration?: number; stroke?: sd.SDColor },
  ): void {
    const cell = this.cellRect(r, c);
    const a = cell.startAnimate({
      delay: opts?.delay ?? 0,
      duration: opts?.duration ?? 220,
      easing: E.easeOut,
    });
    a.setFill(fill);
    if (opts?.stroke !== undefined) a.setStroke(opts.stroke);
    a.endAnimate();
  }

  /** Inclusive range (r1..r2) × (c1..c2). Order-agnostic. */
  paintRange(
    r1: number,
    c1: number,
    r2: number,
    c2: number,
    fill: sd.SDColor,
    opts?: { delay?: number; duration?: number; stroke?: sd.SDColor },
  ): void {
    const rmin = Math.min(r1, r2);
    const rmax = Math.max(r1, r2);
    const cmin = Math.min(c1, c2);
    const cmax = Math.max(c1, c2);
    for (let r = rmin; r <= rmax; r++) {
      for (let c = cmin; c <= cmax; c++) this.paintCell(r, c, fill, opts);
    }
  }

  clearAll(opts?: {
    delay?: number;
    duration?: number;
    fill?: sd.SDColor;
  }): void {
    const fill = opts?.fill ?? C.white;
    for (let r = 1; r <= this.rows; r++) {
      for (let c = 1; c <= this.cols; c++) {
        this.paintCell(r, c, fill, {
          delay: opts?.delay,
          duration: opts?.duration,
        });
      }
    }
  }
}
