import * as sd from "@/sd";

const svg = sd.svg();

sd.main(Scene);

async function Scene() {
  new sd.Math({
    targetNode: svg,
    text: "x^2 + y^2 = z^2",
    centerX: 0,
    centerY: 0,
    fontSize: 60,
  });
}
