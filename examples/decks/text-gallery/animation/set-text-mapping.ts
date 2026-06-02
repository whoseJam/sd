import * as sd from "@/sd";

const svg = sd.svg();

sd.main(Scene);

async function Scene() {
  const t = new sd.Text({ targetNode: svg, text: "H", centerX: 0, centerY: 0, fontSize: 160 });
  await sd.pause();
  t.startAnimate({ duration: 1000 }).setText("II", { H: "II" }).endAnimate();
}
