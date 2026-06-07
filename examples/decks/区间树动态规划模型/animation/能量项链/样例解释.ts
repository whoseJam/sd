import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const BEAD = C.darkOrange;

const N = 8;
const R = 80;
const NODE_R = 9;
const LABEL_R = R + 22;

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

interface Bead {
  circle: sd.Circle;
  label: sd.Math;
}
const beads: Bead[] = [];
for (let i = 0; i < N; i++) {
  const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
  const cx = R * Math.cos(angle);
  const cy = R * Math.sin(angle);
  const lx = LABEL_R * Math.cos(angle);
  const ly = LABEL_R * Math.sin(angle);
  beads.push({
    circle: new sd.Circle({
      targetNode: svg,
      cx,
      cy,
      r: NODE_R,
      fill: BEAD,
      stroke: "none",
      opacity: 0,
    }),
    label: new sd.Math({
      targetNode: svg,
      text: `(h_${i + 1}, t_${i + 1})`,
      cx: lx,
      cy: ly,
      fontSize: 11,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

const DUR = 280;
sd.main(async () => {
  for (let i = 0; i < N; i++) {
    beads[i].circle
      .startAnimate({ delay: i * 40, duration: DUR, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    beads[i].label
      .startAnimate({ delay: i * 40 + 100, duration: DUR, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});
