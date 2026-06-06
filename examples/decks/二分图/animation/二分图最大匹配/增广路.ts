import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// 3+3 bipartite. Edges: L1-R1 L1-R2 / L2-R2 L2-R3 / L3-R1 L3-R3
// Initial greedy match: (L1,R1), (L2,R2).
// Augmenting path from L3: L3 -R1 -L1 -R2 -L2 -R3.
// Flip: new matching (L3,R1), (L1,R2), (L2,R3). 3 matched.

const L_X = -70;
const R_X = 70;
const ROW_Y = [70, 0, -70];

const NODE_R = 16;
const NEUTRAL = C.silver;
const MATCH_COLOR = C.steelBlue;
const PATH_COLOR = C.darkOrange;

interface Pt { x: number; y: number; }
const L: Pt[] = ROW_Y.map((y) => ({ x: L_X, y }));
const R: Pt[] = ROW_Y.map((y) => ({ x: R_X, y }));

interface EdgeSpec { l: number; r: number; }
const EDGES: EdgeSpec[] = [
  { l: 0, r: 0 }, // L1-R1
  { l: 0, r: 1 }, // L1-R2
  { l: 1, r: 1 }, // L2-R2
  { l: 1, r: 2 }, // L2-R3
  { l: 2, r: 0 }, // L3-R1
  { l: 2, r: 2 }, // L3-R3
];

function edgeKey(l: number, r: number): string {
  return `${l}-${r}`;
}

const edgeLines = new Map<string, sd.Line>();
for (const { l, r } of EDGES) {
  edgeLines.set(
    edgeKey(l, r),
    new sd.Line({
      targetNode: svg,
      x1: L[l].x, y1: L[l].y, x2: R[r].x, y2: R[r].y,
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
  );
}

// Augmenting overlay: a separate thicker line drawn on top so we can recolor
// just the path without losing the underlying graph edges.
const pathOverlays = new Map<string, sd.Line>();
const PATH_EDGES: EdgeSpec[] = [
  { l: 2, r: 0 }, // L3-R1 (non-match)
  { l: 0, r: 0 }, // L1-R1 (match)
  { l: 0, r: 1 }, // L1-R2 (non-match)
  { l: 1, r: 1 }, // L2-R2 (match)
  { l: 1, r: 2 }, // L2-R3 (non-match)
];
for (const { l, r } of PATH_EDGES) {
  pathOverlays.set(
    edgeKey(l, r),
    new sd.Line({
      targetNode: svg,
      x1: L[l].x, y1: L[l].y, x2: R[r].x, y2: R[r].y,
      stroke: PATH_COLOR,
      strokeWidth: 2.4,
      opacity: 0,
    }),
  );
}

const leftCircles: sd.Circle[] = L.map((p) => new sd.Circle({
  targetNode: svg,
  cx: p.x, cy: p.y, r: NODE_R,
  fill: C.white,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
  opacity: 0,
}));
const rightCircles: sd.Circle[] = R.map((p) => new sd.Circle({
  targetNode: svg,
  cx: p.x, cy: p.y, r: NODE_R,
  fill: C.white,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
  opacity: 0,
}));
const leftLabels: sd.Text[] = L.map((p, i) => new sd.Text({
  targetNode: svg,
  text: `L${i + 1}`,
  cx: p.x, cy: p.y - 1,
  fontSize: 12,
  fill: C.darkButtonGrey,
  opacity: 0,
}));
const rightLabels: sd.Text[] = R.map((p, i) => new sd.Text({
  targetNode: svg,
  text: `R${i + 1}`,
  cx: p.x, cy: p.y - 1,
  fontSize: 12,
  fill: C.darkButtonGrey,
  opacity: 0,
}));

sd.main(async () => {
  // p1: graph appears
  for (const line of edgeLines.values()) {
    line
      .startAnimate({ duration: 320, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  for (let i = 0; i < 3; i++) {
    const d = 120 + i * 80;
    leftCircles[i].startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    leftLabels[i].startAnimate({ delay: d + 60, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    rightCircles[i].startAnimate({ delay: d, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    rightLabels[i].startAnimate({ delay: d + 60, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();

  // p2: initial matching (L1-R1, L2-R2)
  const initialMatch: EdgeSpec[] = [
    { l: 0, r: 0 }, { l: 1, r: 1 },
  ];
  for (let i = 0; i < initialMatch.length; i++) {
    const { l, r } = initialMatch[i];
    edgeLines.get(edgeKey(l, r))!
      .startAnimate({ delay: i * 180, duration: 320, easing: E.easeOut })
      .setStroke(MATCH_COLOR).setStrokeWidth(2.4).endAnimate();
  }
  await sd.pause();

  // p3: augmenting path traced from L3
  for (let i = 0; i < PATH_EDGES.length; i++) {
    const { l, r } = PATH_EDGES[i];
    pathOverlays.get(edgeKey(l, r))!
      .startAnimate({ delay: i * 200, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();

  // p4: flip — new matching (L3,R1), (L1,R2), (L2,R3)
  // Fade out the orange overlay; recolor underlying edges accordingly.
  for (const line of pathOverlays.values()) {
    line
      .startAnimate({ duration: 320, easing: E.easeOut })
      .setOpacity(0).endAnimate();
  }
  const newMatch: EdgeSpec[] = [
    { l: 2, r: 0 }, { l: 0, r: 1 }, { l: 1, r: 2 },
  ];
  const oldMatch: EdgeSpec[] = [
    { l: 0, r: 0 }, { l: 1, r: 1 },
  ];
  for (const { l, r } of oldMatch) {
    edgeLines.get(edgeKey(l, r))!
      .startAnimate({ duration: 320, easing: E.easeOut })
      .setStroke(NEUTRAL).setStrokeWidth(1).endAnimate();
  }
  for (let i = 0; i < newMatch.length; i++) {
    const { l, r } = newMatch[i];
    edgeLines.get(edgeKey(l, r))!
      .startAnimate({ delay: 200 + i * 180, duration: 360, easing: E.easeOut })
      .setStroke(MATCH_COLOR).setStrokeWidth(2.4).endAnimate();
  }
  await sd.pause();
});
