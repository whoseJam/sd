import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// A 1-D sequence drawn as a row of cells. Highlight one element a_i, then
// show its "uniqueness contribution band" — every subinterval whose left
// endpoint is in [L_i+1, i] and right in [i, R_i-1] is made unique by a_i.
const N = 10;
const UNIT = 50;
const X0 = (-N * UNIT) / 2;
const Y0 = -UNIT / 2;
const cellX = (i) => X0 + i * UNIT;

const seq = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
const I = 4; // 0-indexed: a_I = 5, L_I = 8 (a_8 = 5), R_I = N (none on right with value 5)
// Actually a_8 = 5 in this sequence. So L_I for i=4 is the previous 5 (none) = -1; R_I = 8.
// Let me pick i=2 (a_2 = 4): L = -1 (no previous 4), R = N (no next 4).
// For a clean visual let me use i=3 (a_3 = 1): L_3 = 1 (a_1 = 1), R_3 = N (no later 1).

sd.init(() => {
  for (let i = 0; i < N; i++) {
    const isFocus = i === 3;
    new sd.Rect({
      targetNode: svg,
      x: cellX(i),
      y: Y0,
      width: UNIT,
      height: UNIT,
      fill: isFocus ? "#f14c4c" : C.white,
      fillOpacity: isFocus ? 0.18 : 1,
      stroke: isFocus ? "#f14c4c" : "#aaa",
      strokeWidth: 1.5,
    });
    new sd.Text({
      targetNode: svg,
      text: String(seq[i]),
      cx: cellX(i) + UNIT / 2,
      cy: 0,
      fontSize: 24,
      fill: isFocus ? "#f14c4c" : "#222",
    });
  }
});

sd.main(async () => {
  await sd.pause();

  const i = 3;
  const L = 1;
  const R = N;

  // Mark L_i and R_i positions with brackets / labels.
  new sd.Text({
    targetNode: svg,
    text: "L",
    cx: cellX(L) + UNIT / 2,
    cy: -UNIT - 4,
    fontSize: 18,
    fill: "#4a90e2",
  });
  new sd.Text({
    targetNode: svg,
    text: "i",
    cx: cellX(i) + UNIT / 2,
    cy: -UNIT - 4,
    fontSize: 18,
    fill: "#f14c4c",
  });
  if (R < N) {
    new sd.Text({
      targetNode: svg,
      text: "R",
      cx: cellX(R) + UNIT / 2,
      cy: -UNIT - 4,
      fontSize: 18,
      fill: "#4a90e2",
    });
  }
  await sd.pause();

  // Draw the [L+1, i] band on top and [i, R-1] band below to show range pair.
  const leftBand = new sd.Rect({
    targetNode: svg,
    x: cellX(L + 1),
    y: UNIT / 2 + 6,
    width: (i - L) * UNIT,
    height: 14,
    fill: "#4a90e2",
    fillOpacity: 0,
    stroke: C.none,
  });
  leftBand.startAnimate({ duration: 500 }).setFillOpacity(0.4).endAnimate();

  const rightBand = new sd.Rect({
    targetNode: svg,
    x: cellX(i),
    y: UNIT / 2 + 24,
    width: (R - i) * UNIT,
    height: 14,
    fill: "#f58617",
    fillOpacity: 0,
    stroke: C.none,
  });
  rightBand.startAnimate({ duration: 500 }).setFillOpacity(0.4).endAnimate();
});
