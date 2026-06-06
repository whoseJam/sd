import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// now[x] = actual color stored.
const entries = [
  { x: 1, color: 2 },
  { x: 2, color: 1 },
  { x: 3, color: 3 },
];

const SIZE = 50;
const X0 = -(entries.length * SIZE) / 2;

for (let i = 0; i < entries.length; i++) {
  const { x, color } = entries[i];
  const cellX = X0 + i * SIZE;
  new sd.Rect({
    targetNode: svg,
    x: cellX,
    y: -SIZE / 2,
    width: SIZE,
    height: SIZE,
    fill: C.white,
    stroke: C.silver,
    strokeWidth: 1,
  });
  new sd.Text({
    targetNode: svg,
    text: String(color),
    cx: cellX + SIZE / 2,
    cy: 0,
    fontSize: 16,
    fill: C.darkButtonGrey,
  });
  new sd.Math({
    targetNode: svg,
    text: `\\text{now}[${x}]`,
    cx: cellX + SIZE / 2,
    cy: SIZE / 2 + 18,
    fontSize: 13,
    fill: C.darkButtonGrey,
  });
}

new sd.Text({
  targetNode: svg,
  text: "色号 x → 实际存储颜色",
  cx: 0,
  cy: -SIZE / 2 - 22,
  fontSize: 13,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  await sd.pause();
});
