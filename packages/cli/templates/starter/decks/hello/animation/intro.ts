import * as sd from "@whosejam/sd";

const svg = sd.svg();

sd.main(async () => {
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

  await sd.pause();
});
