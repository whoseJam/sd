import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NODE_R = 14;

interface Node {
  id: string;
  x: number;
  y: number;
  isRoot?: boolean;
  isLeaf?: boolean;
}
const NODES: Node[] = [
  { id: "1", x: 0, y: 70, isRoot: true },
  { id: "2", x: -60, y: 20 },
  { id: "3", x: 60, y: 20 },
  { id: "4", x: -90, y: -30, isLeaf: true },
  { id: "5", x: -30, y: -30, isLeaf: true },
  { id: "6", x: 30, y: -30, isLeaf: true },
  { id: "7", x: 90, y: -30, isLeaf: true },
];

const EDGES: Array<[string, string]> = [
  ["1", "2"],
  ["1", "3"],
  ["2", "4"],
  ["2", "5"],
  ["3", "6"],
  ["3", "7"],
];

const ROOT_FILL = "#e3f2fd";
const ROOT_STROKE = C.steelBlue;
const LEAF_FILL = "#fdecd9";
const LEAF_STROKE = C.darkOrange;

const nodeOf = (id: string) => NODES.find((n) => n.id === id)!;

const edgeLines: sd.Line[] = EDGES.map(([u, v]) => {
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
      text: n.id,
      cx: n.x,
      cy: n.y - 1,
      fontSize: 11,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
);

const DEPTH_X = 130;
const depthLines: sd.Line[] = [];
const depthLabels: sd.Text[] = [];
const DEPTH_Y = [70, 20, -30];
for (let i = 0; i < DEPTH_Y.length; i++) {
  depthLines.push(
    new sd.Line({
      targetNode: svg,
      x1: -120,
      y1: DEPTH_Y[i],
      x2: 120,
      y2: DEPTH_Y[i],
      stroke: C.silver,
      strokeWidth: 0.6,
      strokeDashArray: [3, 3],
      opacity: 0,
    }),
  );
  depthLabels.push(
    new sd.Text({
      targetNode: svg,
      text: String(i),
      cx: DEPTH_X,
      cy: DEPTH_Y[i] - 1,
      fontSize: 11,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

sd.main(async () => {
  // p1: tree appears top-down
  const LEVELS = [[0], [1, 2], [3, 4, 5, 6]];
  for (let lvl = 0; lvl < LEVELS.length; lvl++) {
    const d = lvl * 240;
    for (const ni of LEVELS[lvl]) {
      circles[ni]
        .startAnimate({ delay: d, duration: 280, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
      labels[ni]
        .startAnimate({ delay: d + 80, duration: 280, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
    if (lvl > 0) {
      for (let e = 0; e < edgeLines.length; e++) {
        const [u, v] = EDGES[e];
        const childLevel = LEVELS.findIndex((arr) =>
          arr.includes(NODES.findIndex((n) => n.id === v)),
        );
        if (childLevel === lvl) {
          edgeLines[e]
            .startAnimate({ delay: d - 80, duration: 240, easing: E.easeOut })
            .setOpacity(1)
            .endAnimate();
        }
      }
    }
  }
  await sd.pause();

  // p2: root highlighted
  const rootIdx = NODES.findIndex((n) => n.isRoot);
  circles[rootIdx]
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setFill(ROOT_FILL)
    .setStroke(ROOT_STROKE)
    .setStrokeWidth(2)
    .endAnimate();
  await sd.pause();

  // p3: leaves highlighted
  for (let i = 0; i < NODES.length; i++) {
    if (!NODES[i].isLeaf) continue;
    const d = (i - 3) * 100;
    circles[i]
      .startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setFill(LEAF_FILL)
      .setStroke(LEAF_STROKE)
      .setStrokeWidth(2)
      .endAnimate();
  }
  await sd.pause();

  // p4: depth markers
  for (let i = 0; i < DEPTH_Y.length; i++) {
    const d = i * 180;
    depthLines[i]
      .startAnimate({ delay: d, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    depthLabels[i]
      .startAnimate({ delay: d + 100, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});
