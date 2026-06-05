import * as sd from "@/sd";

// Two disjoint groups of people. The problem: are two given people
// "related" — i.e. in the same group?

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const groups: number[][] = [
  [1, 2, 3, 4],
  [5, 6, 7],
];

const R = 22;
const GAP = 60;
const COL_GAP = 200;

interface Node { id: number; cx: number; cy: number }
const nodes: Node[] = [];
for (let g = 0; g < groups.length; g++) {
  const groupCx = -COL_GAP / 2 + g * COL_GAP;
  for (let k = 0; k < groups[g].length; k++) {
    const cy = ((groups[g].length - 1) / 2 - k) * GAP;
    const cx = groupCx + (k % 2 === 0 ? -25 : 25);
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
      text: String(groups[g][k]),
      cx,
      cy,
      fontSize: 16,
      fill: C.darkButtonGrey,
    });
    nodes.push({ id: groups[g][k], cx, cy });
  }
  const groupY = 0;
  const groupHeight = (groups[g].length - 1) * GAP + R * 2 + 20;
  new sd.Rect({
    targetNode: svg,
    x: groupCx - 70,
    y: groupY - groupHeight / 2,
    width: 140,
    height: groupHeight,
    rx: 12,
    ry: 12,
    fill: C.none,
    stroke: C.silver,
    strokeWidth: 1.4,
    strokeDashArray: [6, 4],
  });
  new sd.Text({
    targetNode: svg,
    text: `Group ${g + 1}`,
    cx: groupCx,
    cy: groupY + groupHeight / 2 + 14,
    fontSize: 14,
    fill: C.darkButtonGrey,
  });
}

sd.main(async () => {
  await sd.pause();
  void E;
});
