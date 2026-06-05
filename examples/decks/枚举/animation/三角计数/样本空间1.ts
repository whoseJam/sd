import * as sd from "@/sd";

import { sampleSpace } from "../sample-space";

const svg = sd.svg();

sampleSpace({
  svg,
  stacks: [
    { items: ["(1,1)", "(1,2)", "(1,3)", "...", "(n,n)"], label: "a" },
    { items: ["(1,1)", "(1,2)", "(1,3)", "...", "(n,n)"], label: "b" },
    { items: ["(1,1)", "(1,2)", "(1,3)", "...", "(n,n)"], label: "c" },
  ],
  process: { text: "abc 是否合法三角形", width: 220 },
  answer: { text: "答案", width: 70 },
  elementWidth: 80,
});

sd.main(async () => {
  await sd.pause();
});
