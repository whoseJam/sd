import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// 3, 2, 1 — XOR = 011 ^ 010 ^ 001 = 000 = 0 → first player loses.
const PILES = [3, 2, 1];
const PILE_X = [-70, 0, 70];
const STONE_R = 9;
const STONE_GAP = 4;
const PILE_BASE_Y = -25;

const stones: sd.Circle[][] = PILES.map((count, p) => {
  const arr: sd.Circle[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(
      new sd.Circle({
        targetNode: svg,
        cx: PILE_X[p],
        cy: PILE_BASE_Y + i * (STONE_R * 2 + STONE_GAP),
        r: STONE_R,
        fill: C.white,
        stroke: C.darkButtonGrey,
        strokeWidth: 1.2,
        opacity: 0,
      }),
    );
  }
  return arr;
});

const pileLabels = PILES.map((count, p) => new sd.Text({
  targetNode: svg,
  text: String(count),
  cx: PILE_X[p], cy: PILE_BASE_Y - 22 - 1,
  fontSize: 12,
  fill: C.darkButtonGrey,
  opacity: 0,
}));

const equation = new sd.Text({
  targetNode: svg,
  text: "3 ⊕ 2 ⊕ 1",
  cx: 0, cy: -70,
  fontSize: 15,
  fill: C.darkButtonGrey,
  opacity: 0,
});

const result = new sd.Text({
  targetNode: svg,
  text: "= 0  →  先手必败",
  cx: 0, cy: -100,
  fontSize: 13,
  fill: C.darkOrange,
  opacity: 0,
});

sd.main(async () => {
  // p1: piles appear (bottom-up).
  for (let p = 0; p < PILES.length; p++) {
    for (let i = 0; i < PILES[p]; i++) {
      const d = p * 100 + i * 90;
      stones[p][i]
        .startAnimate({ delay: d, duration: 260, easing: E.easeOut })
        .setOpacity(1).endAnimate();
    }
    pileLabels[p]
      .startAnimate({ delay: p * 100 + PILES[p] * 90 + 120, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();

  // p2: XOR equation
  equation
    .startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();

  // p3: result
  result
    .startAnimate({ duration: 380, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();
});
