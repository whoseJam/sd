import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";

// Static: "abbaaca" with the hash of each prefix written above each
// cell — pre-computing prefix hashes is what makes O(1) substring
// hash possible.

const svg = sd.svg();
const C = sd.color();

const text = "abbaaca";
const SIZE = 36;
const row = new CharRow({
  targetNode: svg,
  text,
  size: SIZE,
  x: -(text.length * SIZE) / 2,
  y: 0,
  label: "s",
});

for (let i = 1; i <= text.length; i++) {
  new sd.Math({
    targetNode: svg,
    text: `H_{${i}}`,
    cx: row.cellCx(i),
    cy: row.top() + 18,
    fontSize: 14,
    fill: C.steelBlue,
  });
}

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();
});
