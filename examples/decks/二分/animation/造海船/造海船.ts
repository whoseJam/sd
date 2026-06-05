import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Cut function F(len): try several mid candidates and show how many planks.
const logs = [9, 7, 5, 4];
const total = logs.reduce((a, b) => a + b, 0);
const SIZE = 14;
const BAR = 32;
const yStep = 44;
const y0 = (logs.length - 1) * yStep / 2 + 60;

const cuts = [2, 3, 4, 5];

const rects: Array<{ baseX: number; cy: number; len: number }> = [];
for (let i = 0; i < logs.length; i++) {
  const len = logs[i];
  const cy = y0 - i * yStep;
  const baseX = -(len * SIZE) / 2;
  rects.push({ baseX, cy, len });
  new sd.Rect({
    targetNode: svg,
    x: baseX, y: cy - BAR / 2,
    width: len * SIZE, height: BAR,
    fill: C.white, stroke: C.silver, strokeWidth: 1,
  });
}

const midLabel = new sd.Math({
  targetNode: svg,
  text: "mid = ?",
  cx: 0, cy: y0 - logs.length * yStep,
  fontSize: 16, fill: C.darkButtonGrey,
  opacity: 0,
});
const fLabel = new sd.Math({
  targetNode: svg,
  text: "F(mid) = ?",
  cx: 0, cy: y0 - logs.length * yStep - 26,
  fontSize: 14, fill: C.darkOrange,
  opacity: 0,
});

void total;

sd.main(async () => {
  midLabel.startAnimate({ duration: 240, easing: E.easeOut }).setOpacity(1).endAnimate();
  fLabel.startAnimate({ duration: 240, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();

  for (let t = 0; t < cuts.length; t++) {
    const m = cuts[t];
    let planks = 0;
    midLabel.startAnimate({ duration: 200 }).setText(`mid = ${m}`).endAnimate();
    const lines: sd.Line[] = [];
    for (let i = 0; i < logs.length; i++) {
      const { baseX, cy, len } = rects[i];
      const local = Math.floor(len / m);
      planks += local;
      for (let k = 1; k <= local; k++) {
        const cx = baseX + k * m * SIZE;
        const line = new sd.Line({
          targetNode: svg,
          x1: cx, y1: cy - BAR / 2,
          x2: cx, y2: cy + BAR / 2,
          stroke: C.darkOrange, strokeWidth: 1.8,
          opacity: 0,
        });
        line.startAnimate({ delay: i * 60 + k * 30, duration: 220, easing: E.easeOut }).setOpacity(1).endAnimate();
        lines.push(line);
      }
    }
    fLabel.startAnimate({ delay: 200, duration: 200 }).setText(`F(mid) = ${planks}`).endAnimate();
    await sd.pause();
    for (const line of lines) line.startAnimate({ duration: 200 }).setOpacity(0).endAnimate();
  }
});
