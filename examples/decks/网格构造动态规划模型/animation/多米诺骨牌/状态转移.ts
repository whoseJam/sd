import * as sd from "@/sd";

import { fadeInBits, makeBits } from "../common/bits";
import { ACCENT, fadeIn, NEUTRAL } from "../common/style";

const svg = sd.svg();

const CELL = 36;
const GAP = 3;

const S: (0 | 1)[] = [1, 0, 1, 0, 1];
const T: (0 | 1)[] = [0, 1, 0, 1, 0];

const rowS = makeBits(svg, {
  bits: S,
  cellW: CELL,
  cellH: CELL,
  gap: GAP,
  cy: 24,
});
const rowT = makeBits(svg, {
  bits: T,
  cellW: CELL,
  cellH: CELL,
  gap: GAP,
  cy: -24,
});

const labelS = new sd.Math({
  targetNode: svg,
  text: "i,\\ S",
  cx: rowS.cxOf(0) - CELL * 1.4,
  cy: 24,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});
const labelT = new sd.Math({
  targetNode: svg,
  text: "i+1,\\ T",
  cx: rowT.cxOf(0) - CELL * 1.4,
  cy: -24,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});

const verticalDominoes = S.map((b, i) => {
  if (b === 1) return null;
  return new sd.Rect({
    targetNode: svg,
    x: rowS.cxOf(i) - (CELL - 10) / 2,
    y: -24 - CELL / 2 + 5,
    width: CELL - 10,
    height: 2 * CELL + GAP - 10,
    fill: ACCENT,
    stroke: ACCENT,
    strokeWidth: 1.5,
    opacity: 0,
  });
});

const note = new sd.Math({
  targetNode: svg,
  text: "S\\ \\text{的}\\ 0\\ \\text{位}\\Rightarrow T\\ \\text{对应位放竖骨牌}\\Rightarrow T\\ \\text{该位为}\\ 1",
  cx: 0,
  cy: -24 - CELL - 8,
  fontSize: 14,
  fill: NEUTRAL,
  opacity: 0,
});

sd.main(async () => {
  fadeInBits(rowS);
  fadeInBits(rowT, 200);
  fadeIn(labelS, 100);
  fadeIn(labelT, 300);
  await sd.pause();

  for (let i = 0; i < verticalDominoes.length; i++) {
    if (verticalDominoes[i]) fadeIn(verticalDominoes[i]!, i * 100);
  }
  fadeIn(note, verticalDominoes.length * 100 + 100);
  await sd.pause();
});
