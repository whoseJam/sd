import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestPosition);

async function TestPosition() {
  const poly = new sd.Polygon({
    targetNode: svg,
    points: [
      [100, 100],
      [150, 200],
      [200, 100],
    ],
  });
  await sd.pause();
  poly.startAnimate().setScale(0.5).endAnimate();
}
