import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const doorData: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [5, 2],
  [5, 3],
  [4, 6],
  [3, 3],
];
const keyPairs: Array<[number, number]> = [
  [1, 4],
  [2, 3],
  [5, 6],
];

const DOOR_W = 70;
const DOOR_H = 110;
const DOOR_GAP = 14;
const DOOR_Y = 50;
const DOOR_START_X = -((doorData.length - 1) * (DOOR_W + DOOR_GAP)) / 2;

const lockBoxes: sd.Rect[] = [];
const lockTexts: sd.Text[] = [];
const doorRects: sd.Rect[] = [];

doorData.forEach(([l1, l2], i) => {
  const cx = DOOR_START_X + i * (DOOR_W + DOOR_GAP);
  doorRects.push(
    new sd.Rect({
      targetNode: svg,
      cx,
      cy: DOOR_Y,
      width: DOOR_W,
      height: DOOR_H,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.4,
      opacity: 0,
    }),
  );
  [l1, l2].forEach((lock, k) => {
    const y = DOOR_Y + (k === 0 ? DOOR_H / 4 : -DOOR_H / 4);
    lockBoxes.push(
      new sd.Rect({
        targetNode: svg,
        cx,
        cy: y,
        width: 32,
        height: 32,
        fill: C.white,
        stroke: C.darkButtonGrey,
        strokeWidth: 1,
        opacity: 0,
      }),
    );
    lockTexts.push(
      new sd.Text({
        targetNode: svg,
        text: String(lock),
        cx,
        cy: y,
        fontSize: 15,
        fill: C.darkButtonGrey,
        opacity: 0,
      }),
    );
  });
});

const KEY_R = 18;
const KEY_GAP = 60;
const KEY1_Y = -70;
const KEY2_Y = -130;
const keyStartX = -((keyPairs.length - 1) * KEY_GAP) / 2;

const keyCircles: sd.Circle[] = [];
const keyTexts: sd.Text[] = [];
const pairBrackets: sd.Path[] = [];

keyPairs.forEach(([a, b], i) => {
  const cx = keyStartX + i * KEY_GAP;
  [
    { v: a, y: KEY1_Y },
    { v: b, y: KEY2_Y },
  ].forEach(({ v, y }) => {
    keyCircles.push(
      new sd.Circle({
        targetNode: svg,
        cx,
        cy: y,
        r: KEY_R,
        fill: C.white,
        stroke: C.darkButtonGrey,
        strokeWidth: 1.4,
        opacity: 0,
      }),
    );
    keyTexts.push(
      new sd.Text({
        targetNode: svg,
        text: String(v),
        cx,
        cy: y,
        fontSize: 14,
        fill: C.darkButtonGrey,
        opacity: 0,
      }),
    );
  });
  pairBrackets.push(
    new sd.Path({
      targetNode: svg,
      d: `M ${cx - KEY_R - 4} ${KEY1_Y} L ${cx - KEY_R - 10} ${KEY1_Y} L ${cx - KEY_R - 10} ${KEY2_Y} L ${cx - KEY_R - 4} ${KEY2_Y}`,
      stroke: C.darkButtonGrey,
      strokeWidth: 1,
      fill: "none",
      opacity: 0,
    }),
  );
});

new sd.Text({
  targetNode: svg,
  text: "K1",
  cx: keyStartX - KEY_R - 26,
  cy: KEY1_Y,
  fontSize: 13,
  fill: C.darkButtonGrey,
});
new sd.Text({
  targetNode: svg,
  text: "K2",
  cx: keyStartX - KEY_R - 26,
  cy: KEY2_Y,
  fontSize: 13,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  const setup: sd.SDNode[] = [
    ...doorRects,
    ...lockBoxes,
    ...lockTexts,
    ...keyCircles,
    ...keyTexts,
    ...pairBrackets,
  ];
  setup.forEach((el, i) => {
    el.startAnimate({ delay: i * 12, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  });
  await sd.pause();

  const usedKeyIdx = 0;
  const droppedKeyIdx = 1;
  keyCircles[usedKeyIdx]
    .startAnimate({ duration: 260, easing: E.easeOut })
    .setStroke(C.steelBlue as sd.SDColor)
    .setStrokeWidth(2.4)
    .endAnimate();
  keyTexts[usedKeyIdx]
    .startAnimate({ duration: 260, easing: E.easeOut })
    .setFill(C.steelBlue as sd.SDColor)
    .endAnimate();
  keyCircles[droppedKeyIdx]
    .startAnimate({ duration: 260, easing: E.easeOut })
    .setOpacity(0.25)
    .endAnimate();
  keyTexts[droppedKeyIdx]
    .startAnimate({ duration: 260, easing: E.easeOut })
    .setOpacity(0.25)
    .endAnimate();
  await sd.pause();

  const usedKeyValue = keyPairs[0][0];
  doorData.forEach(([l1, l2], i) => {
    if (l1 === usedKeyValue || l2 === usedKeyValue) {
      doorRects[i]
        .startAnimate({ delay: i * 60, duration: 280, easing: E.easeOut })
        .setStroke(C.steelBlue as sd.SDColor)
        .setStrokeWidth(2.4)
        .setFill("#e2ecf6" as sd.SDColor)
        .endAnimate();
    }
  });
  await sd.pause();
});
