import * as sd from "@/sd";

const svg = sd.svg();

sd.main(Scene);

async function Scene() {
  new sd.Math({ targetNode: svg, text: "x^2", centerX: 0, centerY: 130, fontSize: 30 });
  new sd.Math({ targetNode: svg, text: "x^2", centerX: 0, centerY: 50, fontSize: 60 });
  new sd.Math({ targetNode: svg, text: "x^2", centerX: 0, centerY: -100, fontSize: 120 });
}
