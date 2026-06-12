import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const heights = [4, 7, 5, 9, 6, 3, 8];
const N = heights.length;
const SLOT = 56;
const SCALE = 14;
const BASELINE = -30;
const BAR_W = SLOT - 18;
const X0 = -(N * SLOT) / 2;

const cxOf = (i: number) => X0 + (i + 0.5) * SLOT;
const topOf = (i: number) => BASELINE + heights[i] * SCALE;

const bars: sd.Rect[] = [];
const hLabels: sd.Text[] = [];
for (let i = 0; i < N; i++) {
  const h = heights[i] * SCALE;
  bars.push(
    new sd.Rect({
      targetNode: svg,
      cx: cxOf(i),
      cy: BASELINE + h / 2,
      width: BAR_W,
      height: h,
      fill: "#fdecd9",
      stroke: C.darkOrange,
      strokeWidth: 1.4,
      opacity: 0,
    }),
  );
  hLabels.push(
    new sd.Text({
      targetNode: svg,
      text: String(heights[i]),
      cx: cxOf(i),
      cy: topOf(i) + 12,
      fontSize: 13,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

const leftTaller: number[] = new Array(N).fill(-1);
const rightTaller: number[] = new Array(N).fill(-1);
{
  const stk: number[] = [];
  for (let i = 0; i < N; i++) {
    while (stk.length > 0 && heights[stk[stk.length - 1]] <= heights[i])
      stk.pop();
    if (stk.length > 0) leftTaller[i] = stk[stk.length - 1];
    stk.push(i);
  }
}
{
  const stk: number[] = [];
  for (let i = N - 1; i >= 0; i--) {
    while (stk.length > 0 && heights[stk[stk.length - 1]] <= heights[i])
      stk.pop();
    if (stk.length > 0) rightTaller[i] = stk[stk.length - 1];
    stk.push(i);
  }
}

const ARC_BASE = BASELINE - 12;
const arcs: sd.Path[] = [];
function makeArc(from: number, to: number, color: string): sd.Path {
  const x1 = cxOf(from);
  const x2 = cxOf(to);
  const dip = Math.abs(x2 - x1) * 0.35 + 12;
  const arc = new sd.Path({
    targetNode: svg,
    d: `M ${x1} ${ARC_BASE} Q ${(x1 + x2) / 2} ${ARC_BASE - dip} ${x2} ${ARC_BASE}`,
    stroke: color,
    strokeWidth: 1.4,
    fill: "none",
    opacity: 0,
  });
  arcs.push(arc);
  return arc;
}

const counts: number[] = new Array(N).fill(0);
for (let i = 0; i < N; i++) {
  if (leftTaller[i] >= 0) counts[leftTaller[i]]++;
  if (rightTaller[i] >= 0) counts[rightTaller[i]]++;
}

const leftArcs: Array<{ from: number; to: number; arc: sd.Path }> = [];
const rightArcs: Array<{ from: number; to: number; arc: sd.Path }> = [];
for (let i = 0; i < N; i++) {
  if (leftTaller[i] >= 0)
    leftArcs.push({
      from: i,
      to: leftTaller[i],
      arc: makeArc(i, leftTaller[i], C.steelBlue),
    });
  if (rightTaller[i] >= 0)
    rightArcs.push({
      from: i,
      to: rightTaller[i],
      arc: makeArc(i, rightTaller[i], C.darkGreen),
    });
}

const countLabels: sd.Text[] = counts.map(
  (c, i) =>
    new sd.Text({
      targetNode: svg,
      text: String(c),
      cx: cxOf(i),
      cy: BASELINE - 110,
      fontSize: 14,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
);

let bestI = 0;
for (let i = 1; i < N; i++) if (counts[i] > counts[bestI]) bestI = i;

function fade(el: sd.SDNode, delay: number, dur = 260) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fade(bars[i], i * 50);
    fade(hLabels[i], i * 50 + 120);
  }
  await sd.pause();

  for (let k = 0; k < leftArcs.length; k++) fade(leftArcs[k].arc, k * 80);
  await sd.pause();

  for (let k = 0; k < rightArcs.length; k++) fade(rightArcs[k].arc, k * 80);
  await sd.pause();

  for (let i = 0; i < N; i++) fade(countLabels[i], i * 40);
  await sd.pause();

  countLabels[bestI]
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setFill(C.darkOrange)
    .setFontSize(18)
    .endAnimate();
  bars[bestI]
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setStroke(C.darkOrange)
    .setStrokeWidth(2.4)
    .endAnimate();
  await sd.pause();
});
