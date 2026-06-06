import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Concrete illustration: a = {3, 5}. 4 subsets, 4 XOR values.
// Subset XOR values = {0, 3, 5, 6}.

const CELL_W = 24;
const CELL_H = 20;
const CELL_GAP = 4;
const TOTAL_W = 4 * CELL_W + 3 * CELL_GAP;

const bitX = (bit: number) =>
  -TOTAL_W / 2 + CELL_W / 2 + (3 - bit) * (CELL_W + CELL_GAP);

const ROW_Y = [80, 35, -10, -55];
const SUBSET_LABEL_X = -TOTAL_W / 2 - 75;
const ARROW_X = -TOTAL_W / 2 - 16;
const DECIMAL_X = TOTAL_W / 2 + 22;

const NEUTRAL = C.darkButtonGrey;
const FAINT = C.silver;
const ACCENT = C.darkOrange;

interface Row {
  subsetLabel: sd.Math;
  arrow: sd.Text;
  cellBgs: sd.Rect[];
  cellTexts: sd.Text[];
  decimal: sd.Math;
}

const SUBSETS = [
  { label: "\\emptyset",                  bits: [0, 0, 0, 0], value: 0 },
  { label: "\\{ \\vec{a}_1 \\}",           bits: [0, 0, 1, 1], value: 3 },
  { label: "\\{ \\vec{a}_2 \\}",           bits: [0, 1, 0, 1], value: 5 },
  { label: "\\{ \\vec{a}_1, \\vec{a}_2 \\}", bits: [0, 1, 1, 0], value: 6 },
];

function makeRow(spec: typeof SUBSETS[number], cy: number): Row {
  const subsetLabel = new sd.Math({
    targetNode: svg, text: spec.label,
    cx: SUBSET_LABEL_X, cy: cy - 1,
    fontSize: 14, fill: NEUTRAL, opacity: 0,
  });
  subsetLabel.setMaxX(ARROW_X - 12);

  const arrow = new sd.Text({
    targetNode: svg, text: "→",
    cx: ARROW_X, cy: cy - 1,
    fontSize: 14, fill: NEUTRAL, opacity: 0,
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
    fontSize: 14, fill: NEUTRAL, opacity: 0,
  });

  return { subsetLabel, arrow, cellBgs, cellTexts, decimal };
}

const rows: Row[] = SUBSETS.map((s, i) => makeRow(s, ROW_Y[i]));

const conclusion = new sd.Math({
  targetNode: svg,
  text: "S = \\{0,\\ 3,\\ 5,\\ 6\\}",
  cx: 0, cy: -100,
  fontSize: 17, fill: ACCENT, opacity: 0,
});

const DUR = 280;

function showRow(r: Row, delay = 0) {
  const els: Array<sd.Math | sd.Text | sd.Rect> = [
    r.subsetLabel, r.arrow, ...r.cellBgs, ...r.cellTexts, r.decimal,
  ];
  for (let i = 0; i < els.length; i++) {
    els[i].startAnimate({ delay: delay + i * 25, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
}

sd.main(async () => {
  // p1: empty subset (∅ → 0).
  showRow(rows[0]);
  await sd.pause();

  // p2: single-element subsets.
  showRow(rows[1]);
  showRow(rows[2], 280);
  await sd.pause();

  // p3: combined subset {a_1, a_2}.
  showRow(rows[3]);
  await sd.pause();

  // p4: the result set highlighted.
  conclusion.startAnimate({ duration: 400, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  // pulse all decimals to mark them as the values of S.
  for (let i = 0; i < rows.length; i++) {
    rows[i].decimal.startAnimate({ delay: 100 + i * 80, duration: 280, easing: E.easeOut })
      .setFill(ACCENT).endAnimate();
  }
  await sd.pause();
});
