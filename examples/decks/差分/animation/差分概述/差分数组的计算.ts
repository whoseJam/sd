import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();

const data = [1, 3, 2, 5, 3, 5, 3, 4, 6, 3, 4, 1];
const diff = data.map((v, i) => (i === 0 ? v : v - data[i - 1]));

const SIZE = 40;
const X0 = -(data.length * SIZE) / 2;

const a = new NumRow({
  targetNode: svg,
  values: data,
  size: SIZE,
  x: X0,
  y: 30,
  label: "a",
});

const d = new NumRow({
  targetNode: svg,
  values: data.map(() => " "),
  size: SIZE,
  x: X0,
  y: -30 - SIZE,
  label: "d",
});

const ORANGE = "#fdecd9";
const BLUE = "#dbeefd";
const FILLED = "#e8f5e9";

sd.main(async () => {
  a.fadeIn({ delay: 0 });
  d.fadeIn({ delay: 200 });
  await sd.pause();

  for (let i = 1; i <= data.length; i++) {
    if (i >= 3) a.clearCell(i - 2, { duration: 160 });
    if (i >= 2) {
      d.paintCell(i - 1, FILLED, C.darkGreen, { duration: 160 });
      a.paintCell(i - 1, ORANGE, C.darkOrange, { duration: 200 });
    }
    a.paintCell(i, BLUE, C.steelBlue, { duration: 200 });
    d.setValue(i, diff[i - 1], { delay: 120, duration: 220 });
    d.paintCell(i, BLUE, C.steelBlue, { delay: 120, duration: 200 });
    await sd.pause();
  }
});
