import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const P1_COLOR = C.steelBlue;
const P2_COLOR = C.teal;
const TEXT_DARK = C.darkButtonGrey;
const TEXT_LIGHT = "#ffffff";
const BAD_COLOR = "#888888";
const GOOD_COLOR = C.darkOrange;

const data = [
  [10, 10, 20],
  [0, 10, 0],
  [20, 10, 10],
];
const greedyPath1: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [2, 2],
];
const greedyData2 = data.map((row) => row.slice());
for (const [pi, pj] of greedyPath1) greedyData2[pi][pj] = 0;
const greedyPath2: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];
const jointPath1: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];
const jointPath2: Array<[number, number]> = [
  [1, 0],
  [2, 0],
  [2, 1],
];

const ROWS = 3;
const COLS = 3;
const CELL = 40;
const GAP = 3;
const STEP = CELL + GAP;

const LEFT_CX = -200;
const RIGHT_CX = 200;
const TOP_CY = 60;
const BOTTOM_CY = -60;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}

function buildGrid(
  values: number[][],
  gridCx: number,
  gridCy: number,
): Cell[][] {
  const out: Cell[][] = [];
  for (let i = 0; i < ROWS; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < COLS; j++) {
      const cx = gridCx + (j - (COLS - 1) / 2) * STEP;
      const cy = gridCy + ((ROWS - 1) / 2 - i) * STEP;
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
          text: String(values[i][j]),
          cx,
          cy,
          fontSize: 14,
          fill: TEXT_DARK,
          opacity: 0,
        }),
      });
    }
    out.push(row);
  }
  return out;
}

const greedyGrid1 = buildGrid(data, LEFT_CX, TOP_CY);
const greedyGrid2 = buildGrid(greedyData2, LEFT_CX, BOTTOM_CY);
const jointGrid = buildGrid(data, RIGHT_CX, 0);

const greedyLabel = new sd.Math({
  targetNode: svg,
  text: "50 + 20 = 70",
  cx: LEFT_CX + 110,
  cy: BOTTOM_CY - 60,
  fontSize: 15,
  fill: BAD_COLOR,
  opacity: 0,
});
const jointLabel = new sd.Math({
  targetNode: svg,
  text: "80",
  cx: RIGHT_CX + 90,
  cy: -10,
  fontSize: 18,
  fill: GOOD_COLOR,
  opacity: 0,
});

const greedyTitle = new sd.Text({
  targetNode: svg,
  text: "贪心：清零 + 再来一遍",
  cx: LEFT_CX,
  cy: 140,
  fontSize: 14,
  fill: BAD_COLOR,
  opacity: 0,
});
const jointTitle = new sd.Text({
  targetNode: svg,
  text: "联合：两条路径同时走",
  cx: RIGHT_CX,
  cy: 90,
  fontSize: 14,
  fill: GOOD_COLOR,
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

function paintPath(
  g: Cell[][],
  path: Array<[number, number]>,
  color: string,
  baseDelay: number,
) {
  let d = baseDelay;
  for (const [pi, pj] of path) {
    setFill(g[pi][pj].bg, color, d);
    setFill(g[pi][pj].text, TEXT_LIGHT, d + 60);
    d += 50;
  }
}

sd.main(async () => {
  let d = 0;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      fadeIn(greedyGrid1[i][j].bg, d);
      fadeIn(greedyGrid1[i][j].text, d + 40);
      fadeIn(greedyGrid2[i][j].bg, d + 100);
      fadeIn(greedyGrid2[i][j].text, d + 140);
      fadeIn(jointGrid[i][j].bg, d + 200);
      fadeIn(jointGrid[i][j].text, d + 240);
      d += 30;
    }
  }
  fadeIn(greedyTitle, 600);
  fadeIn(jointTitle, 600);
  await sd.pause();

  paintPath(greedyGrid1, greedyPath1, P1_COLOR, 0);
  paintPath(greedyGrid2, greedyPath2, P2_COLOR, 100);
  fadeIn(greedyLabel, 500);
  await sd.pause();

  paintPath(jointGrid, jointPath1, P1_COLOR, 0);
  paintPath(jointGrid, jointPath2, P2_COLOR, 200);
  setFill(jointGrid[0][0].bg, GOOD_COLOR, 600);
  setFill(jointGrid[2][2].bg, GOOD_COLOR, 600);
  fadeIn(jointLabel, 800);
  await sd.pause();
});
