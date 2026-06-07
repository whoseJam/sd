import * as sd from "@/sd";

import { arrowedArc, type ArrowedArc } from "../_/arrow";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const SUBSEQ = C.steelBlue;
const I_HL = C.darkOrange;
const J_HL = C.steelBlue;
const ARC = C.steelBlue;

const N = 10;
const I = 7;
const SUBSEQ_POS = [2, 4, 7, 9];

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

const fiLabel = new sd.Math({
  targetNode: svg,
  text: "f(i)",
  cx: cxOf(I),
  cy: -14,
  fontSize: 13,
  fill: I_HL,
  opacity: 0,
});
const fjLabel = new sd.Math({
  targetNode: svg,
  text: "f(j)",
  cx: cxOf(1),
  cy: -14,
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
function fadeOut(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
}
function setFill(el: sd.Rect | sd.Text, color: string, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}
function setCx(el: sd.Text | sd.Math, cx: number, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setCx(cx)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 30);
    fadeIn(cells[i].text, i * 30 + 40);
  }
  await sd.pause();

  for (let k = 0; k < SUBSEQ_POS.length; k++) {
    const p = SUBSEQ_POS[k];
    setFill(cells[p - 1].bg, SUBSEQ, k * 80);
    setFill(cells[p - 1].text, "#ffffff", k * 80 + 60);
  }
  await sd.pause();

  for (const p of SUBSEQ_POS) {
    if (p === I) continue;
    setFill(cells[p - 1].bg, "none");
    setFill(cells[p - 1].text, NEUTRAL, 60);
  }
  setFill(cells[I - 1].bg, I_HL);
  fadeIn(fiLabel, 80);
  await sd.pause();

  let prev: ArrowedArc | undefined;
  let prevJ = 0;
  for (let j = 1; j < I; j++) {
    if (prev) {
      fadeOut(prev.arc);
      fadeOut(prev.head);
    }
    if (prevJ > 0) {
      setFill(cells[prevJ - 1].bg, "none");
      setFill(cells[prevJ - 1].text, NEUTRAL, 60);
    }
    setFill(cells[j - 1].bg, J_HL, 100);
    setFill(cells[j - 1].text, "#ffffff", 160);
    if (prevJ === 0) fadeIn(fjLabel, 100);
    else setCx(fjLabel, cxOf(j), 100);
    const a = arrowedArc(
      svg,
      cxOf(j),
      CELL_H,
      cxOf(I),
      CELL_H,
      ARC,
      14 + (I - j) * 3,
    );
    fadeIn(a.arc, 200);
    fadeIn(a.head, 280);
    prev = a;
    prevJ = j;
    await sd.pause();
  }
});
