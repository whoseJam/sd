import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL_FILL = "#fdecd9";
const NEUTRAL_STROKE = C.darkOrange;
const VISITED_FILL = C.darkOrange;
const VISITED_TEXT = "#ffffff";
const PATH_COLOR = C.steelBlue;
const I_COLOR = C.steelBlue;
const J_COLOR = C.green;
const START_COLOR = C.darkOrange;

const SCALE = 70;
const cheeses: [number, number][] = [
  [-1, 1],
  [2, -1],
  [3, 0],
  [0, 1],
  [2, 0],
  [1, 0],
];
const VISITED = [0, 1, 4];
const POS_I = 4;
const POS_J = 2;
const VISIT_ORDER = [0, 1, 4];

const cx = (p: [number, number]) => p[0] * SCALE;
const cy = (p: [number, number]) => p[1] * SCALE;

const start = new sd.Circle({
  targetNode: svg,
  cx: 0,
  cy: 0,
  r: 6,
  fill: START_COLOR,
  stroke: "none",
  opacity: 0,
});
const startLabel = new sd.Text({
  targetNode: svg,
  text: "s",
  cx: -16,
  cy: -8,
  fontSize: 14,
  fill: START_COLOR,
  opacity: 0,
});

interface Node {
  circle: sd.Circle;
  label: sd.Text;
  ring?: sd.Circle;
  marker?: sd.Text;
}
const nodes: Node[] = cheeses.map((p, i) => ({
  circle: new sd.Circle({
    targetNode: svg,
    cx: cx(p),
    cy: cy(p),
    r: 16,
    fill: NEUTRAL_FILL,
    stroke: NEUTRAL_STROKE,
    strokeWidth: 1.4,
    opacity: 0,
  }),
  label: new sd.Text({
    targetNode: svg,
    text: String(i + 1),
    cx: cx(p),
    cy: cy(p),
    fontSize: 14,
    fill: NEUTRAL_STROKE,
    opacity: 0,
  }),
}));

function ringAt(p: [number, number], color: string): sd.Circle {
  return new sd.Circle({
    targetNode: svg,
    cx: cx(p),
    cy: cy(p),
    r: 22,
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    opacity: 0,
  });
}

function markerAt(p: [number, number], color: string, text: string): sd.Text {
  return new sd.Text({
    targetNode: svg,
    text,
    cx: cx(p),
    cy: cy(p) + 32,
    fontSize: 14,
    fill: color,
    opacity: 0,
  });
}

const iRing = ringAt(cheeses[POS_I], I_COLOR);
const iMarker = markerAt(cheeses[POS_I], I_COLOR, "i");
const jRing = ringAt(cheeses[POS_J], J_COLOR);
const jMarker = markerAt(cheeses[POS_J], J_COLOR, "j");

const visitedStops: [number, number][] = [
  [0, 0],
  ...VISIT_ORDER.map((i) => cheeses[i]),
];
const visitedSegments: sd.Path[] = [];
for (let s = 0; s < visitedStops.length - 1; s++) {
  const a = visitedStops[s];
  const b = visitedStops[s + 1];
  visitedSegments.push(
    new sd.Path({
      targetNode: svg,
      d: `M ${a[0] * SCALE} ${a[1] * SCALE} L ${b[0] * SCALE} ${b[1] * SCALE}`,
      stroke: PATH_COLOR,
      strokeWidth: 1.6,
      fill: "none",
      opacity: 0,
    }),
  );
}

const transferSeg = new sd.Path({
  targetNode: svg,
  d: `M ${cx(cheeses[POS_I])} ${cy(cheeses[POS_I])} L ${cx(cheeses[POS_J])} ${cy(cheeses[POS_J])}`,
  stroke: J_COLOR,
  strokeWidth: 1.8,
  fill: "none",
  opacity: 0,
});

const DUR = 280;
function fadeIn(el: sd.Circle | sd.Text | sd.Path, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}
function setFill(el: sd.Circle | sd.Text, color: string, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

sd.main(async () => {
  fadeIn(start);
  fadeIn(startLabel, 60);
  for (let i = 0; i < nodes.length; i++) {
    fadeIn(nodes[i].circle, 120 + i * 30);
    fadeIn(nodes[i].label, 120 + i * 30 + 40);
  }
  for (const v of VISITED) {
    setFill(nodes[v].circle, VISITED_FILL, 400);
    setFill(nodes[v].label, VISITED_TEXT, 440);
  }
  for (let i = 0; i < visitedSegments.length; i++) {
    fadeIn(visitedSegments[i], 500 + i * 180);
  }
  await sd.pause();

  fadeIn(iRing);
  fadeIn(iMarker, 80);
  await sd.pause();

  fadeIn(jRing);
  fadeIn(jMarker, 80);
  await sd.pause();

  fadeIn(transferSeg);
  setFill(nodes[POS_J].circle, VISITED_FILL, 200);
  setFill(nodes[POS_J].label, VISITED_TEXT, 240);
  await sd.pause();
});
