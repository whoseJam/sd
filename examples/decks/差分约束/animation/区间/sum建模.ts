import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 8;
const NODE_R = 14;
const GAP = 50;
const ROW_CY = 40;
const FIRST_CX = -(N / 2) * GAP;

const nodeCircles: sd.Circle[] = [];
const nodeLabels: sd.Math[] = [];
for (let i = 0; i <= N; i++) {
  const cx = FIRST_CX + i * GAP;
  nodeCircles.push(
    new sd.Circle({
      targetNode: svg,
      cx,
      cy: ROW_CY,
      r: NODE_R,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.3,
      opacity: 0,
    }),
  );
  nodeLabels.push(
    new sd.Math({
      targetNode: svg,
      text: `S_${i}`,
      cx,
      cy: ROW_CY,
      fontSize: 12,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

const cxOf = (i: number) => FIRST_CX + i * GAP;

const aIdx = 3;
const bIdx = 6;
const cVal = 2;

const intervalLabel = new sd.Math({
  targetNode: svg,
  text: `[a, b] = [${aIdx}, ${bIdx}], \\quad c = ${cVal}`,
  cx: 0,
  cy: 110,
  fontSize: 14,
  fill: C.darkOrange,
  opacity: 0,
});

const arcPath = (() => {
  const x1 = cxOf(aIdx - 1);
  const x2 = cxOf(bIdx);
  const mid = (x1 + x2) / 2;
  const arcTop = ROW_CY + NODE_R + 36;
  const ax = x1 + NODE_R;
  const bx = x2 - NODE_R;
  return `M ${ax} ${ROW_CY + NODE_R - 2} Q ${mid} ${arcTop} ${bx} ${ROW_CY + NODE_R - 2}`;
})();

const arc = new sd.Path({
  targetNode: svg,
  d: arcPath,
  stroke: C.steelBlue,
  strokeWidth: 1.6,
  fill: "none",
  opacity: 0,
});

const arcHead = (() => {
  const bx = cxOf(bIdx) - NODE_R;
  const by = ROW_CY + NODE_R - 2;
  const hs = 6;
  return new sd.Path({
    targetNode: svg,
    d: `M ${bx} ${by} L ${bx - hs} ${by + hs * 0.6} L ${bx + hs * 0.2} ${by + hs} Z`,
    stroke: C.steelBlue,
    fill: C.steelBlue,
    strokeWidth: 1,
    opacity: 0,
  });
})();

const arcWeight = new sd.Math({
  targetNode: svg,
  text: `${cVal}`,
  cx: (cxOf(aIdx - 1) + cxOf(bIdx)) / 2,
  cy: ROW_CY + NODE_R + 42,
  fontSize: 13,
  fill: C.steelBlue,
  opacity: 0,
});

const derived = new sd.Math({
  targetNode: svg,
  text: `S_{${bIdx}} \\ge S_{${aIdx - 1}} + ${cVal}`,
  cx: 0,
  cy: -50,
  fontSize: 16,
  fill: C.steelBlue,
  opacity: 0,
});

const adjacency = new sd.Math({
  targetNode: svg,
  text: `S_j \\le S_{j+1} \\le S_j + 1`,
  cx: 0,
  cy: -90,
  fontSize: 14,
  fill: C.darkButtonGrey,
  opacity: 0,
});

function fade(el: sd.SDNode, delay: number, dur = 240) {
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
  c.startAnimate({ delay, duration: 220, easing: E.easeOut })
    .setFill(fill)
    .setStroke(stroke)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i <= N; i++) {
    fade(nodeCircles[i], i * 35);
    fade(nodeLabels[i], i * 35 + 60);
  }
  await sd.pause();

  fade(intervalLabel, 0);
  paintCircle(nodeCircles[aIdx - 1], "#fdecd9", C.darkOrange, 220);
  paintCircle(nodeCircles[bIdx], "#fdecd9", C.darkOrange, 320);
  await sd.pause();

  fade(derived, 0);
  await sd.pause();

  fade(arc, 0);
  fade(arcHead, 60);
  fade(arcWeight, 120);
  await sd.pause();

  fade(adjacency, 0);
  await sd.pause();
});
