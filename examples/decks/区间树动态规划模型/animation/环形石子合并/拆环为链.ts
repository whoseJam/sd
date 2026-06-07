import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const TREE = C.steelBlue;
const ACCENT = C.darkOrange;

const N = 5;
const TOTAL = 2 * N;
const CELL_W = 38;
const CELL_GAP = 2;
const CELL_H = 24;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (TOTAL + 1) / 2) * STEP;
const midOf = (l: number, r: number) => (cxOf(l) + cxOf(r)) / 2;
const widthOf = (l: number, r: number) => (r - l + 1) * STEP - CELL_GAP;

interface Cell {
  bg: sd.Rect;
  text: sd.Math;
}
const cells: Cell[] = [];
for (let i = 1; i <= TOTAL; i++) {
  const cx = cxOf(i);
  const sIdx = ((i - 1) % N) + 1;
  cells.push({
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: 0,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    text: new sd.Math({
      targetNode: svg,
      text: `S_${sIdx}`,
      cx,
      cy: CELL_H / 2,
      fontSize: 13,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

const BAR_H = 6;
const WINDOW_Y = CELL_H + 14;

const windowBar = new sd.Rect({
  targetNode: svg,
  x: midOf(1, N) - widthOf(1, N) / 2,
  y: WINDOW_Y,
  width: widthOf(1, N),
  height: BAR_H,
  fill: TREE,
  stroke: "none",
  opacity: 0,
});

const BRACE_Y = -10;
const BRACE_TICK = 5;
const BRACE_LEFT = cxOf(1) - CELL_W / 2;
const BRACE_RIGHT = cxOf(TOTAL) + CELL_W / 2;

const braceParts: sd.Line[] = [
  new sd.Line({
    targetNode: svg,
    x1: BRACE_LEFT,
    y1: BRACE_Y,
    x2: BRACE_RIGHT,
    y2: BRACE_Y,
    stroke: NEUTRAL,
    strokeWidth: 1.2,
    opacity: 0,
  }),
  new sd.Line({
    targetNode: svg,
    x1: BRACE_LEFT,
    y1: BRACE_Y,
    x2: BRACE_LEFT,
    y2: BRACE_Y + BRACE_TICK,
    stroke: NEUTRAL,
    strokeWidth: 1.2,
    opacity: 0,
  }),
  new sd.Line({
    targetNode: svg,
    x1: BRACE_RIGHT,
    y1: BRACE_Y,
    x2: BRACE_RIGHT,
    y2: BRACE_Y + BRACE_TICK,
    stroke: NEUTRAL,
    strokeWidth: 1.2,
    opacity: 0,
  }),
  new sd.Line({
    targetNode: svg,
    x1: 0,
    y1: BRACE_Y,
    x2: 0,
    y2: BRACE_Y - BRACE_TICK,
    stroke: NEUTRAL,
    strokeWidth: 1.2,
    opacity: 0,
  }),
];

const braceLabel = new sd.Math({
  targetNode: svg,
  text: "2n",
  cx: 0,
  cy: BRACE_Y - 16,
  fontSize: 14,
  fill: ACCENT,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Line;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < TOTAL; i++) {
    fadeIn(cells[i].bg, i * 25);
    fadeIn(cells[i].text, i * 25 + 30);
  }
  for (const p of braceParts) fadeIn(p, 350);
  fadeIn(braceLabel, 450);
  await sd.pause();

  fadeIn(windowBar, 0);
  await sd.pause();

  for (let l = 2; l <= N; l++) {
    const r = l + N - 1;
    windowBar
      .startAnimate({ duration: DUR, easing: E.easeOut })
      .setX(midOf(l, r) - widthOf(l, r) / 2)
      .endAnimate();
    await sd.pause();
  }
});
