import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Tree: 1-2, 1-3, 3-4, 3-5, 5-6, 5-7
// Subtree sizes: 1=7, 2=1, 3=5, 4=1, 5=3, 6=1, 7=1
// Heavy children: 1→3, 3→5, 5→6 (chain 1-3-5-6).
interface Node { id: number; x: number; y: number; }
const NODES: Node[] = [
  { id: 1, x: -50, y: 90 },
  { id: 2, x: -110, y: 30 },
  { id: 3, x: 10, y: 30 },
  { id: 4, x: -40, y: -30 },
  { id: 5, x: 60, y: -30 },
  { id: 6, x: 30, y: -90 },
  { id: 7, x: 110, y: -90 },
];

const EDGES: Array<[number, number]> = [
  [1, 2], [1, 3],
  [3, 4], [3, 5],
  [5, 6], [5, 7],
];

const HEAVY_EDGES: Array<[number, number]> = [
  [1, 3], [3, 5], [5, 6],
];

const HEAVY_COLOR = C.darkOrange;
const HEAVY_WIDTH = 2.8;

const nodeOf = (id: number) => NODES.find((n) => n.id === id)!;
const edgeKey = (u: number, v: number) => `${Math.min(u, v)}-${Math.max(u, v)}`;

const edgeLines = new Map<string, sd.Line>();
for (const [u, v] of EDGES) {
  const a = nodeOf(u);
  const b = nodeOf(v);
  edgeLines.set(
    edgeKey(u, v),
    new sd.Line({
      targetNode: svg,
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      stroke: C.silver,
      strokeWidth: 1.2,
      opacity: 0,
    }),
  );
}

const NODE_R = 14;
const circles = NODES.map((n) => new sd.Circle({
  targetNode: svg,
  cx: n.x, cy: n.y, r: NODE_R,
  fill: C.white,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
  opacity: 0,
}));
const labels = NODES.map((n) => new sd.Text({
  targetNode: svg,
  text: String(n.id),
  cx: n.x, cy: n.y - 1,
  fontSize: 11,
  fill: C.darkButtonGrey,
  opacity: 0,
}));

sd.main(async () => {
  // p1: tree appears
  for (const line of edgeLines.values()) {
    line.startAnimate({ duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  }
  for (let i = 0; i < NODES.length; i++) {
    const d = 100 + i * 70;
    circles[i].startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    labels[i].startAnimate({ delay: d + 80, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();

  // p2: heavy edges highlight — the spine chain
  for (let i = 0; i < HEAVY_EDGES.length; i++) {
    const [u, v] = HEAVY_EDGES[i];
    edgeLines.get(edgeKey(u, v))!
      .startAnimate({ delay: i * 200, duration: 360, easing: E.easeOut })
      .setStroke(HEAVY_COLOR).setStrokeWidth(HEAVY_WIDTH)
      .endAnimate();
  }
  await sd.pause();
});
