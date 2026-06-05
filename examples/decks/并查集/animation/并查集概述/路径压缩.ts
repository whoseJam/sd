import * as sd from "@/sd";

// Two-state visualization: original tree (chain-ish), then after
// find(10) compresses the path — every node on it points directly
// to the root.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

interface Pos { cx: number; cy: number }

const ROOT = 1;
const POSITIONS_BEFORE: Record<number, Pos> = {
  1: { cx: 0, cy: 80 },
  2: { cx: -120, cy: 20 },
  3: { cx: 0, cy: 20 },
  9: { cx: -40, cy: -40 },
  11: { cx: 40, cy: -40 },
  10: { cx: 0, cy: -100 },
};

const PARENTS_BEFORE: Record<number, number> = {
  2: 1, 3: 1, 9: 3, 11: 3, 10: 9,
};
const PARENTS_AFTER: Record<number, number> = {
  2: 1, 3: 1, 9: 1, 11: 3, 10: 1,
};

const R = 18;
const circles = new Map<number, sd.Circle>();
const labels = new Map<number, sd.Text>();
const edges = new Map<string, sd.Line>();

for (const id of Object.keys(POSITIONS_BEFORE).map(Number).concat([ROOT])) {
  if (!POSITIONS_BEFORE[id]) continue;
  const p = POSITIONS_BEFORE[id];
  circles.set(
    id,
    new sd.Circle({
      targetNode: svg,
      cx: p.cx,
      cy: p.cy,
      r: R,
      fill: C.white,
      stroke: id === ROOT ? C.darkOrange : C.darkButtonGrey,
      strokeWidth: id === ROOT ? 2.4 : 1.4,
    }),
  );
  labels.set(
    id,
    new sd.Text({ targetNode: svg, text: String(id), cx: p.cx, cy: p.cy, fontSize: 14, fill: C.darkButtonGrey }),
  );
}

function makeEdge(child: number, parent: number) {
  const cp = POSITIONS_BEFORE[child];
  const pp = POSITIONS_BEFORE[parent];
  if (!cp || !pp) return undefined;
  const dx = pp.cx - cp.cx;
  const dy = pp.cy - cp.cy;
  const dist = Math.hypot(dx, dy) || 1;
  return new sd.Line({
    targetNode: svg,
    x1: cp.cx + (dx / dist) * R,
    y1: cp.cy + (dy / dist) * R,
    x2: pp.cx - (dx / dist) * R,
    y2: pp.cy - (dy / dist) * R,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
  });
}

for (const [child, parent] of Object.entries(PARENTS_BEFORE)) {
  const line = makeEdge(Number(child), parent);
  if (line) edges.set(`${child}-${parent}`, line);
}

const HL_STROKE = C.darkGreen;

sd.main(async () => {
  await sd.pause();

  // Show find(10) compressing 10 → 9 → 3 → 1 to all point at 1.
  const oldChain: Array<[number, number]> = [[10, 9], [9, 3]];
  const newChain: Array<[number, number]> = [[10, 1], [9, 1]];
  for (let k = 0; k < oldChain.length; k++) {
    const [c, p] = oldChain[k];
    const e = edges.get(`${c}-${p}`);
    if (e) e.startAnimate({ delay: k * 240, duration: 280, easing: E.easeOut }).setOpacity(0).endAnimate();
    const newP = newChain[k][1];
    const newE = makeEdge(Number(c), newP);
    if (newE) {
      newE.setStroke(HL_STROKE).setStrokeWidth(2).setOpacity(0);
      newE.startAnimate({ delay: k * 240 + 200, duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
    }
  }
  await sd.pause();

  // Mark the now-direct parents (which still uses PARENTS_AFTER).
  void PARENTS_AFTER;
  void labels;
});
