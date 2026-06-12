import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const ROOT_CY = 110;
const MID_CY = 20;
const LEAF_CY = -80;
const NODE_R = 22;

interface Node {
  cx: number;
  cy: number;
  circle: sd.Circle;
  label: sd.Text;
  value?: sd.Math;
}

function makeNode(cx: number, cy: number, label: string): Node {
  const circle = new sd.Circle({
    targetNode: svg,
    cx,
    cy,
    r: NODE_R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
    opacity: 0,
  });
  const labelText = new sd.Text({
    targetNode: svg,
    text: label,
    cx,
    cy,
    fontSize: 12,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  return { cx, cy, circle, label: labelText };
}

const root = makeNode(0, ROOT_CY, "MAX");
const midL = makeNode(-100, MID_CY, "MIN");
const midR = makeNode(100, MID_CY, "MIN");

const leafX = [-150, -50, 50, 150];
const leafVals = [3, 5, 2, 9];
const leaves: Node[] = leafX.map((x, i) =>
  makeNode(x, LEAF_CY, String(leafVals[i])),
);

function makeEdge(a: Node, b: Node): sd.Path {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const ax = a.cx + ux * NODE_R;
  const ay = a.cy + uy * NODE_R;
  const bx = b.cx - ux * NODE_R;
  const by = b.cy - uy * NODE_R;
  return new sd.Path({
    targetNode: svg,
    d: `M ${ax} ${ay} L ${bx} ${by}`,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
    fill: "none",
    opacity: 0,
  });
}

const edges: sd.Path[] = [
  makeEdge(root, midL),
  makeEdge(root, midR),
  makeEdge(midL, leaves[0]),
  makeEdge(midL, leaves[1]),
  makeEdge(midR, leaves[2]),
  makeEdge(midR, leaves[3]),
];

function makeBackValue(n: Node, text: string, color: string): sd.Math {
  return new sd.Math({
    targetNode: svg,
    text,
    cx: n.cx,
    cy: n.cy + NODE_R + 14,
    fontSize: 16,
    fill: color,
    opacity: 0,
  });
}

const midLBack = makeBackValue(midL, "3", C.steelBlue);
const midRBack = makeBackValue(midR, "2", C.steelBlue);
const rootBack = makeBackValue(root, "3", C.darkOrange);
rootBack.setCy(ROOT_CY - NODE_R - 14);

function fade(el: sd.SDNode, delay: number, dur = 260) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function paintCircle(
  c: sd.Circle,
  fill: string,
  stroke: string,
  delay: number,
) {
  c.startAnimate({ delay, duration: 240, easing: E.easeOut })
    .setFill(fill)
    .setStroke(stroke)
    .setStrokeWidth(2.2)
    .endAnimate();
}

function paintEdge(p: sd.Path, color: string, delay: number) {
  p.startAnimate({ delay, duration: 240, easing: E.easeOut })
    .setStroke(color)
    .setStrokeWidth(2.2)
    .endAnimate();
}

sd.main(async () => {
  for (const e of edges) fade(e, 0);
  fade(root.circle, 80);
  fade(root.label, 160);
  fade(midL.circle, 140);
  fade(midL.label, 220);
  fade(midR.circle, 140);
  fade(midR.label, 220);
  for (let i = 0; i < leaves.length; i++) {
    fade(leaves[i].circle, 240 + i * 50);
    fade(leaves[i].label, 320 + i * 50);
  }
  await sd.pause();

  fade(midLBack, 0);
  fade(midRBack, 120);
  paintCircle(leaves[0].circle, "#fdecd9", C.darkOrange, 60);
  paintCircle(leaves[2].circle, "#fdecd9", C.darkOrange, 180);
  await sd.pause();

  fade(rootBack, 0);
  paintCircle(midL.circle, "#fdecd9", C.darkOrange, 80);
  await sd.pause();

  paintCircle(root.circle, "#f5b97a", C.darkOrange, 0);
  paintEdge(edges[0], C.darkOrange, 120);
  paintEdge(edges[2], C.darkOrange, 220);
  await sd.pause();
});
