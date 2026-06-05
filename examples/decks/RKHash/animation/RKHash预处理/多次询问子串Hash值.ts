import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";

// Walk through a handful of substring queries on "awkdklsafiewla";
// each beat highlights a different (l, r) range.

const svg = sd.svg();
const C = sd.color();

const text = "awkdklsafiewla";
const SIZE = 28;
const row = new CharRow({
  targetNode: svg,
  text,
  size: SIZE,
  x: -(text.length * SIZE) / 2,
  y: 0,
  label: "s",
});

// Hand-picked queries.
const queries: Array<[number, number]> = [
  [3, 8],
  [1, 5],
  [7, 12],
  [10, 14],
  [4, 9],
];

const HL_FILL = "#cfead0";
const HL_STROKE = C.darkGreen;
const NEU_FILL = C.white;
const NEU_STROKE = C.silver;

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();

  // Clear only the cells that were in the previous highlight but NOT
  // in this one — repainting the same cell within a single beat throws
  // an action conflict on fill.
  let prev = new Set<number>();
  for (const [l, r] of queries) {
    const next = new Set<number>();
    for (let k = l; k <= r; k++) next.add(k);
    for (const k of prev) {
      if (!next.has(k)) row.paintCell(k, NEU_FILL, NEU_STROKE);
    }
    for (const k of next) {
      if (!prev.has(k)) row.paintCell(k, HL_FILL, HL_STROKE);
    }
    prev = next;
    await sd.pause();
  }
});
