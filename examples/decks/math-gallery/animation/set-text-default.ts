import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  // Box center pinned at (0, 0) through the morph: red dot marks where
  // the math's geometric center should land at every frame.
  new sd.Circle({ targetNode: svg, cx: 0, cy: 0, r: 3, fill: C.red });

  const m = new sd.Math({
    targetNode: svg,
    text: "x",
    centerX: 0,
    centerY: 0,
    fontSize: 120,
  });
  await sd.pause();
  m.startAnimate({ duration: 1000 })
    .setText("x^2")
    .setCenterX(0)
    .setCenterY(0)
    .endAnimate();
}
