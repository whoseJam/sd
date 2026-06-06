import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const nodes = [
  { id: 1, cx: -160, cy: 60 },
  { id: 2, cx: -40, cy: 80 },
  { id: 3, cx: 80, cy: 60 },
  { id: 4, cx: -100, cy: -20 },
  { id: 5, cx: 20, cy: -40 },
  { id: 6, cx: 140, cy: -20 },
];
const edges: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 5],
  [5, 6],
];

for (const n of nodes) {
  new sd.Circle({
    targetNode: svg,
    cx: n.cx,
    cy: n.cy,
    r: 18,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: String(n.id),
    cx: n.cx,
    cy: n.cy,
    fontSize: 13,
    fill: C.darkButtonGrey,
  });
}

for (const [u, v] of edges) {
  const a = nodes.find((n) => n.id === u)!;
  const b = nodes.find((n) => n.id === v)!;
  new sd.Line({
    targetNode: svg,
    x1: a.cx,
    y1: a.cy,
    x2: b.cx,
    y2: b.cy,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
  });
}

sd.main(async () => {
  await sd.pause();
});
