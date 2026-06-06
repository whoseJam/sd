import * as sd from "@/sd";

// ∑ c·a_i = c·∑a_i. Constant factor pulled out.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const math = new sd.Math({
  targetNode: svg,
  text: "\\sum_{i=1}^3 c a_i",
  cx: 0,
  cy: 0,
  fontSize: 30,
  fill: C.darkButtonGrey,
});

const DUR = 500;
const STEPS = [
  "c a_1 + c a_2 + c a_3",
  "c (a_1 + a_2 + a_3)",
  "c \\sum_{i=1}^3 a_i",
];

sd.main(async () => {
  await sd.pause();
  for (const step of STEPS) {
    math
      .startAnimate({ duration: DUR, easing: E.easeInOut })
      .setText(step)
      .endAnimate();
    await sd.pause();
  }
});
