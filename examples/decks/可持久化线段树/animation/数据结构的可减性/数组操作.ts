import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 6;
const CELL_W = 44;
const CELL_H = 26;
const GAP = 4;
const ARRAY_W = N * CELL_W + (N - 1) * GAP;
const X0 = -ARRAY_W / 2;

const S_Y = -30;
const M_Y = 40;

const sValues = [3, 1, 5, 2, 4, 6];
const region = { l: 2, r: 5, delta: 4 };

interface Row {
  rects: sd.Rect[];
  texts: sd.Text[];
}

function makeRow(y: number, values: (number | string)[], stroke: string): Row {
  const rects: sd.Rect[] = [];
  const texts: sd.Text[] = [];
  for (let i = 0; i < N; i++) {
    const cx = X0 + i * (CELL_W + GAP) + CELL_W / 2;
    rects.push(
      new sd.Rect({
        targetNode: svg,
        x: X0 + i * (CELL_W + GAP),
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

const sRow = makeRow(S_Y, sValues, C.darkButtonGrey);
const mInitial: (number | string)[] = ["0", "0", "0", "0", "0", "0"];
const mRow = makeRow(M_Y, mInitial, C.silver);

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    const d = i * 70;
    sRow.rects[i]
      .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    sRow.texts[i]
      .startAnimate({ delay: d + 60, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  for (let i = 0; i < N; i++) {
    const d = i * 70;
    mRow.rects[i]
      .startAnimate({ delay: d, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    mRow.texts[i]
      .startAnimate({ delay: d + 60, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  for (let i = 0; i < N; i++) {
    const inRegion = i + 1 >= region.l && i + 1 <= region.r;
    if (!inRegion) continue;
    mRow.texts[i]
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setText(`+${region.delta}`)
      .setFill(C.steelBlue)
      .endAnimate();
    mRow.rects[i]
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setStroke(C.steelBlue)
      .endAnimate();
  }
  await sd.pause();

  for (let i = 0; i < N; i++) {
    const inRegion = i + 1 >= region.l && i + 1 <= region.r;
    const next = inRegion ? sValues[i] + region.delta : sValues[i];
    if (next === sValues[i]) continue;
    sRow.texts[i]
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setText(String(next))
      .setFill(C.steelBlue)
      .endAnimate();
    sRow.rects[i]
      .startAnimate({ duration: 240, easing: E.easeOut })
      .setStroke(C.steelBlue)
      .endAnimate();
  }
  await sd.pause();
});
