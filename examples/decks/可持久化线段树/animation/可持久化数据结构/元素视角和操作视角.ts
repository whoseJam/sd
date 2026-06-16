import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 5;
const CELL_W = 30;
const CELL_H = 20;
const GAP = 3;
const ARRAY_W = N * CELL_W + (N - 1) * GAP;

const LEFT_CX = -150;
const RIGHT_CX = 150;
const LEFT_X0 = LEFT_CX - ARRAY_W / 2;
const RIGHT_X0 = RIGHT_CX - ARRAY_W / 2;

const ROW_GAP = 38;
const TOP_Y = 70;
const COMPUTED_Y = TOP_Y - 3 * ROW_GAP;

const S0 = [1, 1, 1, 1, 1];
const ops = [
  { idx: 2, delta: 3, label: "3" },
  { idx: 4, set: -2, label: "-2" },
  { idx: 3, delta: 5, label: "5" },
];

function apply(values: number[], op: (typeof ops)[number]): number[] {
  const next = [...values];
  next[op.idx - 1] =
    op.set !== undefined ? op.set : next[op.idx - 1] + (op.delta ?? 0);
  return next;
}

const states: number[][] = [S0];
for (const op of ops) states.push(apply(states[states.length - 1], op));

interface Row {
  rects: sd.Rect[];
  texts: sd.Text[];
  cx: number[];
}

function makeRow(
  x0: number,
  y: number,
  values: number[],
  stroke: string,
  dashed = false,
): Row {
  const rects: sd.Rect[] = [];
  const texts: sd.Text[] = [];
  const cx: number[] = [];
  for (let i = 0; i < N; i++) {
    const cellCx = x0 + i * (CELL_W + GAP) + CELL_W / 2;
    cx.push(cellCx);
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
        strokeDashArray: dashed ? [3, 3] : undefined,
        rx: 3,
        ry: 3,
        opacity: 0,
      }),
    );
    const t = new sd.Text({
      targetNode: svg,
      text: String(values[i]),
      fontSize: 12,
      fill: C.darkButtonGrey,
      opacity: 0,
    });
    t.setCx(cellCx).setCy(y - 1);
    texts.push(t);
  }
  return { rects, texts, cx };
}

const leftRows: Row[] = [];
for (let r = 0; r < 4; r++) {
  leftRows.push(
    makeRow(LEFT_X0, TOP_Y - r * ROW_GAP, states[r], C.darkButtonGrey),
  );
}

const rightS0 = makeRow(RIGHT_X0, TOP_Y, S0, C.steelBlue);

const STEP_GAP = 26;
const STEP_Y0 = TOP_Y - 26;
const CHIP_H = 16;
const CHIP_WIDE = 26;
const CHIP_NARROW = 20;
const NOTCH_H = 5;
const NOTCH_W = 7;
const stepLabels: sd.Text[] = [];
const stepChips: sd.Rect[] = [];
const stepNotches: sd.Polygon[] = [];
const stepMarkers: sd.Text[] = [];
const stepCx: number[] = [];
for (let k = 0; k < ops.length; k++) {
  const op = ops[k];
  const isSet = op.set !== undefined;
  const colIdx = op.idx - 1;
  const cx = RIGHT_X0 + colIdx * (CELL_W + GAP) + CELL_W / 2;
  const cy = STEP_Y0 - k * STEP_GAP;
  const w = isSet ? CHIP_WIDE : CHIP_NARROW;
  stepCx.push(cx);
  const chip = new sd.Rect({
    targetNode: svg,
    x: cx - w / 2,
    y: cy - CHIP_H / 2,
    width: w,
    height: CHIP_H,
    fill: isSet ? C.darkSlateGrey : C.white,
    stroke: isSet ? C.none : C.silver,
    strokeWidth: isSet ? 0 : 0.8,
    rx: isSet ? 2 : CHIP_H / 2,
    ry: isSet ? 2 : CHIP_H / 2,
    opacity: 0,
  });
  stepChips.push(chip);
  const notchTopY = cy - CHIP_H / 2;
  const notch = new sd.Polygon({
    targetNode: svg,
    points: [
      [cx - NOTCH_W / 2, notchTopY],
      [cx + NOTCH_W / 2, notchTopY],
      [cx, notchTopY - NOTCH_H],
    ],
    fill: isSet ? C.darkSlateGrey : C.silver,
    stroke: C.none,
    opacity: 0,
  });
  stepNotches.push(notch);
  const t = new sd.Text({
    targetNode: svg,
    text: op.label,
    fontSize: 12,
    fill: isSet ? C.white : C.darkButtonGrey,
    opacity: 0,
  });
  t.setCx(cx).setCy(cy - 1);
  stepLabels.push(t);
  const marker = new sd.Text({
    targetNode: svg,
    text: isSet ? "=" : "+",
    fontSize: 11,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  marker.setCx(cx - w / 2 - 6).setCy(cy - 1);
  stepMarkers.push(marker);
}

const computed = makeRow(RIGHT_X0, COMPUTED_Y, S0, C.steelBlue, true);

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    const d = i * 70;
    leftRows[0].rects[i]
      .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    leftRows[0].texts[i]
      .startAnimate({ delay: d + 60, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    rightS0.rects[i]
      .startAnimate({ delay: d + 120, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    rightS0.texts[i]
      .startAnimate({ delay: d + 180, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  for (let k = 0; k < ops.length; k++) {
    const row = leftRows[k + 1];
    const diffIdx = ops[k].idx - 1;
    for (let i = 0; i < N; i++) {
      const d = i * 50;
      const changed = i === diffIdx;
      row.rects[i]
        .startAnimate({ delay: d, duration: 220, easing: E.easeOut })
        .setOpacity(1)
        .setStroke(changed ? C.steelBlue : C.darkButtonGrey)
        .endAnimate();
      row.texts[i]
        .startAnimate({ delay: d + 60, duration: 220, easing: E.easeOut })
        .setOpacity(1)
        .setFill(changed ? C.steelBlue : C.darkButtonGrey)
        .endAnimate();
    }
    stepChips[k]
      .startAnimate({ delay: 100, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    stepNotches[k]
      .startAnimate({ delay: 100, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    stepLabels[k]
      .startAnimate({ delay: 160, duration: 220, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    stepMarkers[k]
      .startAnimate({ delay: 160, duration: 220, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    await sd.pause();
  }

  for (let i = 0; i < N; i++) {
    const d = i * 50;
    computed.rects[i]
      .startAnimate({ delay: d, duration: 220, easing: E.easeOut })
      .setOpacity(0.9)
      .endAnimate();
    computed.texts[i]
      .startAnimate({ delay: d + 50, duration: 220, easing: E.easeOut })
      .setOpacity(0.9)
      .endAnimate();
  }
  await sd.pause();

  const running = [...S0];
  for (let k = 0; k < ops.length; k++) {
    const op = ops[k];
    const isSet = op.set !== undefined;
    const cell = op.idx - 1;
    const newVal = isSet ? (op.set ?? 0) : running[cell] + (op.delta ?? 0);
    running[cell] = newVal;
    if (isSet) {
      stepChips[k]
        .startAnimate({ duration: 280, easing: E.easeOut })
        .setFill(C.steelBlue)
        .endAnimate();
    } else {
      stepChips[k]
        .startAnimate({ duration: 280, easing: E.easeOut })
        .setStroke(C.steelBlue)
        .endAnimate();
      stepLabels[k]
        .startAnimate({ duration: 280, easing: E.easeOut })
        .setFill(C.steelBlue)
        .endAnimate();
    }
    stepNotches[k]
      .startAnimate({ duration: 280, easing: E.easeOut })
      .setFill(C.steelBlue)
      .endAnimate();
    stepMarkers[k]
      .startAnimate({ duration: 280, easing: E.easeOut })
      .setFill(C.steelBlue)
      .endAnimate();
    computed.texts[cell]
      .startAnimate({ delay: 280, duration: 280, easing: E.easeOut })
      .setText(String(newVal))
      .setCx(computed.cx[cell])
      .setFill(C.steelBlue)
      .endAnimate();
    computed.rects[cell]
      .startAnimate({ delay: 280, duration: 280, easing: E.easeOut })
      .setStroke(C.steelBlue)
      .endAnimate();
    await sd.pause();
  }
});
