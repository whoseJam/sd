import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  const t0 = new sd.Text({ targetNode: svg, text: "ababab", centerX: 0, centerY: 120, fontSize: 60 });
  t0.setSubtextFill("ab", C.red, 0);

  const t1 = new sd.Text({ targetNode: svg, text: "ababab", centerX: 0, centerY: 20, fontSize: 60 });
  t1.setSubtextFill("ab", C.red, 1);

  const t2 = new sd.Text({ targetNode: svg, text: "ababab", centerX: 0, centerY: -80, fontSize: 60 });
  t2.setSubtextFill("ab", C.red, 2);
}
