import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NODE_R = 18;
const A_FILL = "#d6e7f2";
const A_STROKE = C.steelBlue;
const B_FILL = "#fdecd9";
const B_STROKE = C.darkOrange;

interface NodeSpec {
  id: number;
  cx: number;
  cy: number;
  color: "A" | "B";
}

const nodes: NodeSpec[] = [
  { id: 1, cx: -110, cy: 70, color: "A" },
  { id: 2, cx: 10, cy: 70, color: "B" },
  { id: 3, cx: -110, cy: 0, color: "B" },
  { id: 4, cx: 10, cy: 0, color: "A" },
  { id: 5, cx: -110, cy: -70, color: "A" },
  { id: 6, cx: 130, cy: 0, color: "B" },
];

const edges: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 6],
];

const idMap = new Map(nodes.map((n) => [n.id, n]));

const edgeLines: sd.Line[] = edges.map(([u, v]) => {
  const a = idMap.get(u)!;
  const b = idMap.get(v)!;
  return new sd.Line({
    targetNode: svg,
    x1: a.cx,
    y1: a.cy,
    x2: b.cx,
    y2: b.cy,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
    opacity: 0,
  });
});

interface NodeHandle {
  spec: NodeSpec;
  circle: sd.Circle;
  label: sd.Text;
}

const handles: NodeHandle[] = nodes.map((spec) => ({
  spec,
  circle: new sd.Circle({
    targetNode: svg,
    cx: spec.cx,
    cy: spec.cy,
    r: NODE_R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
    opacity: 0,
  }),
  label: new sd.Text({
    targetNode: svg,
    text: String(spec.id),
    cx: spec.cx,
    cy: spec.cy,
    fontSize: 13,
    fill: C.darkButtonGrey,
    opacity: 0,
  }),
}));

const conclusion = new sd.Math({
  targetNode: svg,
  text: "A = \\{1, 4, 5\\}, \\quad B = \\{2, 3, 6\\}",
  cx: 0,
  cy: -120,
  fontSize: 15,
  fill: C.darkOrange,
  opacity: 0,
});

function fade(el: sd.SDNode, delay: number, dur = 260) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function colorNode(h: NodeHandle, delay: number) {
  const isA = h.spec.color === "A";
  h.circle
    .startAnimate({ delay, duration: 240, easing: E.easeOut })
    .setFill(isA ? A_FILL : B_FILL)
    .setStroke(isA ? A_STROKE : B_STROKE)
    .setStrokeWidth(2)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < edgeLines.length; i++) fade(edgeLines[i], i * 30);
  for (let i = 0; i < handles.length; i++) {
    fade(handles[i].circle, 200 + i * 50);
    fade(handles[i].label, 260 + i * 50);
  }
  await sd.pause();

  colorNode(handles[0], 0);
  await sd.pause();

  colorNode(handles[1], 0);
  colorNode(handles[2], 120);
  await sd.pause();

  colorNode(handles[3], 0);
  colorNode(handles[4], 120);
  await sd.pause();

  colorNode(handles[5], 0);
  await sd.pause();

  fade(conclusion, 0);
  await sd.pause();
});
