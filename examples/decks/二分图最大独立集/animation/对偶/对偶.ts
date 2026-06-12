import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NODE_R = 18;
const L_X = -90;
const R_X = 90;
const ROW_Y = [80, 0, -80];

interface Pt {
  cx: number;
  cy: number;
}
const L: Pt[] = ROW_Y.map((y) => ({ cx: L_X, cy: y }));
const R: Pt[] = ROW_Y.map((y) => ({ cx: R_X, cy: y }));

const EDGES: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [1, 0],
  [2, 1],
  [2, 2],
];

const COVER_L = new Set([0, 2]);
const COVER_R = new Set([0]);

const edgeLines = EDGES.map(([l, r]) => {
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

interface Handle {
  circle: sd.Circle;
  label: sd.Text;
}

function makeHandle(p: Pt, text: string): Handle {
  return {
    circle: new sd.Circle({
      targetNode: svg,
      cx: p.cx,
      cy: p.cy,
      r: NODE_R,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.4,
      opacity: 0,
    }),
    label: new sd.Text({
      targetNode: svg,
      text,
      cx: p.cx,
      cy: p.cy,
      fontSize: 12,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  };
}

const lHandles = L.map((p, i) => makeHandle(p, `L${i + 1}`));
const rHandles = R.map((p, i) => makeHandle(p, `R${i + 1}`));

const COVER_FILL = "#d6e7f2";
const COVER_STROKE = C.steelBlue;
const IS_FILL = "#dff0d8";
const IS_STROKE = C.darkGreen;

const coverCaption = new sd.Math({
  targetNode: svg,
  text: "|\\text{MVC}| = 3",
  cx: 0,
  cy: -130,
  fontSize: 14,
  fill: C.steelBlue,
  opacity: 0,
});
const isCaption = new sd.Math({
  targetNode: svg,
  text: "|\\text{MIS}| = n - |\\text{MVC}| = 6 - 3 = 3",
  cx: 0,
  cy: -156,
  fontSize: 14,
  fill: C.darkGreen,
  opacity: 0,
});

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
  c.startAnimate({ delay, duration: 280, easing: E.easeOut })
    .setFill(fill)
    .setStroke(stroke)
    .setStrokeWidth(2.4)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < edgeLines.length; i++) fade(edgeLines[i], i * 40);
  for (let i = 0; i < 3; i++) {
    fade(lHandles[i].circle, 200 + i * 50);
    fade(lHandles[i].label, 260 + i * 50);
    fade(rHandles[i].circle, 200 + i * 50);
    fade(rHandles[i].label, 260 + i * 50);
  }
  await sd.pause();

  let d = 0;
  for (const i of COVER_L) {
    paintCircle(lHandles[i].circle, COVER_FILL, COVER_STROKE, d);
    d += 120;
  }
  for (const i of COVER_R) {
    paintCircle(rHandles[i].circle, COVER_FILL, COVER_STROKE, d);
    d += 120;
  }
  fade(coverCaption, d + 60);
  await sd.pause();

  d = 0;
  for (let i = 0; i < 3; i++) {
    if (!COVER_L.has(i)) {
      paintCircle(lHandles[i].circle, IS_FILL, IS_STROKE, d);
      d += 120;
    }
    if (!COVER_R.has(i)) {
      paintCircle(rHandles[i].circle, IS_FILL, IS_STROKE, d);
      d += 120;
    }
  }
  fade(isCaption, d + 60);
  await sd.pause();
});
