import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// A "boring" sequence — a repeated value 1 1 1 1 1 1 leaves every
// subinterval of length ≥ 2 non-unique. Highlight a 2-length subwindow
// that fails to be unique.
const N = 8;
const UNIT = 60;
const X0 = (-N * UNIT) / 2;
const Y0 = -UNIT / 2;
const cellX = (i) => X0 + i * UNIT;

const seq = [2, 1, 1, 1, 1, 1, 1, 3];

sd.init(() => {
  for (let i = 0; i < N; i++) {
    new sd.Rect({
      targetNode: svg,
      x: cellX(i),
      y: Y0,
      width: UNIT,
      height: UNIT,
      fill: C.white,
      stroke: "#aaa",
      strokeWidth: 1.5,
    });
    new sd.Text({
      targetNode: svg,
      text: String(seq[i]),
      cx: cellX(i) + UNIT / 2,
      cy: 0,
      fontSize: 30,
      fill: "#222",
    });
  }
});

sd.main(async () => {
  await sd.pause();

  // Slide a length-2 window over the middle repeating block; each position
  // contains identical 1s, so the subinterval is not unique.
  const win = new sd.Rect({
    targetNode: svg,
    x: cellX(1),
    y: Y0,
    width: 2 * UNIT,
    height: UNIT,
    fill: "#f14c4c",
    fillOpacity: 0,
    stroke: "#f14c4c",
    strokeWidth: 2,
    strokeOpacity: 0,
  });
  win
    .startAnimate({ duration: 400 })
    .setFillOpacity(0.18)
    .setStrokeOpacity(1)
    .endAnimate();
  await sd.pause();

  for (let i = 2; i <= 4; i++) {
    win.startAnimate({ duration: 500 }).setX(cellX(i)).endAnimate();
    await sd.pause();
  }
});
