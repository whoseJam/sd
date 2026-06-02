import * as sd from "@/sd";

const svg = sd.svg();

sd.main(Scene);

async function Scene() {
  const t = new sd.Text({
    targetNode: svg,
    text: "Animate",
    centerX: 0,
    centerY: 0,
    fontSize: 100,
    fontFamily: "Times New Roman",
  });
  await sd.pause();
  t.startAnimate({ duration: 1200 }).setFontFamily("Arial").endAnimate();
}
