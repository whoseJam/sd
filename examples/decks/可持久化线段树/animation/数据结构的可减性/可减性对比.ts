import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 4;
const CELL_W = 36;
const CELL_H = 22;
const GAP = 4;
const ARRAY_W = N * CELL_W + (N - 1) * GAP;

const SIDE_GAP = 80;
const LEFT_X0 = -ARRAY_W - SIDE_GAP / 2;
const RIGHT_X0 = SIDE_GAP / 2;

const S_Y = -50;
const SP_Y = 50;

interface Row {
  rects: sd.Rect[];
  texts: sd.Text[];
}

function row(
  x0: number,
  y: number,
  values: (number | string)[],
  stroke: string,
): Row {
  const rects: sd.Rect[] = [];
  const texts: sd.Text[] = [];
  for (let i = 0; i < N; i++) {
    const cx = x0 + i * (CELL_W + GAP) + CELL_W / 2;
    rects.push(
      new sd.Rect({
        targetNode: svg,
        x: x0 + i * (CELL_W + GAP),
        y: y - CELL_H / 2,
        width: CELL_W,
        height: CELL_H,
        fill: C.white,
        stroke,
        strokeWidth: 1,
        rx: 3,
        ry: 3,
        opacity: 0,
      }),
    );
    texts.push(
      new sd.Text({
        targetNode: svg,
        text: String(values[i]),
        cx,
        cy: y - 1,
        fontSize: 13,
        fill: C.darkButtonGrey,
        opacity: 0,
      }),
    );
  }
  return { rects, texts };
}

const sValues = [3, 1, 5, 2];
const leftSP = [3, 6, 10, 2];
const rightSP = [3, 9, 9, 2];

const leftS = row(LEFT_X0, S_Y, sValues, C.darkButtonGrey);
const leftSp = row(LEFT_X0, SP_Y, sValues, C.darkButtonGrey);
const rightS = row(RIGHT_X0, S_Y, sValues, C.darkButtonGrey);
const rightSp = row(RIGHT_X0, SP_Y, sValues, C.darkButtonGrey);

function arrow(x0: number, color: string): sd.Line {
  return new sd.Line({
    targetNode: svg,
    x1: x0 + ARRAY_W / 2,
    y1: S_Y + CELL_H / 2 + 4,
    x2: x0 + ARRAY_W / 2,
    y2: SP_Y - CELL_H / 2 - 4,
    stroke: color,
    strokeWidth: 1.6,
    opacity: 0,
  });
}

function backArrow(x0: number, color: string): sd.Line {
  return new sd.Line({
    targetNode: svg,
    x1: x0 + ARRAY_W / 2 + 14,
    y1: SP_Y - CELL_H / 2 - 4,
    x2: x0 + ARRAY_W / 2 + 14,
    y2: S_Y + CELL_H / 2 + 4,
    stroke: color,
    strokeWidth: 1.6,
    strokeDashArray: [3, 3],
    opacity: 0,
  });
}

const leftDown = arrow(LEFT_X0, C.steelBlue);
const leftUp = backArrow(LEFT_X0, C.steelBlue);
const rightDown = arrow(RIGHT_X0, C.red);
const rightUp = backArrow(RIGHT_X0, C.red);

// Red cross over right's back arrow to mark "not reversible".
const crossA = new sd.Line({
  targetNode: svg,
  x1: RIGHT_X0 + ARRAY_W / 2 + 6,
  y1: -4,
  x2: RIGHT_X0 + ARRAY_W / 2 + 22,
  y2: 8,
  stroke: C.red,
  strokeWidth: 1.8,
  opacity: 0,
});
const crossB = new sd.Line({
  targetNode: svg,
  x1: RIGHT_X0 + ARRAY_W / 2 + 6,
  y1: 8,
  x2: RIGHT_X0 + ARRAY_W / 2 + 22,
  y2: -4,
  stroke: C.red,
  strokeWidth: 1.8,
  opacity: 0,
});

async function fadeIn(rw: Row, baseDelay = 0) {
  for (let i = 0; i < N; i++) {
    const d = baseDelay + i * 70;
    rw.rects[i]
      .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    rw.texts[i]
      .startAnimate({ delay: d + 60, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
}

function commit(rw: Row, values: (number | string)[], stroke: string) {
  for (let i = 0; i < N; i++) {
    if (String(values[i]) === rw.texts[i].attributes.text) continue;
    rw.texts[i]
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setText(String(values[i]))
      .setFill(stroke)
      .endAnimate();
    rw.rects[i]
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setStroke(stroke)
      .endAnimate();
  }
}

sd.main(async () => {
  fadeIn(leftS);
  fadeIn(rightS);
  await sd.pause();

  leftDown
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  rightDown
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  fadeIn(leftSp, 100);
  fadeIn(rightSp, 100);
  await sd.pause();

  commit(leftSp, leftSP, C.steelBlue);
  commit(rightSp, rightSP, C.red);
  await sd.pause();

  leftUp
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  rightUp
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  crossA
    .startAnimate({ duration: 200, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  crossB
    .startAnimate({ delay: 80, duration: 200, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
