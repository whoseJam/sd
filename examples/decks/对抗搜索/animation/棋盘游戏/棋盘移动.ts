import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const ROWS = 6;
const COLS = 6;
const CELL = 36;
const BOARD_X0 = (-CELL * COLS) / 2;
const BOARD_Y0 = (CELL * ROWS) / 2;

const cellCx = (c: number) => BOARD_X0 + (c + 0.5) * CELL;
const cellCy = (r: number) => BOARD_Y0 - (r + 0.5) * CELL;

const gridLines: sd.Line[] = [];
for (let r = 0; r <= ROWS; r++) {
  const y = BOARD_Y0 - r * CELL;
  gridLines.push(
    new sd.Line({
      targetNode: svg,
      x1: BOARD_X0,
      y1: y,
      x2: BOARD_X0 + COLS * CELL,
      y2: y,
      stroke: C.silver,
      strokeWidth: 1,
      opacity: 0,
    }),
  );
}
for (let c = 0; c <= COLS; c++) {
  const x = BOARD_X0 + c * CELL;
  gridLines.push(
    new sd.Line({
      targetNode: svg,
      x1: x,
      y1: BOARD_Y0,
      x2: x,
      y2: BOARD_Y0 - ROWS * CELL,
      stroke: C.silver,
      strokeWidth: 1,
      opacity: 0,
    }),
  );
}

const WHITE_R = 1;
const WHITE_C = 1;
const BLACK_R = 3;
const BLACK_C = 3;

const white = new sd.Circle({
  targetNode: svg,
  cx: cellCx(WHITE_C),
  cy: cellCy(WHITE_R),
  r: CELL / 2 - 5,
  fill: "#f0e6d8",
  stroke: C.darkButtonGrey,
  strokeWidth: 1.6,
  opacity: 0,
});
const whiteLabel = new sd.Text({
  targetNode: svg,
  text: "W",
  cx: cellCx(WHITE_C),
  cy: cellCy(WHITE_R),
  fontSize: 14,
  fill: C.darkButtonGrey,
  opacity: 0,
});

const black = new sd.Circle({
  targetNode: svg,
  cx: cellCx(BLACK_C),
  cy: cellCy(BLACK_R),
  r: CELL / 2 - 5,
  fill: "#3b3b3b",
  stroke: "#1a1a1a",
  strokeWidth: 1.6,
  opacity: 0,
});
const blackLabel = new sd.Text({
  targetNode: svg,
  text: "B",
  cx: cellCx(BLACK_C),
  cy: cellCy(BLACK_R),
  fontSize: 14,
  fill: "#f0e6d8",
  opacity: 0,
});

interface MoveArrow {
  arrow: sd.Path;
  head: sd.Path;
}

function makeArrow(
  fromR: number,
  fromC: number,
  toR: number,
  toC: number,
  color: string,
): MoveArrow {
  const x1 = cellCx(fromC);
  const y1 = cellCy(fromR);
  const x2 = cellCx(toC);
  const y2 = cellCy(toR);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const startInset = CELL / 2 - 4;
  const endInset = CELL / 2 - 8;
  const ax = x1 + ux * startInset;
  const ay = y1 + uy * startInset;
  const bx = x2 - ux * endInset;
  const by = y2 - uy * endInset;
  const arrow = new sd.Path({
    targetNode: svg,
    d: `M ${ax} ${ay} L ${bx} ${by}`,
    stroke: color,
    strokeWidth: 1.6,
    fill: "none",
    opacity: 0,
  });
  const hs = 6;
  const px = -uy;
  const py = ux;
  const h1x = bx - ux * hs + px * (hs / 2);
  const h1y = by - uy * hs + py * (hs / 2);
  const h2x = bx - ux * hs - px * (hs / 2);
  const h2y = by - uy * hs - py * (hs / 2);
  const head = new sd.Path({
    targetNode: svg,
    d: `M ${bx} ${by} L ${h1x} ${h1y} L ${h2x} ${h2y} Z`,
    stroke: color,
    fill: color,
    strokeWidth: 1,
    opacity: 0,
  });
  return { arrow, head };
}

const whiteMoves: Array<[number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
const blackMoves: Array<[number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-2, 0],
  [2, 0],
  [0, -2],
  [0, 2],
];

const whiteArrows: MoveArrow[] = whiteMoves.map(([dr, dc]) =>
  makeArrow(WHITE_R, WHITE_C, WHITE_R + dr, WHITE_C + dc, C.steelBlue),
);
const blackArrows: MoveArrow[] = blackMoves.map(([dr, dc]) =>
  makeArrow(BLACK_R, BLACK_C, BLACK_R + dr, BLACK_C + dc, C.crimson),
);

const whiteCaption = new sd.Math({
  targetNode: svg,
  text: "\\max \\quad (\\Delta \\in \\{\\pm 1\\})",
  cx: -BOARD_X0 / 2,
  cy: -BOARD_Y0 - 22,
  fontSize: 13,
  fill: C.steelBlue,
  opacity: 0,
});
const blackCaption = new sd.Math({
  targetNode: svg,
  text: "\\min \\quad (\\Delta \\in \\{\\pm 1, \\pm 2\\})",
  cx: -BOARD_X0 / 2,
  cy: -BOARD_Y0 - 22,
  fontSize: 13,
  fill: C.crimson,
  opacity: 0,
});
blackCaption.setCx(BOARD_X0 / 2 + 60);
whiteCaption.setCx(BOARD_X0 / 2 - 60);

function fade(el: sd.SDNode, delay: number, dur = 240) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < gridLines.length; i++) fade(gridLines[i], i * 8);
  fade(white, 280);
  fade(whiteLabel, 360);
  fade(black, 340);
  fade(blackLabel, 420);
  await sd.pause();

  for (let i = 0; i < whiteArrows.length; i++) {
    fade(whiteArrows[i].arrow, i * 70);
    fade(whiteArrows[i].head, i * 70 + 60);
  }
  fade(whiteCaption, 350);
  await sd.pause();

  for (let i = 0; i < blackArrows.length; i++) {
    fade(blackArrows[i].arrow, i * 60);
    fade(blackArrows[i].head, i * 60 + 60);
  }
  fade(blackCaption, 540);
  await sd.pause();
});
