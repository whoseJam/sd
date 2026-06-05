import * as sd from "@/sd";

// Reverse-time merging: skipped (destroyed) planets greyed out, then
// each beat "restores" one and lights the edges that re-activate.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const R = 18;
const positions: Array<[number, number]> = [
  [-150, 60],
  [-50, 110],
  [50, 60],
  [-100, -40],
  [60, -30],
  [150, 80],
  [120, -90],
];
const destroyed = [2, 4, 6];

interface Node { cx: number; cy: number; circle: sd.Circle }
const nodes: Node[] = [];
for (let i = 0; i < positions.length; i++) {
  const cx = positions[i][0];
  const cy = positions[i][1];
  const isDead = destroyed.includes(i);
  const circle = new sd.Circle({
    targetNode: svg,
    cx,
    cy,
    r: R,
    fill: isDead ? C.silver : C.white,
    stroke: isDead ? C.silver : C.darkButtonGrey,
    strokeWidth: 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: String(i),
    cx,
    cy,
    fontSize: 14,
    fill: isDead ? C.white : C.darkButtonGrey,
  });
  nodes.push({ cx, cy, circle });
}

const edges: Array<[number, number]> = [
  [0, 1], [1, 2], [0, 3], [3, 4], [4, 2], [2, 5], [4, 6], [5, 6],
];

const edgeLines: Array<{ line: sd.Line; involvesDead: boolean }> = [];
for (const [u, v] of edges) {
  const a = nodes[u];
  const b = nodes[v];
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const dist = Math.hypot(dx, dy) || 1;
  const involvesDead = destroyed.includes(u) || destroyed.includes(v);
  edgeLines.push({
    line: new sd.Line({
      targetNode: svg,
      x1: a.cx + (dx / dist) * R,
      y1: a.cy + (dy / dist) * R,
      x2: b.cx - (dx / dist) * R,
      y2: b.cy - (dy / dist) * R,
      stroke: involvesDead ? C.silver : C.darkButtonGrey,
      strokeWidth: 1.2,
    }),
    involvesDead,
  });
}

const RESTORE_FILL = "#cfead0";
const RESTORE_STROKE = C.darkGreen;

sd.main(async () => {
  await sd.pause();

  // Restore destroyed nodes in reverse order. For each, light the
  // node green and brighten its edges.
  for (let k = destroyed.length - 1; k >= 0; k--) {
    const id = destroyed[k];
    const delay = (destroyed.length - 1 - k) * 280;
    nodes[id].circle
      .startAnimate({ delay, duration: 280, easing: E.easeOut })
      .setFill(RESTORE_FILL)
      .setStroke(RESTORE_STROKE)
      .setStrokeWidth(2.2)
      .endAnimate();
  }
  await sd.pause();

  void E;
});
