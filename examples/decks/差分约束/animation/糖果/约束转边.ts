import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NODE_R = 10;
const SPREAD = 34;

interface CaseSpec {
  cy: number;
  condition: string;
  edges: Array<{ from: "a" | "b"; to: "a" | "b"; weight: number }>;
}

const cases: CaseSpec[] = [
  {
    cy: 120,
    condition: "x_a = x_b",
    edges: [
      { from: "a", to: "b", weight: 0 },
      { from: "b", to: "a", weight: 0 },
    ],
  },
  {
    cy: 60,
    condition: "x_a < x_b",
    edges: [{ from: "a", to: "b", weight: 1 }],
  },
  {
    cy: 0,
    condition: "x_a \\ge x_b",
    edges: [{ from: "b", to: "a", weight: 0 }],
  },
  {
    cy: -60,
    condition: "x_a > x_b",
    edges: [{ from: "b", to: "a", weight: 1 }],
  },
  {
    cy: -120,
    condition: "x_a \\le x_b",
    edges: [{ from: "a", to: "b", weight: 0 }],
  },
];

const COND_CX = -140;
const ARROW_CX = -52;
const GRAPH_CX = 60;

interface CaseHandle {
  cond: sd.Math;
  arrow: sd.Math;
  circles: sd.Circle[];
  labels: sd.Text[];
  edgePaths: sd.Path[];
  edgeHeads: sd.Path[];
  weightLabels: sd.Math[];
}

function makeCase(spec: CaseSpec): CaseHandle {
  const cond = new sd.Math({
    targetNode: svg,
    text: spec.condition,
    cx: COND_CX,
    cy: spec.cy,
    fontSize: 16,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  const arrow = new sd.Math({
    targetNode: svg,
    text: "\\Rightarrow",
    cx: ARROW_CX,
    cy: spec.cy,
    fontSize: 16,
    fill: C.darkButtonGrey,
    opacity: 0,
  });

  const ax = GRAPH_CX - SPREAD / 2;
  const bx = GRAPH_CX + SPREAD / 2;

  const edgePaths: sd.Path[] = [];
  const edgeHeads: sd.Path[] = [];
  const weightLabels: sd.Math[] = [];

  const biDir = spec.edges.length === 2;
  for (let i = 0; i < spec.edges.length; i++) {
    const e = spec.edges[i];
    const isAB = e.from === "a" && e.to === "b";
    const x1 = isAB ? ax : bx;
    const x2 = isAB ? bx : ax;
    const offsetY = biDir ? (i === 0 ? 6 : -6) : 0;
    const startY = spec.cy + offsetY;
    const ux = isAB ? 1 : -1;
    const ex1 = x1 + ux * NODE_R;
    const ex2 = x2 - ux * NODE_R;
    const path = new sd.Path({
      targetNode: svg,
      d: `M ${ex1} ${startY} L ${ex2} ${startY}`,
      stroke: C.steelBlue,
      strokeWidth: 1.4,
      fill: "none",
      opacity: 0,
    });
    const hs = 5;
    const h1x = ex2 - ux * hs;
    const h1y = startY + hs * 0.5;
    const h2x = ex2 - ux * hs;
    const h2y = startY - hs * 0.5;
    const head = new sd.Path({
      targetNode: svg,
      d: `M ${ex2} ${startY} L ${h1x} ${h1y} L ${h2x} ${h2y} Z`,
      stroke: C.steelBlue,
      fill: C.steelBlue,
      strokeWidth: 1,
      opacity: 0,
    });
    edgePaths.push(path);
    edgeHeads.push(head);
    const wLabel = new sd.Math({
      targetNode: svg,
      text: String(e.weight),
      cx: GRAPH_CX + 30,
      cy: startY,
      fontSize: 12,
      fill: C.steelBlue,
      opacity: 0,
    });
    weightLabels.push(wLabel);
  }

  const ca = new sd.Circle({
    targetNode: svg,
    cx: ax,
    cy: spec.cy,
    r: NODE_R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
    opacity: 0,
  });
  const cb = new sd.Circle({
    targetNode: svg,
    cx: bx,
    cy: spec.cy,
    r: NODE_R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
    opacity: 0,
  });
  const la = new sd.Text({
    targetNode: svg,
    text: "a",
    cx: ax,
    cy: spec.cy,
    fontSize: 11,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  const lb = new sd.Text({
    targetNode: svg,
    text: "b",
    cx: bx,
    cy: spec.cy,
    fontSize: 11,
    fill: C.darkButtonGrey,
    opacity: 0,
  });

  return {
    cond,
    arrow,
    circles: [ca, cb],
    labels: [la, lb],
    edgePaths,
    edgeHeads,
    weightLabels,
  };
}

const handles = cases.map(makeCase);

function fade(el: sd.SDNode, delay: number, dur = 260) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < handles.length; i++) {
    const h = handles[i];
    const base = i * 70;
    fade(h.cond, base);
    fade(h.arrow, base + 40);
    h.circles.forEach((c, k) => fade(c, base + 80 + k * 30));
    h.labels.forEach((l, k) => fade(l, base + 100 + k * 30));
  }
  await sd.pause();

  for (let i = 0; i < handles.length; i++) {
    const h = handles[i];
    for (let k = 0; k < h.edgePaths.length; k++) {
      const d = i * 60 + k * 60;
      fade(h.edgePaths[k], d);
      fade(h.edgeHeads[k], d);
      fade(h.weightLabels[k], d + 60);
    }
  }
  await sd.pause();
});
