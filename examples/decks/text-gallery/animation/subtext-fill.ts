import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  new sd.Text({
    targetNode: svg,
    text: "abcde",
    centerX: 0,
    centerY: 120,
    fontSize: 60,
  });

  const t1 = new sd.Text({
    targetNode: svg,
    text: "abcde",
    centerX: 0,
    centerY: 20,
    fontSize: 60,
  });
  t1.setSubtextFill("cd", C.red);

  const t2 = new sd.Text({
    targetNode: svg,
    text: "abcde",
    centerX: 0,
    centerY: -80,
    fontSize: 60,
  });
  t2.setSubtextFill("abc", "#3a7afe");
}
