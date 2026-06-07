import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const TREE = C.steelBlue;
const ACCENT = C.darkOrange;

const N = 10;
const CELL_W = 32;
const CELL_GAP = 2;
const CELL_H = 22;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;
const midOf = (l: number, r: number) => (cxOf(l) + cxOf(r)) / 2;
const widthOf = (l: number, r: number) => (r - l + 1) * STEP - CELL_GAP;

const BAR_H = 6;
const CHILD_H = 50;
const CHILD_Y = CELL_H + 14;
const ROOT_Y = CHILD_Y + CHILD_H + 14;
const K = 5;

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
      text: String(i),
      cx,
      cy: CELL_H / 2,
      fontSize: 12,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

const lLabel = new sd.Math({
  targetNode: svg,
  text: "l",
  cx: cxOf(1),
  cy: -12,
  fontSize: 15,
  fill: NEUTRAL,
  opacity: 0,
});
const rLabel = new sd.Math({
  targetNode: svg,
  text: "r",
  cx: cxOf(N),
  cy: -12,
  fontSize: 15,
  fill: NEUTRAL,
  opacity: 0,
});
const kLabel = new sd.Math({
  targetNode: svg,
  text: "k",
  cx: cxOf(K),
  cy: -12,
  fontSize: 15,
  fill: ACCENT,
  opacity: 0,
});

const hl = new sd.Math({
  targetNode: svg,
  text: "h_l",
  cx: cxOf(1) - CELL_W / 2 - 3,
  cy: CELL_H + 10,
  fontSize: 13,
  fill: ACCENT,
  opacity: 0,
});
const tk = new sd.Math({
  targetNode: svg,
  text: "t_k",
  cx: cxOf(K) + CELL_W / 2 + 3,
  cy: CELL_H + 10,
  fontSize: 13,
  fill: ACCENT,
  opacity: 0,
});
const tr = new sd.Math({
  targetNode: svg,
  text: "t_r",
  cx: cxOf(N) + CELL_W / 2 + 3,
  cy: CELL_H + 10,
  fontSize: 13,
  fill: ACCENT,
  opacity: 0,
});

const root = new sd.Rect({
  targetNode: svg,
  x: midOf(1, N) - widthOf(1, N) / 2,
  y: ROOT_Y,
  width: widthOf(1, N),
  height: BAR_H,
  fill: TREE,
  stroke: "none",
  opacity: 0,
});

function makeChild(l: number, r: number) {
  return {
    bar: new sd.Rect({
      targetNode: svg,
      x: midOf(l, r) - widthOf(l, r) / 2,
      y: CHILD_Y + CHILD_H - BAR_H,
      width: widthOf(l, r),
      height: BAR_H,
      fill: TREE,
      stroke: "none",
      opacity: 0,
    }),
    body: new sd.Rect({
      targetNode: svg,
      x: midOf(l, r) - widthOf(l, r) / 2,
      y: CHILD_Y,
      width: widthOf(l, r),
      height: CHILD_H - BAR_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1,
      strokeDashArray: [4, 3],
      opacity: 0,
    }),
    q: new sd.Text({
      targetNode: svg,
      text: "?",
      cx: midOf(l, r),
      cy: CHILD_Y + (CHILD_H - BAR_H) / 2,
      fontSize: 22,
      fill: ACCENT,
      opacity: 0,
    }),
    line: new sd.Line({
      targetNode: svg,
      x1: midOf(1, N),
      y1: ROOT_Y,
      x2: midOf(l, r),
      y2: CHILD_Y + CHILD_H,
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
  };
}

const leftChild = makeChild(1, K);
const rightChild = makeChild(K + 1, N);

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Line;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 25);
    fadeIn(cells[i].text, i * 25 + 30);
  }
  fadeIn(lLabel, 200);
  fadeIn(rLabel, 200);
  fadeIn(root, 280);
  await sd.pause();

  fadeIn(kLabel, 0);
  await sd.pause();

  for (const c of [leftChild, rightChild]) {
    fadeIn(c.body, 0);
    fadeIn(c.bar, 60);
    fadeIn(c.line, 120);
    fadeIn(c.q, 200);
  }
  await sd.pause();

  fadeIn(hl, 0);
  fadeIn(tk, 100);
  fadeIn(tr, 200);
  await sd.pause();
});
