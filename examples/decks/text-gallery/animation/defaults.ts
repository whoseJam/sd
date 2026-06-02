import * as sd from "@/sd";

const svg = sd.svg();

sd.main(Scene);

async function Scene() {
  new sd.Text({ targetNode: svg, text: "Hello", centerX: 0, centerY: 0 });
}
