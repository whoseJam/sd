import * as sd from "@/sd";

import { fadeInGrid, makeGrid } from "../common/grid";
import {
  ACCENT_TEXT,
  fadeIn,
  fadeOpacity,
  LAND,
  NEUTRAL_STROKE,
  OCEAN,
  setFill,
} from "../common/style";

const svg = sd.svg();

const ROWS = 4;
const COLS = 6;
const CELL = 32;
const grid = makeGrid(svg, {
  rows: ROWS,
  cols: COLS,
  cellW: CELL,
  cellH: CELL,
  gap: 3,
  cx: -180,
  cy: 0,
});

const rows: (0 | 1)[][] = [
  [0, 1, 1, 0, 0, 1],
  [1, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 0, 0],
  [1, 0, 1, 0, 1, 1],
];

const oceanSwatch = new sd.Rect({
  targetNode: svg,
  x: 180,
  y: 50 - 14,
  width: 28,
  height: 28,
  fill: OCEAN,
  stroke: OCEAN,
  strokeWidth: 1.2,
  opacity: 0,
});
const oceanLabel = new sd.Math({
  targetNode: svg,
  text: "0\\ \\text{海洋}",
  cx: 250,
  cy: 50,
  fontSize: 18,
  opacity: 0,
});
const landSwatch = new sd.Rect({
  targetNode: svg,
  x: 180,
  y: 0 - 14,
  width: 28,
  height: 28,
  fill: LAND,
  stroke: LAND,
  strokeWidth: 1.2,
  opacity: 0,
});
const landLabel = new sd.Math({
  targetNode: svg,
  text: "1\\ \\text{陆地}",
  cx: 250,
  cy: 0,
  fontSize: 18,
  opacity: 0,
});

const stateXStart = 180;
const stateTexts: sd.Text[] = rows.map((bits, r) => {
  const text = bits.join("");
  return new sd.Text({
    targetNode: svg,
    text,
    cx: stateXStart + 60,
    cy: grid.cyOf(r),
    fontSize: 20,
    fill: NEUTRAL_STROKE,
    opacity: 0,
  });
});

sd.main(async () => {
  fadeInGrid(grid, 0, 12);
  fadeIn(oceanSwatch, 200);
  fadeIn(oceanLabel, 260);
  fadeIn(landSwatch, 280);
  fadeIn(landLabel, 340);
  await sd.pause();

  for (let r = 0; r < ROWS; r++) {
    fadeIn(stateTexts[r]);
    await sd.pause();
    for (let c = 0; c < COLS; c++) {
      const color = rows[r][c] === 0 ? OCEAN : LAND;
      setFill(grid.cells[r][c].bg, color, c * 50);
    }
    stateTexts[r]
      .startAnimate({ delay: 60, duration: 320 })
      .setFill(ACCENT_TEXT)
      .endAnimate();
    fadeOpacity(stateTexts[r], 0.6, 400);
  }
  await sd.pause();
});
