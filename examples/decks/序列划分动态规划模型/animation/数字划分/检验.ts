import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const ACCENT = C.darkOrange;

const data = [1, 3, 2, 4, 5];
const M = 7;
const N = data.length;

const CELL_W = 50;
const CELL_GAP = 2;
const CELL_H = 30;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

const A_Y = 50;
const S_Y = 0;

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

let prefix = 0;
const sValues: string[] = [];
for (let i = 0; i < N; i++) {
  prefix = (prefix * 10 + data[i]) % M;
  sValues.push(String(prefix));
}
const sRow = makeRow(sValues, S_Y, ACCENT);

const aLabel = new sd.Math({
  targetNode: svg,
  text: "a",
  cx: cxOf(0) - CELL_W / 2 - 14,
  cy: A_Y + CELL_H / 2,
  fontSize: 16,
  fill: NEUTRAL,
  opacity: 0,
});
const sLabel = new sd.Math({
  targetNode: svg,
  text: "s",
  cx: cxOf(0) - CELL_W / 2 - 14,
  cy: S_Y + CELL_H / 2,
  fontSize: 16,
  fill: ACCENT,
  opacity: 0,
});
const mLabel = new sd.Math({
  targetNode: svg,
  text: `m = ${M}`,
  cx: cxOf(N - 1) + CELL_W / 2 + 28,
  cy: A_Y + CELL_H / 2,
  fontSize: 14,
  fill: NEUTRAL,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  fadeIn(aLabel, 0);
  for (let i = 0; i < N; i++) {
    fadeIn(aRow[i].bg, i * 40);
    fadeIn(aRow[i].text, i * 40 + 50);
  }
  fadeIn(mLabel, 200);
  await sd.pause();

  fadeIn(sLabel, 0);
  for (let i = 0; i < N; i++) {
    fadeIn(sRow[i].bg, i * 80);
    fadeIn(sRow[i].text, i * 80 + 60);
  }
  await sd.pause();
});
