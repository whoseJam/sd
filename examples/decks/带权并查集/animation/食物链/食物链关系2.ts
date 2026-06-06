import * as sd from "@/sd";

import { arrow } from "../lib/arrow";

// Encoded as DSU distances mod 3: distance 0 = same species,
// 1 = predator, 2 = prey. Three points on a number circle.

const svg = sd.svg();
const C = sd.color();

const positions = [
  { id: 0, label: "同类", cx: 0, cy: 70 },
  { id: 1, label: "吃 (1)", cx: -90, cy: -40 },
  { id: 2, label: "被吃 (2)", cx: 90, cy: -40 },
];

const R = 22;
for (const p of positions) {
  new sd.Circle({
    targetNode: svg,
    cx: p.cx,
    cy: p.cy,
    r: R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: String(p.id),
    cx: p.cx,
    cy: p.cy,
    fontSize: 16,
    fill: C.darkButtonGrey,
  });
  new sd.Text({
    targetNode: svg,
    text: p.label,
    cx: p.cx,
    cy: p.cy - R - 18,
    fontSize: 12,
    fill: C.darkButtonGrey,
  });
}

// Arrows along the cycle 0 → 1 → 2 → 0 with "+1" labels.
const order = [0, 1, 2, 0];
for (let i = 0; i < order.length - 1; i++) {
  const a = positions[order[i]];
  const b = positions[order[i + 1]];
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const dist = Math.hypot(dx, dy) || 1;
  arrow(svg, {
    from: { x: a.cx + (dx / dist) * R, y: a.cy + (dy / dist) * R },
    to: { x: b.cx - (dx / dist) * R, y: b.cy - (dy / dist) * R },
    stroke: C.darkOrange,
  });
}

new sd.Math({
  targetNode: svg,
  text: "d \\bmod 3",
  cx: 0,
  cy: -110,
  fontSize: 15,
  fill: C.darkOrange,
});

sd.main(async () => {
  await sd.pause();
});
