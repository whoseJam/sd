import * as sd from "@/sd";

import { gridHelpers } from "../grid";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Vertical-edge case is the horizontal sweep with axes swapped — but the
// trick reads more clearly as a decomposition: same union, two color-coded
// edge sets, total = ΣH + ΣV. We compute both with the row-flip rule, no
// transform animation needed.
const W = 20;
const H = 10;
const { UNIT, gx, gy } = gridHelpers(W, H, 22);

const H_INK = C.steelBlue;
const V_INK = C.mediumSeaGreen;
const TEXT_NEUTRAL = C.darkButtonGrey;
const GRID_INK = C.silver;

const data: [number, number, number, number][] = [
  [1, 1, 6, 4],
  [4, 3, 5, 3],
  [10, 2, 4, 5],
  [13, 5, 5, 3],
  [16, 1, 3, 4],
];

const dataRects: sd.Rect[] = [];
const gridV: sd.Line[] = [];
const gridH: sd.Line[] = [];
const hEdges: sd.Line[] = [];
const vEdges: sd.Line[] = [];

let frame: sd.Rect;
let hSumText: sd.Text;
let vSumText: sd.Text;
let totalText: sd.Text;
let sumH = 0;
let sumV = 0;

// Pin the constant prefix during setText morphs — alignCharacterSequence would
// otherwise duplicate Σ across multiple target slots and reshape the symbol.
const PIN_H = { "ΣH ": "ΣH " };
const PIN_V = { "ΣV ": "ΣV " };

// Run the row-flip sweep along an axis. `axisLen` is the cell count along
// the sweep direction; `crossLen` along the perpendicular; `add(cellIdx,
// type)` mutates the coverage array; visitor receives each flipped run
// per event group along with the event's sweep coord.
function sweep(
  axisLen: number,
  crossLen: number,
  evList: {
    sweepAt: number;
    cellStart: number;
    cellEnd: number;
    type: 1 | -1;
  }[],
  visit: (sweepAt: number, runStart: number, runEnd: number) => void,
): number {
  const seg = sd.make1d(crossLen, 0);
  evList.sort((a, b) => a.sweepAt - b.sweepAt || b.type - a.type);
  let total = 0;
  for (let k = 0; k < evList.length; ) {
    const at = evList[k].sweepAt;
    const before = seg.map((c: number) => (c > 0 ? 1 : 0));
    while (k < evList.length && evList[k].sweepAt === at) {
      const ev = evList[k++];
      for (let x = ev.cellStart; x < ev.cellEnd; x++) seg[x] += ev.type;
    }
    const after = seg.map((c: number) => (c > 0 ? 1 : 0));
    for (let l = 0, r; l < crossLen; l = r + 1) {
      r = l;
      if (before[l] === after[l]) continue;
      while (r + 1 < crossLen && before[r + 1] !== after[r + 1]) r++;
      visit(at, l, r + 1);
      total += r + 1 - l;
    }
  }
  return total;
}

sd.init(() => {
  for (let i = 1; i < W; i++) {
    gridV.push(
      new sd.Line({
        targetNode: svg,
        x1: gx(i),
        y1: gy(0),
        x2: gx(i),
        y2: gy(H),
        stroke: GRID_INK,
        strokeWidth: 0.8,
        strokeDashArray: [2, 3],
        opacity: 0,
      }),
    );
  }
  for (let j = 1; j < H; j++) {
    gridH.push(
      new sd.Line({
        targetNode: svg,
        x1: gx(0),
        y1: gy(j),
        x2: gx(W),
        y2: gy(j),
        stroke: GRID_INK,
        strokeWidth: 0.8,
        strokeDashArray: [2, 3],
        opacity: 0,
      }),
    );
  }

  frame = new sd.Rect({
    targetNode: svg,
    x: gx(0),
    y: gy(0),
    width: W * UNIT,
    height: H * UNIT,
    fill: C.none,
    stroke: C.silver,
    strokeWidth: 1.5,
    opacity: 0,
  });

  data.forEach(([x, y, w, h]) => {
    dataRects.push(
      new sd.Rect({
        targetNode: svg,
        x: gx(x),
        y: gy(y),
        width: w * UNIT,
        height: h * UNIT,
        fill: C.buttonGrey,
        stroke: C.silver,
        strokeWidth: 1,
        opacity: 0,
      }),
    );
  });

  // Stack readouts to the right of the frame at its vertical center,
  // colour-keyed so the H/V split is unmistakable.
  const READ_X = gx(W) + 16;
  const READ_CY = gy(H / 2);
  hSumText = new sd.Text({
    targetNode: svg,
    text: "ΣH 0",
    x: READ_X,
    cy: READ_CY + 22,
    fontSize: 16,
    fill: H_INK,
    opacity: 0,
  });
  vSumText = new sd.Text({
    targetNode: svg,
    text: "ΣV 0",
    x: READ_X,
    cy: READ_CY,
    fontSize: 16,
    fill: V_INK,
    opacity: 0,
  });
  // Edges + totals are deterministic from `data`; compute them in init so
  // totalText can be seeded with its final value (no morph needed for the punchline).
  const hEvs: {
    sweepAt: number;
    cellStart: number;
    cellEnd: number;
    type: 1 | -1;
  }[] = [];
  data.forEach(([x, y, w, h]) => {
    hEvs.push({ sweepAt: y, cellStart: x, cellEnd: x + w, type: 1 });
    hEvs.push({ sweepAt: y + h, cellStart: x, cellEnd: x + w, type: -1 });
  });
  const vEvs: {
    sweepAt: number;
    cellStart: number;
    cellEnd: number;
    type: 1 | -1;
  }[] = [];
  data.forEach(([x, y, w, h]) => {
    vEvs.push({ sweepAt: x, cellStart: y, cellEnd: y + h, type: 1 });
    vEvs.push({ sweepAt: x + w, cellStart: y, cellEnd: y + h, type: -1 });
  });
  sumH = sweep(W, W, hEvs, (atY, l, r) => {
    hEdges.push(
      new sd.Line({
        targetNode: svg,
        x1: gx(l),
        y1: gy(atY),
        x2: gx(r),
        y2: gy(atY),
        stroke: H_INK,
        strokeWidth: 2.2,
        opacity: 0,
      }),
    );
  });
  sumV = sweep(H, H, vEvs, (atX, l, r) => {
    vEdges.push(
      new sd.Line({
        targetNode: svg,
        x1: gx(atX),
        y1: gy(l),
        x2: gx(atX),
        y2: gy(r),
        stroke: V_INK,
        strokeWidth: 2.2,
        opacity: 0,
      }),
    );
  });

  totalText = new sd.Text({
    targetNode: svg,
    text: `= ${sumH + sumV}`,
    x: READ_X,
    cy: READ_CY - 26,
    fontSize: 18,
    fill: TEXT_NEUTRAL,
    opacity: 0,
  });
});

sd.main(async () => {
  // Layered entrance — graph paper → frame → input rects → readouts.
  for (let i = 0; i < gridV.length; i++) {
    gridV[i]
      .startAnimate({ delay: i * 8, duration: 220, easing: E.easeOut })
      .setOpacity(0.35)
      .endAnimate();
  }
  for (let j = 0; j < gridH.length; j++) {
    gridH[j]
      .startAnimate({ delay: 60 + j * 16, duration: 220, easing: E.easeOut })
      .setOpacity(0.35)
      .endAnimate();
  }
  frame
    .startAnimate({ delay: 220, duration: 400, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  for (let i = 0; i < dataRects.length; i++) {
    dataRects[i]
      .startAnimate({ delay: 340 + i * 80, duration: 300, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  hSumText
    .startAnimate({ delay: 800, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  vSumText
    .startAnimate({ delay: 880, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  await sd.pause();

  // Beat: horizontal edges assemble. Stagger by edge order so the viewer
  // sees the outline form, not a single flash.
  for (let i = 0; i < hEdges.length; i++) {
    hEdges[i]
      .startAnimate({ delay: i * 60, duration: 260, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  hSumText
    .startAnimate({
      delay: hEdges.length * 60,
      duration: 280,
      easing: E.easeOut,
    })
    .setText(`ΣH ${sumH}`, PIN_H)
    .endAnimate();

  await sd.pause();

  // Beat: vertical edges. Same algorithm, swapped axes — the green
  // strokes are the visual proof.
  for (let i = 0; i < vEdges.length; i++) {
    vEdges[i]
      .startAnimate({ delay: i * 60, duration: 260, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  vSumText
    .startAnimate({
      delay: vEdges.length * 60,
      duration: 280,
      easing: E.easeOut,
    })
    .setText(`ΣV ${sumV}`, PIN_V)
    .endAnimate();

  await sd.pause();

  totalText
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  await sd.pause();
});
