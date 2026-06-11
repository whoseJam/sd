import * as sd from "@/sd";

import { fadeInGrid, makeGrid } from "../common/grid";
import { fadeIn, NEUTRAL_STROKE } from "../common/style";

const svg = sd.svg();

const ROWS = 2;
const COLS = 4;
const CELL = 44;
const GAP = 3;

const left = makeGrid(svg, {
  rows: ROWS,
  cols: COLS,
  cellW: CELL,
  cellH: CELL,
  gap: GAP,
  cx: -150,
  cy: 0,
});
const right = makeGrid(svg, {
  rows: ROWS,
  cols: COLS,
  cellW: CELL,
  cellH: CELL,
  gap: GAP,
  cx: 150,
  cy: 0,
});

interface Domino {
  r: number;
  c: number;
  horizontal: boolean;
}

const colors = ["#b4610e", "#3a7a5a", "#4a6fa5", "#a05a3a"];

function drawDominoes(
  grid: ReturnType<typeof makeGrid>,
  dominoes: Domino[],
): sd.Rect[] {
  return dominoes.map((d, i) => {
    const c1 = grid.cells[d.r][d.c];
    const c2 = d.horizontal
      ? grid.cells[d.r][d.c + 1]
      : grid.cells[d.r + 1][d.c];
    const cx = (c1.cx + c2.cx) / 2;
    const cy = (c1.cy + c2.cy) / 2;
    const w = d.horizontal ? 2 * CELL + GAP - 8 : CELL - 8;
    const h = d.horizontal ? CELL - 8 : 2 * CELL + GAP - 8;
    return new sd.Rect({
      targetNode: svg,
      x: cx - w / 2,
      y: cy - h / 2,
      width: w,
      height: h,
      fill: colors[i % colors.length],
      stroke: colors[i % colors.length],
      strokeWidth: 1.5,
      opacity: 0,
    });
  });
}

const tilingA: Domino[] = [
  { r: 0, c: 0, horizontal: true },
  { r: 0, c: 2, horizontal: true },
  { r: 1, c: 0, horizontal: true },
  { r: 1, c: 2, horizontal: true },
];
const tilingB: Domino[] = [
  { r: 0, c: 0, horizontal: false },
  { r: 0, c: 1, horizontal: true },
  { r: 1, c: 1, horizontal: true },
  { r: 0, c: 3, horizontal: false },
];

const aDominoes = drawDominoes(left, tilingA);
const bDominoes = drawDominoes(right, tilingB);

const noteA = new sd.Math({
  targetNode: svg,
  text: "\\text{方案}\\ 1",
  cx: left.cxOf((COLS - 1) / 2),
  cy: left.cyOf(ROWS - 1) - CELL,
  fontSize: 16,
  fill: NEUTRAL_STROKE,
  opacity: 0,
});
const noteB = new sd.Math({
  targetNode: svg,
  text: "\\text{方案}\\ 2",
  cx: right.cxOf((COLS - 1) / 2),
  cy: right.cyOf(ROWS - 1) - CELL,
  fontSize: 16,
  fill: NEUTRAL_STROKE,
  opacity: 0,
});

sd.main(async () => {
  fadeInGrid(left, 0, 18);
  fadeInGrid(right, 100, 18);
  await sd.pause();

  for (let i = 0; i < aDominoes.length; i++) fadeIn(aDominoes[i], i * 90);
  fadeIn(noteA, aDominoes.length * 90 + 100);
  await sd.pause();

  for (let i = 0; i < bDominoes.length; i++) fadeIn(bDominoes[i], i * 90);
  fadeIn(noteB, bDominoes.length * 90 + 100);
  await sd.pause();
});
