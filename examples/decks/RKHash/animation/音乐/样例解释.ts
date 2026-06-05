import * as sd from "@/sd";

import { CharRow } from "../../../KMP/animation/char-row";

// Sliding-window discretized match: scan B's length window across A
// and check whether the discretization (rank pattern) matches B's.

const svg = sd.svg();
const C = sd.color();

const A = [5, 6, 2, 10, 10, 7, 3, 2, 9];
const B = [1, 4, 4, 3, 2, 1];

function discretize(arr: ReadonlyArray<number>): number[] {
  const sorted = [...new Set(arr)].sort((a, b) => a - b);
  const rank = new Map<number, number>();
  sorted.forEach((v, i) => rank.set(v, i));
  return arr.map((v) => rank.get(v) ?? 0);
}

const dB = discretize(B);

const SIZE = 30;
const rowA = new CharRow({
  targetNode: svg,
  text: A.map((v) => String(v).slice(-1)).join(""),
  size: SIZE,
  x: -(A.length * SIZE) / 2,
  y: 40,
  label: "A",
});
const rowB = new CharRow({
  targetNode: svg,
  text: B.map((v) => String(v).slice(-1)).join(""),
  size: SIZE,
  x: -(B.length * SIZE) / 2,
  y: -20,
  label: "B",
});

// Discretized labels below each cell.
for (let i = 0; i < dB.length; i++) {
  new sd.Text({
    targetNode: svg,
    text: String(dB[i]),
    cx: rowB.cellCx(i + 1),
    cy: rowB.bottom() - 14,
    fontSize: 12,
    fill: C.steelBlue,
  });
}

const HL_FILL = "#dde6ef";
const HL_STROKE = C.steelBlue;
const MATCH_FILL = "#cfead0";
const MATCH_STROKE = C.darkGreen;
const NEU_FILL = C.white;
const NEU_STROKE = C.silver;

sd.main(async () => {
  rowA.fadeIn({ delay: 0 });
  rowB.fadeIn({ delay: 220 });
  await sd.pause();

  let prev = new Set<number>();
  for (let start = 0; start + B.length <= A.length; start++) {
    const next = new Set<number>();
    for (let k = start + 1; k <= start + B.length; k++) next.add(k);
    const slice = A.slice(start, start + B.length);
    const dS = discretize(slice);
    const matched = dS.every((v, i) => v === dB[i]);
    const fill = matched ? MATCH_FILL : HL_FILL;
    const stroke = matched ? MATCH_STROKE : HL_STROKE;
    for (const k of prev) if (!next.has(k)) rowA.paintCell(k, NEU_FILL, NEU_STROKE);
    for (const k of next) rowA.paintCell(k, fill, stroke);
    prev = next;
    await sd.pause();
  }
});
