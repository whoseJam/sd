import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const c = [0, 0, 2, 3, 4, 5, 0, 0, 0];
const dRow = c.map((v, i) => (i === 0 ? v : v - c[i - 1]));
const ddRow = dRow.map((v, i) => (i === 0 ? v : v - dRow[i - 1]));

const SIZE = 44;
const X0 = -(c.length * SIZE) / 2;

const cR = new NumRow({
  targetNode: svg,
  values: c,
  size: SIZE,
  x: X0,
  y: 60,
  label: "c",
});
const dR = new NumRow({
  targetNode: svg,
  values: dRow.map(() => " "),
  size: SIZE,
  x: X0,
  y: 0,
  label: "D(c)",
  labelGap: 36,
});
const ddR = new NumRow({
  targetNode: svg,
  values: ddRow.map(() => " "),
  size: SIZE,
  x: X0,
  y: -60 - SIZE,
  label: "D²(c)",
  labelGap: 44,
});

sd.main(async () => {
  cR.fadeIn({ delay: 0 });
  await sd.pause();

  dR.fadeInLabel();
  for (let i = 1; i <= c.length; i++) {
    dR.setValue(i, dRow[i - 1], { delay: i * 60 });
    if (dRow[i - 1] !== 0) dR.paintCell(i, "#fdecd9", C.darkOrange, { delay: i * 60, duration: 200 });
    dR.fadeInCell(i, { delay: i * 60 });
  }
  await sd.pause();

  ddR.fadeInLabel();
  for (let i = 1; i <= c.length; i++) {
    ddR.setValue(i, ddRow[i - 1], { delay: i * 60 });
    if (ddRow[i - 1] !== 0) ddR.paintCell(i, "#dbeefd", C.steelBlue, { delay: i * 60, duration: 200 });
    ddR.fadeInCell(i, { delay: i * 60 });
  }
  await sd.pause();
});
