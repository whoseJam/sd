import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

new sd.Text({
  targetNode: svg,
  text: "loop(k) = for i in 1..n: loop(k - 1)",
  cx: 0,
  cy: 0,
  fontSize: 16,
  fill: C.darkButtonGrey,
});

new sd.Text({
  targetNode: svg,
  text: "把函数自己当作黑箱",
  cx: 0,
  cy: -30,
  fontSize: 13,
  fill: C.darkOrange,
});

sd.main(async () => {
  await sd.pause();
});
