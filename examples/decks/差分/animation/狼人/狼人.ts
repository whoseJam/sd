import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const c = [
  0, 0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1, 0, 1, 2, 3, 2, 1, 0, 0, 0,
];
const d1 = c.map((v, i) => (i === 0 ? v : v - c[i - 1]));
const d2 = d1.map((v, i) => (i === 0 ? v : v - d1[i - 1]));

const SIZE = 30;
const X0 = -(c.length * SIZE) / 2;

const cR = new NumRow({
  targetNode: svg,
  values: c,
  size: SIZE,
  x: X0,
  y: 60,
  label: "c",
  labelGap: 30,
});
const d1R = new NumRow({
  targetNode: svg,
  values: d1.map(() => " "),
  size: SIZE,
  x: X0,
  y: 0,
  label: "D(c)",
  labelGap: 36,
});
const d2R = new NumRow({
  targetNode: svg,
  values: d2.map(() => " "),
  size: SIZE,
  x: X0,
  y: -60 - SIZE,
  label: "D²(c)",
  labelGap: 40,
});

sd.main(async () => {
  cR.fadeIn({ delay: 0 });
  await sd.pause();

  d1R.fadeInLabel();
  for (let i = 1; i <= c.length; i++) {
    d1R.setValue(i, d1[i - 1], { delay: i * 30 });
    if (d1[i - 1] !== 0)
      d1R.paintCell(i, "#fdecd9", C.darkOrange, {
        delay: i * 30,
        duration: 180,
      });
    d1R.fadeInCell(i, { delay: i * 30 });
  }
  await sd.pause();

  d2R.fadeInLabel();
  for (let i = 1; i <= c.length; i++) {
    d2R.setValue(i, d2[i - 1], { delay: i * 30 });
    if (d2[i - 1] !== 0)
      d2R.paintCell(i, "#dbeefd", C.steelBlue, {
        delay: i * 30,
        duration: 180,
      });
    d2R.fadeInCell(i, { delay: i * 30 });
  }
  await sd.pause();
});
