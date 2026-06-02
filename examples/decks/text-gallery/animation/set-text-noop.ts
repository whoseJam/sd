import * as sd from "@/sd";

const svg = sd.svg();

sd.main(Scene);

async function Scene() {
  const t = new sd.Text({
    targetNode: svg,
    text: "hello",
    centerX: 0,
    centerY: 0,
    fontSize: 120,
  });
  await sd.pause();
  t.startAnimate({ duration: 800 }).setText("hello").endAnimate();
}
