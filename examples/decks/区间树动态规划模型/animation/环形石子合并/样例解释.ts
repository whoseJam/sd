import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const STONE = C.steelBlue;

const N = 10;
const R = 80;
const NODE_R = 8;

new sd.Circle({
  targetNode: svg,
  cx: 0,
  cy: 0,
  r: R,
  fill: "none",
  stroke: NEUTRAL,
  strokeWidth: 1,
  strokeDashArray: [4, 3],
});

const nodes: sd.Circle[] = [];
for (let i = 0; i < N; i++) {
  const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
  const cx = R * Math.cos(angle);
  const cy = R * Math.sin(angle);
  nodes.push(
    new sd.Circle({
      targetNode: svg,
      cx,
      cy,
      r: NODE_R,
      fill: STONE,
      stroke: "none",
      opacity: 0,
    }),
  );
}

const DUR = 280;
sd.main(async () => {
  for (let i = 0; i < N; i++) {
    nodes[i]
      .startAnimate({ delay: i * 40, duration: DUR, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});
