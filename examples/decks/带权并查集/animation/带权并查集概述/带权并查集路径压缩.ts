import * as sd from "@/sd";

// Before/after path compression on a weighted DSU: child's stored
// distance d[u] becomes the sum of distances along the path to root.

const svg = sd.svg();
const C = sd.color();

const R = 20;

interface N {
  id: string;
  cx: number;
  cy: number;
}
const left: N[] = [
  { id: "root", cx: -150, cy: 60 },
  { id: "u", cx: -150, cy: 0 },
  { id: "v", cx: -150, cy: -60 },
];
const right: N[] = [
  { id: "root", cx: 150, cy: 60 },
  { id: "u", cx: 100, cy: -10 },
  { id: "v", cx: 200, cy: -10 },
];

function place(n: N, isRoot: boolean) {
  new sd.Circle({
    targetNode: svg,
    cx: n.cx,
    cy: n.cy,
    r: R,
    fill: C.white,
    stroke: isRoot ? C.darkOrange : C.darkButtonGrey,
    strokeWidth: isRoot ? 2.4 : 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: n.id,
    cx: n.cx,
    cy: n.cy,
    fontSize: 12,
    fill: C.darkButtonGrey,
  });
}

function edge(c: N, p: N, label: string) {
  const dx = p.cx - c.cx;
  const dy = p.cy - c.cy;
  const dist = Math.hypot(dx, dy) || 1;
  new sd.Line({
    targetNode: svg,
    x1: c.cx + (dx / dist) * R,
    y1: c.cy + (dy / dist) * R,
    x2: p.cx - (dx / dist) * R,
    y2: p.cy - (dy / dist) * R,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
  });
  new sd.Text({
    targetNode: svg,
    text: label,
    cx: (c.cx + p.cx) / 2 + 12,
    cy: (c.cy + p.cy) / 2,
    fontSize: 12,
    fill: C.steelBlue,
  });
}

for (const n of left) place(n, n.id === "root");
edge(left[1], left[0], "2");
edge(left[2], left[1], "3");

for (const n of right) place(n, n.id === "root");
edge(right[1], right[0], "2");
edge(right[2], right[0], "5");

new sd.Text({
  targetNode: svg,
  text: "before",
  cx: -150,
  cy: -100,
  fontSize: 14,
  fill: C.darkButtonGrey,
});
new sd.Text({
  targetNode: svg,
  text: "after",
  cx: 150,
  cy: -100,
  fontSize: 14,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  await sd.pause();
});
