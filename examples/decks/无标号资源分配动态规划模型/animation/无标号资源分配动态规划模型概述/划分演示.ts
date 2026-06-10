import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 8;
const CELL = 26;
const GAP = 4;
const STEP = CELL + GAP;
const DUR = 320;

const FILL = C.darkOrange;
const NEUTRAL = C.darkButtonGrey;

const PARTITIONS: number[][] = [
  [6, 1, 1],
  [5, 2, 1],
  [4, 3, 1],
  [4, 2, 2],
  [3, 3, 2],
  [4, 4],
];

const GRID_LEFT = -((N - 1) * STEP) / 2 + 80;

const title = new sd.Text({
  targetNode: svg,
  text: "8 = ",
  cx: GRID_LEFT - 110,
  cy: 0,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});
const equation = new sd.Text({
  targetNode: svg,
  text: PARTITIONS[0].join(" + "),
  cx: GRID_LEFT - 55,
  cy: 0,
  fontSize: 18,
  fill: FILL,
  opacity: 0,
});

let cells: sd.Rect[] = [];

function renderPartition(p: number[], delay: number) {
  for (const c of cells) {
    c.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setOpacity(0)
      .endAnimate();
  }
  cells = [];
  const start = delay + DUR - 80;
  const rows = p.length;
  for (let r = 0; r < rows; r++) {
    const cy = ((rows - 1) / 2 - r) * STEP;
    for (let c = 0; c < p[r]; c++) {
      const cx = GRID_LEFT + c * STEP + CELL / 2;
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
          delay: start + (r * 4 + c) * 25,
          duration: DUR,
          easing: E.easeOut,
        })
        .setOpacity(1)
        .endAnimate();
      cells.push(rect);
    }
  }
  equation
    .startAnimate({ delay: start, duration: DUR, easing: E.easeOut })
    .setText(p.join(" + "))
    .endAnimate();
}

sd.main(async () => {
  title
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  equation
    .startAnimate({ delay: 80, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  renderPartition(PARTITIONS[0], 60);
  await sd.pause();
  for (let i = 1; i < PARTITIONS.length; i++) {
    renderPartition(PARTITIONS[i], 0);
    await sd.pause();
  }
});
