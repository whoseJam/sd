import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const CHEESE_FILL = "#fdecd9";
const CHEESE_STROKE = C.darkOrange;
const PATH_COLOR = C.steelBlue;
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
const tour = [0, 5, 2, 4, 1, 3];

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
}
const nodes: Node[] = cheeses.map((p, i) => ({
  circle: new sd.Circle({
    targetNode: svg,
    cx: cx(p),
    cy: cy(p),
    r: 16,
    fill: CHEESE_FILL,
    stroke: CHEESE_STROKE,
    strokeWidth: 1.4,
    opacity: 0,
  }),
  label: new sd.Text({
    targetNode: svg,
    text: String(i + 1),
    cx: cx(p),
    cy: cy(p),
    fontSize: 14,
    fill: CHEESE_STROKE,
    opacity: 0,
  }),
}));

const stops: [number, number][] = [[0, 0], ...tour.map((i) => cheeses[i])];
const segments: sd.Path[] = [];
for (let s = 0; s < stops.length - 1; s++) {
  const a = stops[s];
  const b = stops[s + 1];
  segments.push(
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

const DUR = 280;
function fadeIn(el: sd.Circle | sd.Text | sd.Path, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  fadeIn(start);
  fadeIn(startLabel, 60);
  for (let i = 0; i < nodes.length; i++) {
    fadeIn(nodes[i].circle, 120 + i * 50);
    fadeIn(nodes[i].label, 120 + i * 50 + 40);
  }
  await sd.pause();

  for (let i = 0; i < segments.length; i++) fadeIn(segments[i], i * 180);
  await sd.pause();
});
