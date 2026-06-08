import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const START = C.darkButtonGrey;
const P1_COLOR = C.steelBlue;
const P2_COLOR = C.teal;

const ROWS = 5;
const COLS = 5;
const CELL = 36;
const GAP = 3;
const STEP = CELL + GAP;

const cxOf = (j: number) => (j - (COLS + 1) / 2) * STEP;
const cyOf = (i: number) => ((ROWS + 1) / 2 - i) * STEP;

interface Cell {
  bg: sd.Rect;
}
const cells: Cell[][] = [];
for (let i = 1; i <= ROWS; i++) {
  const row: Cell[] = [];
  for (let j = 1; j <= COLS; j++) {
    const cx = cxOf(j);
    const cy = cyOf(i);
    row.push({
      bg: new sd.Rect({
        targetNode: svg,
        x: cx - CELL / 2,
        y: cy - CELL / 2,
        width: CELL,
        height: CELL,
        fill: "none",
        stroke: NEUTRAL,
        strokeWidth: 1,
        opacity: 0,
      }),
    });
  }
  cells.push(row);
}

const PATH1: Array<[number, number]> = [
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 3],
];
const PATH2: Array<[number, number]> = [
  [1, 1],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
];

const startLabel = new sd.Text({
  targetNode: svg,
  text: "S",
  cx: cxOf(1),
  cy: cyOf(1),
  fontSize: 14,
  fill: START,
  opacity: 0,
});
const p1End = new sd.Math({
  targetNode: svg,
  text: "(x_1,y_1)",
  cx: cxOf(3) + 30,
  cy: cyOf(3) - 22,
  fontSize: 14,
  fill: P1_COLOR,
  opacity: 0,
});
const p2End = new sd.Math({
  targetNode: svg,
  text: "(x_2,y_2)",
  cx: cxOf(4) + 32,
  cy: cyOf(2),
  fontSize: 14,
  fill: P2_COLOR,
  opacity: 0,
});

function makeArrow(
  i1: number,
  j1: number,
  i2: number,
  j2: number,
  color: string,
): sd.Path {
  const x1 = cxOf(j1);
  const y1 = cyOf(i1);
  const x2 = cxOf(j2);
  const y2 = cyOf(i2);
  return new sd.Path({
    targetNode: svg,
    d: `M ${x1} ${y1} L ${x2} ${y2}`,
    stroke: color,
    strokeWidth: 2.5,
    fill: "none",
    opacity: 0,
  });
}

const p1Segs: sd.Path[] = [];
for (let k = 1; k < PATH1.length; k++) {
  const [i1, j1] = PATH1[k - 1];
  const [i2, j2] = PATH1[k];
  p1Segs.push(makeArrow(i1, j1, i2, j2, P1_COLOR));
}

const p2Segs: sd.Path[] = [];
for (let k = 1; k < PATH2.length; k++) {
  const [i1, j1] = PATH2[k - 1];
  const [i2, j2] = PATH2[k];
  p2Segs.push(makeArrow(i1, j1, i2, j2, P2_COLOR));
}

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Path;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  let d = 0;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      fadeIn(cells[i][j].bg, d);
      d += 18;
    }
  }
  fadeIn(startLabel, 700);
  await sd.pause();

  let pd = 0;
  for (const seg of p1Segs) {
    fadeIn(seg, pd);
    pd += 100;
  }
  fadeIn(p1End, pd + 100);
  await sd.pause();

  let pd2 = 0;
  for (const seg of p2Segs) {
    fadeIn(seg, pd2);
    pd2 += 100;
  }
  fadeIn(p2End, pd2 + 100);
  await sd.pause();
});
