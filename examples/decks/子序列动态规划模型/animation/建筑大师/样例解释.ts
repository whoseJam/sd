import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const BRACE_C = C.steelBlue;
const ACCENT = C.darkOrange;

const N = 8;
const M = 4;

const CELL_W = 42;
const CELL_GAP = 2;
const CELL_H = 30;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[] = [];
for (let i = 1; i <= N; i++) {
  const cx = cxOf(i);
  const v = ((i - 1) % M) + 1;
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
    text: new sd.Text({
      targetNode: svg,
      text: String(v),
      cx,
      cy: CELL_H / 2,
      fontSize: 14,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

const xL = cxOf(1) - CELL_W / 2;
const xR = cxOf(N) + CELL_W / 2;
const BRACE_Y = -10;

const braceParts: sd.Line[] = [
  new sd.Line({
    targetNode: svg,
    x1: xL,
    y1: BRACE_Y,
    x2: xR,
    y2: BRACE_Y,
    stroke: BRACE_C,
    strokeWidth: 1.2,
    opacity: 0,
  }),
  new sd.Line({
    targetNode: svg,
    x1: xL,
    y1: BRACE_Y,
    x2: xL,
    y2: BRACE_Y + 5,
    stroke: BRACE_C,
    strokeWidth: 1.2,
    opacity: 0,
  }),
  new sd.Line({
    targetNode: svg,
    x1: xR,
    y1: BRACE_Y,
    x2: xR,
    y2: BRACE_Y + 5,
    stroke: BRACE_C,
    strokeWidth: 1.2,
    opacity: 0,
  }),
  new sd.Line({
    targetNode: svg,
    x1: 0,
    y1: BRACE_Y,
    x2: 0,
    y2: BRACE_Y - 5,
    stroke: BRACE_C,
    strokeWidth: 1.2,
    opacity: 0,
  }),
];

const nLabel = new sd.Math({
  targetNode: svg,
  text: "n",
  cx: 0,
  cy: BRACE_Y - 14,
  fontSize: 14,
  fill: ACCENT,
  opacity: 0,
});

const mLabel = new sd.Math({
  targetNode: svg,
  text: `m = ${M}`,
  cx: cxOf(N) + CELL_W / 2 + 30,
  cy: CELL_H / 2,
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
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 40);
    fadeIn(cells[i].text, i * 40 + 50);
  }
  fadeIn(mLabel, 250);
  for (const p of braceParts) fadeIn(p, 350);
  fadeIn(nLabel, 450);
  await sd.pause();
});
