import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Visual language for "linear basis":
//   a set of numbers → arrow → a smaller set ("the basis B").
//
// Block carries a label (a_i / b_j / decimal) rather than concrete bits,
// so this primitive is reusable downstream — a tree path's numbers
// flowing into the basis, two bases merging, etc.

const BLOCK_W = 48;
const BLOCK_H = 44;
const BLOCK_GAP = 8;
const RX = 7;

const LEFT_COUNT = 5;
const RIGHT_COUNT = 3;

const LEFT_CX = -180;
const RIGHT_CX = 180;
const Y = 0;

const SRC_FILL = C.white;
const SRC_STROKE = C.darkButtonGrey;
const SRC_STROKE_W = 1.6;

const REP_FILL = "#fdecd9";
const REP_STROKE = C.darkOrange;
const REP_STROKE_W = 2;
const LABEL_COLOR = "#3a3a3a";
const REP_LABEL_COLOR = "#a04d09";

interface Block { bg: sd.Rect; label: sd.Math; }

function makeBlock(
  cx: number,
  cy: number,
  labelLatex: string,
  fill: sd.SDColor,
  stroke: sd.SDColor,
  strokeWidth: number,
  labelColor: sd.SDColor,
  labelSize: number,
): Block {
  return {
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - BLOCK_W / 2, y: cy - BLOCK_H / 2,
      width: BLOCK_W, height: BLOCK_H,
      fill, stroke,
      strokeWidth,
      rx: RX, ry: RX,
      opacity: 0,
    }),
    label: new sd.Math({
      targetNode: svg,
      text: labelLatex,
      cx, cy: cy - 1,
      fontSize: labelSize,
      fill: labelColor,
      opacity: 0,
    }),
  };
}

function rowXs(count: number, centerX: number): number[] {
  const totalW = count * BLOCK_W + (count - 1) * BLOCK_GAP;
  const x0 = centerX - totalW / 2 + BLOCK_W / 2;
  return Array.from({ length: count }, (_, i) => x0 + i * (BLOCK_W + BLOCK_GAP));
}

const leftXs = rowXs(LEFT_COUNT, LEFT_CX);
const rightXs = rowXs(RIGHT_COUNT, RIGHT_CX);

const leftBlocks: Block[] = leftXs.map((cx, i) =>
  makeBlock(
    cx, Y,
    `a_${i + 1}`,
    SRC_FILL, SRC_STROKE, SRC_STROKE_W,
    LABEL_COLOR, 18,
  ),
);

const rightBlocks: Block[] = rightXs.map((cx, i) =>
  makeBlock(
    cx, Y,
    `b_${i + 1}`,
    REP_FILL, REP_STROKE, REP_STROKE_W,
    REP_LABEL_COLOR, 18,
  ),
);

// Captions above each set.
const leftCaption = new sd.Math({
  targetNode: svg,
  text: "\\{ a_1, \\dots, a_n \\}",
  cx: LEFT_CX, cy: -(BLOCK_H / 2) - 22,
  fontSize: 17, fill: LABEL_COLOR, opacity: 0,
});

const rightCaption = new sd.Math({
  targetNode: svg,
  text: "B",
  cx: RIGHT_CX, cy: -(BLOCK_H / 2) - 22,
  fontSize: 22, fill: REP_STROKE, opacity: 0,
});

// Compression arrow — one sd.Path so the shaft and the V-head fade in
// together. Stroke-only, no fill.
const LEFT_RIGHT_EDGE = LEFT_CX + (LEFT_COUNT * BLOCK_W + (LEFT_COUNT - 1) * BLOCK_GAP) / 2;
const RIGHT_LEFT_EDGE = RIGHT_CX - (RIGHT_COUNT * BLOCK_W + (RIGHT_COUNT - 1) * BLOCK_GAP) / 2;
const ARROW_TAIL = LEFT_RIGHT_EDGE + 20;
const ARROW_TIP = RIGHT_LEFT_EDGE - 20;
const HEAD_LEN = 12;
const HEAD_HALF = 8;
const arrow = new sd.Path({
  targetNode: svg,
  d: [
    `M ${ARROW_TAIL} ${Y}`,
    `L ${ARROW_TIP} ${Y}`,
    `M ${ARROW_TIP - HEAD_LEN} ${Y - HEAD_HALF}`,
    `L ${ARROW_TIP} ${Y}`,
    `L ${ARROW_TIP - HEAD_LEN} ${Y + HEAD_HALF}`,
  ].join(" "),
  stroke: REP_STROKE,
  strokeWidth: 3,
  fill: "none",
  opacity: 0,
});
const arrowLabel = new sd.Math({
  targetNode: svg,
  text: "\\text{线性基}",
  cx: (ARROW_TAIL + ARROW_TIP) / 2,
  cy: Y - 22,
  fontSize: 18, fill: REP_STROKE, opacity: 0,
});

const DUR = 340;

function fadeIn(el: sd.Rect | sd.Math | sd.Line | sd.Path, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
}

sd.main(async () => {
  // p1: the original set appears, blocks stagger in.
  for (let i = 0; i < leftBlocks.length; i++) {
    fadeIn(leftBlocks[i].bg, i * 110);
    fadeIn(leftBlocks[i].label, i * 110 + 80);
  }
  fadeIn(leftCaption, leftBlocks.length * 110 + 80);
  await sd.pause();

  // p2: compression arrow + label fade in together.
  fadeIn(arrow);
  fadeIn(arrowLabel, 120);
  await sd.pause();

  // p3: B lands — smaller, accent fill.
  for (let i = 0; i < rightBlocks.length; i++) {
    fadeIn(rightBlocks[i].bg, i * 160);
    fadeIn(rightBlocks[i].label, i * 160 + 80);
  }
  fadeIn(rightCaption, rightBlocks.length * 160 + 100);
  await sd.pause();
});
