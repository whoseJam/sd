import * as sd from "@/sd";

// 8 nodes laid out on a grid, then a sequence of merges. Each beat
// adds one parent edge (child -> parent) and lights the edge orange.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 8;
const R = 22;
const GRID = 80;

interface Node { id: number; cx: number; cy: number; circle: sd.Circle }

const nodes: Node[] = [];
for (let i = 1; i <= N; i++) {
  const col = (i - 1) % 4;
  const row = Math.floor((i - 1) / 4);
  const cx = (col - 1.5) * GRID;
  const cy = (0.5 - row) * GRID;
  const circle = new sd.Circle({
    targetNode: svg,
    cx,
    cy,
    r: R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
  });
  new sd.Text({ targetNode: svg, text: String(i), cx, cy, fontSize: 16, fill: C.darkButtonGrey });
  nodes.push({ id: i, cx, cy, circle });
}

// Hand-picked merges with explicit parent (child -> parent). Avoid
// cycles since this is the conceptual demo, not a path-compression
// trace.
const merges: Array<[number, number]> = [
  [1, 2],
  [4, 5],
  [3, 6],
  [2, 6],
  [6, 8],
  [3, 7],
];

const HL_STROKE = C.darkOrange;

sd.main(async () => {
  await sd.pause();
  for (const [child, parent] of merges) {
    const a = nodes[child - 1];
    const b = nodes[parent - 1];
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    const dist = Math.hypot(dx, dy) || 1;
    const line = new sd.Line({
      targetNode: svg,
      x1: a.cx + (dx / dist) * R,
      y1: a.cy + (dy / dist) * R,
      x2: b.cx - (dx / dist) * R,
      y2: b.cy - (dy / dist) * R,
      stroke: HL_STROKE,
      strokeWidth: 1.6,
      opacity: 0,
    });
    line.startAnimate({ duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
    await sd.pause();
  }
});
