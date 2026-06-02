import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  new sd.Circle({ targetNode: svg, cx: -300, cy: 0, r: 4, fill: C.red });
  new sd.Math({ targetNode: svg, text: "f(x)", x: -300, y: 0, fontSize: 50 });

  new sd.Circle({ targetNode: svg, cx: 0, cy: 0, r: 4, fill: C.red });
  new sd.Math({ targetNode: svg, text: "f(x)", cx: 0, cy: 0, fontSize: 50 });

  new sd.Circle({ targetNode: svg, cx: 300, cy: 0, r: 4, fill: C.red });
  new sd.Math({
    targetNode: svg,
    text: "f(x)",
    centerX: 300,
    centerY: 0,
    fontSize: 50,
  });
}
