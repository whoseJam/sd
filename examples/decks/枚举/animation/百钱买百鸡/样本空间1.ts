import * as sd from "@/sd";

import { sampleSpace } from "../sample-space";

const svg = sd.svg();

sampleSpace({
  svg,
  stacks: [
    { items: ["0", "1", "2", "...", "100"], label: "公鸡 x" },
    { items: ["0", "1", "2", "...", "100"], label: "母鸡 y" },
    { items: ["0", "1", "2", "...", "100"], label: "小鸡 z" },
  ],
  process: { text: "检查数量和钱数", width: 160 },
  answer: { text: "答案", width: 70 },
});

sd.main(async () => {
  await sd.pause();
});
