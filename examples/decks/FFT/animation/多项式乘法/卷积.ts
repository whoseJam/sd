import * as sd from "@/sd";

import { AXIS_COLOR } from "../common/coord";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N_A = 6;
const N_B = 5;
const N_C = N_A + N_B - 1;
const CELL_W = 38;
const CELL_H = 32;
const GAP = 4;
const ROW_GAP = 22;

const A_CY = ROW_GAP + CELL_H;
const B_CY = 0;
const C_CY = -(ROW_GAP + CELL_H);

const HIGHLIGHT = C.darkOrange;
const HIGHLIGHT_BG = "#fdecd9" as sd.SDColor;

interface Cell {
  rect: sd.Rect;
  text: sd.Math;
}

function makeCell(cx: number, cy: number, latex: string): Cell {
  const rect = new sd.Rect({
    targetNode: svg,
    cx,
    cy,
    width: CELL_W,
    height: CELL_H,
    fill: "none",
    stroke: AXIS_COLOR,
    strokeWidth: 1.2,
  });
  const text = new sd.Math({
    targetNode: svg,
    text: latex,
    cx,
    cy,
    fontSize: 13,
  });
  return { rect, text };
}

function rowXStart(count: number): number {
  return -((count - 1) * (CELL_W + GAP)) / 2;
}

const aCells: Cell[] = [];
const bCells: Cell[] = [];
const cCells: Cell[] = [];

const aX0 = rowXStart(N_A);
const bX0 = rowXStart(N_B);
const cX0 = rowXStart(N_C);

for (let i = 0; i < N_A; i++) {
  aCells.push(makeCell(aX0 + i * (CELL_W + GAP), A_CY, `a_{${i}}`));
}
for (let i = 0; i < N_B; i++) {
  bCells.push(makeCell(bX0 + i * (CELL_W + GAP), B_CY, `b_{${i}}`));
}
for (let i = 0; i < N_C; i++) {
  cCells.push(makeCell(cX0 + i * (CELL_W + GAP), C_CY, `c_{${i}}`));
}

new sd.Text({
  targetNode: svg,
  text: "A",
  cx: aX0 - CELL_W,
  cy: A_CY,
  fontSize: 16,
  fill: AXIS_COLOR,
});
new sd.Text({
  targetNode: svg,
  text: "B",
  cx: bX0 - CELL_W,
  cy: B_CY,
  fontSize: 16,
  fill: AXIS_COLOR,
});
new sd.Text({
  targetNode: svg,
  text: "C",
  cx: cX0 - CELL_W,
  cy: C_CY,
  fontSize: 16,
  fill: AXIS_COLOR,
});

const highlights: sd.Rect[] = [];
for (let i = 0; i < N_C; i++) {
  highlights.push(
    new sd.Rect({
      targetNode: svg,
      cx: cX0 + i * (CELL_W + GAP),
      cy: C_CY,
      width: CELL_W,
      height: CELL_H,
      fill: HIGHLIGHT_BG,
      stroke: HIGHLIGHT,
      strokeWidth: 1.6,
      opacity: 0,
    }),
  );
}

interface LinkSet {
  i: number;
  lines: sd.Line[];
}

const linkSets: LinkSet[] = [];

for (let i = 0; i < N_C; i++) {
  const lines: sd.Line[] = [];
  for (let j = 0; j <= i; j++) {
    const k = i - j;
    if (j >= N_A || k >= N_B) continue;
    const aCx = aX0 + j * (CELL_W + GAP);
    const aCy = A_CY - CELL_H / 2;
    const bCx = bX0 + k * (CELL_W + GAP);
    const bCy = B_CY + CELL_H / 2;
    lines.push(
      new sd.Line({
        targetNode: svg,
        x1: aCx,
        y1: aCy,
        x2: bCx,
        y2: bCy,
        stroke: HIGHLIGHT,
        strokeWidth: 1.2,
        opacity: 0,
      }),
    );
  }
  linkSets.push({ i, lines });
}

function fadeIn(
  node: sd.SDNode,
  opts: { delay?: number; duration?: number } = {},
) {
  node
    .startAnimate({
      delay: opts.delay ?? 0,
      duration: opts.duration ?? 240,
      easing: E.easeOut,
    })
    .setOpacity(1)
    .endAnimate();
}

function fadeOut(
  node: sd.SDNode,
  opts: { delay?: number; duration?: number } = {},
) {
  node
    .startAnimate({
      delay: opts.delay ?? 0,
      duration: opts.duration ?? 180,
      easing: E.easeOut,
    })
    .setOpacity(0)
    .endAnimate();
}

function show(i: number) {
  fadeIn(highlights[i], { duration: 200 });
  for (let k = 0; k < linkSets[i].lines.length; k++) {
    fadeIn(linkSets[i].lines[k], { delay: 60 + k * 40 });
  }
}

function hide(i: number) {
  fadeOut(highlights[i]);
  for (const line of linkSets[i].lines) fadeOut(line);
}

const SEQUENCE = [0, 2, 5, 7, 9];

sd.main(async () => {
  await sd.pause();
  for (let s = 0; s < SEQUENCE.length; s++) {
    show(SEQUENCE[s]);
    await sd.pause();
    hide(SEQUENCE[s]);
  }
  await sd.pause();
});
