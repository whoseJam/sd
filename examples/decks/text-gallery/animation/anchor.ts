import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  new sd.Circle({ targetNode: svg, cx: -300, cy: 100, r: 4, fill: C.red });
  new sd.Text({ targetNode: svg, text: "(x, y)", x: -300, y: 100, fontSize: 30 });

  new sd.Circle({ targetNode: svg, cx: 0, cy: 100, r: 4, fill: C.red });
  new sd.Text({ targetNode: svg, text: "(cx, cy)", cx: 0, cy: 100, fontSize: 30 });

  new sd.Circle({ targetNode: svg, cx: 300, cy: 100, r: 4, fill: C.red });
  new sd.Text({
    targetNode: svg,
    text: "(centerX, centerY)",
    centerX: 300,
    centerY: 100,
    fontSize: 30,
  });
}
