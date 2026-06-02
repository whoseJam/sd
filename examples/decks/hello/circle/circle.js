import * as sd from "@/sd";

const svg = sd.svg();

sd.main(Grow);

async function Grow() {
  const circle = new sd.Circle({
    targetNode: svg,
    cx: 300,
    cy: 200,
    r: 20,
  }).setStrokeWidth(3);
  await sd.pause();
  circle.startAnimate().setR(120).endAnimate();
  await sd.pause();
  circle.startAnimate().setR(40).endAnimate();
}
