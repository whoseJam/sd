import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const t = new sd.Text({
  targetNode: svg,
  text: "0 / 20",
  cx: 0,
  cy: 0,
  fontSize: 80,
  fill: C.black,
});

sd.main(async () => {
  await sd.pause();
  t.startAnimate({ duration: 1500 }).setText("5 / 20").endAnimate();
  await sd.pause();
  t.startAnimate({ duration: 1500 }).setText("8 / 20").endAnimate();
  await sd.pause();
  t.startAnimate({ duration: 1500 }).setText("13 / 20").endAnimate();
});
