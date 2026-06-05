import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";

const svg = sd.svg();
const C = sd.color();

const data = [3, 1, 4, 1, 5, 9, 2, 6];
const SIZE = 38;
const row = new CharRow({
  targetNode: svg,
  text: data.map(String).join(""),
  size: SIZE,
  x: -(data.length * SIZE) / 2,
  y: 0,
  label: "a",
});

for (let i = 1; i <= data.length; i++) {
  new sd.Text({
    targetNode: svg,
    text: String(i),
    cx: row.cellCx(i),
    cy: -14,
    fontSize: 11,
    fill: C.darkButtonGrey,
  });
}

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();
});
