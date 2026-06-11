import * as sd from "@/sd";

import { fadeInBits, makeBits } from "../common/bits";
import { ACCENT, CANNON, fadeIn, NEUTRAL } from "../common/style";

const svg = sd.svg();

const CELL = 32;
const GAP = 3;
const N = 6;

const T: (0 | 1)[] = [1, 0, 0, 0, 0, 1];
const S: (0 | 1)[] = [0, 0, 1, 0, 0, 0];
const P: (0 | 1)[] = [0, 1, 0, 0, 1, 0];

const rowT = makeBits(svg, {
  bits: T,
  cellW: CELL,
  cellH: CELL,
  gap: GAP,
  cy: 44,
});
const rowS = makeBits(svg, {
  bits: S,
  cellW: CELL,
  cellH: CELL,
  gap: GAP,
  cy: 0,
});
const rowP = makeBits(svg, {
  bits: P,
  cellW: CELL,
  cellH: CELL,
  gap: GAP,
  cy: -44,
});

function rowLabel(text: string, cy: number, fill: string) {
  return new sd.Math({
    targetNode: svg,
    text,
    cx: rowT.cxOf(0) - CELL * 1.6,
    cy,
    fontSize: 16,
    fill,
    opacity: 0,
  });
}

const lT = rowLabel("i-1,\\ T", 44, NEUTRAL);
const lS = rowLabel("i,\\ S", 0, NEUTRAL);
const lP = rowLabel("i+1,\\ P", -44, ACCENT);

function cannons(bits: (0 | 1)[], cy: number) {
  return bits.map((b, i) => {
    if (b === 0) return null;
    return new sd.Text({
      targetNode: svg,
      text: "●",
      cx: rowT.cxOf(i),
      cy: cy + 16,
      fontSize: 14,
      fill: CANNON,
      opacity: 0,
    });
  });
}

const cT = cannons(T, 44);
const cS = cannons(S, 0);
const cP = cannons(P, -44);

const note = new sd.Math({
  targetNode: svg,
  text: "P\\ \\text{需与}\\ T,S\\ \\text{都互不攻击}",
  cx: 0,
  cy: -44 - CELL * 1.1,
  fontSize: 14,
  fill: NEUTRAL,
  opacity: 0,
});

sd.main(async () => {
  fadeInBits(rowT);
  fadeInBits(rowS, 120);
  fadeIn(lT, 60);
  fadeIn(lS, 180);
  for (let i = 0; i < N; i++) {
    if (cT[i]) fadeIn(cT[i]!, 250 + i * 30);
    if (cS[i]) fadeIn(cS[i]!, 380 + i * 30);
  }
  await sd.pause();

  fadeInBits(rowP);
  fadeIn(lP, 100);
  for (let i = 0; i < N; i++) {
    if (cP[i]) fadeIn(cP[i]!, 250 + i * 30);
  }
  fadeIn(note, 600);
  await sd.pause();
});
