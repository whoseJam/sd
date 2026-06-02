import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  new sd.Circle({ targetNode: svg, cx: -250, cy: 0, r: 4, fill: C.red });

  const m = new sd.Math({
    targetNode: svg,
    text: "\\int_0^\\infty e^{-x^2}\\,dx",
    x: -250,
    y: 0,
    fontSize: 24,
  });
  await sd.pause();
  m.startAnimate({ duration: 1500 }).setFontSize(80).endAnimate();
}
