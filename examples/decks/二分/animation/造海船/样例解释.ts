import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Logs with lengths; show them stacked.
const logs = [9, 7, 5, 4];
const SIZE = 24;
const BAR = 60;

const yStep = 50;
const y0 = ((logs.length - 1) * yStep) / 2;

for (let i = 0; i < logs.length; i++) {
  const len = logs[i];
  const cy = y0 - i * yStep;
  new sd.Rect({
    targetNode: svg,
    x: -(len * SIZE) / 2,
    y: cy - BAR / 2,
    width: len * SIZE,
    height: BAR / 2,
    fill: "#fdecd9",
    stroke: C.darkOrange,
    strokeWidth: 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: `${len}`,
    cx: (len * SIZE) / 2 + 18,
    cy: cy - BAR / 4,
    fontSize: 13,
    fill: C.darkButtonGrey,
  });
}

const cutLen = 3;
sd.main(async () => {
  await sd.pause();
  // Cut markers across each log.
  for (let i = 0; i < logs.length; i++) {
    const len = logs[i];
    const cy = y0 - i * yStep;
    for (let k = 1; k * cutLen <= len; k++) {
      const cx = -(len * SIZE) / 2 + k * cutLen * SIZE;
      new sd.Line({
        targetNode: svg,
        x1: cx,
        y1: cy - BAR / 2,
        x2: cx,
        y2: cy,
        stroke: C.darkGreen,
        strokeWidth: 2,
        opacity: 0,
      })
        .startAnimate({
          delay: i * 120 + k * 60,
          duration: 220,
          easing: E.easeOut,
        })
        .setOpacity(1)
        .endAnimate();
    }
  }
  await sd.pause();
});
