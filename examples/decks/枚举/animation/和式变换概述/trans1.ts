import * as sd from "@/sd";

// ∑(a_i + b_i) = a_1+b_1+a_2+b_2+a_3+b_3 = a_1+a_2+a_3+b_1+b_2+b_3
// = ∑a_i + ∑b_i. Each beat regroups the sum a step further.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const math = new sd.Math({
  targetNode: svg,
  text: "\\sum_{i=1}^3 (a_i + b_i)",
  cx: 0,
  cy: 0,
  fontSize: 30,
  fill: C.darkButtonGrey,
});

const DUR = 500;
const STEPS = ["a_1+b_1+a_2+b_2+a_3+b_3", "a_1+a_2+a_3+b_1+b_2+b_3", "\\sum_{i=1}^3 a_i + \\sum_{i=1}^3 b_i"];

sd.main(async () => {
  await sd.pause();
  for (const step of STEPS) {
    math.startAnimate({ duration: DUR, easing: E.easeInOut }).setText(step).endAnimate();
    await sd.pause();
  }
});
