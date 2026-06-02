import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestStrokeDashArray);

async function TestStrokeDashArray() {
  const circle = new sd.Circle({
    targetNode: svg,
    cx: 100,
    cy: 100,
    r: 50,
  }).setStrokeWidth(3);
  await sd.pause();
  circle.startAnimate().setStrokeDashArray([10, 10]).endAnimate();
  await sd.pause();
  circle.startAnimate().setStrokeDashArray([10, 0]).endAnimate();
}
