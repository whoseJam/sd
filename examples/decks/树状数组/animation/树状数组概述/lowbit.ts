import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";

// lowbit(x) = x & -x. Walk through the 2's-complement chain on
// x = 00011000 (decimal 24): negate, complement, +1, AND.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const SIZE = 30;
const N = 8;
const X0 = -(N * SIZE) / 2;
const GAP = 12;

interface Row {
  label: string;
  bits: string;
  y: number;
  cells: CharRow;
}
const rows: Row[] = [];

const items: Array<[string, string]> = [
  ["x", "00011000"],
  ["−x 原码", "10011000"],
  ["−x 反码", "11100111"],
  ["−x 补码", "11101000"],
  ["x & (−x)", "00001000"],
];

for (let i = 0; i < items.length; i++) {
  const y = 80 - i * (SIZE + GAP);
  const row = new CharRow({
    targetNode: svg,
    text: items[i][1],
    size: SIZE,
    x: X0,
    y,
  });
  new sd.Text({
    targetNode: svg,
    text: items[i][0],
    cx: X0 - 80,
    cy: y + SIZE / 2,
    fontSize: 14,
    fill: C.darkButtonGrey,
  });
  rows.push({ label: items[i][0], bits: items[i][1], y, cells: row });
}

sd.main(async () => {
  rows[0].cells.fadeIn({ delay: 0 });
  await sd.pause();
  for (let i = 1; i < rows.length; i++) {
    rows[i].cells.fadeIn({ delay: 0 });
    await sd.pause();
  }

  // Final beat: highlight the bit that survives the AND in the last row.
  for (let k = 1; k <= N; k++) {
    if (rows[rows.length - 1].bits[k - 1] === "1") {
      rows[rows.length - 1].cells.paintCell(k, "#cfead0", C.darkGreen);
      rows[0].cells.paintCell(k, "#cfead0", C.darkGreen);
    }
  }
  await sd.pause();
  void E;
});
