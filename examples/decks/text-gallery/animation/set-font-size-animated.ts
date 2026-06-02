import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  // Text (x,y) = math bottom-left, so this corner should remain glued to
  // the dot through the whole tween.
  new sd.Circle({ targetNode: svg, cx: -200, cy: 0, r: 4, fill: C.red });

  const t = new sd.Text({
    targetNode: svg,
    text: "scale me",
    x: -200,
    y: 0,
    fontSize: 20,
  });
  await sd.pause();
  t.startAnimate({ duration: 1500 }).setFontSize(120).endAnimate();
}
