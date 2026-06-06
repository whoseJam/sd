import * as sd from "@/sd";

// Merging two weighted DSU trees: tree A's root x with d[x] = 0,
// tree B's root y with d[y] = 0; given that dis(x → y) = w, set
// d[x] = w so x now points to y. Edge labels show the d values.

const svg = sd.svg();
const C = sd.color();

const R = 22;

interface N {
  id: string;
  cx: number;
  cy: number;
}

const before: N[] = [
  { id: "a", cx: -180, cy: 60 },
  { id: "b", cx: -150, cy: -30 },
  { id: "x", cx: -120, cy: 60 },
  { id: "y", cx: 60, cy: 60 },
  { id: "c", cx: 90, cy: -30 },
];

function draw(n: N, isRoot: boolean) {
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
    fontSize: 14,
    fill: C.darkButtonGrey,
  });
}

for (const n of before) draw(n, n.id === "x" || n.id === "y");

function edge(child: N, parent: N, label?: string) {
  const dx = parent.cx - child.cx;
  const dy = parent.cy - child.cy;
  const dist = Math.hypot(dx, dy) || 1;
  new sd.Line({
    targetNode: svg,
    x1: child.cx + (dx / dist) * R,
    y1: child.cy + (dy / dist) * R,
    x2: parent.cx - (dx / dist) * R,
    y2: parent.cy - (dy / dist) * R,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
  });
  if (label) {
    new sd.Text({
      targetNode: svg,
      text: label,
      cx: (child.cx + parent.cx) / 2 + 14,
      cy: (child.cy + parent.cy) / 2,
      fontSize: 12,
      fill: C.steelBlue,
    });
  }
}

edge(before[0], before[2], "3");
edge(before[1], before[2], "1");
edge(before[4], before[3], "2");

new sd.Math({
  targetNode: svg,
  text: "\\text{dis}(x \\to y) = 4",
  cx: 0,
  cy: -110,
  fontSize: 14,
  fill: C.darkOrange,
});

new sd.Path({
  targetNode: svg,
  d: `M ${before[2].cx + R} ${before[2].cy + 20} Q 0 ${before[2].cy - 60} ${before[3].cx - R} ${before[3].cy + 20}`,
  stroke: C.darkOrange,
  strokeWidth: 1.6,
  strokeDashArray: [5, 4],
  fill: C.none,
});

new sd.Text({
  targetNode: svg,
  text: "set d[x] = 4",
  cx: 0,
  cy: 100,
  fontSize: 13,
  fill: C.darkOrange,
});

sd.main(async () => {
  await sd.pause();
});
