import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 5;
const CELL_W = 32;
const CELL_H = 22;
const CELL_GAP = 4;
const ARRAY_W = N * CELL_W + (N - 1) * CELL_GAP;

const LEFT_X0 = -ARRAY_W - 40;
const RIGHT_X0 = 40;
const ARRAY_Y = 0;

const initial = [1, 1, 1, 1, 1];
const ops = [
  { idx: 2, delta: 3 },
  { idx: 4, set: -2 },
  { idx: 3, delta: 5 },
];

interface ArrayView {
  rects: sd.Rect[];
  texts: sd.Text[];
  values: number[];
}

function makeArrayView(x0: number, values: number[]): ArrayView {
  const rects: sd.Rect[] = [];
  const texts: sd.Text[] = [];
  for (let i = 0; i < N; i++) {
    const cx = x0 + i * (CELL_W + CELL_GAP) + CELL_W / 2;
    rects.push(
      new sd.Rect({
        targetNode: svg,
        x: x0 + i * (CELL_W + CELL_GAP),
        y: ARRAY_Y - CELL_H / 2,
        width: CELL_W,
        height: CELL_H,
        fill: C.white,
        stroke: C.darkButtonGrey,
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
        cy: ARRAY_Y - 1,
        fontSize: 12,
        fill: C.darkButtonGrey,
        opacity: 0,
      }),
    );
  }
  return { rects, texts, values: [...values] };
}

const left = makeArrayView(LEFT_X0, initial);
const right = makeArrayView(RIGHT_X0, initial);

function applyOp(view: ArrayView, op: (typeof ops)[number]) {
  const next =
    op.set !== undefined ? op.set : view.values[op.idx - 1] + (op.delta ?? 0);
  view.values[op.idx - 1] = next;
  view.texts[op.idx - 1]
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setText(String(next))
    .endAnimate();
  view.rects[op.idx - 1]
    .startAnimate({ duration: 200, easing: E.easeOut })
    .setStroke(C.steelBlue)
    .endAnimate();
  view.rects[op.idx - 1]
    .startAnimate({ delay: 500, duration: 400, easing: E.easeOut })
    .setStroke(C.darkButtonGrey)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    const d = i * 80;
    left.rects[i]
      .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    left.texts[i]
      .startAnimate({ delay: d + 60, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    right.rects[i]
      .startAnimate({ delay: d + 200, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    right.texts[i]
      .startAnimate({ delay: d + 260, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  for (const op of ops) {
    applyOp(left, op);
    await sd.pause();
  }

  for (const op of ops) {
    applyOp(right, op);
    await sd.pause();
  }
});
