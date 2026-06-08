import * as sd from "@/sd";

import { arrowedArc, type ArrowedArc } from "../_/arrow";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;
const J_HL = C.steelBlue;
const ARC = C.steelBlue;

const N = 10;
const I = 6;

const CELL_W = 44;
const CELL_GAP = 4;
const CELL_H = 32;
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
      fontSize: 14,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

const fiLabel = new sd.Math({
  targetNode: svg,
  text: "f(i)",
  cx: cxOf(I),
  cy: -16,
  fontSize: 14,
  fill: I_HL,
  opacity: 0,
});
const fim1Label = new sd.Math({
  targetNode: svg,
  text: "f(i-1)",
  cx: cxOf(I - 1),
  cy: -16,
  fontSize: 13,
  fill: J_HL,
  opacity: 0,
});
const fim2Label = new sd.Math({
  targetNode: svg,
  text: "f(i-2)",
  cx: cxOf(I - 2),
  cy: -16,
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
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 30);
    fadeIn(cells[i].text, i * 30 + 40);
  }
  await sd.pause();

  setFill(cells[I - 1].bg, I_HL);
  setFill(cells[I - 1].text, "#ffffff", 60);
  fadeIn(fiLabel, 80);
  await sd.pause();

  setFill(cells[I - 2].bg, J_HL);
  setFill(cells[I - 2].text, "#ffffff", 60);
  fadeIn(fim1Label, 80);
  const a1: ArrowedArc = arrowedArc(
    svg,
    cxOf(I - 1),
    CELL_H,
    cxOf(I),
    CELL_H,
    ARC,
    14,
  );
  fadeIn(a1.arc, 160);
  fadeIn(a1.head, 240);
  await sd.pause();

  setFill(cells[I - 3].bg, J_HL);
  setFill(cells[I - 3].text, "#ffffff", 60);
  fadeIn(fim2Label, 80);
  const a2: ArrowedArc = arrowedArc(
    svg,
    cxOf(I - 2),
    CELL_H,
    cxOf(I),
    CELL_H,
    ARC,
    26,
  );
  fadeIn(a2.arc, 160);
  fadeIn(a2.head, 240);
  await sd.pause();
});
