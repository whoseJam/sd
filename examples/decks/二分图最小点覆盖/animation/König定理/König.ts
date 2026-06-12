import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NODE_R = 18;
const L_X = -90;
const R_X = 90;
const TOP = 50;
const BOT = -50;

interface Pt {
  cx: number;
  cy: number;
}

const L: Pt[] = [
  { cx: L_X, cy: TOP },
  { cx: L_X, cy: BOT },
];
const R: Pt[] = [
  { cx: R_X, cy: TOP },
  { cx: R_X, cy: BOT },
];

const EDGES: Array<{ l: number; r: number; matched: boolean }> = [
  { l: 0, r: 0, matched: true },
  { l: 1, r: 0, matched: false },
  { l: 1, r: 1, matched: true },
];

const edgeLines = EDGES.map(({ l, r }) => {
  const a = L[l];
  const b = R[r];
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

const lCircles = L.map(
  (p) =>
    new sd.Circle({
      targetNode: svg,
      cx: p.cx,
      cy: p.cy,
      r: NODE_R,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.4,
      opacity: 0,
    }),
);
const rCircles = R.map(
  (p) =>
    new sd.Circle({
      targetNode: svg,
      cx: p.cx,
      cy: p.cy,
      r: NODE_R,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.4,
      opacity: 0,
    }),
);
const lLabels = L.map(
  (p, i) =>
    new sd.Text({
      targetNode: svg,
      text: `L${i + 1}`,
      cx: p.cx,
      cy: p.cy,
      fontSize: 12,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
);
const rLabels = R.map(
  (p, i) =>
    new sd.Text({
      targetNode: svg,
      text: `R${i + 1}`,
      cx: p.cx,
      cy: p.cy,
      fontSize: 12,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
);

const matchingCaption = new sd.Math({
  targetNode: svg,
  text: "|M| = 2",
  cx: 0,
  cy: -100,
  fontSize: 15,
  fill: C.darkOrange,
  opacity: 0,
});

const coverCaption = new sd.Math({
  targetNode: svg,
  text: "|\\text{MVC}| = 2 = |M|",
  cx: 0,
  cy: -130,
  fontSize: 15,
  fill: C.steelBlue,
  opacity: 0,
});

function fade(el: sd.SDNode, delay: number, dur = 260) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function paintEdge(idx: number, color: string, delay: number) {
  edgeLines[idx]
    .startAnimate({ delay, duration: 280, easing: E.easeOut })
    .setStroke(color)
    .setStrokeWidth(2.4)
    .endAnimate();
}

function ringCircle(c: sd.Circle, delay: number) {
  c.startAnimate({ delay, duration: 280, easing: E.easeOut })
    .setStroke(C.steelBlue)
    .setStrokeWidth(3)
    .setFill("#d6e7f2")
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < edgeLines.length; i++) fade(edgeLines[i], i * 50);
  for (let i = 0; i < 2; i++) {
    fade(lCircles[i], 200 + i * 50);
    fade(lLabels[i], 260 + i * 50);
    fade(rCircles[i], 200 + i * 50);
    fade(rLabels[i], 260 + i * 50);
  }
  await sd.pause();

  for (let i = 0; i < EDGES.length; i++) {
    if (EDGES[i].matched) paintEdge(i, C.darkOrange, i * 120);
  }
  fade(matchingCaption, 320);
  await sd.pause();

  ringCircle(rCircles[0], 0);
  ringCircle(lCircles[1], 120);
  fade(coverCaption, 280);
  await sd.pause();
});
