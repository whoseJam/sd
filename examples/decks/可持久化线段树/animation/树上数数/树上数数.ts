import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

interface TreeNode {
  id: string;
  cx: number;
  cy: number;
  value: number;
}

const NODE_R = 14;
const LEFT_X0 = -80;

const tree: TreeNode[] = [
  { id: "1", cx: LEFT_X0 + 80, cy: 130, value: 3 },
  { id: "2", cx: LEFT_X0 + 30, cy: 80, value: 5 },
  { id: "3", cx: LEFT_X0 + 130, cy: 80, value: 2 },
  { id: "4", cx: LEFT_X0, cy: 30, value: 7 },
  { id: "5", cx: LEFT_X0 + 60, cy: 30, value: 1 },
  { id: "6", cx: LEFT_X0 + 110, cy: 30, value: 4 },
  { id: "7", cx: LEFT_X0 + 160, cy: 30, value: 6 },
];

const parents: Record<string, string | null> = {
  "1": null,
  "2": "1",
  "3": "1",
  "4": "2",
  "5": "2",
  "6": "3",
  "7": "3",
};

const U_ID = "4";
const V_ID = "7";
const LCA_ID = "1";
const circles = new Map<string, sd.Circle>();
const labels = new Map<string, sd.Math>();
const edges: sd.Line[] = [];
const edgeByChild = new Map<string, sd.Line>();
const nodeById = new Map<string, TreeNode>();

for (const n of tree) {
  nodeById.set(n.id, n);
  circles.set(
    n.id,
    new sd.Circle({
      targetNode: svg,
      cx: n.cx,
      cy: n.cy,
      r: NODE_R,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.2,
      opacity: 0,
    }),
  );
  labels.set(
    n.id,
    new sd.Math({
      targetNode: svg,
      text: String(n.value),
      cx: n.cx,
      cy: n.cy - 1,
      fontSize: 12,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

for (const n of tree) {
  const p = parents[n.id];
  if (!p) continue;
  const parent = nodeById.get(p)!;
  const line = new sd.Line({
    targetNode: svg,
    x1: parent.cx,
    y1: parent.cy - NODE_R,
    x2: n.cx,
    y2: n.cy + NODE_R,
    stroke: C.silver,
    strokeWidth: 1,
    opacity: 0,
  });
  edges.push(line);
  edgeByChild.set(n.id, line);
}

function pathToRoot(id: string): string[] {
  const out: string[] = [];
  let cur: string | null = id;
  while (cur) {
    out.push(cur);
    cur = parents[cur];
  }
  return out;
}

const uPath = pathToRoot(U_ID);
const vPath = pathToRoot(V_ID);

sd.main(async () => {
  for (let i = 0; i < tree.length; i++) {
    const d = i * 80;
    circles
      .get(tree[i].id)
      ?.startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    labels
      .get(tree[i].id)
      ?.startAnimate({ delay: d + 60, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  for (let i = 0; i < edges.length; i++) {
    edges[i]
      .startAnimate({ delay: 60 + i * 60, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  for (const id of uPath) {
    circles
      .get(id)
      ?.startAnimate({ duration: 240, easing: E.easeOut })
      .setStroke(C.steelBlue)
      .endAnimate();
    labels
      .get(id)
      ?.startAnimate({ duration: 240, easing: E.easeOut })
      .setFill(C.steelBlue)
      .endAnimate();
    const e = edgeByChild.get(id);
    if (e)
      e.startAnimate({ duration: 240, easing: E.easeOut })
        .setStroke(C.steelBlue)
        .endAnimate();
  }
  for (const id of vPath) {
    circles
      .get(id)
      ?.startAnimate({ duration: 240, easing: E.easeOut })
      .setStroke(C.steelBlue)
      .endAnimate();
    labels
      .get(id)
      ?.startAnimate({ duration: 240, easing: E.easeOut })
      .setFill(C.steelBlue)
      .endAnimate();
    const e = edgeByChild.get(id);
    if (e)
      e.startAnimate({ duration: 240, easing: E.easeOut })
        .setStroke(C.steelBlue)
        .endAnimate();
  }
  circles
    .get(LCA_ID)
    ?.startAnimate({ duration: 240, easing: E.easeOut })
    .setStroke(C.red)
    .setStrokeWidth(1.8)
    .endAnimate();
  await sd.pause();
});
