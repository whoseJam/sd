import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Heights of broadcast stations.
const heights = [4, 7, 5, 9, 6, 3, 8];
const N = heights.length;
const SIZE = 50;
const X0 = -(N * SIZE) / 2;
const SCALE = 18;

for (let i = 0; i < N; i++) {
  const h = heights[i] * SCALE;
  new sd.Rect({
    targetNode: svg,
    x: X0 + i * SIZE + 6,
    y: -h / 2,
    width: SIZE - 12,
    height: h,
    fill: "#fdecd9",
    stroke: C.darkOrange,
    strokeWidth: 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: String(heights[i]),
    cx: X0 + (i + 0.5) * SIZE,
    cy: -h / 2 - 14,
    fontSize: 13,
    fill: C.darkButtonGrey,
  });
}

// Find nearest taller left/right with monotone stack.
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

sd.main(async () => {
  await sd.pause();
  // Show arcs for each station to its nearest taller neighbor.
  for (let i = 0; i < N; i++) {
    if (leftTaller[i] >= 0) {
      const cx1 = X0 + (i + 0.5) * SIZE;
      const cx2 = X0 + (leftTaller[i] + 0.5) * SIZE;
      new sd.Path({
        targetNode: svg,
        d: `M ${cx1} 100 Q ${(cx1 + cx2) / 2} ${100 + Math.abs(cx1 - cx2) * 0.5} ${cx2} 100`,
        stroke: C.steelBlue,
        strokeWidth: 1.4,
        fill: "none",
        opacity: 0,
      })
        .startAnimate({ delay: i * 80, duration: 280, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
    if (rightTaller[i] >= 0) {
      const cx1 = X0 + (i + 0.5) * SIZE;
      const cx2 = X0 + (rightTaller[i] + 0.5) * SIZE;
      new sd.Path({
        targetNode: svg,
        d: `M ${cx1} 100 Q ${(cx1 + cx2) / 2} ${100 + Math.abs(cx1 - cx2) * 0.5} ${cx2} 100`,
        stroke: C.darkGreen,
        strokeWidth: 1.4,
        fill: "none",
        opacity: 0,
      })
        .startAnimate({ delay: i * 80 + 30, duration: 280, easing: E.easeOut })
        .setOpacity(1)
        .endAnimate();
    }
  }
  await sd.pause();
});
