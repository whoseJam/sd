import * as sd from "@/sd";

import { arrowedArc, type ArrowedArc } from "../_/arrow";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const PICK = C.steelBlue;
const ARC = C.steelBlue;

const N = 10;
const picks = [1, 3, 4, 7, 10];

const CELL_W = 36;
const CELL_GAP = 2;
const CELL_H = 28;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[] = [];
for (let i = 1; i <= N; i++) {
  const cx = cxOf(i);
  cells.push({
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: 0,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    text: new sd.Text({
      targetNode: svg,
      text: String(i),
      cx,
      cy: CELL_H / 2,
      fontSize: 13,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

const arcs: ArrowedArc[] = [];
for (let k = 0; k + 1 < picks.length; k++) {
  arcs.push(
    arrowedArc(
      svg,
      cxOf(picks[k]),
      CELL_H,
      cxOf(picks[k + 1]),
      CELL_H,
      ARC,
      14 + (picks[k + 1] - picks[k]) * 4,
    ),
  );
}

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Path;
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
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 30);
    fadeIn(cells[i].text, i * 30 + 40);
  }
  await sd.pause();

  for (let k = 0; k < picks.length; k++) {
    const p = picks[k];
    setFill(cells[p - 1].bg, PICK, k * 100);
    setFill(cells[p - 1].text, "#ffffff", k * 100 + 50);
  }
  for (let k = 0; k < arcs.length; k++) {
    fadeIn(arcs[k].arc, 200 + k * 100);
    fadeIn(arcs[k].head, 280 + k * 100);
  }
  await sd.pause();
});
