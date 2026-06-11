import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 5;
const R = 18;
const STEP = 56;
const DUR = 280;

const ON = C.darkOrange;
const ON_TEXT = "#ffffff";
const OFF = C.darkButtonGrey;

const SELECTED = [0, 1, 3];

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP - 60;

const yTop = 50;
const yBot = -50;

const labeledLabel = new sd.Text({
  targetNode: svg,
  text: "有标号",
  cx: -380,
  cy: yTop,
  fontSize: 18,
  fill: OFF,
  opacity: 0,
});
const labeledCircles: sd.Circle[] = [];
const labeledNums: sd.Text[] = [];
for (let i = 0; i < N; i++) {
  const used = SELECTED.includes(i);
  labeledCircles.push(
    new sd.Circle({
      targetNode: svg,
      cx: cxOf(i),
      cy: yTop,
      r: R,
      fill: used ? ON : "none",
      stroke: used ? ON : OFF,
      strokeWidth: 1.4,
      opacity: 0,
    }),
  );
  labeledNums.push(
    new sd.Text({
      targetNode: svg,
      text: String(i + 1),
      cx: cxOf(i),
      cy: yTop,
      fontSize: 16,
      fill: used ? ON_TEXT : OFF,
      opacity: 0,
    }),
  );
}
const labeledState = new sd.Text({
  targetNode: svg,
  text: "状态 = {1, 2, 4}",
  cx: 270,
  cy: yTop,
  fontSize: 18,
  fill: ON,
  opacity: 0,
});

const unlabeledLabel = new sd.Text({
  targetNode: svg,
  text: "无标号",
  cx: -380,
  cy: yBot,
  fontSize: 18,
  fill: OFF,
  opacity: 0,
});
const unlabeledCircles: sd.Circle[] = [];
for (let i = 0; i < N; i++) {
  const used = i < SELECTED.length;
  unlabeledCircles.push(
    new sd.Circle({
      targetNode: svg,
      cx: cxOf(i),
      cy: yBot,
      r: R,
      fill: used ? ON : "none",
      stroke: used ? ON : OFF,
      strokeWidth: 1.4,
      opacity: 0,
    }),
  );
}
const unlabeledState = new sd.Text({
  targetNode: svg,
  text: "状态 = 3",
  cx: 270,
  cy: yBot,
  fontSize: 18,
  fill: ON,
  opacity: 0,
});

function fadeIn(el: sd.Circle | sd.Text, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  fadeIn(labeledLabel);
  for (let i = 0; i < N; i++) {
    fadeIn(labeledCircles[i], 60 + i * 50);
    fadeIn(labeledNums[i], 60 + i * 50 + 40);
  }
  fadeIn(labeledState, 60 + N * 50 + 80);
  await sd.pause();

  fadeIn(unlabeledLabel);
  for (let i = 0; i < N; i++) {
    fadeIn(unlabeledCircles[i], 60 + i * 50);
  }
  fadeIn(unlabeledState, 60 + N * 50 + 80);
  await sd.pause();
});
