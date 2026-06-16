import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const P1_COLOR = C.steelBlue;
const P2_COLOR = C.teal;
const TEXT_DARK = C.darkButtonGrey;
const TEXT_LIGHT = "#ffffff";

const grid = [
  [1, 5, 9],
  [3, 0, 4],
  [7, 1, 5],
];

const path1: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];
const path2: Array<[number, number]> = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
  [2, 2],
];

const ROWS = 3;
const COLS = 3;
const CELL = 44;
const GAP = 4;
const STEP = CELL + GAP;
const GRID_CX = -120;
const GRID_CY = 0;

const cxOf = (j: number) => GRID_CX + (j - (COLS - 1) / 2) * STEP;
const cyOf = (i: number) => GRID_CY + ((ROWS - 1) / 2 - i) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
  value: number;
}
const cells: Cell[][] = [];
for (let i = 0; i < ROWS; i++) {
  const row: Cell[] = [];
  for (let j = 0; j < COLS; j++) {
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
      text: new sd.Text({
        targetNode: svg,
        text: String(grid[i][j]),
        cx,
        cy,
        fontSize: 16,
        fill: TEXT_DARK,
        opacity: 0,
      }),
      value: grid[i][j],
    });
  }
  cells.push(row);
}

const sum1 = grid[0][0] + grid[0][1] + grid[0][2] + grid[1][2] + grid[2][2];
const sum2 = grid[0][0] + grid[1][0] + grid[2][0] + grid[2][1] + grid[2][2];

const TEXT_X = GRID_CX + (COLS / 2) * STEP + 90;

const sum1Label = new sd.Math({
  targetNode: svg,
  text: `\\text{路径}_1=${sum1}`,
  cx: TEXT_X,
  cy: STEP * 0.6,
  fontSize: 18,
  fill: P1_COLOR,
  opacity: 0,
});

const sum2Label = new sd.Math({
  targetNode: svg,
  text: `\\text{路径}_2=${sum2}`,
  cx: TEXT_X,
  cy: -STEP * 0.6,
  fontSize: 18,
  fill: P2_COLOR,
  opacity: 0,
});

const totalLabel = new sd.Math({
  targetNode: svg,
  text: `\\text{合计}=${sum1 + 0 + 3 + 7 + 1 + 0}`,
  cx: TEXT_X,
  cy: -STEP * 1.6,
  fontSize: 18,
  fill: TEXT_DARK,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math;
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
function setText(el: sd.Text, text: string, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setText(text)
    .endAnimate();
}

sd.main(async () => {
  let d = 0;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      fadeIn(cells[i][j].bg, d);
      fadeIn(cells[i][j].text, d + 40);
      d += 40;
    }
  }
  await sd.pause();

  let pd = 0;
  for (const [pi, pj] of path1) {
    setFill(cells[pi][pj].bg, P1_COLOR, pd);
    setFill(cells[pi][pj].text, TEXT_LIGHT, pd + 60);
    pd += 90;
  }
  fadeIn(sum1Label, pd + 100);
  await sd.pause();

  let cd = 0;
  for (const [pi, pj] of path1) {
    setText(cells[pi][pj].text, "0", cd);
    cd += 60;
  }
  await sd.pause();

  let p2d = 0;
  for (const [pi, pj] of path2) {
    setFill(cells[pi][pj].bg, P2_COLOR, p2d);
    setFill(cells[pi][pj].text, TEXT_LIGHT, p2d + 60);
    p2d += 90;
  }
  fadeIn(sum2Label, p2d + 100);
  await sd.pause();

  fadeIn(totalLabel, 100);
  await sd.pause();
});
