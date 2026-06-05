import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";

const svg = sd.svg();
const C = sd.color();

const data = [3, 1, 4, 1, 5, 9, 2, 6];
const prefix: number[] = [];
{
  let s = 0;
  for (const v of data) { s += v; prefix.push(s); }
}

const SIZE = 38;
const X0 = -(data.length * SIZE) / 2;
const aRow = new CharRow({
  targetNode: svg,
  text: data.map(String).join(""),
  size: SIZE,
  x: X0,
  y: 60,
  label: "a",
});
const sRow = new CharRow({
  targetNode: svg,
  text: prefix.map((v) => String(v).slice(-1)).join(""),
  size: SIZE,
  x: X0,
  y: 0,
  label: "S",
});

// Real prefix values (2-digit room) as overlay text — slice(-1) above
// just keeps glyphs at one char so cells line up.
for (let i = 1; i <= data.length; i++) {
  new sd.Text({
    targetNode: svg,
    text: String(prefix[i - 1]),
    cx: sRow.cellCx(i),
    cy: sRow.bottom() + SIZE / 2,
    fontSize: 13,
    fill: C.steelBlue,
  });
}

sd.main(async () => {
  aRow.fadeIn({ delay: 0 });
  sRow.fadeIn({ delay: 220 });
  await sd.pause();
});
