import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

for (let i = 1; i <= 4; i++) {
  const x = -180 + (i - 1) * 100;
  new sd.Rect({
    targetNode: svg, x: x - 40, y: -22, width: 80, height: 44,
    fill: "#fdecd9", stroke: C.darkOrange, strokeWidth: 1.4, opacity: 0,
  }).startAnimate({ delay: i * 180, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  new sd.Text({
    targetNode: svg, text: `test ${i}`,
    cx: x, cy: 0, fontSize: 14, fill: C.darkButtonGrey, opacity: 0,
  }).startAnimate({ delay: i * 180 + 80, duration: 240, easing: E.easeOut }).setOpacity(1).endAnimate();
}

sd.main(async () => {
  await sd.pause();
});
