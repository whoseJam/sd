import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Show points + lower convex hull + a tangent line.
const points = [
  { x: -180, y: 60 },
  { x: -110, y: 0 },
  { x: -40, y: -40 },
  { x: 30, y: -50 },
  { x: 100, y: -20 },
  { x: 180, y: 50 },
];

for (const p of points) {
  new sd.Circle({
    targetNode: svg,
    cx: p.x,
    cy: p.y,
    r: 5,
    fill: C.darkButtonGrey,
    stroke: C.darkButtonGrey,
  });
}

// Connect lower hull (manually picked).
const hull = points;
for (let i = 0; i + 1 < hull.length; i++) {
  new sd.Line({
    targetNode: svg,
    x1: hull[i].x,
    y1: hull[i].y,
    x2: hull[i + 1].x,
    y2: hull[i + 1].y,
    stroke: C.darkOrange,
    strokeWidth: 1.8,
  });
}

// Tangent line with given slope.
const tangent = new sd.Line({
  targetNode: svg,
  x1: -200,
  y1: -60 + (-200 - -40) * -0.5,
  x2: 200,
  y2: -60 + (200 - -40) * -0.5,
  stroke: C.steelBlue,
  strokeWidth: 1.4,
  strokeDashArray: [6, 4],
  opacity: 0,
});

sd.main(async () => {
  tangent
    .startAnimate({ delay: 300, duration: 360, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  new sd.Text({
    targetNode: svg,
    text: "min intercept",
    cx: 0,
    cy: -90,
    fontSize: 13,
    fill: C.steelBlue,
    opacity: 0,
  })
    .startAnimate({ delay: 500, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
