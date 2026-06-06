import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Full binary tree, depth 3, nodes 1..7.
// Pre:  1 2 4 5 3 6 7
// In:   4 2 5 1 6 3 7
// Post: 4 5 2 6 7 3 1
interface Node {
  id: number;
  x: number;
  y: number;
}
const NODES: Node[] = [
  { id: 1, x: 0, y: 90 },
  { id: 2, x: -55, y: 50 },
  { id: 3, x: 55, y: 50 },
  { id: 4, x: -80, y: 10 },
  { id: 5, x: -30, y: 10 },
  { id: 6, x: 30, y: 10 },
  { id: 7, x: 80, y: 10 },
];

const EDGES: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 6],
  [3, 7],
];

const PRE = [1, 2, 4, 5, 3, 6, 7];
const IN = [4, 2, 5, 1, 6, 3, 7];
const POST = [4, 5, 2, 6, 7, 3, 1];

const NODE_R = 13;
const nodeOf = (id: number) => NODES.find((n) => n.id === id)!;

const edgeLines = EDGES.map(([u, v]) => {
  const a = nodeOf(u);
  const b = nodeOf(v);
  return new sd.Line({
    targetNode: svg,
    x1: a.x,
    y1: a.y,
    x2: b.x,
    y2: b.y,
    stroke: C.silver,
    strokeWidth: 1.2,
    opacity: 0,
  });
});

const circles = NODES.map(
  (n) =>
    new sd.Circle({
      targetNode: svg,
      cx: n.x,
      cy: n.y,
      r: NODE_R,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.4,
      opacity: 0,
    }),
);
const labels = NODES.map(
  (n) =>
    new sd.Text({
      targetNode: svg,
      text: String(n.id),
      cx: n.x,
      cy: n.y - 1,
      fontSize: 11,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
);

// Sequence rows: a key text on the left + 7 cell-like number labels.
function makeSeqRow(key: string, seq: number[], y: number) {
  const keyText = new sd.Text({
    targetNode: svg,
    text: key,
    cx: -110,
    cy: y - 1,
    fontSize: 11,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  const cellW = 18;
  const x0 = -80;
  const cells = seq.map(
    (n, i) =>
      new sd.Text({
        targetNode: svg,
        text: String(n),
        cx: x0 + i * cellW + cellW / 2,
        cy: y - 1,
        fontSize: 12,
        fill: C.darkButtonGrey,
        opacity: 0,
      }),
  );
  return { keyText, cells };
}

const preRow = makeSeqRow("前序", PRE, -45);
const inRow = makeSeqRow("中序", IN, -75);
const postRow = makeSeqRow("后序", POST, -105);

const PRE_COLOR = C.steelBlue;
const IN_COLOR = C.darkOrange;
const POST_COLOR = "#388e3c"; // green

sd.main(async () => {
  // p1: tree appears
  for (const line of edgeLines) {
    line
      .startAnimate({ duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  for (let i = 0; i < NODES.length; i++) {
    const d = 80 + i * 60;
    circles[i]
      .startAnimate({ delay: d, duration: 260, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    labels[i]
      .startAnimate({ delay: d + 60, duration: 260, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  // p2: pre-order
  preRow.keyText
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .setFill(PRE_COLOR)
    .endAnimate();
  for (let i = 0; i < preRow.cells.length; i++) {
    preRow.cells[i]
      .startAnimate({ delay: 80 + i * 110, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .setFill(PRE_COLOR)
      .endAnimate();
  }
  await sd.pause();

  // p3: in-order
  inRow.keyText
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .setFill(IN_COLOR)
    .endAnimate();
  for (let i = 0; i < inRow.cells.length; i++) {
    inRow.cells[i]
      .startAnimate({ delay: 80 + i * 110, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .setFill(IN_COLOR)
      .endAnimate();
  }
  await sd.pause();

  // p4: post-order
  postRow.keyText
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .setFill(POST_COLOR)
    .endAnimate();
  for (let i = 0; i < postRow.cells.length; i++) {
    postRow.cells[i]
      .startAnimate({ delay: 80 + i * 110, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .setFill(POST_COLOR)
      .endAnimate();
  }
  await sd.pause();
});
