import * as sd from "@/sd";

// (∑a_i)(∑b_j) factorization shown via stepwise expansion.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const math = new sd.Math({
  targetNode: svg,
  text: "\\sum_{i=1}^3 a_i \\sum_{j=1}^3 b_j",
  cx: 0,
  cy: 0,
  fontSize: 28,
  fill: C.darkButtonGrey,
});

const DUR = 500;
const STEPS = [
  "\\sum_{i=1}^3 a_i (b_1 + b_2 + b_3)",
  "a_1(b_1+b_2+b_3) + a_2(b_1+b_2+b_3) + a_3(b_1+b_2+b_3)",
  "(a_1+a_2+a_3)(b_1+b_2+b_3)",
  "\\left(\\sum_{i=1}^3 a_i\\right)\\left(\\sum_{j=1}^3 b_j\\right)",
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
