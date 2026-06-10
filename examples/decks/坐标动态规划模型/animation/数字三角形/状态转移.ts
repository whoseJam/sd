import * as sd from "@/sd";

import { arrowedArc, type ArrowedArc } from "../common/arrow";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;
const J_HL = C.steelBlue;
const ARC = C.steelBlue;

const ROWS = 5;
const CELL_W = 44;
const CELL_H = 32;
const CELL_GAP_X = 6;
const ROW_GAP = 10;
const STEP_X = CELL_W + CELL_GAP_X;
const STEP_Y = CELL_H + ROW_GAP;

const cxOf = (i: number, j: number) => (j - (i + 1) / 2) * STEP_X;
const cyOf = (i: number) => ((ROWS + 1) / 2 - i) * STEP_Y;

const I_TARGET = 4;
const J_TARGET = 2;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[][] = [];
for (let i = 1; i <= ROWS; i++) {
  const row: Cell[] = [];
  for (let j = 1; j <= i; j++) {
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
      text: new sd.Text({
        targetNode: svg,
        text: `${i},${j}`,
        cx,
        cy,
        fontSize: 12,
        fill: NEUTRAL,
        opacity: 0,
      }),
    });
  }
  cells.push(row);
}

const fijLabel = new sd.Math({
  targetNode: svg,
  text: "f(i,j)",
  cx: cxOf(I_TARGET, J_TARGET) + CELL_W / 2 + 26,
  cy: cyOf(I_TARGET),
  fontSize: 14,
  fill: I_HL,
  opacity: 0,
});
const fp1Label = new sd.Math({
  targetNode: svg,
  text: "f(i-1,j-1)",
  cx: cxOf(I_TARGET - 1, J_TARGET - 1) - CELL_W / 2 - 36,
  cy: cyOf(I_TARGET - 1),
  fontSize: 13,
  fill: J_HL,
  opacity: 0,
});
const fp2Label = new sd.Math({
  targetNode: svg,
  text: "f(i-1,j)",
  cx: cxOf(I_TARGET - 1, J_TARGET) + CELL_W / 2 + 30,
  cy: cyOf(I_TARGET - 1),
  fontSize: 13,
  fill: J_HL,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Path;
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
  let delay = 0;
  for (let i = 1; i <= ROWS; i++) {
    for (let j = 1; j <= i; j++) {
      fadeIn(cells[i - 1][j - 1].bg, delay);
      fadeIn(cells[i - 1][j - 1].text, delay + 40);
      delay += 40;
    }
  }
  await sd.pause();

  setFill(cells[I_TARGET - 1][J_TARGET - 1].bg, I_HL);
  setFill(cells[I_TARGET - 1][J_TARGET - 1].text, "#ffffff", 60);
  fadeIn(fijLabel, 80);
  await sd.pause();

  setFill(cells[I_TARGET - 2][J_TARGET - 2].bg, J_HL);
  setFill(cells[I_TARGET - 2][J_TARGET - 2].text, "#ffffff", 60);
  fadeIn(fp1Label, 80);
  const a1: ArrowedArc = arrowedArc(
    svg,
    cxOf(I_TARGET - 1, J_TARGET - 1),
    cyOf(I_TARGET - 1) - CELL_H / 2,
    cxOf(I_TARGET, J_TARGET),
    cyOf(I_TARGET) + CELL_H / 2,
    ARC,
    -6,
  );
  fadeIn(a1.arc, 160);
  fadeIn(a1.head, 240);
  await sd.pause();

  setFill(cells[I_TARGET - 2][J_TARGET - 1].bg, J_HL);
  setFill(cells[I_TARGET - 2][J_TARGET - 1].text, "#ffffff", 60);
  fadeIn(fp2Label, 80);
  const a2: ArrowedArc = arrowedArc(
    svg,
    cxOf(I_TARGET - 1, J_TARGET),
    cyOf(I_TARGET - 1) - CELL_H / 2,
    cxOf(I_TARGET, J_TARGET),
    cyOf(I_TARGET) + CELL_H / 2,
    ARC,
    -6,
  );
  fadeIn(a2.arc, 160);
  fadeIn(a2.head, 240);
  await sd.pause();
});
