import * as sd from "@/sd";

import { arrow } from "../lib/arrow";

// Food chain cycle: A → B → C → A. Three nodes with cyclic predation
// arrows.

const svg = sd.svg();
const C = sd.color();

const R = 22;
const positions: Array<[string, number, number]> = [
  ["A", 0, 80],
  ["B", -80, -40],
  ["C", 80, -40],
];

const nodes = new Map<string, { cx: number; cy: number }>();
for (const [id, cx, cy] of positions) {
  new sd.Circle({
    targetNode: svg,
    cx,
    cy,
    r: R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: id,
    cx,
    cy,
    fontSize: 16,
    fill: C.darkButtonGrey,
  });
  nodes.set(id, { cx, cy });
}

const pairs: Array<[string, string]> = [
  ["A", "B"],
  ["B", "C"],
  ["C", "A"],
];
for (const [u, v] of pairs) {
  const a = nodes.get(u)!;
  const b = nodes.get(v)!;
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const dist = Math.hypot(dx, dy) || 1;
  arrow(svg, {
    from: { x: a.cx + (dx / dist) * R, y: a.cy + (dy / dist) * R },
    to: { x: b.cx - (dx / dist) * R, y: b.cy - (dy / dist) * R },
    stroke: C.darkOrange,
  });
}

new sd.Text({
  targetNode: svg,
  text: "A 吃 B 吃 C 吃 A",
  cx: 0,
  cy: -100,
  fontSize: 14,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  await sd.pause();
});
