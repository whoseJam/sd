import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const SPLIT = C.darkOrange;
const BRACE_C = C.steelBlue;

const data = "1246".split("");
const N = data.length;

const CELL_W = 40;
const CELL_GAP = 2;
const CELL_H = 30;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

const segments: [number, number][] = [
  [0, 1],
  [2, 3],
];

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[] = data.map((ch, i) => {
  const cx = cxOf(i);
  return {
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
      text: ch,
      cx,
      cy: CELL_H / 2,
      fontSize: 16,
      fill: NEUTRAL,
      opacity: 0,
    }),
  };
});

const mLabel = new sd.Math({
  targetNode: svg,
  text: "m=2",
  cx: cxOf(0) - CELL_W / 2 - 24,
  cy: CELL_H / 2,
  fontSize: 14,
  fill: NEUTRAL,
  opacity: 0,
});

function makeBrace(l: number, r: number): sd.Line[] {
  const xL = cxOf(l) - CELL_W / 2;
  const xR = cxOf(r) + CELL_W / 2;
  const y = -10;
  const tick = 5;
  return [
    new sd.Line({
      targetNode: svg,
      x1: xL,
      y1: y,
      x2: xR,
      y2: y,
      stroke: BRACE_C,
      strokeWidth: 1.2,
      opacity: 0,
    }),
    new sd.Line({
      targetNode: svg,
      x1: xL,
      y1: y,
      x2: xL,
      y2: y + tick,
      stroke: BRACE_C,
      strokeWidth: 1.2,
      opacity: 0,
    }),
    new sd.Line({
      targetNode: svg,
      x1: xR,
      y1: y,
      x2: xR,
      y2: y + tick,
      stroke: BRACE_C,
      strokeWidth: 1.2,
      opacity: 0,
    }),
    new sd.Line({
      targetNode: svg,
      x1: (xL + xR) / 2,
      y1: y,
      x2: (xL + xR) / 2,
      y2: y - tick,
      stroke: BRACE_C,
      strokeWidth: 1.2,
      opacity: 0,
    }),
  ];
}

const braces = segments.map(([l, r]) => makeBrace(l, r));

const splitLines = segments.slice(1).map(
  ([l]) =>
    new sd.Line({
      targetNode: svg,
      x1: cxOf(l) - CELL_W / 2 - CELL_GAP / 2,
      y1: -4,
      x2: cxOf(l) - CELL_W / 2 - CELL_GAP / 2,
      y2: CELL_H + 4,
      stroke: SPLIT,
      strokeWidth: 1.5,
      strokeDashArray: [3, 3],
      opacity: 0,
    }),
);

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Line;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  fadeIn(mLabel, 0);
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 40);
    fadeIn(cells[i].text, i * 40 + 50);
  }
  await sd.pause();

  for (const line of splitLines) fadeIn(line, 0);
  for (const brace of braces) {
    for (const part of brace) fadeIn(part, 100);
  }
  await sd.pause();
});
