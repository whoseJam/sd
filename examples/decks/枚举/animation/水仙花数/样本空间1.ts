import * as sd from "@/sd";

import { sampleSpace } from "../sample-space";

const svg = sd.svg();

sampleSpace({
  svg,
  stacks: [{ items: ["100", "101", "102", "103", "...", "999"] }],
  process: {
    text: "\\overline{abc} = a^3 + b^3 + c^3",
    math: true,
    width: 220,
  },
  answer: { text: "答案", width: 70 },
});

sd.main(async () => {
  await sd.pause();
});
