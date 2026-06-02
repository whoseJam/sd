import * as sd from "@/sd";

const svg = sd.svg();

sd.main(Scene);

async function Scene() {
  const t = new sd.Text({ targetNode: svg, text: "1234", centerX: 0, centerY: 0, fontSize: 100 });
  await sd.pause();
  t.startAnimate({ duration: 1200 })
    .setText("1+2+3+4", { 1: "1", 2: "2", 3: "3", 4: "4" })
    .endAnimate();
}
