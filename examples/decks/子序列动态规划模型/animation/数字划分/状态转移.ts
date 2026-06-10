import * as sd from "@/sd";

import { arrowedArc } from "../common/arrow";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const ZERO = C.green;
const ARC = C.green;

const N = 10;
const zeroIndex = [4, 6, 9];

const CELL_W = 42;
const CELL_GAP = 2;
const CELL_H = 26;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;

const S_Y = 38;
const F_Y = 0;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}

function makeRow(values: string[], yBottom: number, color: string): Cell[] {
  return values.map((v, i) => {
    const cx = cxOf(i);
    return {
      bg: new sd.Rect({
        targetNode: svg,
        x: cx - CELL_W / 2,
        y: yBottom,
        width: CELL_W,
        height: CELL_H,
        fill: "none",
        stroke: color,
        strokeWidth: 1,
        opacity: 0,
      }),
      text: new sd.Text({
        targetNode: svg,
        text: v,
        cx,
        cy: yBottom + CELL_H / 2,
        fontSize: 13,
        fill: color,
        opacity: 0,
      }),
    };
  });
}

const sValues = Array.from({ length: N + 1 }, (_, i) =>
  i === 0 ? "0" : zeroIndex.includes(i) ? "0" : "s",
);
const fValues = Array.from({ length: N + 1 }, (_, i) => (i === 0 ? "1" : "f"));

const sRow = makeRow(sValues, S_Y, NEUTRAL);
const fRow = makeRow(fValues, F_Y, NEUTRAL);

const sLabel = new sd.Math({
  targetNode: svg,
  text: "s",
  cx: cxOf(0) - CELL_W / 2 - 14,
  cy: S_Y + CELL_H / 2,
  fontSize: 16,
  fill: NEUTRAL,
  opacity: 0,
});
const fLabel = new sd.Math({
  targetNode: svg,
  text: "f",
  cx: cxOf(0) - CELL_W / 2 - 14,
  cy: F_Y + CELL_H / 2,
  fontSize: 16,
  fill: NEUTRAL,
  opacity: 0,
});

const arcs = zeroIndex.map((idx) =>
  arrowedArc(
    svg,
    cxOf(0),
    F_Y + CELL_H,
    cxOf(idx),
    F_Y + CELL_H,
    ARC,
    14 + idx * 3,
  ),
);

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
  fadeIn(sLabel, 0);
  fadeIn(fLabel, 0);
  for (let i = 0; i <= N; i++) {
    fadeIn(sRow[i].bg, i * 25);
    fadeIn(sRow[i].text, i * 25 + 30);
    fadeIn(fRow[i].bg, i * 25);
    fadeIn(fRow[i].text, i * 25 + 30);
  }
  await sd.pause();

  for (const idx of zeroIndex) {
    setFill(sRow[idx].bg, ZERO);
    setFill(sRow[idx].text, "#ffffff", 60);
    setFill(fRow[idx].bg, ZERO);
    setFill(fRow[idx].text, "#ffffff", 60);
  }
  for (let k = 0; k < arcs.length; k++) {
    fadeIn(arcs[k].arc, 200 + k * 80);
    fadeIn(arcs[k].head, 280 + k * 80);
  }
  await sd.pause();
});
