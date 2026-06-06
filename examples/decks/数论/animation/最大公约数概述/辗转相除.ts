import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// gcd(48, 18): 48 = 2·18 + 12 → 18 = 1·12 + 6 → 12 = 2·6 + 0 → gcd = 6
const STEPS = [
  { a: 48, b: 18 },
  { a: 18, b: 12 },
  { a: 12, b: 6 },
  { a: 6, b: 0 },
];

const BOX_W = 84;
const BOX_H = 28;
const Y_TOP = 90;
const Y_GAP = 50;

const FINAL_FILL = "#fdecd9";
const FINAL_STROKE = C.darkOrange;

const boxes: sd.Rect[] = [];
const labels: sd.Text[] = [];

for (let i = 0; i < STEPS.length; i++) {
  const cy = Y_TOP - i * Y_GAP;
  boxes.push(
    new sd.Rect({
      targetNode: svg,
      x: -BOX_W / 2, y: cy - BOX_H / 2,
      width: BOX_W, height: BOX_H,
      fill: C.white,
      stroke: C.silver,
      strokeWidth: 1,
      rx: 4, ry: 4,
      opacity: 0,
    }),
  );
  const { a, b } = STEPS[i];
  labels.push(
    new sd.Text({
      targetNode: svg,
      text: `gcd(${a}, ${b})`,
      cx: 0, cy: cy - 1,
      fontSize: 13,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

// Down arrows between successive boxes, plus "mod" annotation.
interface DownArrow { line: sd.Line; head: sd.Path; modLabel: sd.Text; }
const arrows: DownArrow[] = [];
for (let i = 0; i < STEPS.length - 1; i++) {
  const yTop = Y_TOP - i * Y_GAP - BOX_H / 2;
  const yBot = Y_TOP - (i + 1) * Y_GAP + BOX_H / 2;
  const headSize = 6;
  arrows.push({
    line: new sd.Line({
      targetNode: svg,
      x1: 0, y1: yTop, x2: 0, y2: yBot + headSize,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.2,
      opacity: 0,
    }),
    head: new sd.Path({
      targetNode: svg,
      d: `M 0 ${yBot} L ${-headSize / 2} ${yBot + headSize} L ${headSize / 2} ${yBot + headSize} Z`,
      stroke: C.darkButtonGrey,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
    modLabel: new sd.Text({
      targetNode: svg,
      text: "a mod b",
      cx: 36, cy: (yTop + yBot) / 2 - 1,
      fontSize: 9,
      fill: C.silver,
      opacity: 0,
    }),
  });
}

sd.main(async () => {
  // p1: initial pair
  boxes[0].startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  labels[0].startAnimate({ delay: 80, duration: 320, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();

  // p2..p4: each substitution step
  for (let i = 1; i < STEPS.length; i++) {
    const aIdx = i - 1;
    arrows[aIdx].line.startAnimate({ duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    arrows[aIdx].head.startAnimate({ duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    arrows[aIdx].modLabel.startAnimate({ delay: 100, duration: 280, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    boxes[i].startAnimate({ delay: 220, duration: 320, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    labels[i].startAnimate({ delay: 300, duration: 320, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    if (i === STEPS.length - 1) {
      // last step: highlight the answer
      boxes[i].startAnimate({ delay: 620, duration: 320, easing: E.easeOut })
        .setFill(FINAL_FILL).setStroke(FINAL_STROKE).setStrokeWidth(1.6)
        .endAnimate();
      labels[i].startAnimate({ delay: 620, duration: 320, easing: E.easeOut })
        .setFill(FINAL_STROKE).endAnimate();
    }
    await sd.pause();
  }
});
