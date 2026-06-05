import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const aData = [3, 1, 4, 1, 5, 9, 2];
const bData = [2, 7, 1, 8, 2, 8, 1];
const cData = aData.map((v, i) => v + bData[i]);

const SIZE = 44;
const X0 = -(aData.length * SIZE) / 2;

const a = new NumRow({
  targetNode: svg,
  values: aData,
  size: SIZE,
  x: X0,
  y: 60,
  label: "a",
});
const b = new NumRow({
  targetNode: svg,
  values: bData,
  size: SIZE,
  x: X0,
  y: 0,
  label: "b",
});
const c = new NumRow({
  targetNode: svg,
  values: cData.map(() => " "),
  size: SIZE,
  x: X0,
  y: -60 - SIZE,
  label: "c",
});

const plus = new sd.Math({
  targetNode: svg,
  text: "+",
  cx: X0 - 50,
  cy: 30,
  fontSize: 20,
  fill: C.darkButtonGrey,
  opacity: 0,
});
const eq = new sd.Math({
  targetNode: svg,
  text: "=",
  cx: X0 - 50,
  cy: -30 - SIZE / 2,
  fontSize: 20,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  a.fadeIn({ delay: 0 });
  b.fadeIn({ delay: 200 });
  plus.startAnimate({ delay: 240, duration: 220, easing: E.easeOut }).setOpacity(1).endAnimate();
  c.fadeIn({ delay: 400 });
  eq.startAnimate({ delay: 440, duration: 220, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();

  for (let i = 1; i <= aData.length; i++) {
    a.paintCell(i, "#dbeefd", C.steelBlue, { duration: 180 });
    b.paintCell(i, "#dbeefd", C.steelBlue, { duration: 180 });
    c.setValue(i, cData[i - 1], { delay: 100 });
    c.paintCell(i, "#e8f5e9", C.darkGreen, { delay: 100, duration: 180 });
    await sd.pause();
    a.clearCell(i, { duration: 140 });
    b.clearCell(i, { duration: 140 });
    c.clearCell(i, { duration: 140 });
  }
  await sd.pause();
});
