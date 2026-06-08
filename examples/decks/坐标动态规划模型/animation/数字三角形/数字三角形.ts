import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const A_COLOR = C.darkButtonGrey;
const F_COLOR = C.steelBlue;
const PATH_BG = C.darkOrange;
const PATH_TEXT = "#ffffff";

const a = [[7], [3, 8], [8, 1, 0], [2, 7, 4, 4], [4, 5, 2, 6, 5]];

const ROWS = a.length;

const f: number[][] = [];
for (let i = 0; i < ROWS; i++) f.push(new Array(a[i].length).fill(0));
f[0][0] = a[0][0];
for (let i = 1; i < ROWS; i++) {
  for (let j = 0; j <= i; j++) {
    let best = -Infinity;
    if (j - 1 >= 0) best = Math.max(best, f[i - 1][j - 1]);
    if (j < i) best = Math.max(best, f[i - 1][j]);
    f[i][j] = best + a[i][j];
  }
}

const path: Array<[number, number]> = [];
{
  let bestJ = 0;
  for (let j = 1; j < ROWS; j++)
    if (f[ROWS - 1][j] > f[ROWS - 1][bestJ]) bestJ = j;
  path.unshift([ROWS - 1, bestJ]);
  for (let i = ROWS - 1; i > 0; i--) {
    const [ci, cj] = path[0];
    let pj = cj;
    if (cj - 1 >= 0 && (cj >= i || f[ci - 1][cj - 1] >= f[ci - 1][cj]))
      pj = cj - 1;
    path.unshift([i - 1, pj]);
  }
}

const CELL_W = 50;
const CELL_H = 44;
const CELL_GAP_X = 6;
const ROW_GAP = 8;
const STEP_X = CELL_W + CELL_GAP_X;
const STEP_Y = CELL_H + ROW_GAP;

const cxOf = (i: number, j: number) => (j - i / 2) * STEP_X;
const cyOf = (i: number) => ((ROWS - 1) / 2 - i) * STEP_Y;

interface Cell {
  bg: sd.Rect;
  aText: sd.Text;
  fText: sd.Text;
}
const cells: Cell[][] = [];
for (let i = 0; i < ROWS; i++) {
  const row: Cell[] = [];
  for (let j = 0; j <= i; j++) {
    const cx = cxOf(i, j);
    const cy = cyOf(i);
    row.push({
      bg: new sd.Rect({
        targetNode: svg,
        x: cx - CELL_W / 2,
        y: cy - CELL_H / 2,
        width: CELL_W,
        height: CELL_H,
        fill: "none",
        stroke: NEUTRAL,
        strokeWidth: 1,
        opacity: 0,
      }),
      aText: new sd.Text({
        targetNode: svg,
        text: String(a[i][j]),
        cx,
        cy: cy + 8,
        fontSize: 14,
        fill: A_COLOR,
        opacity: 0,
      }),
      fText: new sd.Text({
        targetNode: svg,
        text: String(f[i][j]),
        cx,
        cy: cy - 10,
        fontSize: 13,
        fill: F_COLOR,
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
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j <= i; j++) {
      fadeIn(cells[i][j].bg, d);
      fadeIn(cells[i][j].aText, d + 40);
      d += 30;
    }
  }
  await sd.pause();

  for (let i = 0; i < ROWS; i++) {
    let dd = 0;
    for (let j = 0; j <= i; j++) {
      fadeIn(cells[i][j].fText, dd);
      dd += 70;
    }
    await sd.pause();
  }

  for (const [pi, pj] of path) {
    setFill(cells[pi][pj].bg, PATH_BG);
    setFill(cells[pi][pj].aText, PATH_TEXT, 60);
    setFill(cells[pi][pj].fText, PATH_TEXT, 60);
  }
  await sd.pause();
});
