import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;
const J_HL = C.steelBlue;

const data = [1, 2, 4, 1, 3, 5];
const N = data.length;

const fValues: number[] = [];
const chosenJ: number[] = [];
for (let i = 0; i < N; i++) {
  let best = 1;
  let bestJ = -1;
  for (let j = 0; j < i; j++) {
    if (data[j] >= data[i]) continue;
    if (fValues[j] + 1 > best) {
      best = fValues[j] + 1;
      bestJ = j;
    }
  }
  fValues.push(best);
  chosenJ.push(bestJ);
}

const CELL_W = 50;
const CELL_GAP = 2;
const CELL_H = 30;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

const A_Y = 80;
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
        fontSize: 14,
        fill: color,
        opacity: 0,
      }),
    };
  });
}

const aRow = makeRow(data.map(String), A_Y, NEUTRAL);
const fRow = makeRow(
  data.map(() => "?"),
  F_Y,
  NEUTRAL,
);

const aLabel = new sd.Math({
  targetNode: svg,
  text: "a",
  cx: cxOf(0) - CELL_W / 2 - 14,
  cy: A_Y + CELL_H / 2,
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

function makeArc(jPos: number, iPos: number, color: string): sd.Path {
  const x1 = cxOf(jPos);
  const x2 = cxOf(iPos);
  const y = F_Y + CELL_H;
  const arcH = 14 + (iPos - jPos) * 4;
  return new sd.Path({
    targetNode: svg,
    d: `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + arcH} ${x2} ${y}`,
    stroke: color,
    strokeWidth: 1.4,
    fill: "none",
    opacity: 0,
  });
}

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
function setText(el: sd.Text, txt: string, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setText(txt)
    .endAnimate();
}

sd.main(async () => {
  fadeIn(aLabel, 0);
  for (let i = 0; i < N; i++) {
    fadeIn(aRow[i].bg, i * 40);
    fadeIn(aRow[i].text, i * 40 + 50);
  }
  fadeIn(fLabel, 200);
  for (let i = 0; i < N; i++) {
    fadeIn(fRow[i].bg, 200 + i * 40);
    fadeIn(fRow[i].text, 200 + i * 40 + 50);
  }
  await sd.pause();

  let prevArc: sd.Path | undefined;
  for (let i = 0; i < N; i++) {
    if (i > 0) {
      setFill(aRow[i - 1].bg, J_HL, 0);
      if (prevArc) {
        fadeOut(prevArc, 0);
        prevArc = undefined;
      }
    }
    setFill(aRow[i].bg, I_HL, 80);
    setFill(aRow[i].text, "#ffffff", 140);
    setText(fRow[i].text, String(fValues[i]), 180);
    if (chosenJ[i] >= 0) {
      const arc = makeArc(chosenJ[i], i, J_HL);
      fadeIn(arc, 240);
      prevArc = arc;
    }
    await sd.pause();
  }
});
