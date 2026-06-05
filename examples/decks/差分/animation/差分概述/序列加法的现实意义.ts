import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const aData = [3, 1, 4, 1, 5, 9, 2, 6, 5];
const N = aData.length;
const L = 3;
const R = 6;
const K = 2;
const inc = aData.map((_, i) => (i + 1 >= L && i + 1 <= R ? K : 0));
const aAfter = aData.map((v, i) => v + inc[i]);

const SIZE = 44;
const X0 = -(N * SIZE) / 2;

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
  values: inc.map((v) => (v === 0 ? "" : String(v))),
  size: SIZE,
  x: X0,
  y: 0,
  label: "+",
});
const aP = new NumRow({
  targetNode: svg,
  values: aData.map(() => " "),
  size: SIZE,
  x: X0,
  y: -60 - SIZE,
  label: "a'",
});

const bracket = new sd.Math({
  targetNode: svg,
  text: `[l{=}${L},\\ r{=}${R}],\\ k{=}${K}`,
  cx: 0,
  cy: -60 - SIZE - 36,
  fontSize: 16,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  a.fadeIn({ delay: 0 });
  b.fadeIn({ delay: 200 });
  for (let i = L; i <= R; i++) b.paintCell(i, "#fdecd9", C.darkOrange, { delay: 220, duration: 200 });
  aP.fadeIn({ delay: 400 });
  bracket.startAnimate({ delay: 420, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();

  for (let i = 1; i <= N; i++) {
    aP.setValue(i, aAfter[i - 1], { delay: (i - 1) * 60 });
    if (inc[i - 1] !== 0) {
      aP.paintCell(i, "#dbeefd", C.steelBlue, { delay: (i - 1) * 60, duration: 200 });
    }
  }
  await sd.pause();
});
