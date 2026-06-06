import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Constructive proof. A 1→n walk is allowed to wander: it may detour
// from A to B, trace a cycle attached at B, then return along the same
// A-B edge. Edge A-B is traversed twice, so its weight XOR-cancels.
// What remains is the simple path 1-A-n plus the cycle. Generalizes:
// every "out-and-back" pair of edges cancels, so any 1→n walk reduces
// to (a simple path) ⊕ (some cycles).

const NEUTRAL = C.darkButtonGrey;
const WALK_COL = "#d34d2e";
const PATH_COL = C.steelBlue;
const CYCLE_COL = C.darkOrange;

const NODE_R = 13;
const CYCLE_R = 34;

interface Pt {
  x: number;
  y: number;
}
const N1: Pt = { x: -180, y: 0 };
const NA: Pt = { x: 0, y: 0 };
const NB: Pt = { x: 0, y: 55 };
const NN: Pt = { x: 180, y: 0 };
// Cycle hangs above B: its bottom point sits exactly at B's center.
const CYCLE_CY = NB.y + CYCLE_R;
const CYCLE_BOTTOM: Pt = { x: NB.x, y: NB.y };
const CYCLE_TOP: Pt = { x: NB.x, y: NB.y + 2 * CYCLE_R };

// ===== Static background: edges + cycle outline drawn FIRST =====

const e1A = new sd.Line({
  targetNode: svg,
  x1: N1.x,
  y1: N1.y,
  x2: NA.x,
  y2: NA.y,
  stroke: NEUTRAL,
  strokeWidth: 1.6,
  opacity: 0,
});
const eAB = new sd.Line({
  targetNode: svg,
  x1: NA.x,
  y1: NA.y,
  x2: NB.x,
  y2: NB.y,
  stroke: NEUTRAL,
  strokeWidth: 1.6,
  opacity: 0,
});
const eAN = new sd.Line({
  targetNode: svg,
  x1: NA.x,
  y1: NA.y,
  x2: NN.x,
  y2: NN.y,
  stroke: NEUTRAL,
  strokeWidth: 1.6,
  opacity: 0,
});
const cycleOutline = new sd.Circle({
  targetNode: svg,
  cx: NB.x,
  cy: CYCLE_CY,
  r: CYCLE_R,
  fill: "none",
  stroke: NEUTRAL,
  strokeWidth: 1.6,
  opacity: 0,
});

// ===== Walk overlay paths (between background edges and nodes) =====
// Initialize with a huge dash gap so they're invisible before pointStoT
// is kicked off. pointStoT then sets the correct dash array.

const HUGE_GAP = 100000;

function makeWalkPath(d: string): sd.Path {
  return new sd.Path({
    targetNode: svg,
    d,
    stroke: WALK_COL,
    strokeWidth: 2.8,
    fill: "none",
    strokeDashArray: [0, HUGE_GAP],
  });
}

const walk1A = makeWalkPath(`M ${N1.x} ${N1.y} L ${NA.x} ${NA.y}`);
const walkAB_out = makeWalkPath(`M ${NA.x} ${NA.y} L ${NB.x} ${NB.y}`);
const walkCircle = makeWalkPath(
  `M ${CYCLE_BOTTOM.x} ${CYCLE_BOTTOM.y} ` +
    `A ${CYCLE_R} ${CYCLE_R} 0 1 1 ${CYCLE_TOP.x} ${CYCLE_TOP.y} ` +
    `A ${CYCLE_R} ${CYCLE_R} 0 1 1 ${CYCLE_BOTTOM.x} ${CYCLE_BOTTOM.y}`,
);
const walkAB_back = makeWalkPath(`M ${NB.x} ${NB.y} L ${NA.x} ${NA.y}`);
const walkAN = makeWalkPath(`M ${NA.x} ${NA.y} L ${NN.x} ${NN.y}`);

// ===== Nodes drawn LAST so they cover edge endpoints =====

interface NodeVis {
  c: sd.Circle;
  t: sd.Text;
}
function makeNode(p: Pt, label: string): NodeVis {
  return {
    c: new sd.Circle({
      targetNode: svg,
      cx: p.x,
      cy: p.y,
      r: NODE_R,
      fill: C.white,
      stroke: NEUTRAL,
      strokeWidth: 1.6,
      opacity: 0,
    }),
    t: new sd.Text({
      targetNode: svg,
      text: label,
      cx: p.x,
      cy: p.y - 1,
      fontSize: 13,
      fill: NEUTRAL,
      opacity: 0,
    }),
  };
}

const node1 = makeNode(N1, "1");
const nodeA = makeNode(NA, "A");
const nodeB = makeNode(NB, "B");
const nodeN = makeNode(NN, "n");
const allNodes = [node1, nodeA, nodeB, nodeN];

const x2Label = new sd.Math({
  targetNode: svg,
  text: "\\times 2",
  cx: NA.x + 18,
  cy: (NA.y + NB.y) / 2,
  fontSize: 13,
  fill: WALK_COL,
  opacity: 0,
});

const CAP_Y = -45;
const walkCap = new sd.Math({
  targetNode: svg,
  text: "\\text{walk: } 1 {\\to} A {\\to} B {\\to} \\text{环} {\\to} B {\\to} A {\\to} n",
  cx: 0,
  cy: CAP_Y,
  fontSize: 13,
  fill: WALK_COL,
  opacity: 0,
});
const cancelCap = new sd.Math({
  targetNode: svg,
  text: "A {\\to} B \\text{ 走两遍} \\Rightarrow \\text{XOR 自抵消}",
  cx: 0,
  cy: CAP_Y,
  fontSize: 14,
  fill: WALK_COL,
  opacity: 0,
});
const splitCap = new sd.Math({
  targetNode: svg,
  text: "\\text{walk} = (1 {\\to} A {\\to} n) \\oplus \\text{环}",
  cx: 0,
  cy: CAP_Y,
  fontSize: 14,
  fill: NEUTRAL,
  opacity: 0,
});
const conclusionCap = new sd.Math({
  targetNode: svg,
  text: "\\text{任意 } 1 {\\to} n \\text{ 路径} = P_0 \\oplus (\\text{若干简单环})",
  cx: 0,
  cy: CAP_Y,
  fontSize: 14,
  fill: CYCLE_COL,
  opacity: 0,
});

const DUR = 320;

type FadeEl = sd.Line | sd.Math | sd.Text | sd.Circle | sd.Path;

function fadeIn(el: FadeEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function fadeOut(el: FadeEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
}

function drawPath(path: sd.Path, delay: number, duration: number) {
  path
    .startAnimate({ delay, duration, easing: E.linear })
    .pointStoT()
    .endAnimate();
}

function recolor(path: sd.Path, color: string, delay = 0) {
  path
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setStroke(color)
    .endAnimate();
}

sd.main(async () => {
  // p1: static graph fades in. Edges first, cycle outline, then nodes on top.
  fadeIn(e1A, 0);
  fadeIn(eAB, 70);
  fadeIn(eAN, 140);
  fadeIn(cycleOutline, 210);
  for (let i = 0; i < allNodes.length; i++) {
    fadeIn(allNodes[i].c, 300 + i * 50);
    fadeIn(allNodes[i].t, 300 + i * 50 + 30);
  }
  await sd.pause();

  // p2: walk traced segment by segment at a uniform ~350 px/sec.
  const SPEED = 350;
  const L_1A = Math.hypot(NA.x - N1.x, NA.y - N1.y);
  const L_AB = Math.abs(NB.y - NA.y);
  const L_CIRC = 2 * Math.PI * CYCLE_R;
  const L_AN = Math.hypot(NN.x - NA.x, NN.y - NA.y);
  const ms = (len: number) => Math.round((len / SPEED) * 1000);

  let t = 0;
  drawPath(walk1A, t, ms(L_1A));
  t += ms(L_1A);
  drawPath(walkAB_out, t, ms(L_AB));
  t += ms(L_AB);
  fadeIn(x2Label, t - 80);
  drawPath(walkCircle, t, ms(L_CIRC));
  t += ms(L_CIRC);
  drawPath(walkAB_back, t, ms(L_AB));
  t += ms(L_AB);
  drawPath(walkAN, t, ms(L_AN));
  fadeIn(walkCap, 250);
  await sd.pause();

  // p3: the doubled A-B traversal cancels.
  fadeOut(walkCap);
  fadeIn(cancelCap, 100);
  fadeOut(walkAB_out, 300);
  fadeOut(walkAB_back, 300);
  fadeOut(x2Label, 300);
  await sd.pause();

  // p4: surviving edges regroup into the simple path (blue) + the cycle (orange).
  fadeOut(cancelCap);
  recolor(walk1A, PATH_COL, 100);
  recolor(walkAN, PATH_COL, 100);
  recolor(walkCircle, CYCLE_COL, 100);
  fadeIn(splitCap, 300);
  await sd.pause();

  // p5: lift to the general statement.
  fadeOut(splitCap);
  fadeIn(conclusionCap, 200);
  await sd.pause();
});
