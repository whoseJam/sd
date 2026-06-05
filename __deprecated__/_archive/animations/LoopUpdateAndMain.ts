import * as sd from "@/sd";

const svg = sd.svg();

const rect = new sd.Rect({
  targetNode: svg,
});

sd.main(async () => {
  await sd.pause();
  rect.startAnimate().setX(100).setY(100).endAnimate();
});

sd.loopUpdate((t: number) => {
  rect.setBorderRadius(Math.sin(t / 100) * 5 + 10);
});
