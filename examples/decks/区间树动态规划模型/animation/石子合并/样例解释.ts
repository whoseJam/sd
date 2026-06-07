import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const ACCENT = C.darkOrange;

const N = 10;
const CELL_W = 40;
const CELL_GAP = 2;
const CELL_H = 30;
const STEP = CELL_W + CELL_GAP;

const masses = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[] = [];
for (let i = 1; i <= N; i++) {
  const cx = cxOf(i);
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
      text: String(masses[i - 1]),
      cx,
      cy: CELL_H / 2,
      fontSize: 15,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

const BRACE_Y = -10;
const BRACE_TICK = 5;
const BRACE_LEFT = cxOf(1) - CELL_W / 2;
const BRACE_RIGHT = cxOf(N) + CELL_W / 2;

const braceParts: sd.Line[] = [];
braceParts.push(
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
);
braceParts.push(
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
);
braceParts.push(
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
);
braceParts.push(
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
);

const braceLabel = new sd.Text({
  targetNode: svg,
  text: "n 堆石子",
  cx: 0,
  cy: BRACE_Y - 16,
  fontSize: 13,
  fill: ACCENT,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Line;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 30);
    fadeIn(cells[i].text, i * 30 + 40);
  }
  for (const part of braceParts) fadeIn(part, 350);
  fadeIn(braceLabel, 450);
  await sd.pause();
});
