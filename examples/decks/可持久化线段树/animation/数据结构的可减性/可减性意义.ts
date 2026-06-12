import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const K = 6;
const NODE_R = 10;
const NODE_GAP = 70;
const X0 = -(K * NODE_GAP) / 2;
const Y = 0;

const L = 2;
const R = 4;

const versionCircles: sd.Circle[] = [];
for (let i = 0; i <= K; i++) {
  versionCircles.push(
    new sd.Circle({
      targetNode: svg,
      cx: X0 + i * NODE_GAP,
      cy: Y,
      r: NODE_R,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.2,
      opacity: 0,
    }),
  );
}

const opArrows: sd.Line[] = [];
for (let i = 0; i < K; i++) {
  const x1 = X0 + i * NODE_GAP + NODE_R + 2;
  const x2 = X0 + (i + 1) * NODE_GAP - NODE_R - 2;
  opArrows.push(
    new sd.Line({
      targetNode: svg,
      x1,
      y1: Y,
      x2,
      y2: Y,
      stroke: C.silver,
      strokeWidth: 0.8,
      opacity: 0,
    }),
  );
}

const tBrace = new sd.Line({
  targetNode: svg,
  x1: X0 + (L - 1) * NODE_GAP + NODE_R + 2,
  y1: Y + 28,
  x2: X0 + R * NODE_GAP - NODE_R - 2,
  y2: Y + 28,
  stroke: C.steelBlue,
  strokeWidth: 1.8,
  opacity: 0,
});

sd.main(async () => {
  for (let i = 0; i <= K; i++) {
    const d = i * 80;
    versionCircles[i]
      .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  for (let i = 0; i < K; i++) {
    const d = i * 80 + 160;
    opArrows[i]
      .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  for (let i = L; i <= R; i++) {
    opArrows[i - 1]
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setStroke(C.steelBlue)
      .setStrokeWidth(1.4)
      .endAnimate();
  }
  versionCircles[L - 1]
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setStroke(C.steelBlue)
    .endAnimate();
  versionCircles[R]
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setStroke(C.steelBlue)
    .endAnimate();
  tBrace
    .startAnimate({ delay: 120, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
