import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";

// Two stacks of cow gene strings (spotted vs non-spotted). A specific
// column range is highlighted — that's the "distinguishing window"
// the problem asks us to find.

const svg = sd.svg();
const C = sd.color();

const spotted = ["AATCCCAT", "ACTTGCAA", "GGTCGCAA"];
const nonSpotted = ["ACTCCCAG", "ACTCGCAT", "ACTTCCAT"];

const SIZE = 26;
const LEN = spotted[0].length;
const W = LEN * SIZE;
const X0 = -W / 2;
const ROW_GAP = 8;

const spottedRows: CharRow[] = [];
const nonSpottedRows: CharRow[] = [];
const Y_START = 100;
for (let i = 0; i < spotted.length; i++) {
  spottedRows.push(
    new CharRow({
      targetNode: svg,
      text: spotted[i],
      size: SIZE,
      x: X0,
      y: Y_START - i * (SIZE + ROW_GAP),
    }),
  );
}
const SECOND_Y = Y_START - spotted.length * (SIZE + ROW_GAP) - 24;
for (let i = 0; i < nonSpotted.length; i++) {
  nonSpottedRows.push(
    new CharRow({
      targetNode: svg,
      text: nonSpotted[i],
      size: SIZE,
      x: X0,
      y: SECOND_Y - i * (SIZE + ROW_GAP),
    }),
  );
}

new sd.Text({
  targetNode: svg,
  text: "斑点",
  cx: X0 - 30,
  cy: Y_START - (spotted.length - 1) * (SIZE + ROW_GAP) / 2 + SIZE / 2,
  fontSize: 14,
  fill: C.darkButtonGrey,
});
new sd.Text({
  targetNode: svg,
  text: "非斑点",
  cx: X0 - 30,
  cy: SECOND_Y - (nonSpotted.length - 1) * (SIZE + ROW_GAP) / 2 + SIZE / 2,
  fontSize: 14,
  fill: C.darkButtonGrey,
});

// Discriminating window: cols 4..5.
const HL_FILL = "#cfead0";
const HL_STROKE = C.darkGreen;
const L = 4;
const R = 5;

sd.main(async () => {
  for (const row of spottedRows) row.fadeIn({ delay: 0 });
  for (const row of nonSpottedRows) row.fadeIn({ delay: 180 });
  await sd.pause();

  for (const row of [...spottedRows, ...nonSpottedRows]) {
    for (let k = L; k <= R; k++) row.paintCell(k, HL_FILL, HL_STROKE, { delay: (k - L) * 60 });
  }
  await sd.pause();
});
