import * as sd from "@/sd";

const C = sd.color();
const E = sd.easing();

export const NEUTRAL = C.darkButtonGrey;
export const ON_FILL = C.darkOrange;
export const ON_TEXT = "#ffffff";
export const HIGHLIGHT = C.steelBlue;
export const DUR = 280;

const CELL_W = 40;
const CELL_H = 40;
const CELL_GAP = 6;
const STEP = CELL_W + CELL_GAP;

export interface BitsetCell {
  bg: sd.Rect;
  label: sd.Text;
  bit: sd.Text;
}

export interface BitsetView {
  cells: BitsetCell[];
  cxOf: (bitIdx: number) => number;
  cellY: number;
  bitY: number;
  lparen: sd.Text;
  rparen: sd.Text;
  sub: sd.Text;
}

export interface BitsetOptions {
  n: number;
  cy?: number;
  bitGap?: number;
}

export function makeBitset(svg: sd.SDNode, opts: BitsetOptions): BitsetView {
  const n = opts.n;
  const cy = opts.cy ?? 0;
  const bitGap = opts.bitGap ?? 56;

  const cxOf = (bitIdx: number) => (n - 1 - bitIdx - (n - 1) / 2) * STEP;
  const bitY = cy - bitGap;

  const cells: BitsetCell[] = [];
  for (let bitIdx = 0; bitIdx < n; bitIdx++) {
    const cx = cxOf(bitIdx);
    cells.push({
      bg: new sd.Rect({
        targetNode: svg,
        x: cx - CELL_W / 2,
        y: cy - CELL_H / 2,
        width: CELL_W,
        height: CELL_H,
        fill: "none",
        stroke: NEUTRAL,
        strokeWidth: 1.2,
        opacity: 0,
      }),
      label: new sd.Text({
        targetNode: svg,
        text: String(bitIdx + 1),
        cx,
        cy,
        fontSize: 15,
        fill: NEUTRAL,
        opacity: 0,
      }),
      bit: new sd.Text({
        targetNode: svg,
        text: "0",
        cx,
        cy: bitY,
        fontSize: 18,
        fill: NEUTRAL,
        opacity: 0,
      }),
    });
  }

  const halfRow = ((n - 1) * STEP) / 2 + CELL_W / 2 + 8;
  const lparen = new sd.Text({
    targetNode: svg,
    text: "(",
    cx: -halfRow,
    cy: bitY,
    fontSize: 22,
    fill: NEUTRAL,
    opacity: 0,
  });
  const rparen = new sd.Text({
    targetNode: svg,
    text: ")",
    cx: halfRow,
    cy: bitY,
    fontSize: 22,
    fill: NEUTRAL,
    opacity: 0,
  });
  const sub = new sd.Text({
    targetNode: svg,
    text: "2",
    cx: halfRow + 10,
    cy: bitY - 8,
    fontSize: 12,
    fill: NEUTRAL,
    opacity: 0,
  });

  return { cells, cxOf, cellY: cy, bitY, lparen, rparen, sub };
}

type Anim = sd.Rect | sd.Text | sd.Math | sd.Path;

export function fadeIn(el: Anim, delay = 0, dur = DUR) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

export function fadeOut(el: Anim, delay = 0, dur = DUR) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
}

export function setFill(
  el: sd.Rect | sd.Text,
  color: string,
  delay = 0,
  dur = DUR,
) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

export function fadeInRow(view: BitsetView, baseDelay = 0) {
  for (let bitIdx = view.cells.length - 1; bitIdx >= 0; bitIdx--) {
    const order = view.cells.length - 1 - bitIdx;
    fadeIn(view.cells[bitIdx].bg, baseDelay + order * 40);
    fadeIn(view.cells[bitIdx].label, baseDelay + order * 40 + 60);
  }
}

export function fadeInBits(view: BitsetView, baseDelay = 0) {
  fadeIn(view.lparen, baseDelay);
  fadeIn(view.rparen, baseDelay);
  fadeIn(view.sub, baseDelay);
  for (let bitIdx = view.cells.length - 1; bitIdx >= 0; bitIdx--) {
    const order = view.cells.length - 1 - bitIdx;
    fadeIn(view.cells[bitIdx].bit, baseDelay + order * 30);
  }
}

export function setOn(view: BitsetView, bitIdx: number, delay = 0) {
  setFill(view.cells[bitIdx].bg, ON_FILL, delay);
  setFill(view.cells[bitIdx].label, ON_TEXT, delay + 40);
  view.cells[bitIdx].bit
    .startAnimate({ delay: delay + 40, duration: DUR, easing: E.easeOut })
    .setText("1")
    .setFill(ON_FILL)
    .endAnimate();
}

export function setOff(view: BitsetView, bitIdx: number, delay = 0) {
  setFill(view.cells[bitIdx].bg, "none", delay);
  setFill(view.cells[bitIdx].label, NEUTRAL, delay + 40);
  view.cells[bitIdx].bit
    .startAnimate({ delay: delay + 40, duration: DUR, easing: E.easeOut })
    .setText("0")
    .setFill(NEUTRAL)
    .endAnimate();
}

export function applyMask(view: BitsetView, mask: number, baseDelay = 0) {
  for (let bitIdx = view.cells.length - 1; bitIdx >= 0; bitIdx--) {
    const order = view.cells.length - 1 - bitIdx;
    if ((mask >> bitIdx) & 1) setOn(view, bitIdx, baseDelay + order * 25);
    else setOff(view, bitIdx, baseDelay + order * 25);
  }
}
