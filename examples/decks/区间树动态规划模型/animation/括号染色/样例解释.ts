import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const ARC = C.steelBlue;

const seq = "(())()".split("");
const N = seq.length;

const CELL_W = 30;
const CELL_GAP = 2;
const CELL_H = 28;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[] = [];
for (let i = 0; i < N; i++) {
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
      text: seq[i],
      cx,
      cy: CELL_H / 2,
      fontSize: 18,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

function findMatch(s: number): number {
  let depth = 0;
  for (let i = s; i < N; i++) {
    if (seq[i] === "(") depth++;
    if (seq[i] === ")") depth--;
    if (depth === 0) return i;
  }
  return -1;
}

const matches: [number, number][] = [];
for (let i = 0; i < N; i++) {
  if (seq[i] === "(") matches.push([i, findMatch(i)]);
}

const arcs: sd.Path[] = matches.map(([l, r]) => {
  const x1 = cxOf(l);
  const x2 = cxOf(r);
  const y1 = CELL_H;
  const arcH = 14 + (r - l) * 6;
  return new sd.Path({
    targetNode: svg,
    d: `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${y1 + arcH} ${x2} ${y1}`,
    stroke: ARC,
    strokeWidth: 1.4,
    fill: "none",
    opacity: 0,
  });
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Path;
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
  await sd.pause();
  for (let i = 0; i < arcs.length; i++) fadeIn(arcs[i], i * 200);
  await sd.pause();
});
