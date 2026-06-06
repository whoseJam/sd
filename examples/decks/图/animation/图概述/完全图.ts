import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// Show K1 through K5 side by side.
const Ks = [1, 2, 3, 4, 5];
const groupGap = 130;

for (let kIdx = 0; kIdx < Ks.length; kIdx++) {
  const n = Ks[kIdx];
  const cx0 = (-(Ks.length - 1) * groupGap) / 2 + kIdx * groupGap;
  const r = 32;
  const positions: Array<{ cx: number; cy: number }> = [];
  if (n === 1) {
    positions.push({ cx: cx0, cy: 0 });
  } else {
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      positions.push({
        cx: cx0 + r * Math.cos(angle),
        cy: r * Math.sin(angle),
      });
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      new sd.Line({
        targetNode: svg,
        x1: positions[i].cx,
        y1: positions[i].cy,
        x2: positions[j].cx,
        y2: positions[j].cy,
        stroke: C.darkButtonGrey,
        strokeWidth: 1,
      });
    }
  }
  for (const p of positions) {
    new sd.Circle({
      targetNode: svg,
      cx: p.cx,
      cy: p.cy,
      r: 5,
      fill: C.darkButtonGrey,
      stroke: C.darkButtonGrey,
    });
  }
  new sd.Math({
    targetNode: svg,
    text: `K^{${n}}`,
    cx: cx0,
    cy: 60,
    fontSize: 14,
    fill: C.darkButtonGrey,
  });
}

sd.main(async () => {
  await sd.pause();
});
