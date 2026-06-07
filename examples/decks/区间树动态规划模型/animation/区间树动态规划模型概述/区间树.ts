import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const TREE = C.steelBlue;

const N = 10;
const CELL_W = 30;
const CELL_GAP = 2;
const CELL_H = 20;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;

interface IntervalData {
  l: number;
  r: number;
  depth: number;
  parent: number;
}

const data: IntervalData[] = [
  { l: 1, r: 10, depth: 0, parent: -1 },
  { l: 1, r: 4, depth: 1, parent: 0 },
  { l: 5, r: 6, depth: 1, parent: 0 },
  { l: 7, r: 10, depth: 1, parent: 0 },
  { l: 1, r: 2, depth: 2, parent: 1 },
  { l: 3, r: 4, depth: 2, parent: 1 },
  { l: 5, r: 5, depth: 2, parent: 2 },
  { l: 6, r: 6, depth: 2, parent: 2 },
  { l: 7, r: 9, depth: 2, parent: 3 },
  { l: 10, r: 10, depth: 2, parent: 3 },
  { l: 1, r: 1, depth: 3, parent: 4 },
  { l: 2, r: 2, depth: 3, parent: 4 },
  { l: 3, r: 3, depth: 3, parent: 5 },
  { l: 4, r: 4, depth: 3, parent: 5 },
  { l: 7, r: 8, depth: 3, parent: 8 },
  { l: 9, r: 9, depth: 3, parent: 8 },
  { l: 7, r: 7, depth: 4, parent: 14 },
  { l: 8, r: 8, depth: 4, parent: 14 },
];

const MAX_DEPTH = 4;
const NODE_H = 6;
const LAYER_GAP = 16;
const ROOT_TOP = -12;
const yBottomOf = (d: number) => ROOT_TOP - NODE_H - d * LAYER_GAP;

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

interface TreeNode {
  rect: sd.Rect;
  line?: sd.Line;
  depth: number;
}
const nodes: TreeNode[] = data.map((d) => {
  const cx = (cxOf(d.l) + cxOf(d.r)) / 2;
  const width = (d.r - d.l + 1) * STEP - CELL_GAP;
  const yB = yBottomOf(d.depth);
  const rect = new sd.Rect({
    targetNode: svg,
    x: cx - width / 2,
    y: yB,
    width,
    height: NODE_H,
    fill: TREE,
    stroke: "none",
    opacity: 0,
  });
  let line: sd.Line | undefined;
  if (d.parent >= 0) {
    const p = data[d.parent];
    const pCx = (cxOf(p.l) + cxOf(p.r)) / 2;
    line = new sd.Line({
      targetNode: svg,
      x1: pCx,
      y1: yBottomOf(p.depth),
      x2: cx,
      y2: yB + NODE_H,
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    });
  }
  return { rect, line, depth: d.depth };
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
  await sd.pause();
  for (let d = 0; d <= MAX_DEPTH; d++) {
    const layer = nodes.filter((n) => n.depth === d);
    layer.forEach((n, idx) => {
      fadeIn(n.rect, idx * 60);
      if (n.line) fadeIn(n.line, idx * 60 + 80);
    });
    await sd.pause();
  }
});
