import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export interface FTableOpts {
  targetNode: sd.Group;
  rows: number;
  cols: number;
  cellSize: number;
  x: number;
  y: number;
  label?: string;
}

export class FTable {
  readonly group: sd.Group;
  readonly rows: number;
  readonly cols: number;
  readonly size: number;
  readonly x: number;
  readonly y: number;
  private cellRects: sd.Rect[][] = [];
  private glyphs: sd.Text[][] = [];

  constructor(opts: FTableOpts) {
    this.group = new sd.Group({ targetNode: opts.targetNode });
    this.rows = opts.rows;
    this.cols = opts.cols;
    this.size = opts.cellSize;
    this.x = opts.x;
    this.y = opts.y;

    for (let j = 0; j < opts.rows; j++) {
      const cellRow: sd.Rect[] = [];
      const glyphRow: sd.Text[] = [];
      for (let i = 1; i <= opts.cols; i++) {
        const cellX = opts.x + (i - 1) * opts.cellSize;
        const cellY = opts.y + (opts.rows - 1 - j) * opts.cellSize;
        cellRow.push(
          new sd.Rect({
            targetNode: this.group,
            x: cellX,
            y: cellY,
            width: opts.cellSize,
            height: opts.cellSize,
            fill: C.white,
            stroke: C.silver,
            strokeWidth: 1,
          }),
        );
        glyphRow.push(
          new sd.Text({
            targetNode: this.group,
            text: "",
            cx: cellX + opts.cellSize / 2,
            cy: cellY + opts.cellSize / 2,
            fontSize: opts.cellSize * 0.4,
            fill: C.darkButtonGrey,
          }),
        );
      }
      this.cellRects.push(cellRow);
      this.glyphs.push(glyphRow);
    }

    for (let j = 0; j < opts.rows; j++) {
      new sd.Math({
        targetNode: this.group,
        text: `2^{${j}}`,
        cx: opts.x - 24,
        cy: opts.y + (opts.rows - 1 - j + 0.5) * opts.cellSize,
        fontSize: 14,
        fill: C.darkButtonGrey,
      });
    }
    for (let i = 1; i <= opts.cols; i++) {
      new sd.Text({
        targetNode: this.group,
        text: String(i),
        cx: opts.x + (i - 0.5) * opts.cellSize,
        cy: opts.y - 14,
        fontSize: 12,
        fill: C.darkButtonGrey,
      });
    }
    if (opts.label) {
      new sd.Text({
        targetNode: this.group,
        text: opts.label,
        cx: opts.x - 24,
        cy: opts.y + opts.rows * opts.cellSize + 14,
        fontSize: 14,
        fill: C.darkButtonGrey,
      });
    }
  }

  cellCx(j: number, i: number): number {
    return this.x + (i - 0.5) * this.size;
  }
  cellCy(j: number, _i: number): number {
    return this.y + (this.rows - 1 - j + 0.5) * this.size;
  }

  paintCell(
    j: number,
    i: number,
    fill: sd.SDColor,
    stroke: sd.SDColor,
    opts?: { delay?: number; duration?: number },
  ) {
    this.cellRects[j][i - 1]
      .startAnimate({
        delay: opts?.delay ?? 0,
        duration: opts?.duration ?? 200,
        easing: E.easeOut,
      })
      .setFill(fill)
      .setStroke(stroke)
      .endAnimate();
  }

  clearCell(
    j: number,
    i: number,
    opts?: { delay?: number; duration?: number },
  ) {
    this.cellRects[j][i - 1]
      .startAnimate({
        delay: opts?.delay ?? 0,
        duration: opts?.duration ?? 200,
        easing: E.easeOut,
      })
      .setFill(C.white)
      .setStroke(C.silver)
      .endAnimate();
  }

  setValue(
    j: number,
    i: number,
    v: number | string,
    opts?: { delay?: number; duration?: number },
  ) {
    this.glyphs[j][i - 1]
      .startAnimate({
        delay: opts?.delay ?? 0,
        duration: opts?.duration ?? 200,
        easing: E.easeOut,
      })
      .setText(String(v))
      .endAnimate();
  }
}
