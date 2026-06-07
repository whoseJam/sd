import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const RED = C.red;
const BLUE = C.steelBlue;

const CELL_W = 28;
const CELL_GAP = 2;
const CELL_H = 28;
const GROUP_GAP = 30;
const STEP = CELL_W + CELL_GAP;
const GROUP_W = 2 * CELL_W + CELL_GAP;
const TOTAL = 4 * GROUP_W + 3 * GROUP_GAP;

function groupCx(idx: number): number {
  return -TOTAL / 2 + GROUP_W / 2 + idx * (GROUP_W + GROUP_GAP);
}

interface Pair {
  bgL: sd.Rect;
  bgR: sd.Rect;
  tL: sd.Text;
  tR: sd.Text;
}

function makePair(cx: number, lColor: string, rColor: string): Pair {
  const lx = cx - STEP / 2;
  const rx = cx + STEP / 2;
  return {
    bgL: new sd.Rect({
      targetNode: svg,
      x: lx - CELL_W / 2,
      y: 0,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    bgR: new sd.Rect({
      targetNode: svg,
      x: rx - CELL_W / 2,
      y: 0,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    tL: new sd.Text({
      targetNode: svg,
      text: "(",
      cx: lx,
      cy: CELL_H / 2,
      fontSize: 18,
      fill: lColor,
      opacity: 0,
    }),
    tR: new sd.Text({
      targetNode: svg,
      text: ")",
      cx: rx,
      cy: CELL_H / 2,
      fontSize: 18,
      fill: rColor,
      opacity: 0,
    }),
  };
}

const pairs: Pair[] = [
  makePair(groupCx(0), RED, NEUTRAL),
  makePair(groupCx(1), NEUTRAL, RED),
  makePair(groupCx(2), BLUE, NEUTRAL),
  makePair(groupCx(3), NEUTRAL, BLUE),
];

const DUR = 280;
type AnyEl = sd.Rect | sd.Text;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  pairs.forEach((p, idx) => {
    const d = idx * 80;
    fadeIn(p.bgL, d);
    fadeIn(p.bgR, d + 30);
    fadeIn(p.tL, d + 60);
    fadeIn(p.tR, d + 90);
  });
  await sd.pause();
});
