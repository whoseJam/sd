import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;
const J_HL = C.steelBlue;

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
  text: "i",
  cx: cxOf(I),
  cy: -14,
  fontSize: 14,
  fill: I_HL,
  opacity: 0,
});
const jLabel = new sd.Math({
  targetNode: svg,
  text: "j",
  cx: cxOf(J),
  cy: -14,
  fontSize: 14,
  fill: J_HL,
  opacity: 0,
});

const x1 = cxOf(J);
const x2 = cxOf(I);
const arc = new sd.Path({
  targetNode: svg,
  d: `M ${x1} ${CELL_H} Q ${(x1 + x2) / 2} ${CELL_H + 30} ${x2} ${CELL_H}`,
  stroke: J_HL,
  strokeWidth: 1.4,
  fill: "none",
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
  fadeIn(iLabel, 80);
  await sd.pause();

  setFill(cells[J - 1].bg, J_HL);
  setFill(cells[J - 1].text, "#ffffff", 60);
  fadeIn(jLabel, 80);
  fadeIn(arc, 200);
  await sd.pause();
});
