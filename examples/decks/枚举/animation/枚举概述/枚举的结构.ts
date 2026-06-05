import * as sd from "@/sd";

import { sampleSpace } from "../sample-space";

const svg = sd.svg();

sampleSpace({
  svg,
  stacks: [{ items: ["样本 1", "样本 2", "样本 3", "...", "样本 n"] }],
  process: { text: "计算过程", width: 110 },
  answer: { text: "答案", width: 70 },
});

sd.main(async () => {
  await sd.pause();
});
