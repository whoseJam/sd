import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(Scene);

async function Scene() {
  // marker at math (0, 0): the text's centerX should sit on this dot
  // throughout the morph, not drift right as the new text widens.
  new sd.Circle({ targetNode: svg, cx: 0, cy: 0, r: 3, fill: C.red });

  const t = new sd.Text({
    targetNode: svg,
    text: "1",
    centerX: 0,
    centerY: 0,
    fontSize: 120,
  });
  await sd.pause();
  t.startAnimate({ duration: 800 }).setText("hello").setCenterX(0).endAnimate();
}
