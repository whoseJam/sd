import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 8;
const NODE_W = 24;
const NODE_H = 16;
const LEVEL_Y = [85, 45, 5, -35];
const TIMELINE_Y = -75;
const TIMELINE_H = 14;

const ARRAY_CELL_GAP = 26;
const ARRAY_X0 = -((N - 1) * ARRAY_CELL_GAP) / 2;
const arrayX = (i: number) => ARRAY_X0 + (i - 1) * ARRAY_CELL_GAP;
function nodeCenter(l: number, r: number, level: number) {
  return { cx: (arrayX(l) + arrayX(r)) / 2, cy: LEVEL_Y[level] };
}

interface TreeNode { l: number; r: number; level: number; rect: sd.Rect; text: sd.Text; }
const tree: TreeNode[] = [];
const edges: { line: sd.Line; childLevel: number }[] = [];

function buildEdges(l: number, r: number, level: number) {
  if (l === r) return;
  const m = Math.floor((l + r) / 2);
  const p = nodeCenter(l, r, level);
  const lc = nodeCenter(l, m, level + 1);
  const rc = nodeCenter(m + 1, r, level + 1);
  for (const child of [lc, rc]) {
    edges.push({
      line: new sd.Line({
        targetNode: svg,
        x1: p.cx, y1: p.cy - NODE_H / 2,
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

function buildNodes(l: number, r: number, level: number) {
  const { cx, cy } = nodeCenter(l, r, level);
  tree.push({
    l, r, level,
    rect: new sd.Rect({
      targetNode: svg,
      x: cx - NODE_W / 2, y: cy - NODE_H / 2,
      width: NODE_W, height: NODE_H,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1,
      rx: 3, ry: 3,
      opacity: 0,
    }),
    text: new sd.Text({
      targetNode: svg,
      text: l === r ? String(l) : `${l}-${r}`,
      cx, cy: cy - 1,
      fontSize: 8,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  });
  if (l === r) return;
  const m = Math.floor((l + r) / 2);
  buildNodes(l, m, level + 1);
  buildNodes(m + 1, r, level + 1);
}

buildEdges(1, N, 0);
buildNodes(1, N, 0);

// Timeline strip across the array indices.
const tlBgs: sd.Rect[] = [];
const tlTexts: sd.Text[] = [];
for (let i = 1; i <= N; i++) {
  tlBgs.push(
    new sd.Rect({
      targetNode: svg,
      x: arrayX(i) - 11, y: TIMELINE_Y - TIMELINE_H / 2,
      width: 22, height: TIMELINE_H,
      fill: C.white,
      stroke: C.silver,
      strokeWidth: 0.8,
      rx: 2, ry: 2,
      opacity: 0,
    }),
  );
  tlTexts.push(
    new sd.Text({
      targetNode: svg,
      text: String(i),
      cx: arrayX(i), cy: TIMELINE_Y - 1,
      fontSize: 9,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

// Event range [2, 6] gets covered by tree nodes [2,2], [3,4], [5,6].
const EVENT = { l: 2, r: 6 };
const COVERING: Array<[number, number]> = [[2, 2], [3, 4], [5, 6]];

const EVENT_COLOR = C.darkOrange;
const EVENT_FILL = "#fdecd9";

sd.main(async () => {
  // p1: segment tree + timeline strip
  for (const e of edges) {
    e.line.startAnimate({ duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  }
  for (const n of tree) {
    n.rect.startAnimate({ delay: n.level * 180, duration: 260, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    n.text.startAnimate({ delay: n.level * 180 + 80, duration: 260, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  for (let i = 0; i < N; i++) {
    const d = i * 50;
    tlBgs[i].startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    tlTexts[i].startAnimate({ delay: d + 60, duration: 240, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();

  // p2: event range highlight on timeline
  for (let i = EVENT.l; i <= EVENT.r; i++) {
    const d = (i - EVENT.l) * 100;
    tlBgs[i - 1].startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setFill(EVENT_FILL).setStroke(EVENT_COLOR).setStrokeWidth(1.2)
      .endAnimate();
    tlTexts[i - 1].startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setFill(EVENT_COLOR).endAnimate();
  }
  await sd.pause();

  // p3: tree nodes that cover this range light up
  for (let i = 0; i < COVERING.length; i++) {
    const [l, r] = COVERING[i];
    const node = tree.find((n) => n.l === l && n.r === r)!;
    const d = i * 220;
    node.rect.startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setFill(EVENT_FILL).setStroke(EVENT_COLOR).setStrokeWidth(1.6)
      .endAnimate();
    node.text.startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setFill(EVENT_COLOR).endAnimate();
  }
  await sd.pause();
});
