import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 8;
const NODE_W = 24;
const NODE_H = 16;

// Array cell centers — leaves of the segment tree land at these x positions.
const ARRAY_Y = -75;
const LEAF_Y = -35;
const LEVEL2_Y = 5;
const LEVEL1_Y = 45;
const ROOT_Y = 85;
const LEVEL_Y = [ROOT_Y, LEVEL1_Y, LEVEL2_Y, LEAF_Y];

const ARRAY_CELL_GAP = 26; // cell pitch
const ARRAY_X0 = -((N - 1) * ARRAY_CELL_GAP) / 2;

function arrayX(i: number): number {
  return ARRAY_X0 + (i - 1) * ARRAY_CELL_GAP;
}

function nodeCenter(l: number, r: number, level: number): { cx: number; cy: number } {
  return { cx: (arrayX(l) + arrayX(r)) / 2, cy: LEVEL_Y[level] };
}

interface TreeNode { l: number; r: number; level: number; rect: sd.Rect; text: sd.Text; }

const tree: TreeNode[] = [];
function build(l: number, r: number, level: number) {
  const { cx, cy } = nodeCenter(l, r, level);
  const rect = new sd.Rect({
    targetNode: svg,
    x: cx - NODE_W / 2, y: cy - NODE_H / 2,
    width: NODE_W, height: NODE_H,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1,
    rx: 3, ry: 3,
    opacity: 0,
  });
  const text = new sd.Text({
    targetNode: svg,
    text: l === r ? String(l) : `${l}-${r}`,
    cx, cy: cy - 1,
    fontSize: 8,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  tree.push({ l, r, level, rect, text });
  if (l === r) return;
  const m = Math.floor((l + r) / 2);
  build(l, m, level + 1);
  build(m + 1, r, level + 1);
}

// Edges first so they render under the nodes.
interface TreeEdge { line: sd.Line; childLevel: number; }
const edges: TreeEdge[] = [];

function buildEdges(l: number, r: number, level: number) {
  if (l === r) return;
  const m = Math.floor((l + r) / 2);
  const parent = nodeCenter(l, r, level);
  const left = nodeCenter(l, m, level + 1);
  const right = nodeCenter(m + 1, r, level + 1);
  for (const child of [left, right]) {
    edges.push({
      line: new sd.Line({
        targetNode: svg,
        x1: parent.cx, y1: parent.cy - NODE_H / 2,
        x2: child.cx, y2: child.cy + NODE_H / 2,
        stroke: C.silver,
        strokeWidth: 0.8,
        opacity: 0,
      }),
      childLevel: level + 1,
    });
  }
  buildEdges(l, m, level + 1);
  buildEdges(m + 1, r, level + 1);
}

buildEdges(1, N, 0);
build(1, N, 0);

// Array cells along the bottom.
const arrayBgs: sd.Rect[] = [];
const arrayTexts: sd.Text[] = [];
const arrayValues = [5, 3, 8, 1, 6, 4, 7, 2];
for (let i = 1; i <= N; i++) {
  const cx = arrayX(i);
  const w = 22, h = 16;
  arrayBgs.push(
    new sd.Rect({
      targetNode: svg,
      x: cx - w / 2, y: ARRAY_Y - h / 2,
      width: w, height: h,
      fill: C.white,
      stroke: C.silver,
      strokeWidth: 0.8,
      rx: 2, ry: 2,
      opacity: 0,
    }),
  );
  arrayTexts.push(
    new sd.Text({
      targetNode: svg,
      text: String(arrayValues[i - 1]),
      cx, cy: ARRAY_Y - 1,
      fontSize: 9,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

sd.main(async () => {
  // p1: array appears
  for (let i = 0; i < N; i++) {
    const d = i * 60;
    arrayBgs[i]
      .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    arrayTexts[i]
      .startAnimate({ delay: d + 80, duration: 240, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();

  // p2: tree grows top-down with level stagger
  const LEVEL_DELAY = 280;
  for (const node of tree) {
    const d = node.level * LEVEL_DELAY;
    node.rect
      .startAnimate({ delay: d, duration: 260, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    node.text
      .startAnimate({ delay: d + 80, duration: 260, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  for (const edge of edges) {
    const d = (edge.childLevel - 1) * LEVEL_DELAY + 120;
    edge.line
      .startAnimate({ delay: d, duration: 260, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();
});
