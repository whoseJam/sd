import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const SUBSEQ = C.steelBlue;
const I_HL = C.darkOrange;
const ARC = C.darkOrange;

const N = 10;
const CELL_W = 36;
const CELL_GAP = 2;
const CELL_H = 26;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;

const I = 7;
const subseqJs = [2, 4];

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
  fontSize: 14,
  fill: I_HL,
  opacity: 0,
});

function makeArc(jPos: number, iPos: number, color: string): sd.Path {
  const x1 = cxOf(jPos);
  const x2 = cxOf(iPos);
  const y1 = CELL_H;
  const arcH = 16 + (iPos - jPos) * 4;
  return new sd.Path({
    targetNode: svg,
    d: `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${y1 + arcH} ${x2} ${y1}`,
    stroke: color,
    strokeWidth: 1.4,
    fill: "none",
    opacity: 0,
  });
}

const arcs = subseqJs.map((j) => makeArc(j, I, ARC));
const fjLabels = subseqJs.map(
  (j) =>
    new sd.Math({
      targetNode: svg,
      text: "f(j)",
      cx: cxOf(j),
      cy: -14,
      fontSize: 13,
      fill: SUBSEQ,
      opacity: 0,
    }),
);

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Path;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}
function setFill(el: sd.Rect | sd.Text | sd.Math, color: string, delay = 0) {
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
  setFill(cells[I - 1].text, "#ffffff", 80);
  fadeIn(fiLabel, 100);
  await sd.pause();

  for (let k = 0; k < subseqJs.length; k++) {
    const j = subseqJs[k];
    setFill(cells[j - 1].bg, SUBSEQ);
    setFill(cells[j - 1].text, "#ffffff", 80);
    fadeIn(fjLabels[k], 100);
    fadeIn(arcs[k], 200);
    await sd.pause();
  }
});
