import * as sd from "@/sd";

import { StonePiles } from "../common/stone-pile";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const data = [3, 5, 6];

const piles = new StonePiles({
  targetNode: svg,
  counts: data,
  cx: 0,
  baseY: -60,
  pileGap: 90,
  stoneR: 14,
});

const xorValue = data.reduce((a, b) => a ^ b, 0);

const formula = new sd.Math({
  targetNode: svg,
  text: `${data.join(" \\oplus ")} = ${xorValue}`,
  cx: 0,
  cy: 100,
  fontSize: 18,
  fill: C.darkButtonGrey,
  opacity: 0,
});

const verdict = new sd.Text({
  targetNode: svg,
  text: xorValue === 0 ? "先手必败" : "先手必胜",
  cx: 0,
  cy: 130,
  fontSize: 16,
  fill:
    xorValue === 0 ? ("#c62828" as sd.SDColor) : (C.steelBlue as sd.SDColor),
  opacity: 0,
});

sd.main(async () => {
  piles.fadeIn();
  await sd.pause();
  formula
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
  verdict
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
