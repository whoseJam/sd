import * as sd from "@/sd";

// Nested ∑ over a_i b_j factors by pulling the j-sum out of the i-loop.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const math = new sd.Math({
  targetNode: svg,
  text: "\\sum_{i=1}^3 \\sum_{j=1}^3 a_i b_j",
  cx: 0,
  cy: 0,
  fontSize: 28,
  fill: C.darkButtonGrey,
});

const DUR = 500;
const STEPS = [
  "\\sum_{i=1}^3 (a_i b_1 + a_i b_2 + a_i b_3)",
  "\\sum_{i=1}^3 a_i (b_1 + b_2 + b_3)",
  "\\sum_{i=1}^3 a_i \\sum_{j=1}^3 b_j",
];

sd.main(async () => {
  await sd.pause();
  for (const step of STEPS) {
    math.startAnimate({ duration: DUR, easing: E.easeInOut }).setText(step).endAnimate();
    await sd.pause();
  }
});
