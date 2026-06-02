import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  new sd.Circle({ targetNode: svg, cx: 0, cy: 0, r: 3, fill: C.red });

  const m = new sd.Math({
    targetNode: svg,
    text: "a^2 + b^2",
    centerX: 0,
    centerY: 0,
    fontSize: 100,
  });
  await sd.pause();
  m.startAnimate({ duration: 1200 })
    .setText("c^2")
    .setCenterX(0)
    .setCenterY(0)
    .endAnimate();
}
