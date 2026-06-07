import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const TREE = C.steelBlue;
const ACCENT = C.darkOrange;

const N = 8;
const CELL_W = 30;
const CELL_GAP = 2;
const CELL_H = 20;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;
const midOf = (l: number, r: number) => (cxOf(l) + cxOf(r)) / 2;
const widthOf = (l: number, r: number) => (r - l + 1) * STEP - CELL_GAP;

const BAR_H = 6;
const CHILD_H = 50;
const CELLS_TOP = CELL_H;
const CHILD_Y = CELLS_TOP + 12;
const ROOT_Y = CHILD_Y + CHILD_H + 12;

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
      fontSize: 13,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

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

const lLabel = new sd.Math({
  targetNode: svg,
  text: "l",
  cx: cxOf(1),
  cy: -12,
  fontSize: 14,
  fill: NEUTRAL,
  opacity: 0,
});
const rLabel = new sd.Math({
  targetNode: svg,
  text: "r",
  cx: cxOf(N),
  cy: -12,
  fontSize: 14,
  fill: NEUTRAL,
  opacity: 0,
});

const K0 = 4;
const childBox = (l: number, r: number) => ({
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
});

const left = childBox(1, K0);
const right = childBox(K0 + 1, N);

const kLabel = new sd.Math({
  targetNode: svg,
  text: "k",
  cx: cxOf(K0),
  cy: -12,
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

function moveLeftChild(k: number) {
  const x = midOf(1, k) - widthOf(1, k) / 2;
  const w = widthOf(1, k);
  const cx = midOf(1, k);
  left.bar
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setX(x)
    .setWidth(w)
    .endAnimate();
  left.body
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setX(x)
    .setWidth(w)
    .endAnimate();
  left.q
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setCx(cx)
    .endAnimate();
  left.line
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setX2(cx)
    .endAnimate();
}

function moveRightChild(k: number) {
  const x = midOf(k + 1, N) - widthOf(k + 1, N) / 2;
  const w = widthOf(k + 1, N);
  const cx = midOf(k + 1, N);
  right.bar
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setX(x)
    .setWidth(w)
    .endAnimate();
  right.body
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setX(x)
    .setWidth(w)
    .endAnimate();
  right.q
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setCx(cx)
    .endAnimate();
  right.line
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setX2(cx)
    .endAnimate();
}

function moveK(k: number) {
  kLabel
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setCx(cxOf(k))
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 30);
    fadeIn(cells[i].text, i * 30 + 40);
  }
  fadeIn(lLabel, 200);
  fadeIn(rLabel, 200);
  await sd.pause();

  fadeIn(root, 0);
  await sd.pause();

  fadeIn(left.body, 0);
  fadeIn(left.bar, 60);
  fadeIn(left.line, 120);
  fadeIn(right.body, 0);
  fadeIn(right.bar, 60);
  fadeIn(right.line, 120);
  fadeIn(left.q, 200);
  fadeIn(right.q, 200);
  fadeIn(kLabel, 200);
  await sd.pause();

  for (const k of [2, 6, 3, 5]) {
    moveLeftChild(k);
    moveRightChild(k);
    moveK(k);
    await sd.pause();
  }
});
