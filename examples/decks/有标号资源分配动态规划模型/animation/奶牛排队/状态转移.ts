import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const VISITED_FILL = C.darkOrange;
const VISITED_TEXT = "#ffffff";
const QUEUE_FILL = C.steelBlue;
const I_COLOR = C.steelBlue;
const J_COLOR = C.green;

const data = [3, 4, 2, 1, 4, 3, 1, 6, 6];
const K = 1;
const N = data.length;
const VISITED_ORDER = [0, 3, 1, 7];
const POS_I = 7;
const POS_J = 2;

const CELL_W = 44;
const CELL_H = 40;
const GAP = 6;
const STEP = CELL_W + GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
  posLabel: sd.Text;
}
const cows: Cell[] = [];
for (let i = 0; i < N; i++) {
  const cx = cxOf(i);
  cows.push({
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: 40 - CELL_H / 2,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1.2,
      opacity: 0,
    }),
    text: new sd.Text({
      targetNode: svg,
      text: String(data[i]),
      cx,
      cy: 40,
      fontSize: 16,
      fill: NEUTRAL,
      opacity: 0,
    }),
    posLabel: new sd.Text({
      targetNode: svg,
      text: String(i + 1),
      cx,
      cy: 8,
      fontSize: 11,
      fill: "#999",
      opacity: 0,
    }),
  });
}

const klabel = new sd.Text({
  targetNode: svg,
  text: `K = ${K}`,
  cx: cxOf(N - 1) + STEP * 1.2,
  cy: 40,
  fontSize: 14,
  fill: NEUTRAL,
  opacity: 0,
});

const queueCells: { bg: sd.Rect; text: sd.Text }[] = [];
for (let i = 0; i < N; i++) {
  const cx = cxOf(i);
  queueCells.push({
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: -40 - CELL_H / 2,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1,
      strokeDasharray: "3 3",
      opacity: 0,
    }),
    text: new sd.Text({
      targetNode: svg,
      text: "?",
      cx,
      cy: -40,
      fontSize: 16,
      fill: QUEUE_FILL,
      opacity: 0,
    }),
  });
}

function arrowAt(cx: number, color: string): { path: sd.Path; label: sd.Text } {
  return {
    path: new sd.Path({
      targetNode: svg,
      d: `M ${cx} 76 L ${cx - 5} 86 L ${cx + 5} 86 Z`,
      fill: color,
      stroke: "none",
      opacity: 0,
    }),
    label: new sd.Text({
      targetNode: svg,
      text: "",
      cx,
      cy: 96,
      fontSize: 14,
      fill: color,
      opacity: 0,
    }),
  };
}

const iArrow = arrowAt(cxOf(POS_I), I_COLOR);
iArrow.label.startAnimate({ duration: 0 }).setText("i").endAnimate();
const jArrow = arrowAt(cxOf(POS_J), J_COLOR);
jArrow.label.startAnimate({ duration: 0 }).setText("j").endAnimate();

const DUR = 280;
function fadeIn(el: sd.Rect | sd.Text | sd.Path, delay = 0) {
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
    fadeIn(cows[i].bg, i * 25);
    fadeIn(cows[i].text, i * 25 + 30);
    fadeIn(cows[i].posLabel, i * 25 + 60);
    fadeIn(queueCells[i].bg, 80 + i * 25);
  }
  fadeIn(klabel, 200);

  for (let s = 0; s < VISITED_ORDER.length; s++) {
    const p = VISITED_ORDER[s];
    setFill(cows[p].bg, VISITED_FILL, 350 + s * 100);
    setFill(cows[p].text, VISITED_TEXT, 390 + s * 100);
    queueCells[s].text
      .startAnimate({ delay: 430 + s * 100, duration: DUR, easing: E.easeOut })
      .setText(String(data[p]))
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  fadeIn(iArrow.path);
  fadeIn(iArrow.label, 80);
  await sd.pause();

  fadeIn(jArrow.path);
  fadeIn(jArrow.label, 80);
  await sd.pause();

  setFill(cows[POS_J].bg, VISITED_FILL);
  setFill(cows[POS_J].text, VISITED_TEXT, 40);
  queueCells[VISITED_ORDER.length].text
    .startAnimate({ delay: 80, duration: DUR, easing: E.easeOut })
    .setText(String(data[POS_J]))
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
