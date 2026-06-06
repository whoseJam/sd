import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Decision-tree walk for "k-th smallest XOR" on basis {b_3=13, b_2=6, b_1=3}.
// Tree leaves are the 8 sorted XOR values 0, 3, 5, 6, 8, 11, 13, 14.
// For k = 5 the path is: root → right (k=5 > 4) → left (k=1 ≤ 2)
// → left (k=1 ≤ 1) → leaf "8".

const LEAF_VALUES = [0, 3, 5, 6, 8, 11, 13, 14];

const LEAF_Y = -70;
const L2_Y = -20;
const L1_Y = 35;
const ROOT_Y = 90;

const LEAF_XS = [-175, -125, -75, -25, 25, 75, 125, 175];
const L2_XS = [-150, -50, 50, 150];
const L1_XS = [-100, 100];
const ROOT_X = 0;

const NODE_R = 6;
const NODE_FILL = C.white;
const NODE_STROKE = C.darkButtonGrey;
const NODE_STROKE_W = 1.4;

const PATH_FILL = C.darkOrange;
const PATH_STROKE = "#a04d09";
const PATH_W = 2.6;

const EDGE_STROKE = C.silver;
const EDGE_W = 1;

// The chosen path through the tree (indices at each level).
// At root: go right (idx 1 of [0, 1]).
// At L1 right (x = +100): go left to L2 idx 2 (x = +50).
// At L2 idx 2 (x = +50): go left to leaf idx 4 (x = +25, value 8).
const PATH_NODES = [
  { x: ROOT_X, y: ROOT_Y },
  { x: L1_XS[1], y: L1_Y },
  { x: L2_XS[2], y: L2_Y },
  { x: LEAF_XS[4], y: LEAF_Y },
];

// Edges: parent → child mapping.
// Level 0 → 1: root to both L1 nodes.
// Level 1 → 2: L1[0] to L2[0], L2[1]; L1[1] to L2[2], L2[3].
// Level 2 → leaves: L2[i] to leaves[2i], leaves[2i+1].
interface EdgeKey {
  from: { x: number; y: number };
  to: { x: number; y: number };
}
const ALL_EDGES: EdgeKey[] = [];
ALL_EDGES.push({
  from: { x: ROOT_X, y: ROOT_Y },
  to: { x: L1_XS[0], y: L1_Y },
});
ALL_EDGES.push({
  from: { x: ROOT_X, y: ROOT_Y },
  to: { x: L1_XS[1], y: L1_Y },
});
for (let p = 0; p < 2; p++) {
  ALL_EDGES.push({
    from: { x: L1_XS[p], y: L1_Y },
    to: { x: L2_XS[2 * p], y: L2_Y },
  });
  ALL_EDGES.push({
    from: { x: L1_XS[p], y: L1_Y },
    to: { x: L2_XS[2 * p + 1], y: L2_Y },
  });
}
for (let p = 0; p < 4; p++) {
  ALL_EDGES.push({
    from: { x: L2_XS[p], y: L2_Y },
    to: { x: LEAF_XS[2 * p], y: LEAF_Y },
  });
  ALL_EDGES.push({
    from: { x: L2_XS[p], y: L2_Y },
    to: { x: LEAF_XS[2 * p + 1], y: LEAF_Y },
  });
}

const allEdgeLines: sd.Line[] = ALL_EDGES.map(
  (e) =>
    new sd.Line({
      targetNode: svg,
      x1: e.from.x,
      y1: e.from.y,
      x2: e.to.x,
      y2: e.to.y,
      stroke: EDGE_STROKE,
      strokeWidth: EDGE_W,
      opacity: 0,
    }),
);

// Internal node circles.
const internalNodes: { x: number; y: number; circle: sd.Circle }[] = [];
function addNode(x: number, y: number) {
  internalNodes.push({
    x,
    y,
    circle: new sd.Circle({
      targetNode: svg,
      cx: x,
      cy: y,
      r: NODE_R,
      fill: NODE_FILL,
      stroke: NODE_STROKE,
      strokeWidth: NODE_STROKE_W,
      opacity: 0,
    }),
  });
}
addNode(ROOT_X, ROOT_Y);
for (const x of L1_XS) addNode(x, L1_Y);
for (const x of L2_XS) addNode(x, L2_Y);

// Leaves: rectangles with values.
interface Leaf {
  bg: sd.Rect;
  text: sd.Text;
}
const LEAF_W = 28;
const LEAF_H = 22;
const leaves: Leaf[] = LEAF_VALUES.map((v, i) => ({
  bg: new sd.Rect({
    targetNode: svg,
    x: LEAF_XS[i] - LEAF_W / 2,
    y: LEAF_Y - LEAF_H / 2,
    width: LEAF_W,
    height: LEAF_H,
    fill: C.white,
    stroke: NODE_STROKE,
    strokeWidth: NODE_STROKE_W,
    rx: 3,
    ry: 3,
    opacity: 0,
  }),
  text: new sd.Text({
    targetNode: svg,
    text: String(v),
    cx: LEAF_XS[i],
    cy: LEAF_Y - 1,
    fontSize: 12,
    fill: C.darkButtonGrey,
    opacity: 0,
  }),
}));

// Basis labels on the left, one per decision level. Each label sits
// next to the row of nodes that resulted from deciding about that b_i.
const BASIS_LABEL_X = -240;
const basisLabels: sd.Math[] = [
  new sd.Math({
    targetNode: svg,
    text: "b_3 = 13",
    cx: BASIS_LABEL_X,
    cy: L1_Y,
    fontSize: 14,
    fill: C.darkButtonGrey,
    opacity: 0,
  }),
  new sd.Math({
    targetNode: svg,
    text: "b_2 = 6",
    cx: BASIS_LABEL_X,
    cy: L2_Y,
    fontSize: 14,
    fill: C.darkButtonGrey,
    opacity: 0,
  }),
  new sd.Math({
    targetNode: svg,
    text: "b_1 = 3",
    cx: BASIS_LABEL_X,
    cy: LEAF_Y,
    fontSize: 14,
    fill: C.darkButtonGrey,
    opacity: 0,
  }),
];

// k-counter at top-center, updates as we descend the path.
const kCounter = new sd.Math({
  targetNode: svg,
  text: "k = 5",
  cx: 0,
  cy: ROOT_Y + 30,
  fontSize: 16,
  fill: PATH_STROKE,
  opacity: 0,
});

const DUR = 280;

function fadeIn(
  el: sd.Rect | sd.Text | sd.Math | sd.Line | sd.Circle,
  delay = 0,
) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function highlightNode(idx: number, delay = 0) {
  internalNodes[idx].circle
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(PATH_FILL)
    .setStroke(PATH_STROKE)
    .setStrokeWidth(2.4)
    .endAnimate();
}

function highlightEdge(
  from: { x: number; y: number },
  to: { x: number; y: number },
  delay = 0,
) {
  const idx = ALL_EDGES.findIndex(
    (e) =>
      e.from.x === from.x &&
      e.from.y === from.y &&
      e.to.x === to.x &&
      e.to.y === to.y,
  );
  if (idx < 0) return;
  allEdgeLines[idx]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setStroke(PATH_STROKE)
    .setStrokeWidth(PATH_W)
    .endAnimate();
}

function highlightLeaf(idx: number, delay = 0) {
  leaves[idx].bg
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill("#fdecd9")
    .setStroke(PATH_STROKE)
    .setStrokeWidth(2)
    .endAnimate();
  leaves[idx].text
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(PATH_STROKE)
    .endAnimate();
}

function updateK(text: string, delay = 0) {
  kCounter
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setText(text)
    .endAnimate();
}

// Find node index by (x, y).
function nodeIdx(x: number, y: number): number {
  return internalNodes.findIndex((n) => n.x === x && n.y === y);
}

sd.main(async () => {
  // p1: tree skeleton appears top-down, layer by layer.
  // Each layer = parent's outgoing edges + child nodes, fading in together
  // so edges never land on empty space.
  const LAYER_DUR = 200;

  // Layer 0: root + chrome (k counter, basis labels).
  fadeIn(internalNodes[nodeIdx(ROOT_X, ROOT_Y)].circle);
  fadeIn(kCounter);
  for (let i = 0; i < basisLabels.length; i++) fadeIn(basisLabels[i], i * 60);

  // Layer 1: edges root → L1 + L1 nodes.
  for (let i = 0; i < 2; i++) {
    fadeIn(allEdgeLines[i], LAYER_DUR);
    fadeIn(internalNodes[nodeIdx(L1_XS[i], L1_Y)].circle, LAYER_DUR);
  }

  // Layer 2: edges L1 → L2 + L2 nodes. Edges 2..5.
  for (let i = 2; i < 6; i++) fadeIn(allEdgeLines[i], LAYER_DUR * 2);
  for (let i = 0; i < 4; i++)
    fadeIn(internalNodes[nodeIdx(L2_XS[i], L2_Y)].circle, LAYER_DUR * 2);

  // Layer 3: edges L2 → leaves + leaf rects. Edges 6..13.
  for (let i = 6; i < 14; i++) fadeIn(allEdgeLines[i], LAYER_DUR * 3);
  for (let i = 0; i < leaves.length; i++) {
    fadeIn(leaves[i].bg, LAYER_DUR * 3);
    fadeIn(leaves[i].text, LAYER_DUR * 3 + 40);
  }

  highlightNode(nodeIdx(ROOT_X, ROOT_Y), LAYER_DUR * 3 + 240);
  await sd.pause();

  // p2: step 1 — root → right (k = 5 > 4, go larger). k becomes 1.
  highlightEdge(PATH_NODES[0], PATH_NODES[1]);
  highlightNode(nodeIdx(PATH_NODES[1].x, PATH_NODES[1].y), 200);
  updateK("k = 1", 400);
  await sd.pause();

  // p3: step 2 — right L1 → left L2 (k = 1 ≤ 2, go smaller). k stays 1.
  highlightEdge(PATH_NODES[1], PATH_NODES[2]);
  highlightNode(nodeIdx(PATH_NODES[2].x, PATH_NODES[2].y), 200);
  await sd.pause();

  // p4: step 3 — L2 → leaf at index 4 (value 8). Final answer.
  highlightEdge(PATH_NODES[2], PATH_NODES[3]);
  highlightLeaf(4, 200);
  await sd.pause();
});
