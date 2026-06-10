import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const VISITED_FILL = C.darkOrange;
const VISITED_TEXT = "#ffffff";
const QUEUE_FILL = C.steelBlue;

const data = [3, 4, 2, 1, 4, 3, 1, 6, 6];
const K = 1;
const N = data.length;
const sample = [2, 1, 3, 4, 6, 0, 7, 5, 8];

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
      text: "",
      cx,
      cy: -40,
      fontSize: 16,
      fill: QUEUE_FILL,
      opacity: 0,
    }),
  });
}

const DUR = 280;
function fadeIn(el: sd.Rect | sd.Text, delay = 0) {
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
    fadeIn(cows[i].bg, i * 30);
    fadeIn(cows[i].text, i * 30 + 40);
    fadeIn(cows[i].posLabel, i * 30 + 80);
    fadeIn(queueCells[i].bg, 100 + i * 30);
  }
  fadeIn(klabel, 200);
  await sd.pause();

  for (let step = 0; step < sample.length; step++) {
    const fromPos = sample[step];
    setFill(cows[fromPos].bg, VISITED_FILL, step * 200);
    setFill(cows[fromPos].text, VISITED_TEXT, step * 200 + 40);
    queueCells[step].text
      .startAnimate({
        delay: step * 200 + 80,
        duration: DUR,
        easing: E.easeOut,
      })
      .setText(String(data[fromPos]))
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});
