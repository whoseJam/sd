import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const eq = new sd.Math({
  targetNode: svg,
  text: "\\{a\\} = \\{c_1\\} + \\{c_2\\} + \\cdots + \\{c_m\\}",
  cx: 0,
  cy: 30,
  fontSize: 18,
  fill: C.darkButtonGrey,
  opacity: 0,
});

const arrow = new sd.Math({
  targetNode: svg,
  text: "\\Big\\Downarrow\\ D",
  cx: 0,
  cy: 0,
  fontSize: 16,
  fill: C.darkOrange,
  opacity: 0,
});

const eq2 = new sd.Math({
  targetNode: svg,
  text: "D(\\{a\\}) = D(\\{c_1\\}) + D(\\{c_2\\}) + \\cdots + D(\\{c_m\\})",
  cx: 0,
  cy: -30,
  fontSize: 18,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  eq.startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
  arrow
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
  eq2
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
