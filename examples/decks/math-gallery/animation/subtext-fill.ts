import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  const m = new sd.Math({
    targetNode: svg,
    text: "x^2 + 2x + 1",
    centerX: 0,
    centerY: 0,
    fontSize: 100,
  });
  m.setSubtextFill("x", C.red, 0);
  m.setSubtextFill("x", "#3a7afe", 1);
}
