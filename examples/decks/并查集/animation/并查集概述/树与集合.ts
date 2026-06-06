import * as sd from "@/sd";

// Same group, two views: as an unstructured set vs as a rooted tree.
// The tree is what DSU actually stores.

const svg = sd.svg();
const C = sd.color();

const ids = [1, 4, 5, 7];
const ROOT = 4;
const R = 22;

// Left: set view — circles arranged in a row inside a dashed bag.
const LEFT_CX = -180;
const setSpacing = 60;
for (let i = 0; i < ids.length; i++) {
  const cx = LEFT_CX + (i - (ids.length - 1) / 2) * setSpacing;
  new sd.Circle({
    targetNode: svg,
    cx,
    cy: 0,
    r: R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: String(ids[i]),
    cx,
    cy: 0,
    fontSize: 16,
    fill: C.darkButtonGrey,
  });
}
new sd.Rect({
  targetNode: svg,
  x: LEFT_CX - ((ids.length / 2) * setSpacing + R),
  y: -R - 12,
  width: ids.length * setSpacing + R * 2 - 12,
  height: R * 2 + 24,
  rx: 14,
  ry: 14,
  fill: C.none,
  stroke: C.silver,
  strokeWidth: 1.4,
  strokeDashArray: [6, 4],
});
new sd.Text({
  targetNode: svg,
  text: "Set",
  cx: LEFT_CX,
  cy: R + 36,
  fontSize: 18,
  fill: C.darkButtonGrey,
});

// Right: tree view — root + 3 children.
const RIGHT_CX = 180;
const ROOT_CY = 50;
const CHILD_CY = -40;
const positions = new Map<number, { cx: number; cy: number }>();
positions.set(ROOT, { cx: RIGHT_CX, cy: ROOT_CY });
const children = ids.filter((i) => i !== ROOT);
for (let k = 0; k < children.length; k++) {
  positions.set(children[k], {
    cx: RIGHT_CX + (k - (children.length - 1) / 2) * 70,
    cy: CHILD_CY,
  });
}

for (const [id, pos] of positions) {
  new sd.Circle({
    targetNode: svg,
    cx: pos.cx,
    cy: pos.cy,
    r: R,
    fill: C.white,
    stroke: id === ROOT ? C.darkOrange : C.darkButtonGrey,
    strokeWidth: id === ROOT ? 2.4 : 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: String(id),
    cx: pos.cx,
    cy: pos.cy,
    fontSize: 16,
    fill: C.darkButtonGrey,
  });
}

for (const c of children) {
  const cp = positions.get(c)!;
  const rp = positions.get(ROOT)!;
  const dx = rp.cx - cp.cx;
  const dy = rp.cy - cp.cy;
  const dist = Math.hypot(dx, dy) || 1;
  new sd.Line({
    targetNode: svg,
    x1: cp.cx + (dx / dist) * R,
    y1: cp.cy + (dy / dist) * R,
    x2: rp.cx - (dx / dist) * R,
    y2: rp.cy - (dy / dist) * R,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
  });
}
new sd.Text({
  targetNode: svg,
  text: "Tree",
  cx: RIGHT_CX,
  cy: ROOT_CY + R + 22,
  fontSize: 18,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  await sd.pause();
});
