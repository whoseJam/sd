import * as sd from "@/sd";

import { sampleSpace } from "../sample-space";

const svg = sd.svg();

sampleSpace({
  svg,
  stacks: [
    { items: ["1", "2", "3", "...", "9"], label: "a" },
    { items: ["0", "1", "2", "...", "9"], label: "b" },
    { items: ["0", "1", "2", "...", "9"], label: "c" },
  ],
  process: { text: "\\overline{abc} = a^3 + b^3 + c^3", math: true, width: 220 },
  answer: { text: "答案", width: 70 },
});

sd.main(async () => {
  await sd.pause();
});
