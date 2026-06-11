import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

const HL_INSET = 3;

export interface GridOpts {
  targetNode: sd.Group;
  rows: number;
  cols: number;
  size: number;
  x: number;
  y: number;
  cellFill?: sd.SDColor;
  cellStroke?: sd.SDColor;
  textFill?: sd.SDColor;
  fontScale?: number;
  showRowIndex?: boolean;
  showColIndex?: boolean;
}

export class Grid {
  readonly group: sd.Group;
  readonly rows: number;
  readonly cols: number;
  readonly size: number;
  readonly x: number;
  readonly y: number;
  readonly cells: sd.Rect[][] = [];
  readonly overlays: sd.Rect[][] = [];
  readonly glyphs: sd.Text[][] = [];
  readonly rowLabels: sd.Text[] = [];
  readonly colLabels: sd.Text[] = [];
  private values: Array<Array<number | string>> = [];

  constructor(opts: GridOpts) {
    this.rows = opts.rows;
    this.cols = opts.cols;
    this.size = opts.size;
    this.x = opts.x;
    this.y = opts.y;

    this.group = new sd.Group({ targetNode: opts.targetNode });
    const cellFill = opts.cellFill ?? C.white;
    const cellStroke = opts.cellStroke ?? C.silver;
    const textFill = opts.textFill ?? C.darkButtonGrey;
    const fontSize = opts.size * (opts.fontScale ?? 0.5);

    for (let r = 0; r < opts.rows; r++) {
      this.cells.push([]);
      this.overlays.push([]);
      this.glyphs.push([]);
      this.values.push([]);
      for (let c = 0; c < opts.cols; c++) {
        const cellX = opts.x + c * opts.size;
        const cellY = opts.y - r * opts.size;
        this.cells[r].push(
          new sd.Rect({
            targetNode: this.group,
            x: cellX,
            y: cellY,
            width: opts.size,
            height: opts.size,
            fill: cellFill,
            stroke: cellStroke,
            strokeWidth: 1,
            opacity: 0,
          }),
        );
        this.overlays[r].push(
          new sd.Rect({
            targetNode: this.group,
            x: cellX + HL_INSET,
            y: cellY + HL_INSET,
            width: opts.size - 2 * HL_INSET,
            height: opts.size - 2 * HL_INSET,
            fill: C.white,
            stroke: C.silver,
            strokeWidth: 1.4,
            opacity: 0,
          }),
        );
        this.glyphs[r].push(
          new sd.Text({
            targetNode: this.group,
            text: "",
            cx: cellX + opts.size / 2,
            cy: cellY + opts.size / 2,
            fontSize,
            fill: textFill,
            opacity: 0,
          }),
        );
        this.values[r].push("");
      }
    }

    if (opts.showColIndex) {
      for (let c = 0; c < opts.cols; c++) {
        const cellX = opts.x + c * opts.size;
        this.colLabels.push(
          new sd.Text({
            targetNode: this.group,
            text: String(c + 1),
            cx: cellX + opts.size / 2,
            cy: opts.y + opts.size + opts.size * 0.35,
            fontSize: opts.size * 0.4,
            fill: textFill,
            opacity: 0,
          }),
        );
      }
    }
    if (opts.showRowIndex) {
      for (let r = 0; r < opts.rows; r++) {
        const cellY = opts.y - r * opts.size;
        this.rowLabels.push(
          new sd.Text({
            targetNode: this.group,
            text: String(r + 1),
            cx: opts.x - opts.size * 0.35,
            cy: cellY + opts.size / 2,
            fontSize: opts.size * 0.4,
            fill: textFill,
            opacity: 0,
          }),
        );
      }
    }
  }

  fadeIn(opts?: { delay?: number; duration?: number }): number {
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 320;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.cells[r][c]
          .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
          .setOpacity(1)
          .endAnimate();
      }
    }
    for (const t of [...this.rowLabels, ...this.colLabels]) {
      t.startAnimate({ delay: d, duration: dur, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
    return d + dur;
  }

  setValue(
    r: number,
    c: number,
    v: number | string,
    opts?: { delay?: number; duration?: number },
  ) {
    this.values[r - 1][c - 1] = v;
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 200;
    this.glyphs[r - 1][c - 1]
      .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
      .setText(String(v))
      .setOpacity(1)
      .endAnimate();
  }

  intValue(r: number, c: number): number {
    const v = this.values[r - 1][c - 1];
    return typeof v === "number" ? v : Number(v);
  }

  paintCell(
    r: number,
    c: number,
    fill: sd.SDColor,
    stroke: sd.SDColor,
    opts?: { delay?: number; duration?: number },
  ) {
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 220;
    this.overlays[r - 1][c - 1]
      .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
      .setFill(fill)
      .setStroke(stroke)
      .setOpacity(1)
      .endAnimate();
  }

  clearAll(opts?: { delay?: number; duration?: number }) {
    const d = opts?.delay ?? 0;
    const dur = opts?.duration ?? 220;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.overlays[r][c]
          .startAnimate({ delay: d, duration: dur, easing: E.easeOut })
          .setOpacity(0)
          .endAnimate();
      }
    }
  }

  cellCx(c: number): number {
    return this.x + (c - 0.5) * this.size;
  }
  cellCy(r: number): number {
    return this.y - (r - 1) * this.size + this.size / 2;
  }
}
