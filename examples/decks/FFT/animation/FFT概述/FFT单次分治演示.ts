import * as sd from "@/sd";

import { AXIS_COLOR } from "../common/coord";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 8;
const CELL_W = 38;
const CELL_H = 30;
const GAP = 4;
const TOP_Y = 40;
const BOT_Y = -40;

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
    fontSize: 14,
    opacity: 0,
  });
  return { rect, text };
}

function makeAltText(cx: number, cy: number, latex: string): sd.Math {
  return new sd.Math({
    targetNode: svg,
    text: latex,
    cx,
    cy,
    fontSize: 14,
    opacity: 0,
    fill: C.darkOrange,
  });
}

const topXStart = -((N - 1) * (CELL_W + GAP)) / 2;
const halfRowW = ((N / 2 - 1) * (CELL_W + GAP)) / 2;
const leftCx = -110;
const rightCx = 110;
const f0XStart = leftCx - halfRowW;
const f1XStart = rightCx - halfRowW;

const topCells: Cell[] = [];
const topAlt: sd.Math[] = [];
for (let i = 0; i < N; i++) {
  const cx = topXStart + i * (CELL_W + GAP);
  topCells.push(makeCell(cx, TOP_Y, `a_{${i}}`));
  topAlt.push(makeAltText(cx, TOP_Y, `y_{${i}}`));
}

const f0Cells: Cell[] = [];
const f1Cells: Cell[] = [];
const f0Alt: sd.Math[] = [];
const f1Alt: sd.Math[] = [];
for (let i = 0; i < N / 2; i++) {
  const cx0 = f0XStart + i * (CELL_W + GAP);
  const cx1 = f1XStart + i * (CELL_W + GAP);
  f0Cells.push(makeCell(cx0, BOT_Y, `a_{${2 * i}}`));
  f1Cells.push(makeCell(cx1, BOT_Y, `a_{${2 * i + 1}}`));
  f0Alt.push(makeAltText(cx0, BOT_Y, `y^{(1)}_{${2 * i}}`));
  f1Alt.push(makeAltText(cx1, BOT_Y, `y^{(2)}_{${2 * i + 1}}`));
}

interface ArrowParts {
  line: sd.Line;
  head: sd.Path;
}

function makeArrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: sd.SDColor,
): ArrowParts {
  const headLen = 6;
  const headW = 4;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const px = -uy;
  const py = ux;
  const tipX = x2 - ux * 2;
  const tipY = y2 - uy * 2;
  const ax = tipX - ux * headLen + px * (headW / 2);
  const ay = tipY - uy * headLen + py * (headW / 2);
  const bx = tipX - ux * headLen - px * (headW / 2);
  const by = tipY - uy * headLen - py * (headW / 2);
  const line = new sd.Line({
    targetNode: svg,
    x1,
    y1,
    x2: tipX,
    y2: tipY,
    stroke: color,
    strokeWidth: 1,
    opacity: 0,
  });
  const head = new sd.Path({
    targetNode: svg,
    d: `M ${tipX} ${tipY} L ${ax} ${ay} L ${bx} ${by} Z`,
    fill: color,
    stroke: color,
    strokeWidth: 1,
    opacity: 0,
  });
  return { line, head };
}

// Each top y_i receives one contribution from the even half (f0, blue) and
// one from the odd half (f1, orange). Coloring by source lets the eye trace
// the "two-into-one" structure of the merge step.
const F0_COLOR = C.blue;
const F1_COLOR = C.darkOrange;

const arrows: ArrowParts[] = [];
for (let i = 0; i < N; i++) {
  const dstCx = topXStart + i * (CELL_W + GAP);
  const src0 = f0XStart + (i % (N / 2)) * (CELL_W + GAP);
  const src1 = f1XStart + (i % (N / 2)) * (CELL_W + GAP);
  arrows.push(
    makeArrow(src0, BOT_Y + CELL_H / 2, dstCx, TOP_Y - CELL_H / 2, F0_COLOR),
  );
  arrows.push(
    makeArrow(src1, BOT_Y + CELL_H / 2, dstCx, TOP_Y - CELL_H / 2, F1_COLOR),
  );
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

function fadeOut(
  node: sd.SDNode,
  opts: { delay?: number; duration?: number } = {},
) {
  node
    .startAnimate({
      delay: opts.delay ?? 0,
      duration: opts.duration ?? 200,
      easing: E.easeOut,
    })
    .setOpacity(0)
    .endAnimate();
}

function fadeCells(cells: Cell[], stagger = 50) {
  for (let i = 0; i < cells.length; i++) {
    fadeIn(cells[i].rect, { delay: i * stagger });
    fadeIn(cells[i].text, { delay: i * stagger });
  }
}

sd.main(async () => {
  await sd.pause();
  fadeCells(topCells);
  await sd.pause();
  fadeCells(f0Cells);
  fadeCells(f1Cells);
  await sd.pause();
  for (let i = 0; i < N / 2; i++) {
    fadeOut(f0Cells[i].text, { delay: i * 40 });
    fadeOut(f1Cells[i].text, { delay: i * 40 });
    fadeIn(f0Alt[i], { delay: i * 40 + 150 });
    fadeIn(f1Alt[i], { delay: i * 40 + 150 });
  }
  await sd.pause();
  for (let i = 0; i < arrows.length; i++) {
    fadeIn(arrows[i].line, { delay: i * 20, duration: 200 });
    fadeIn(arrows[i].head, { delay: i * 20, duration: 200 });
  }
  for (let i = 0; i < N; i++) {
    fadeOut(topCells[i].text, { delay: 250 + i * 40 });
    fadeIn(topAlt[i], { delay: 400 + i * 40 });
  }
  await sd.pause();
});
