import * as sd from "@/sd";

// Holes A, B, C in the middle + special TOP and BOTTOM nodes; edges
// (= "intersecting" relations) merge components. End state: TOP and
// BOTTOM are in the same component via A → B → C.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const R = 22;
const nodes: Record<string, { cx: number; cy: number; circle: sd.Circle }> = {};
const layout: Array<[string, number, number]> = [
  ["TOP", 0, 120],
  ["A", -100, 40],
  ["B", 0, -20],
  ["C", 100, 40],
  ["BOT", 0, -120],
];
for (const [label, cx, cy] of layout) {
  const circle = new sd.Circle({
    targetNode: svg,
    cx,
    cy,
    r: R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
  });
  new sd.Text({ targetNode: svg, text: label, cx, cy, fontSize: 13, fill: C.darkButtonGrey });
  nodes[label] = { cx, cy, circle };
}

const edges: Array<[string, string]> = [
  ["TOP", "A"],
  ["A", "B"],
  ["B", "C"],
  ["C", "BOT"],
];

const lines: sd.Line[] = [];
for (const [u, v] of edges) {
  const a = nodes[u];
  const b = nodes[v];
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const dist = Math.hypot(dx, dy) || 1;
  lines.push(
    new sd.Line({
      targetNode: svg,
      x1: a.cx + (dx / dist) * R,
      y1: a.cy + (dy / dist) * R,
      x2: b.cx - (dx / dist) * R,
      y2: b.cy - (dy / dist) * R,
      stroke: C.darkOrange,
      strokeWidth: 1.6,
      opacity: 0,
    }),
  );
}

sd.main(async () => {
  await sd.pause();
  for (let i = 0; i < lines.length; i++) {
    lines[i]
      .startAnimate({ delay: i * 200, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
  // Highlight the source/sink.
  nodes.TOP.circle.startAnimate({ duration: 280 }).setStroke(C.darkGreen).setStrokeWidth(2.4).endAnimate();
  nodes.BOT.circle.startAnimate({ duration: 280 }).setStroke(C.darkGreen).setStrokeWidth(2.4).endAnimate();
  await sd.pause();
});
