import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// n = 12. Floor values:
// i:    1  2  3  4  5  6  7  8  9 10 11 12
// ⌊n/i⌋: 12  6  4  3  2  2  1  1  1  1  1  1
// Blocks: [1] [2] [3] [4] [5,6] [7,8,9,10,11,12] — 6 blocks.
const N = 12;
const VALUES = Array.from({ length: N }, (_, i) => Math.floor(N / (i + 1)));

// Group into blocks of consecutive equal values.
const BLOCKS: Array<{ start: number; end: number; value: number }> = [];
{
  let l = 0;
  while (l < N) {
    let r = l;
    while (r + 1 < N && VALUES[r + 1] === VALUES[l]) r++;
    BLOCKS.push({ start: l, end: r, value: VALUES[l] });
    l = r + 1;
  }
}

const CELL_W = 22;
const CELL_H = 26;
const CELL_GAP = 2;
const ROW_Y = 0;
const I_LABEL_Y = 32;

function cellCx(i: number): number {
  const totalW = N * CELL_W + (N - 1) * CELL_GAP;
  const x0 = -totalW / 2 + CELL_W / 2;
  return x0 + i * (CELL_W + CELL_GAP);
}

const ODD_FILL = "#fdecd9";
const ODD_STROKE = C.darkOrange;
const EVEN_FILL = "#e3f2fd";
const EVEN_STROKE = C.steelBlue;

const cellBgs: sd.Rect[] = [];
const cellTexts: sd.Text[] = [];
const iLabels: sd.Text[] = [];

for (let i = 0; i < N; i++) {
  const cx = cellCx(i);
  cellBgs.push(
    new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2, y: ROW_Y - CELL_H / 2,
      width: CELL_W, height: CELL_H,
      fill: C.white,
      stroke: C.silver,
      strokeWidth: 0.8,
      rx: 3, ry: 3,
      opacity: 0,
    }),
  );
  cellTexts.push(
    new sd.Text({
      targetNode: svg,
      text: String(VALUES[i]),
      cx, cy: ROW_Y - 1,
      fontSize: 12,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
  iLabels.push(
    new sd.Text({
      targetNode: svg,
      text: String(i + 1),
      cx, cy: I_LABEL_Y - 1,
      fontSize: 9,
      fill: C.silver,
      opacity: 0,
    }),
  );
}

const summary = new sd.Text({
  targetNode: svg,
  text: `${BLOCKS.length} 块  ≤  O(√n)`,
  cx: 0, cy: -45,
  fontSize: 13,
  fill: C.darkOrange,
  opacity: 0,
});

sd.main(async () => {
  // p1: cells + i labels + floor values
  for (let i = 0; i < N; i++) {
    const d = i * 50;
    cellBgs[i].startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    cellTexts[i].startAnimate({ delay: d + 80, duration: 240, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    iLabels[i].startAnimate({ delay: d + 40, duration: 240, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();

  // p2: paint blocks (alternating tints) so the grouping reads at a glance.
  for (let b = 0; b < BLOCKS.length; b++) {
    const { start, end } = BLOCKS[b];
    const fill = b % 2 === 0 ? ODD_FILL : EVEN_FILL;
    const stroke = b % 2 === 0 ? ODD_STROKE : EVEN_STROKE;
    for (let i = start; i <= end; i++) {
      const d = b * 200 + (i - start) * 40;
      cellBgs[i].startAnimate({ delay: d, duration: 280, easing: E.easeOut })
        .setFill(fill).setStroke(stroke).setStrokeWidth(1.2)
        .endAnimate();
    }
  }
  await sd.pause();

  // p3: the punchline: block count is small.
  summary.startAnimate({ duration: 400, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();
});
