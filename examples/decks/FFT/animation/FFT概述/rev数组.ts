import * as sd from "@/sd";

import { AXIS_COLOR } from "../common/coord";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 8;
const LOG_N = 3;
const CELL_W = 50;
const CELL_H = 32;
const GAP = 4;
const TOP_Y = 70;
const BOT_Y = -70;
const BIN_OFFSET = 24;

function bitReverse(x: number, bits: number): number {
  let r = 0;
  for (let i = 0; i < bits; i++) {
    r = (r << 1) | ((x >> i) & 1);
  }
  return r;
}

function toBin(x: number, bits: number): string {
  let s = "";
  for (let i = bits - 1; i >= 0; i--) s += (x >> i) & 1;
  return s;
}

interface CellGroup {
  rect: sd.Rect;
  value: sd.Math;
  bin: sd.Text;
}

function makeCellGroup(
  cx: number,
  cy: number,
  valueLatex: string,
  binText: string,
  binOutside: "above" | "below",
): CellGroup {
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
  const value = new sd.Math({
    targetNode: svg,
    text: valueLatex,
    cx,
    cy,
    fontSize: 16,
    opacity: 0,
  });
  const bin = new sd.Text({
    targetNode: svg,
    text: binText,
    cx,
    cy: cy + (binOutside === "above" ? BIN_OFFSET : -BIN_OFFSET),
    fontSize: 12,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  return { rect, value, bin };
}

const xStart = -((N - 1) * (CELL_W + GAP)) / 2;

const topCells: CellGroup[] = [];
const botCells: CellGroup[] = [];

for (let i = 0; i < N; i++) {
  const cx = xStart + i * (CELL_W + GAP);
  topCells.push(makeCellGroup(cx, TOP_Y, `a_{${i}}`, toBin(i, LOG_N), "above"));
}

for (let pos = 0; pos < N; pos++) {
  const cx = xStart + pos * (CELL_W + GAP);
  const sourceIdx = bitReverse(pos, LOG_N);
  botCells.push(
    makeCellGroup(cx, BOT_Y, `a_{${sourceIdx}}`, toBin(pos, LOG_N), "below"),
  );
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

// Arrows: cells that map to themselves (rev[i] == i) get the neutral axis
// color. Cells that swap with a partner share a palette color, so the eye
// can pair them up at a glance.
const SWAP_PALETTE: sd.SDColor[] = [C.blue, C.darkOrange, C.green, C.red];

const arrowColors = new Map<number, sd.SDColor>();
let palettePtr = 0;
for (let i = 0; i < N; i++) {
  const j = bitReverse(i, LOG_N);
  if (i === j) {
    arrowColors.set(i, AXIS_COLOR);
  } else if (!arrowColors.has(i)) {
    const color = SWAP_PALETTE[palettePtr++ % SWAP_PALETTE.length];
    arrowColors.set(i, color);
    arrowColors.set(j, color);
  }
}

const arrows: ArrowParts[] = [];
for (let i = 0; i < N; i++) {
  const srcCx = xStart + i * (CELL_W + GAP);
  const dstPos = bitReverse(i, LOG_N);
  const dstCx = xStart + dstPos * (CELL_W + GAP);
  arrows.push(
    makeArrow(
      srcCx,
      TOP_Y - CELL_H / 2,
      dstCx,
      BOT_Y + CELL_H / 2,
      arrowColors.get(i) ?? AXIS_COLOR,
    ),
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

function fadeInGroup(cells: CellGroup[], stagger = 40) {
  for (let i = 0; i < cells.length; i++) {
    fadeIn(cells[i].rect, { delay: i * stagger });
    fadeIn(cells[i].value, { delay: i * stagger });
    fadeIn(cells[i].bin, { delay: i * stagger + 80 });
  }
}

sd.main(async () => {
  await sd.pause();
  fadeInGroup(topCells);
  await sd.pause();
  for (let i = 0; i < arrows.length; i++) {
    fadeIn(arrows[i].line, { delay: i * 30, duration: 220 });
    fadeIn(arrows[i].head, { delay: i * 30, duration: 220 });
  }
  fadeInGroup(botCells, 30);
  await sd.pause();
});
