import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Two rounded boxes: 状态设置 + 状态转移.
const labels = [
  { text: "状态设置", cx: -100, color: C.steelBlue, tone: "#dbeefd" as sd.SDColor },
  { text: "状态转移", cx: 100, color: C.darkOrange, tone: "#fdecd9" as sd.SDColor },
];

for (let i = 0; i < labels.length; i++) {
  const l = labels[i];
  const r = new sd.Rect({
    targetNode: svg, x: l.cx - 70, y: -30, width: 140, height: 60,
    fill: l.tone, stroke: l.color, strokeWidth: 1.8, opacity: 0,
  });
  r.startAnimate({ delay: i * 200, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  new sd.Text({
    targetNode: svg, text: l.text,
    cx: l.cx, cy: 0, fontSize: 16, fill: l.color, opacity: 0,
  }).startAnimate({ delay: i * 200 + 100, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
}

new sd.Math({
  targetNode: svg, text: "dp = \\text{state} + \\text{transition}",
  cx: 0, cy: -70, fontSize: 16, fill: C.darkButtonGrey,
  opacity: 0,
}).startAnimate({ delay: 600, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();

sd.main(async () => {
  await sd.pause();
});
