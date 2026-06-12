import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const STR = "01101001";
const N = STR.length;
const L0 = 3;
const X = [0];
for (let i = 0; i < N; i++) X.push(X[i] + Number(STR[i]));

const CELL_W = 36;
const CELL_H = 30;
const ROW_S_CY = 70;
const ROW_X_CY = 0;
const FIRST_CHAR_CX = -((N - 1) / 2) * CELL_W;

interface CellGroup {
  rect: sd.Rect;
  value: sd.Text;
}

function makeCharCell(idx: number): CellGroup {
  const cx = FIRST_CHAR_CX + idx * CELL_W;
  const rect = new sd.Rect({
    targetNode: svg,
    cx,
    cy: ROW_S_CY,
    width: CELL_W,
    height: CELL_H,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1,
    opacity: 0,
  });
  const value = new sd.Text({
    targetNode: svg,
    text: STR[idx],
    cx,
    cy: ROW_S_CY,
    fontSize: 15,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  return { rect, value };
}

function makeXCell(idx: number): CellGroup {
  const cx = FIRST_CHAR_CX - CELL_W / 2 + idx * CELL_W;
  const rect = new sd.Rect({
    targetNode: svg,
    cx,
    cy: ROW_X_CY,
    width: CELL_W,
    height: CELL_H,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1,
    opacity: 0,
  });
  const value = new sd.Text({
    targetNode: svg,
    text: String(X[idx]),
    cx,
    cy: ROW_X_CY,
    fontSize: 14,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  return { rect, value };
}

const charCells = Array.from({ length: N }, (_, i) => makeCharCell(i));
const xCells = Array.from({ length: N + 1 }, (_, i) => makeXCell(i));

const xLabels = Array.from(
  { length: N + 1 },
  (_, i) =>
    new sd.Math({
      targetNode: svg,
      text: `X_${i}`,
      cx: FIRST_CHAR_CX - CELL_W / 2 + i * CELL_W,
      cy: ROW_X_CY - CELL_H / 2 - 12,
      fontSize: 10,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
);

const winLeft = 1;
const winRight = winLeft + L0 - 1;

const brace = new sd.Path({
  targetNode: svg,
  d: (() => {
    const x1 = FIRST_CHAR_CX + (winLeft - 1) * CELL_W - CELL_W / 2;
    const x2 = FIRST_CHAR_CX + (winRight - 1) * CELL_W + CELL_W / 2;
    const y0 = ROW_S_CY + CELL_H / 2 + 8;
    const y1 = y0 + 6;
    return `M ${x1} ${y0} L ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y0}`;
  })(),
  stroke: C.darkOrange,
  strokeWidth: 1.4,
  fill: "none",
  opacity: 0,
});

const braceLabel = new sd.Math({
  targetNode: svg,
  text: `L_0 = ${L0}`,
  cx:
    (FIRST_CHAR_CX +
      (winLeft - 1) * CELL_W -
      CELL_W / 2 +
      (FIRST_CHAR_CX + (winRight - 1) * CELL_W + CELL_W / 2)) /
    2,
  cy: ROW_S_CY + CELL_H / 2 + 28,
  fontSize: 13,
  fill: C.darkOrange,
  opacity: 0,
});

const formula1 = new sd.Math({
  targetNode: svg,
  text: `(\\text{1's in window}) = X_${winRight} - X_${winLeft - 1} = ${X[winRight] - X[winLeft - 1]}`,
  cx: 0,
  cy: -80,
  fontSize: 14,
  fill: C.darkOrange,
  opacity: 0,
});

const formula2 = new sd.Math({
  targetNode: svg,
  text: `(\\text{0's in window}) = L_0 - (X_${winRight} - X_${winLeft - 1}) = ${L0 - (X[winRight] - X[winLeft - 1])}`,
  cx: 0,
  cy: -110,
  fontSize: 14,
  fill: C.steelBlue,
  opacity: 0,
});

function fade(el: sd.SDNode, delay: number, dur = 240) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function highlight(
  cell: CellGroup,
  fill: string,
  stroke: string,
  delay: number,
) {
  cell.rect
    .startAnimate({ delay, duration: 220, easing: E.easeOut })
    .setFill(fill)
    .setStroke(stroke)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fade(charCells[i].rect, i * 30);
    fade(charCells[i].value, 60 + i * 30);
  }
  for (let i = 0; i <= N; i++) {
    fade(xCells[i].rect, 320 + i * 28);
    fade(xCells[i].value, 380 + i * 28);
    fade(xLabels[i], 400 + i * 28);
  }
  await sd.pause();

  for (let i = winLeft - 1; i < winRight; i++)
    highlight(charCells[i], "#fdecd9", C.darkOrange, (i - winLeft + 1) * 60);
  fade(brace, 320);
  fade(braceLabel, 380);
  await sd.pause();

  highlight(xCells[winLeft - 1], "#dceaf6", C.steelBlue, 0);
  highlight(xCells[winRight], "#dceaf6", C.steelBlue, 80);
  await sd.pause();

  fade(formula1, 0);
  await sd.pause();

  fade(formula2, 0);
  await sd.pause();
});
