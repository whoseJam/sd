import * as sd from "@/sd";

// A degenerate DSU shape: a chain. Each find() from the leaf takes
// O(n), which is why path compression matters.

const svg = sd.svg();
const C = sd.color();

const chain = [10, 9, 3, 1];
const R = 20;
const GAP = 70;
const X0 = -(chain.length - 1) * GAP / 2;

const nodes: { id: number; cx: number; cy: number }[] = [];
for (let i = 0; i < chain.length; i++) {
  const cx = X0 + i * GAP;
  const cy = 0;
  new sd.Circle({
    targetNode: svg,
    cx,
    cy,
    r: R,
    fill: C.white,
    stroke: i === chain.length - 1 ? C.darkOrange : C.darkButtonGrey,
    strokeWidth: i === chain.length - 1 ? 2.4 : 1.4,
  });
  new sd.Text({ targetNode: svg, text: String(chain[i]), cx, cy, fontSize: 16, fill: C.darkButtonGrey });
  nodes.push({ id: chain[i], cx, cy });
}

for (let i = 0; i < chain.length - 1; i++) {
  new sd.Line({
    targetNode: svg,
    x1: nodes[i].cx + R,
    y1: 0,
    x2: nodes[i + 1].cx - R,
    y2: 0,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
  });
}

new sd.Text({
  targetNode: svg,
  text: "find(10) 走 4 步",
  cx: 0,
  cy: -50,
  fontSize: 14,
  fill: C.darkRed,
});

sd.main(async () => {
  await sd.pause();
});
