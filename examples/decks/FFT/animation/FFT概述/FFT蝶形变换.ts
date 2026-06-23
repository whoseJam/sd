import * as sd from "@/sd";

import { AXIS_COLOR } from "../common/coord";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 4;
const LOG_N = 2;
const CELL_W = 48;
const CELL_H = 26;
const ROW_GAP = 14;
const COL_GAP = 96;

function bitReverse(x: number, bits: number): number {
  let r = 0;
  for (let i = 0; i < bits; i++) r = (r << 1) | ((x >> i) & 1);
  return r;
}

function colCx(c: number): number {
  return (c - LOG_N / 2) * (CELL_W + COL_GAP);
}

function rowCy(r: number): number {
  return (N / 2 - 0.5 - r) * (CELL_H + ROW_GAP);
}

interface Cell {
  rect: sd.Rect;
  text: sd.Math;
}

function makeCell(cx: number, cy: number, latex: string): Cell {
  const rect = new sd.Rect({
    targetNode: svg,
    cx,
    cy,
    width: CELL_W,
    height: CELL_H,
    fill: "none",
    stroke: AXIS_COLOR,
    strokeWidth: 1.2,
    opacity: 0,
  });
  const text = new sd.Math({
    targetNode: svg,
    text: latex,
    cx,
    cy,
    fontSize: 12,
    opacity: 0,
  });
  return { rect, text };
}

const TOP_LABEL_CY = rowCy(0) + CELL_H / 2 + 18;

const colLabels: sd.Text[] = [];
for (let c = 0; c <= LOG_N; c++) {
  const text = c === 0 ? "input" : c === LOG_N ? "output" : `stage ${c}`;
  colLabels.push(
    new sd.Text({
      targetNode: svg,
      text,
      cx: colCx(c),
      cy: TOP_LABEL_CY,
      fontSize: 11,
      fill: AXIS_COLOR,
      opacity: 0,
    }),
  );
}

const cols: Cell[][] = [];
for (let c = 0; c <= LOG_N; c++) {
  const cells: Cell[] = [];
  for (let r = 0; r < N; r++) {
    let label: string;
    if (c === 0) label = `a_{${bitReverse(r, LOG_N)}}`;
    else if (c === LOG_N) label = `y_{${r}}`;
    else label = `y^{(${c})}_{${r}}`;
    cells.push(makeCell(colCx(c), rowCy(r), label));
  }
  cols.push(cells);
}

const stageLines: sd.Line[][] = [];
for (let c = 0; c < LOG_N; c++) {
  const stride = 1 << c;
  const x1 = colCx(c) + CELL_W / 2;
  const x2 = colCx(c + 1) - CELL_W / 2;
  const lines: sd.Line[] = [];
  for (let r = 0; r < N; r++) {
    const partner = r ^ stride;
    lines.push(
      new sd.Line({
        targetNode: svg,
        x1,
        y1: rowCy(r),
        x2,
        y2: rowCy(r),
        stroke: AXIS_COLOR,
        strokeWidth: 0.9,
        opacity: 0,
      }),
    );
    lines.push(
      new sd.Line({
        targetNode: svg,
        x1,
        y1: rowCy(r),
        x2,
        y2: rowCy(partner),
        stroke: C.darkOrange,
        strokeWidth: 0.9,
        opacity: 0,
      }),
    );
  }
  stageLines.push(lines);
}

function fadeIn(
  node: sd.SDNode,
  opts: { delay?: number; duration?: number } = {},
) {
  node
    .startAnimate({
      delay: opts.delay ?? 0,
      duration: opts.duration ?? 260,
      easing: E.easeOut,
    })
    .setOpacity(1)
    .endAnimate();
}

function fadeInCol(c: number, stagger = 40) {
  const col = cols[c];
  fadeIn(colLabels[c], { delay: 0, duration: 220 });
  for (let r = 0; r < col.length; r++) {
    fadeIn(col[r].rect, { delay: r * stagger });
    fadeIn(col[r].text, { delay: r * stagger + 60 });
  }
}

function fadeInLines(lines: sd.Line[], stagger = 30) {
  for (let i = 0; i < lines.length; i++) {
    fadeIn(lines[i], { delay: i * stagger, duration: 220 });
  }
}

sd.main(async () => {
  await sd.pause();
  fadeInCol(0);
  await sd.pause();
  fadeInLines(stageLines[0]);
  fadeInCol(1);
  await sd.pause();
  fadeInLines(stageLines[1]);
  fadeInCol(2);
  await sd.pause();
});
