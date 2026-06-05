import * as sd from "@/sd";

import { Grid } from "../grid";

// Show that the sample space is every choice of (top-left corner, bottom-
// right corner) on a 4×5 board. Three representative beats cycle through
// distinct sub-rectangles so the viewer reads "any pair of corners gives
// a rectangle"; an exhaustive sweep would be ~150 beats and useless.

const svg = sd.svg();
const C = sd.color();

const ROWS = 4;
const COLS = 5;
const SIZE = 50;

const RECT_FILL = "#dde6ef";
const RECT_STROKE = C.steelBlue;
const BASE_FILL = C.white;
const BASE_STROKE = C.silver;

const grid = new Grid({
  targetNode: svg,
  rows: ROWS,
  cols: COLS,
  cellSize: SIZE,
  rowLabels: ["1", "2", "3", "4"],
  colLabels: ["1", "2", "3", "4", "5"],
});

interface Sample {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
}

const samples: Sample[] = [
  { r1: 1, c1: 1, r2: 2, c2: 3 },
  { r1: 1, c1: 1, r2: 4, c2: 5 },
  { r1: 2, c1: 2, r2: 3, c2: 4 },
  { r1: 3, c1: 3, r2: 4, c2: 5 },
];

sd.main(async () => {
  for (let s = 0; s < samples.length; s++) {
    if (s > 0) grid.clearAll({ fill: BASE_FILL });
    const sample = samples[s];
    grid.paintRange(sample.r1, sample.c1, sample.r2, sample.c2, RECT_FILL, {
      stroke: RECT_STROKE,
      delay: s > 0 ? 240 : 0,
    });
    await sd.pause();
  }
  // Trailing pause keeps the last sample visible; clearAll's stroke is the
  // base stroke so the cells re-blend into the grid cleanly between beats.
  void BASE_STROKE;
});
