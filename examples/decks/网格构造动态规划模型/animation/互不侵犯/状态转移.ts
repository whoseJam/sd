import * as sd from "@/sd";

import { fadeInBits, makeBits } from "../common/bits";
import {
  ACCENT,
  fadeIn,
  fadeOpacity,
  INVALID,
  KING,
  NEUTRAL,
  setStroke,
} from "../common/style";

const svg = sd.svg();

const CELL = 36;
const GAP = 3;
const N = 5;

const S: (0 | 1)[] = [1, 0, 1, 0, 1];
const T: (0 | 1)[] = [0, 0, 0, 0, 0];

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
  text: "S",
  cx: rowS.cxOf(0) - CELL,
  cy: 24,
  fontSize: 20,
  fill: ACCENT,
  opacity: 0,
});
const labelT = new sd.Math({
  targetNode: svg,
  text: "T",
  cx: rowT.cxOf(0) - CELL,
  cy: -24,
  fontSize: 20,
  fill: NEUTRAL,
  opacity: 0,
});

const kingMarks = S.map((b, i) => {
  if (b === 0) return null;
  return new sd.Text({
    targetNode: svg,
    text: "♚",
    cx: rowS.cxOf(i),
    cy: 24 + 26,
    fontSize: 18,
    fill: KING,
    opacity: 0,
  });
});

const candidateBits: (0 | 1)[][] = [
  [1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 0, 1, 0],
];
const candidateValid = [false, false, false, true];

const E = sd.easing();

async function showCandidate(bits: (0 | 1)[], valid: boolean) {
  for (let i = 0; i < N; i++) {
    rowT.cells[i].text
      .startAnimate({ delay: i * 30, duration: 200, easing: E.easeOut })
      .setText(String(bits[i]))
      .setCx(rowT.cxOf(i))
      .setCy(-24)
      .endAnimate();
  }
  const stroke = valid ? ACCENT : INVALID;
  for (let i = 0; i < N; i++) {
    setStroke(rowT.cells[i].bg, stroke, i * 30);
  }
  await sd.pause();
}

sd.main(async () => {
  fadeInBits(rowS);
  fadeInBits(rowT, 200);
  fadeIn(labelS, 100);
  fadeIn(labelT, 300);
  for (let i = 0; i < N; i++) {
    if (kingMarks[i]) fadeIn(kingMarks[i]!, 400 + i * 30);
  }
  await sd.pause();

  for (let k = 0; k < candidateBits.length; k++) {
    await showCandidate(candidateBits[k], candidateValid[k]);
  }
  fadeOpacity(labelT, 0.4, 0);
  await sd.pause();
});
