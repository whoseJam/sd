import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Mountain + a fixed-height line; show each slope's projection onto the line.
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
const groundD = ground.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
new sd.Path({
  targetNode: svg, d: groundD,
  stroke: C.darkButtonGrey, strokeWidth: 1.6, fill: "none",
});

const H = 120;
new sd.Line({
  targetNode: svg, x1: -240, y1: H, x2: 240, y2: H,
  stroke: C.steelBlue, strokeWidth: 1.4,
});
new sd.Text({
  targetNode: svg, text: "灯高",
  cx: 230, cy: H + 12,
  fontSize: 11, fill: C.steelBlue,
});

// For each ridge segment, project endpoints onto y=H using slope rays.
sd.main(async () => {
  await sd.pause();
  for (let i = 0; i + 1 < ground.length; i++) {
    const [ax, ay] = ground[i];
    const [bx, by] = ground[i + 1];
    if (ay === by) continue;
    // The slope can be lit from any lamp on the line that the "upward facing" normal points toward.
    // Simplified: shade a feasibility interval on y=H per slope.
    const projAx = ax + ((H - ay) * (bx - ax)) / (by - ay || 0.0001);
    const projBx = bx + ((H - by) * (ax - bx)) / (ay - by || 0.0001);
    const lo = Math.min(projAx, projBx);
    const hi = Math.max(projAx, projBx);
    new sd.Line({
      targetNode: svg,
      x1: Math.max(-240, lo), y1: H + 4,
      x2: Math.min(240, hi), y2: H + 4,
      stroke: C.darkOrange, strokeWidth: 2,
      opacity: 0,
    }).startAnimate({ delay: i * 120, duration: 220, easing: E.easeOut }).setOpacity(0.6).endAnimate();
  }
  await sd.pause();
});
