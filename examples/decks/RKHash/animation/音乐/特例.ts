import * as sd from "@/sd";

import { arrow } from "../../../枚举/animation/arrow";
import { CharRow } from "../../../KMP/animation/char-row";

// "Music" problem: comparing two substrings by the *differences*
// between successive notes, not by raw values. CBCCA centred above
// CBCC ↔ BCCA, with the delta sequence below each.

const svg = sd.svg();
const C = sd.color();

const top = "CBCCA";
const left = "CBCC";
const right = "BCCA";
const leftDelta = ["0", "1", "0", "1"];
const rightDelta = ["1", "0", "1", "0"];

const SIZE = 32;
const TOP_Y = 60;
const BOT_Y = -20;

const topRow = new CharRow({
  targetNode: svg,
  text: top,
  size: SIZE,
  x: -(top.length * SIZE) / 2,
  y: TOP_Y,
});

const leftRow = new CharRow({
  targetNode: svg,
  text: left,
  size: SIZE,
  x: -(left.length * SIZE) / 2 - SIZE * 1.5,
  y: BOT_Y,
});
const rightRow = new CharRow({
  targetNode: svg,
  text: right,
  size: SIZE,
  x: -(right.length * SIZE) / 2 + SIZE * 1.5,
  y: BOT_Y,
});

for (let i = 0; i < leftDelta.length; i++) {
  new sd.Text({
    targetNode: svg,
    text: leftDelta[i],
    cx: leftRow.cellCx(i + 1),
    cy: BOT_Y - 14,
    fontSize: 14,
    fill: C.darkButtonGrey,
  });
}
for (let i = 0; i < rightDelta.length; i++) {
  new sd.Text({
    targetNode: svg,
    text: rightDelta[i],
    cx: rightRow.cellCx(i + 1),
    cy: BOT_Y - 14,
    fontSize: 14,
    fill: C.darkButtonGrey,
  });
}

arrow(svg, {
  from: { x: leftRow.cellRight(left.length) + 2, y: BOT_Y + SIZE / 2 },
  to: { x: rightRow.cellLeft(1) - 2, y: BOT_Y + SIZE / 2 },
});

void top;

sd.main(async () => {
  topRow.fadeIn({ delay: 0 });
  leftRow.fadeIn({ delay: 200 });
  rightRow.fadeIn({ delay: 400 });
  await sd.pause();
});
