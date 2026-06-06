import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// f_t = G^T f_{t-1}: every entry of f_t counts length-t walks ending at
// that node. 6-node directed graph (1→2, 1→3, 2→3, 3→4, 3→5, 4→5,
// 5→6, 6→1). Iterate f_0 = (1, 0, 0, 0, 0, 0) for 3 steps; graph node
// colors track active set (positive entries of f_t).

const NEUTRAL = C.darkButtonGrey;
const HL = C.darkOrange;
const HL_BG = "#fdecd9";

// ===== Graph =====
const G_CX = -200;
const G_CY = 0;
const G_R = 40;
const NODE_R = 8;

const NODE_ANGLES = [90, 30, -30, -90, -150, 150];
const NODE_POS = NODE_ANGLES.map((a) => {
  const rad = (a * Math.PI) / 180;
  return {
    x: G_CX + G_R * Math.cos(rad),
    y: G_CY + G_R * Math.sin(rad),
  };
});

const EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 4],
  [4, 5],
  [5, 0],
];

const F_STATES = [
  [1, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 0, 1, 2, 1],
];

interface GNode {
  circle: sd.Circle;
  label: sd.Text;
}
const gNodes: GNode[] = NODE_POS.map((p, i) => ({
  circle: new sd.Circle({
    targetNode: svg,
    cx: p.x,
    cy: p.y,
    r: NODE_R,
    fill: C.white,
    stroke: NEUTRAL,
    strokeWidth: 1.4,
    opacity: 0,
  }),
  label: new sd.Text({
    targetNode: svg,
    text: String(i + 1),
    cx: p.x,
    cy: p.y,
    fontSize: 10,
    fill: NEUTRAL,
    opacity: 0,
  }),
}));

interface GEdge {
  line: sd.Line;
  arrow: sd.Path;
}
function makeEdge(from: number, to: number): GEdge {
  const p1 = NODE_POS[from];
  const p2 = NODE_POS[to];
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = p1.x + ux * NODE_R;
  const sy = p1.y + uy * NODE_R;
  const ex = p2.x - ux * (NODE_R + 1);
  const ey = p2.y - uy * (NODE_R + 1);
  const aSize = 4;
  const px = -uy;
  const py = ux;
  const a1x = ex - ux * aSize + px * aSize * 0.5;
  const a1y = ey - uy * aSize + py * aSize * 0.5;
  const a2x = ex - ux * aSize - px * aSize * 0.5;
  const a2y = ey - uy * aSize - py * aSize * 0.5;
  return {
    line: new sd.Line({
      targetNode: svg,
      x1: sx,
      y1: sy,
      x2: ex - ux * aSize,
      y2: ey - uy * aSize,
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    arrow: new sd.Path({
      targetNode: svg,
      d: `M ${ex} ${ey} L ${a1x} ${a1y} L ${a2x} ${a2y} Z`,
      stroke: NEUTRAL,
      fill: NEUTRAL,
      opacity: 0,
    }),
  };
}
const gEdges: GEdge[] = EDGES.map(([f, t]) => makeEdge(f, t));

// ===== G^T matrix =====
// G^T[i][j] = 1 iff edge j→i exists.
const GT_VALUES = [
  [0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 0],
];

const GT_CX = -90;
const GT_CY = 0;
const GT_CELL = 11;
const GT_GAP = 1;
const GT_MATRIX_W = 6 * GT_CELL + 5 * GT_GAP;
const GT_MATRIX_H = 6 * GT_CELL + 5 * GT_GAP;
const GT_HALF_W = GT_MATRIX_W / 2 + 4;
const GT_HALF_H = GT_MATRIX_H / 2 + 2;

function gtCellCx(j: number): number {
  return GT_CX - GT_MATRIX_W / 2 + j * (GT_CELL + GT_GAP) + GT_CELL / 2;
}
function gtCellCy(i: number): number {
  return GT_CY + GT_MATRIX_H / 2 - (i + 1) * GT_CELL - i * GT_GAP + GT_CELL / 2;
}

const gtCells: sd.Text[] = [];
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 6; j++) {
    gtCells.push(
      new sd.Text({
        targetNode: svg,
        text: String(GT_VALUES[i][j]),
        cx: gtCellCx(j),
        cy: gtCellCy(i),
        fontSize: 9,
        fill: NEUTRAL,
        opacity: 0,
      }),
    );
  }
}

const gtBracketL = new sd.Path({
  targetNode: svg,
  d: `M ${GT_CX - GT_HALF_W + 3} ${GT_CY + GT_HALF_H} L ${GT_CX - GT_HALF_W} ${GT_CY + GT_HALF_H} L ${GT_CX - GT_HALF_W} ${GT_CY - GT_HALF_H} L ${GT_CX - GT_HALF_W + 3} ${GT_CY - GT_HALF_H}`,
  stroke: NEUTRAL,
  strokeWidth: 1.2,
  fill: "none",
  opacity: 0,
});
const gtBracketR = new sd.Path({
  targetNode: svg,
  d: `M ${GT_CX + GT_HALF_W - 3} ${GT_CY + GT_HALF_H} L ${GT_CX + GT_HALF_W} ${GT_CY + GT_HALF_H} L ${GT_CX + GT_HALF_W} ${GT_CY - GT_HALF_H} L ${GT_CX + GT_HALF_W - 3} ${GT_CY - GT_HALF_H}`,
  stroke: NEUTRAL,
  strokeWidth: 1.2,
  fill: "none",
  opacity: 0,
});

const gtTitle = new sd.Math({
  targetNode: svg,
  text: "G",
  cx: GT_CX,
  cy: 55,
  fontSize: 13,
  fill: NEUTRAL,
  opacity: 0,
});

// ===== f vector =====
const F_CELL = 11;
const F_GAP = 1;
const F_CX = -25;
const F_CY = 0;
const F_TITLE_Y = 55;
const F_HALF_H = 3 * F_CELL + 2.5 * F_GAP + 2;
const F_HALF_W = F_CELL / 2 + 4;

function fCellY(i: number): number {
  return F_CY + 2.5 * (F_CELL + F_GAP) - i * (F_CELL + F_GAP);
}

const fCells: sd.Text[] = [];
for (let i = 0; i < 6; i++) {
  fCells.push(
    new sd.Text({
      targetNode: svg,
      text: String(F_STATES[0][i]),
      cx: F_CX,
      cy: fCellY(i),
      fontSize: 11,
      fill: NEUTRAL,
      opacity: 0,
    }),
  );
}

const fBracketL = new sd.Path({
  targetNode: svg,
  d: `M ${F_CX - F_HALF_W + 3} ${F_HALF_H} L ${F_CX - F_HALF_W} ${F_HALF_H} L ${F_CX - F_HALF_W} ${-F_HALF_H} L ${F_CX - F_HALF_W + 3} ${-F_HALF_H}`,
  stroke: NEUTRAL,
  strokeWidth: 1.2,
  fill: "none",
  opacity: 0,
});
const fBracketR = new sd.Path({
  targetNode: svg,
  d: `M ${F_CX + F_HALF_W - 3} ${F_HALF_H} L ${F_CX + F_HALF_W} ${F_HALF_H} L ${F_CX + F_HALF_W} ${-F_HALF_H} L ${F_CX + F_HALF_W - 3} ${-F_HALF_H}`,
  stroke: NEUTRAL,
  strokeWidth: 1.2,
  fill: "none",
  opacity: 0,
});

const fTitle = new sd.Math({
  targetNode: svg,
  text: "f_0",
  cx: F_CX,
  cy: F_TITLE_Y,
  fontSize: 13,
  fill: HL,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Circle | sd.Text | sd.Math | sd.Path | sd.Line;

function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function colorNode(idx: number, active: boolean, delay = 0) {
  const color = active ? HL : NEUTRAL;
  const fill = active ? HL_BG : C.white;
  const strokeWidth = active ? 2 : 1.4;
  gNodes[idx].circle
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setStroke(color)
    .setStrokeWidth(strokeWidth)
    .setFill(fill)
    .endAnimate();
  gNodes[idx].label
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

// Which edges + matrix cells actually contribute to each transition
// t-1 → t (where the source node has positive count in f_{t-1}).
const TRANSITIONS: Array<{ edges: number[]; cells: Array<[number, number]> }> = [
  // f_0 → f_1: only node 1 (idx 0) has count > 0, so edges 1→2, 1→3
  { edges: [0, 1], cells: [[1, 0], [2, 0]] },
  // f_1 → f_2: nodes 2, 3 active. Edges 2→3, 3→4, 3→5
  { edges: [2, 3, 4], cells: [[2, 1], [3, 2], [4, 2]] },
  // f_2 → f_3: nodes 3, 4, 5 active. Edges 3→4, 3→5, 4→5, 5→6
  { edges: [3, 4, 5, 6], cells: [[3, 2], [4, 2], [4, 3], [5, 4]] },
];

function highlightEdge(idx: number, active: boolean, delay = 0) {
  const color = active ? HL : NEUTRAL;
  const sw = active ? 2 : 1;
  gEdges[idx].line
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setStroke(color)
    .setStrokeWidth(sw)
    .endAnimate();
  gEdges[idx].arrow
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .setStroke(color)
    .endAnimate();
}

function highlightCell(row: number, col: number, active: boolean, delay = 0) {
  gtCells[row * 6 + col]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(active ? HL : NEUTRAL)
    .endAnimate();
}

function applyTransition(t: number) {
  const trans = TRANSITIONS[t - 1];
  const firingE = new Set(trans.edges);
  for (let i = 0; i < gEdges.length; i++) highlightEdge(i, firingE.has(i));
  const firingC = new Set(trans.cells.map(([r, c]) => `${r},${c}`));
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      highlightCell(i, j, firingC.has(`${i},${j}`));
    }
  }
  updateF(t, 250);
  for (let i = 0; i < 6; i++) {
    colorNode(i, F_STATES[t][i] > 0, 500 + i * 30);
  }
}

function updateF(t: number, delay = 0) {
  const newF = F_STATES[t];
  for (let i = 0; i < 6; i++) {
    const cy = fCellY(i);
    fCells[i]
      .startAnimate({
        delay: delay + 40 * i,
        duration: DUR,
        easing: E.easeOut,
      })
      .setText(String(newF[i]))
      .setCx(F_CX)
      .setCy(cy)
      .setFill(newF[i] > 0 ? HL : NEUTRAL)
      .endAnimate();
  }
  fTitle
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setText(`f_${t}`)
    .setCx(F_CX)
    .setCy(F_TITLE_Y)
    .endAnimate();
}

sd.main(async () => {
  // p1: nodes first, then edges, then matrix, then f vector. Order
  // matters — edges connecting to invisible nodes look unmoored.
  for (let i = 0; i < gNodes.length; i++) {
    fadeIn(gNodes[i].circle, i * 30);
    fadeIn(gNodes[i].label, 60 + i * 30);
  }
  for (let i = 0; i < gEdges.length; i++) {
    fadeIn(gEdges[i].line, 280 + i * 35);
    fadeIn(gEdges[i].arrow, 290 + i * 35);
  }
  fadeIn(gtBracketL, 650);
  fadeIn(gtBracketR, 650);
  fadeIn(gtTitle, 700);
  for (const c of gtCells) fadeIn(c, 720);
  fadeIn(fBracketL, 900);
  fadeIn(fBracketR, 900);
  fadeIn(fTitle, 950);
  for (const c of fCells) fadeIn(c, 970);
  colorNode(0, true, 1150);
  await sd.pause();

  // p2-p4: each transition highlights firing edges + matrix entries,
  // updates f, then recolors graph nodes.
  for (let t = 1; t <= 3; t++) {
    applyTransition(t);
    await sd.pause();
  }
});
