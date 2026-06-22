import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const BOX_W = 50;
const BOX_H = 28;
const STACK_CX = -240;
const FLOOR_Y = -28;
const STACK_X = STACK_CX - BOX_W / 2;

const floor = new sd.Line({
  targetNode: svg,
  x1: STACK_CX - 38,
  y1: FLOOR_Y,
  x2: STACK_CX + 38,
  y2: FLOOR_Y,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.2,
  opacity: 0,
});

interface StackBox {
  rect: sd.Rect;
  text: sd.Text;
}

function makeBox(level: number, value: number): StackBox {
  const baseY = FLOOR_Y + level * BOX_H;
  const rect = new sd.Rect({
    targetNode: svg,
    x: STACK_X,
    y: baseY,
    width: BOX_W,
    height: BOX_H,
    fill: C.white,
    stroke: C.steelBlue,
    strokeWidth: 1,
    rx: 2,
    ry: 2,
    opacity: 0,
  });
  const text = new sd.Text({
    targetNode: svg,
    text: String(value),
    fontSize: 16,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  text.setCx(STACK_CX).setCy(baseY + BOX_H / 2 - 1);
  return { rect, text };
}

const box3 = makeBox(0, 3);
const box2 = makeBox(1, 2);

const T_PUSH3 = "\\{\\text{push}(3)\\}";
const T_PUSH2 = "\\{\\text{push}(2)\\}";
const T_TOP = "\\{\\text{top}()\\}";
const T_POP = "\\{\\text{pop}()\\}";

const COMMON: string[] = [
  "S_0",
  `S_0 + ${T_PUSH3}`,
  `S_0 + ${T_PUSH3} + ${T_PUSH2}`,
  `S_0 + ${T_PUSH3} + ${T_PUSH2} + ${T_TOP}`,
];

const EQ_TEXTS = [
  COMMON[0],
  `S_1 = ${COMMON[1]}`,
  `S_2 = ${COMMON[2]}`,
  `S_3 = ${COMMON[3]}`,
  `S_4 = ${COMMON[3]} + ${T_POP}`,
];

const EQ_MAPPINGS: Array<{ [k: string]: string }> = [
  { [COMMON[0]]: COMMON[0] },
  { [COMMON[1]]: COMMON[1] },
  { [COMMON[2]]: COMMON[2] },
  { [COMMON[3]]: COMMON[3] },
];

const eq = new sd.Math({
  targetNode: svg,
  text: EQ_TEXTS[0],
  x: -150,
  y: -10,
  fontSize: 17,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  floor
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  eq.startAnimate({ delay: 120, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  box3.rect
    .startAnimate({ duration: 300, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  box3.text
    .startAnimate({ delay: 80, duration: 300, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  eq.startAnimate({ delay: 120, duration: 360, easing: E.easeOut })
    .setText(EQ_TEXTS[1], EQ_MAPPINGS[0])
    .endAnimate();
  await sd.pause();

  box2.rect
    .startAnimate({ duration: 300, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  box2.text
    .startAnimate({ delay: 80, duration: 300, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  eq.startAnimate({ delay: 120, duration: 360, easing: E.easeOut })
    .setText(EQ_TEXTS[2], EQ_MAPPINGS[1])
    .endAnimate();
  await sd.pause();

  box2.rect
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setStroke(C.coral)
    .endAnimate();
  box2.rect
    .startAnimate({ delay: 520, duration: 280, easing: E.easeOut })
    .setStroke(C.steelBlue)
    .endAnimate();
  eq.startAnimate({ delay: 120, duration: 360, easing: E.easeOut })
    .setText(EQ_TEXTS[3], EQ_MAPPINGS[2])
    .endAnimate();
  await sd.pause();

  box2.rect
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
  box2.text
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
  eq.startAnimate({ delay: 120, duration: 360, easing: E.easeOut })
    .setText(EQ_TEXTS[4], EQ_MAPPINGS[3])
    .endAnimate();
  await sd.pause();
});
