import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const F_COLOR = C.steelBlue;
const BLOCK_BG = "#fdecd9";
const ANSWER_BG = C.darkOrange;

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

const blocked: boolean[][] = [];
for (let i = 0; i < N; i++) blocked.push(new Array(M).fill(false));
blocked[HORSE_I - 1][HORSE_J - 1] = true;
for (const [di, dj] of KNIGHT_MOVES) {
  const ni = HORSE_I + di;
  const nj = HORSE_J + dj;
  if (ni >= 1 && ni <= N && nj >= 1 && nj <= M) blocked[ni - 1][nj - 1] = true;
}

const f: number[][] = [];
for (let i = 0; i < N; i++) f.push(new Array(M).fill(0));
if (!blocked[0][0]) f[0][0] = 1;
for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    if (i === 0 && j === 0) continue;
    if (blocked[i][j]) continue;
    let v = 0;
    if (i > 0) v += f[i - 1][j];
    if (j > 0) v += f[i][j - 1];
    f[i][j] = v;
  }
}

const CELL = 32;
const GAP = 2;
const STEP = CELL + GAP;
const cxOf = (j: number) => (j - (M + 1) / 2) * STEP;
const cyOf = (i: number) => ((N + 1) / 2 - i) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[][] = [];
for (let i = 0; i < N; i++) {
  const row: Cell[] = [];
  for (let j = 0; j < M; j++) {
    const cx = cxOf(j + 1);
    const cy = cyOf(i + 1);
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
      text: new sd.Text({
        targetNode: svg,
        text: blocked[i][j] ? "×" : String(f[i][j]),
        cx,
        cy,
        fontSize: 13,
        fill: blocked[i][j] ? NEUTRAL : F_COLOR,
        opacity: 0,
      }),
    });
  }
  cells.push(row);
}

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
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (blocked[i][j]) {
        setFill(cells[i][j].bg, BLOCK_BG, 700);
        fadeIn(cells[i][j].text, 780);
      }
    }
  }
  await sd.pause();

  for (let i = 0; i < N; i++) {
    let dd = 0;
    for (let j = 0; j < M; j++) {
      if (!blocked[i][j]) fadeIn(cells[i][j].text, dd);
      dd += 50;
    }
    await sd.pause();
  }

  setFill(cells[N - 1][M - 1].bg, ANSWER_BG);
  setFill(cells[N - 1][M - 1].text, "#ffffff", 60);
  await sd.pause();
});
