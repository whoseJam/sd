import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const CELL = 22;
const GAP = 3;
const STEP = CELL + GAP;
const DUR = 280;
const FILL = C.darkOrange;
const NEUTRAL = C.darkButtonGrey;

const PARTITIONS: number[][] = [[5], [4, 1], [3, 2], [3, 1, 1], [2, 2, 1]];
const SLOT_W = 180;
const BOTTOM_Y = -30;

const title = new sd.Text({
  targetNode: svg,
  text: "n = 5,  m = 3",
  cx: 0,
  cy: 110,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});

function placeFerrers(p: number[], slotIdx: number, t0: number) {
  const baseX = (slotIdx - 2) * SLOT_W;
  const rows = p.length;
  const widest = p[0];
  for (let r = 0; r < rows; r++) {
    const cy = BOTTOM_Y + (rows - 1 - r) * STEP;
    for (let c = 0; c < p[r]; c++) {
      const cx = baseX - ((widest - 1) * STEP) / 2 + c * STEP;
      const rect = new sd.Rect({
        targetNode: svg,
        x: cx - CELL / 2,
        y: cy - CELL / 2,
        width: CELL,
        height: CELL,
        fill: FILL,
        stroke: "none",
        opacity: 0,
      });
      rect
        .startAnimate({
          delay: t0 + (r * 5 + c) * 30,
          duration: DUR,
          easing: E.easeOut,
        })
        .setOpacity(1)
        .endAnimate();
    }
  }
  const label = new sd.Text({
    targetNode: svg,
    text: "{" + p.join(", ") + "}",
    cx: baseX,
    cy: BOTTOM_Y - 60,
    fontSize: 16,
    fill: NEUTRAL,
    opacity: 0,
  });
  label
    .startAnimate({ delay: t0 + 320, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  title
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  for (let i = 0; i < PARTITIONS.length; i++) {
    placeFerrers(PARTITIONS[i], i, 200 + i * 250);
  }
  await sd.pause();
});
