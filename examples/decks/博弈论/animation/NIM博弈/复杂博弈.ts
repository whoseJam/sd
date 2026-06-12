import * as sd from "@/sd";

import { StonePiles } from "../common/stone-pile";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const data = [3, 5, 7, 6, 4, 2];
const xorValue = data.reduce((a, b) => a ^ b, 0);
const highBit = 31 - Math.clz32(xorValue);
const targetIdx = data.findIndex((v) => ((v >> highBit) & 1) === 1);
const newVal = data[targetIdx] ^ xorValue;
const removeCount = data[targetIdx] - newVal;

const piles = new StonePiles({
  targetNode: svg,
  counts: data,
  cx: 0,
  baseY: -110,
  pileGap: 80,
  stoneR: 13,
});

const formula = new sd.Math({
  targetNode: svg,
  text: `${data.join(" \\oplus ")} = ${xorValue}`,
  cx: 0,
  cy: 90,
  fontSize: 16,
  fill: C.darkButtonGrey,
  opacity: 0,
});

const moveText = new sd.Math({
  targetNode: svg,
  text: `A_{${targetIdx + 1}} = ${data[targetIdx]} \\to ${data[targetIdx]} \\oplus ${xorValue} = ${newVal}`,
  cx: 0,
  cy: 122,
  fontSize: 15,
  fill: C.steelBlue as sd.SDColor,
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
  moveText
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  piles.removeTop(targetIdx, removeCount, { delay: 120 });
  await sd.pause();
});
