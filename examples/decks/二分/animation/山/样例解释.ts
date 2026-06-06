import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Mountain silhouette with a lamp position.
const ground: Array<[number, number]> = [
  [-200, -60],
  [-160, -60],
  [-100, 30],
  [-60, -20],
  [0, 60],
  [50, 10],
  [100, 40],
  [160, -10],
  [200, -60],
];
const groundD = ground
  .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
  .join(" ");
new sd.Path({
  targetNode: svg,
  d: groundD,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.6,
  fill: "none",
});

new sd.Line({
  targetNode: svg,
  x1: -200,
  y1: -60,
  x2: 200,
  y2: -60,
  stroke: C.darkButtonGrey,
  strokeWidth: 0.8,
  strokeDashArray: [3, 3],
});

const LAMP_X = -20;
const LAMP_Y = 120;
const lamp = new sd.Circle({
  targetNode: svg,
  cx: LAMP_X,
  cy: LAMP_Y,
  r: 8,
  fill: "#fdecd9",
  stroke: C.darkOrange,
  strokeWidth: 2,
  opacity: 0,
});

sd.main(async () => {
  lamp
    .startAnimate({ delay: 200, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  for (const [gx, gy] of ground) {
    new sd.Line({
      targetNode: svg,
      x1: LAMP_X,
      y1: LAMP_Y,
      x2: gx,
      y2: gy,
      stroke: C.darkOrange,
      strokeWidth: 0.8,
      opacity: 0,
    })
      .startAnimate({ delay: 400, duration: 280, easing: E.easeOut })
      .setOpacity(0.6)
      .endAnimate();
  }
  await sd.pause();
});
