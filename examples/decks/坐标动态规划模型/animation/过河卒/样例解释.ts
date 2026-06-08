import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const START = C.steelBlue;
const END = C.darkOrange;
const HORSE = C.crimson;
const ATTACK = "#fdecd9";

const N = 7;
const M = 7;
const HORSE_I = 4;
const HORSE_J = 4;

const KNIGHT_MOVES: Array<[number, number]> = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];

const blocked = new Set<string>();
blocked.add(`${HORSE_I},${HORSE_J}`);
for (const [di, dj] of KNIGHT_MOVES) {
  const ni = HORSE_I + di;
  const nj = HORSE_J + dj;
  if (ni >= 1 && ni <= N && nj >= 1 && nj <= M) blocked.add(`${ni},${nj}`);
}

const CELL = 32;
const GAP = 2;
const STEP = CELL + GAP;

const cxOf = (j: number) => (j - (M + 1) / 2) * STEP;
const cyOf = (i: number) => ((N + 1) / 2 - i) * STEP;

interface Cell {
  bg: sd.Rect;
}
const cells: Cell[][] = [];
for (let i = 1; i <= N; i++) {
  const row: Cell[] = [];
  for (let j = 1; j <= M; j++) {
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

const startLabel = new sd.Text({
  targetNode: svg,
  text: "S",
  cx: cxOf(1),
  cy: cyOf(1),
  fontSize: 16,
  fill: START,
  opacity: 0,
});
const endLabel = new sd.Text({
  targetNode: svg,
  text: "T",
  cx: cxOf(M),
  cy: cyOf(N),
  fontSize: 16,
  fill: END,
  opacity: 0,
});
const horseLabel = new sd.Text({
  targetNode: svg,
  text: "马",
  cx: cxOf(HORSE_J),
  cy: cyOf(HORSE_I),
  fontSize: 14,
  fill: HORSE,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}
function setFill(el: sd.Rect | sd.Text, color: string, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

sd.main(async () => {
  let d = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      fadeIn(cells[i][j].bg, d);
      d += 18;
    }
  }
  await sd.pause();

  fadeIn(startLabel, 0);
  fadeIn(endLabel, 80);
  await sd.pause();

  setFill(cells[HORSE_I - 1][HORSE_J - 1].bg, HORSE);
  fadeIn(horseLabel, 60);
  await sd.pause();

  let kd = 0;
  for (const key of blocked) {
    const [i, j] = key.split(",").map(Number);
    if (i === HORSE_I && j === HORSE_J) continue;
    setFill(cells[i - 1][j - 1].bg, ATTACK, kd);
    kd += 60;
  }
  await sd.pause();
});
