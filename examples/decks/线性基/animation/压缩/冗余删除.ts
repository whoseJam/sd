import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// {3, 5, 6} → notice 6 = 3 ⊕ 5 → drop 6 → {3, 5}.
// 原集合能 XOR 出的值 = 新集合能 XOR 出的值 = {0, 3, 5, 6}.

const CELL_W = 26;
const CELL_H = 22;
const CELL_GAP = 4;
const TOTAL_W = 4 * CELL_W + 3 * CELL_GAP;

const bitX = (bit: number) =>
  -TOTAL_W / 2 + CELL_W / 2 + (3 - bit) * (CELL_W + CELL_GAP);

const ROW_Y = [80, 35, -10];
const LABEL_X = -TOTAL_W / 2 - CELL_W / 2 - 16;
const DECIMAL_X = TOTAL_W / 2 + 24;

const NEUTRAL = C.darkButtonGrey;
const FAINT = C.silver;
const ACCENT = C.darkOrange;
const HIGHLIGHT = C.steelBlue;

const VECTORS = [
  { label: "\\vec{a}", bits: [0, 0, 1, 1], value: 3 },
  { label: "\\vec{b}", bits: [0, 1, 0, 1], value: 5 },
  { label: "\\vec{c}", bits: [0, 1, 1, 0], value: 6 },
];

interface Row {
  label: sd.Math;
  cellBgs: sd.Rect[];
  cellTexts: sd.Text[];
  decimal: sd.Math;
}

function makeRow(spec: typeof VECTORS[number], cy: number): Row {
  const label = new sd.Math({
    targetNode: svg, text: spec.label,
    cx: LABEL_X, cy: cy - 1,
    fontSize: 15, fill: NEUTRAL, opacity: 0,
  });
  const cellBgs: sd.Rect[] = [];
  const cellTexts: sd.Text[] = [];
  for (let i = 0; i < 4; i++) {
    const bit = 3 - i;
    const cx = bitX(bit);
    cellBgs.push(new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2, y: cy - CELL_H / 2,
      width: CELL_W, height: CELL_H,
      fill: C.white, stroke: FAINT, strokeWidth: 1,
      rx: 3, ry: 3, opacity: 0,
    }));
    cellTexts.push(new sd.Text({
      targetNode: svg,
      text: String(spec.bits[i]), cx, cy: cy - 1,
      fontSize: 13, fill: NEUTRAL, opacity: 0,
    }));
  }
  const decimal = new sd.Math({
    targetNode: svg, text: `= ${spec.value}`,
    cx: DECIMAL_X, cy: cy - 1,
    fontSize: 15, fill: NEUTRAL, opacity: 0,
  });
  return { label, cellBgs, cellTexts, decimal };
}

const rows: Row[] = VECTORS.map((v, i) => makeRow(v, ROW_Y[i]));

const equation = new sd.Math({
  targetNode: svg,
  text: "\\vec{c} = \\vec{a} \\oplus \\vec{b}",
  cx: 0, cy: -55,
  fontSize: 17, fill: HIGHLIGHT, opacity: 0,
});

const strikeLine = new sd.Line({
  targetNode: svg,
  x1: -TOTAL_W / 2 - CELL_W / 2 - 6, y1: ROW_Y[2],
  x2: TOTAL_W / 2 + CELL_W / 2 + 6, y2: ROW_Y[2],
  stroke: ACCENT, strokeWidth: 1.8, opacity: 0,
});

const conclusion = new sd.Math({
  targetNode: svg,
  text: "S = \\{0,\\ 3,\\ 5,\\ 6\\}",
  cx: 0, cy: -95,
  fontSize: 16, fill: ACCENT, opacity: 0,
});

const DUR = 280;

function showRow(r: Row, delay = 0) {
  const els: Array<sd.Math | sd.Text | sd.Rect> = [
    r.label, ...r.cellBgs, ...r.cellTexts, r.decimal,
  ];
  for (let i = 0; i < els.length; i++) {
    els[i].startAnimate({ delay: delay + i * 30, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
}

function dimRow(r: Row, delay = 0) {
  const els: Array<sd.Math | sd.Text | sd.Rect> = [
    r.label, ...r.cellBgs, ...r.cellTexts, r.decimal,
  ];
  for (const el of els) {
    el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setOpacity(0.25).endAnimate();
  }
}

sd.main(async () => {
  // p1: show all three vectors.
  for (let i = 0; i < 3; i++) showRow(rows[i], i * 220);
  await sd.pause();

  // p2: reveal that c = a ⊕ b. Pulse a and b's rows.
  equation.startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  for (let row = 0; row <= 1; row++) {
    for (const bg of rows[row].cellBgs) {
      bg.startAnimate({ delay: 100, duration: 200, easing: E.easeOut })
        .setStroke(HIGHLIGHT).setStrokeWidth(1.6).endAnimate();
      bg.startAnimate({ delay: 700, duration: 240, easing: E.easeOut })
        .setStroke(FAINT).setStrokeWidth(1).endAnimate();
    }
  }
  await sd.pause();

  // p3: c is redundant — strike through, dim.
  strikeLine.startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  dimRow(rows[2], 200);
  await sd.pause();

  // p4: S unchanged.
  conclusion.startAnimate({ duration: 380, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();
});
