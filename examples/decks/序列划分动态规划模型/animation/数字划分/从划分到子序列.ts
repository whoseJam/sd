import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const SPLIT = C.darkOrange;
const BRACE_C = C.steelBlue;
const PICK = C.green;
const ARC = C.green;

const data = "124612412318".split("");
const N = data.length;

const CELL_W = 36;
const CELL_GAP = 2;
const CELL_H = 28;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

const segments: [number, number][] = [
  [0, 1],
  [2, 3],
  [4, 8],
  [9, 11],
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
      fontSize: 14,
      fill: NEUTRAL,
      opacity: 0,
    }),
  };
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

function makeArc(jPos: number, iPos: number, color: string): sd.Path {
  const x1 = cxOf(jPos);
  const x2 = cxOf(iPos);
  const y = CELL_H;
  const arcH = 14 + (iPos - jPos) * 3;
  return new sd.Path({
    targetNode: svg,
    d: `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + arcH} ${x2} ${y}`,
    stroke: color,
    strokeWidth: 1.4,
    fill: "none",
    opacity: 0,
  });
}

const arcs = segments
  .slice(1)
  .map(([, r], k) => makeArc(segments[k][1], r, ARC));

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Line | sd.Path;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}
function setFill(el: sd.Rect | sd.Text, color: string, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 25);
    fadeIn(cells[i].text, i * 25 + 30);
  }
  for (const line of splitLines) fadeIn(line, 300);
  for (const brace of braces) {
    for (const part of brace) fadeIn(part, 400);
  }
  await sd.pause();

  for (const [, r] of segments) {
    setFill(cells[r].bg, PICK);
    setFill(cells[r].text, "#ffffff", 60);
  }
  for (const arc of arcs) fadeIn(arc, 200);
  await sd.pause();
});
