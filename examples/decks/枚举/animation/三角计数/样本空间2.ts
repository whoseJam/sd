import * as sd from "@/sd";

import { sampleSpace } from "../sample-space";

// Reduced sample space: parameterize the triangle by its horizontal base
// (y, l, r) instead of three arbitrary points. The third vertex then has
// 2n − 2 choices (n − 1 other rows × {column l, column r}), so the answer
// is |y| · |l, r| × (2n − 2).

const svg = sd.svg();

sampleSpace({
  svg,
  stacks: [
    { items: ["1", "2", "3", "...", "n"], label: "y" },
    { items: ["(1,2)", "(1,3)", "(1,4)", "...", "(n-1,n)"], label: "l, r" },
  ],
  process: { text: "2n − 2", width: 90 },
  answer: { text: "答案", width: 70 },
  elementWidth: 80,
});

sd.main(async () => {
  await sd.pause();
});
