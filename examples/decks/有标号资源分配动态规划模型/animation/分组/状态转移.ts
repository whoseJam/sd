import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const S_COLOR_A = C.darkOrange;
const S_COLOR_B = C.steelBlue;
const T_COLOR = C.green;

const N = 6;
const S_MEMBERS_A = [0, 1];
const S_MEMBERS_B = [2, 3];
const T_MEMBERS = [4, 5];

const CELL_W = 50;
const CELL_H = 44;
const GAP = 8;
const STEP = CELL_W + GAP;
const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[] = [];
for (let i = 0; i < N; i++) {
  const cx = cxOf(i);
  cells.push({
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: -CELL_H / 2,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1.2,
      opacity: 0,
    }),
    text: new sd.Text({
      targetNode: svg,
      text: String(i + 1),
      cx,
      cy: 0,
      fontSize: 18,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

function groupArc(a: number, b: number, color: string): sd.Path {
  const x1 = cxOf(a);
  const x2 = cxOf(b);
  const distance = Math.abs(x2 - x1);
  const lift = -CELL_H / 2 - 18 - distance * 0.18;
  return new sd.Path({
    targetNode: svg,
    d: `M ${x1} ${-CELL_H / 2} Q ${(x1 + x2) / 2} ${lift} ${x2} ${-CELL_H / 2}`,
    stroke: color,
    strokeWidth: 1.6,
    fill: "none",
    opacity: 0,
  });
}

function arcsWithin(members: number[], color: string): sd.Path[] {
  const out: sd.Path[] = [];
  for (let a = 0; a < members.length; a++)
    for (let b = a + 1; b < members.length; b++)
      out.push(groupArc(members[a], members[b], color));
  return out;
}

const sArcsA = arcsWithin(S_MEMBERS_A, S_COLOR_A);
const sArcsB = arcsWithin(S_MEMBERS_B, S_COLOR_B);
const tArcs = arcsWithin(T_MEMBERS, T_COLOR);

const tBrace = new sd.Path({
  targetNode: svg,
  d: `M ${cxOf(T_MEMBERS[0]) - CELL_W / 2} ${CELL_H / 2 + 12} L ${cxOf(T_MEMBERS[0]) - CELL_W / 2} ${CELL_H / 2 + 24} L ${cxOf(T_MEMBERS[T_MEMBERS.length - 1]) + CELL_W / 2} ${CELL_H / 2 + 24} L ${cxOf(T_MEMBERS[T_MEMBERS.length - 1]) + CELL_W / 2} ${CELL_H / 2 + 12}`,
  stroke: T_COLOR,
  strokeWidth: 1.4,
  fill: "none",
  opacity: 0,
});

const tLabel = new sd.Math({
  targetNode: svg,
  text: "T",
  cx: (cxOf(T_MEMBERS[0]) + cxOf(T_MEMBERS[T_MEMBERS.length - 1])) / 2,
  cy: CELL_H / 2 + 40,
  fontSize: 16,
  fill: T_COLOR,
  opacity: 0,
});

const sLabel = new sd.Math({
  targetNode: svg,
  text: "S",
  cx: (cxOf(0) + cxOf(3)) / 2,
  cy: -CELL_H / 2 - 60,
  fontSize: 16,
  fill: NEUTRAL,
  opacity: 0,
});

const DUR = 280;
function fadeIn(el: sd.Rect | sd.Text | sd.Math | sd.Path, delay = 0) {
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
    fadeIn(cells[i].bg, i * 40);
    fadeIn(cells[i].text, i * 40 + 60);
  }
  await sd.pause();

  for (const i of S_MEMBERS_A) {
    setFill(cells[i].bg, S_COLOR_A);
    setFill(cells[i].text, "#ffffff", 40);
  }
  for (const i of S_MEMBERS_B) {
    setFill(cells[i].bg, S_COLOR_B);
    setFill(cells[i].text, "#ffffff", 40);
  }
  sArcsA.forEach((a, k) => fadeIn(a, 200 + k * 60));
  sArcsB.forEach((a, k) => fadeIn(a, 200 + k * 60));
  fadeIn(sLabel, 400);
  await sd.pause();

  for (const i of T_MEMBERS) {
    setFill(cells[i].bg, T_COLOR);
    setFill(cells[i].text, "#ffffff", 40);
  }
  tArcs.forEach((a, k) => fadeIn(a, 200 + k * 60));
  fadeIn(tBrace, 300);
  fadeIn(tLabel, 380);
  await sd.pause();
});
