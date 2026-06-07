import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const ACCENT = C.darkOrange;
const ARC = C.steelBlue;

const CELL_W = 30;
const CELL_GAP = 2;
const CELL_H = 30;
const STEP = CELL_W + CELL_GAP;

const N = 7;
const seq = ["(", ".", ".", ".", ".", ".", ")"];
const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[] = [];
for (let i = 0; i < N; i++) {
  const cx = cxOf(i);
  const isEdge = i === 0 || i === N - 1;
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
      text: seq[i],
      cx,
      cy: CELL_H / 2,
      fontSize: 18,
      fill: isEdge ? ACCENT : NEUTRAL,
      opacity: 0,
    }),
  });
}

const lLabel = new sd.Math({
  targetNode: svg,
  text: "l",
  cx: cxOf(0),
  cy: -12,
  fontSize: 14,
  fill: ACCENT,
  opacity: 0,
});
const rLabel = new sd.Math({
  targetNode: svg,
  text: "r",
  cx: cxOf(N - 1),
  cy: -12,
  fontSize: 14,
  fill: ACCENT,
  opacity: 0,
});

const arc = new sd.Path({
  targetNode: svg,
  d: `M ${cxOf(0)} ${CELL_H} Q 0 ${CELL_H + 30} ${cxOf(N - 1)} ${CELL_H}`,
  stroke: ARC,
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

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 25);
    fadeIn(cells[i].text, i * 25 + 30);
  }
  fadeIn(lLabel, 200);
  fadeIn(rLabel, 200);
  fadeIn(arc, 350);
  await sd.pause();
});
