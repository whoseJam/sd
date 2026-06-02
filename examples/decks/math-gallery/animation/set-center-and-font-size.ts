import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  // Red dot marks where the math box center SHOULD be at every frame.
  // If setCenterX(0).setCenterY(0) chained after setFontSize works,
  // the math stays centered on the dot through the size tween.
  new sd.Circle({ targetNode: svg, cx: 0, cy: 0, r: 4, fill: C.red });

  const m = new sd.Math({
    targetNode: svg,
    text: "E = mc^2",
    centerX: 0,
    centerY: 0,
    fontSize: 30,
  });
  await sd.pause();
  m.startAnimate({ duration: 1500 })
    .setFontSize(100)
    .setCenterX(0)
    .setCenterY(0)
    .endAnimate();
}
