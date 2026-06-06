import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// Two belts AB (top) and CD (bottom).
const A: [number, number] = [-180, 80];
const B: [number, number] = [-40, 80];
const C2: [number, number] = [40, -80];
const D: [number, number] = [180, -80];

function lineColored(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: sd.SDColor,
) {
  new sd.Line({
    targetNode: svg,
    x1,
    y1,
    x2,
    y2,
    stroke: color,
    strokeWidth: 2.4,
  });
}

lineColored(A[0], A[1], B[0], B[1], C.darkOrange);
lineColored(C2[0], C2[1], D[0], D[1], C.steelBlue);

for (const [p, lbl, off] of [
  [A, "A", [-14, 0]],
  [B, "B", [14, 0]],
  [C2, "C", [-14, 0]],
  [D, "D", [14, 0]],
] as Array<[[number, number], string, [number, number]]>) {
  new sd.Circle({
    targetNode: svg,
    cx: p[0],
    cy: p[1],
    r: 4,
    fill: C.darkButtonGrey,
    stroke: C.darkButtonGrey,
  });
  new sd.Text({
    targetNode: svg,
    text: lbl,
    cx: p[0] + off[0],
    cy: p[1] + off[1],
    fontSize: 13,
    fill: C.darkButtonGrey,
  });
}

// Sample path A -> E (mid of AB) -> F (mid of CD) -> D
const E: [number, number] = [(A[0] + B[0]) / 2, A[1]];
const F: [number, number] = [(C2[0] + D[0]) / 2, C2[1]];

const path = new sd.Path({
  targetNode: svg,
  d: `M ${A[0]} ${A[1]} L ${E[0]} ${E[1]} L ${F[0]} ${F[1]} L ${D[0]} ${D[1]}`,
  stroke: C.darkGreen,
  strokeWidth: 2,
  fill: "none",
  opacity: 0,
});

const Eed = sd.easing();
sd.main(async () => {
  path
    .startAnimate({ delay: 200, duration: 480, easing: Eed.easeOut })
    .setOpacity(1)
    .endAnimate();
  new sd.Text({
    targetNode: svg,
    text: "E",
    cx: E[0],
    cy: E[1] + 16,
    fontSize: 12,
    fill: C.darkGreen,
    opacity: 0,
  })
    .startAnimate({ delay: 300, duration: 240, easing: Eed.easeOut })
    .setOpacity(1)
    .endAnimate();
  new sd.Text({
    targetNode: svg,
    text: "F",
    cx: F[0],
    cy: F[1] - 14,
    fontSize: 12,
    fill: C.darkGreen,
    opacity: 0,
  })
    .startAnimate({ delay: 380, duration: 240, easing: Eed.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
