import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const data = [2, 5, 4, 1, 2, 3, 6, 2, 4, 1, 4, 1, 5];
const N = data.length;
const SIZE = 32;
const X0 = -(N * SIZE) / 2;

const arr = new NumRow({
  targetNode: svg,
  values: data,
  size: SIZE,
  x: X0,
  y: 30,
  label: "A",
});

function findRight(start: number): number {
  const seen = new Set<number>();
  for (let i = start; i < N; i++) {
    if (seen.has(data[i])) return i - 1;
    seen.add(data[i]);
  }
  return N - 1;
}

const Fl: number[] = [];
for (let i = 0; i < N; i++) Fl.push(findRight(i));

const fRow = new NumRow({
  targetNode: svg,
  values: Fl.map((v) => v + 1),
  size: SIZE,
  x: X0,
  y: -30 - SIZE,
  label: "F",
});

sd.main(async () => {
  arr.fadeIn({ delay: 0 });
  fRow.fadeIn({ delay: 200 });
  await sd.pause();

  let firstStep = true;
  for (let i = 1; i <= N; i++) {
    const base = firstStep ? 0 : 220;
    firstStep = false;
    const right = Fl[i - 1] + 1;
    for (let k = i; k <= right; k++)
      arr.paintCell(k, "#e8f5e9", C.darkGreen, {
        delay: base + (k - i) * 30,
        duration: 200,
      });
    fRow.paintCell(i, "#fdecd9", C.darkOrange, {
      delay: base + 60,
      duration: 200,
    });
    await sd.pause();
    for (let k = i; k <= right; k++) arr.clearCell(k, { duration: 160 });
    fRow.clearCell(i, { duration: 160 });
  }
  void E;
  await sd.pause();
});
