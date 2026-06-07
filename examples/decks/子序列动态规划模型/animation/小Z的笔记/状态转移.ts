import * as sd from "@/sd";

import { arrowedArc } from "../_/arrow";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;
const J_HL = C.steelBlue;
const DELETE_HL = C.red;
const BRACE_C = C.steelBlue;

const N = 10;
const I = 7;
const J = 4;

const CELL_W = 36;
const CELL_GAP = 2;
const CELL_H = 26;
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

const iLabel = new sd.Math({
  targetNode: svg,
  text: "f(i)",
  cx: cxOf(I),
  cy: -14,
  fontSize: 13,
  fill: I_HL,
  opacity: 0,
});
const jLabel = new sd.Math({
  targetNode: svg,
  text: "f(j)",
  cx: cxOf(J),
  cy: -14,
  fontSize: 13,
  fill: J_HL,
  opacity: 0,
});

const arrow = arrowedArc(svg, cxOf(J), CELL_H, cxOf(I), CELL_H, J_HL, 30);

const BRACE_Y = CELL_H + 24;
const xL = cxOf(1) - CELL_W / 2;
const xR = cxOf(I) + CELL_W / 2;
const braceParts: sd.Line[] = [
  new sd.Line({
    targetNode: svg,
    x1: xL,
    y1: BRACE_Y,
    x2: xR,
    y2: BRACE_Y,
    stroke: BRACE_C,
    strokeWidth: 1.2,
    opacity: 0,
  }),
  new sd.Line({
    targetNode: svg,
    x1: xL,
    y1: BRACE_Y,
    x2: xL,
    y2: BRACE_Y - 5,
    stroke: BRACE_C,
    strokeWidth: 1.2,
    opacity: 0,
  }),
  new sd.Line({
    targetNode: svg,
    x1: xR,
    y1: BRACE_Y,
    x2: xR,
    y2: BRACE_Y - 5,
    stroke: BRACE_C,
    strokeWidth: 1.2,
    opacity: 0,
  }),
];
const braceLabel = new sd.Text({
  targetNode: svg,
  text: "合法",
  cx: (xL + xR) / 2,
  cy: BRACE_Y + 12,
  fontSize: 12,
  fill: BRACE_C,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Path | sd.Line;
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
  setFill(cells[I - 1].bg, I_HL, 250);
  setFill(cells[I - 1].text, "#ffffff", 320);
  fadeIn(iLabel, 320);
  for (const p of braceParts) fadeIn(p, 400);
  fadeIn(braceLabel, 500);
  await sd.pause();

  setFill(cells[J - 1].bg, J_HL);
  setFill(cells[J - 1].text, "#ffffff", 60);
  fadeIn(jLabel, 80);
  fadeIn(arrow.arc, 200);
  fadeIn(arrow.head, 280);
  await sd.pause();

  for (let k = J + 1; k < I; k++) {
    setFill(cells[k - 1].bg, DELETE_HL, (k - J - 1) * 50);
    setFill(cells[k - 1].text, "#ffffff", (k - J - 1) * 50 + 60);
  }
  await sd.pause();
});
