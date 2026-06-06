import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Show inputs first, then enumerate all subset XOR values.
//   a = {a_1 = 3, a_2 = 5}
//   subsets: ∅, {a_1}, {a_2}, {a_1, a_2}
//   XOR values: {0, 3, 5, 6}

const CELL_W = 24;
const CELL_H = 20;
const CELL_GAP = 4;
const TOTAL_W = 4 * CELL_W + 3 * CELL_GAP;

const bitX = (bit: number) =>
  -TOTAL_W / 2 + CELL_W / 2 + (3 - bit) * (CELL_W + CELL_GAP);

// Top: inputs. Bottom: subset → XOR enumeration.
const INPUT_Y = [110, 75];
const ROW_Y = [20, -15, -50, -85];
const LEFT_LABEL_X = -TOTAL_W / 2 - 75;
const ARROW_X = -TOTAL_W / 2 - 16;
const DECIMAL_X = TOTAL_W / 2 + 22;

const NEUTRAL = C.darkButtonGrey;
const FAINT = C.silver;
const ACCENT = C.darkOrange;

interface Row {
  leftLabel: sd.Math;
  arrow: sd.Text | null;
  cellBgs: sd.Rect[];
  cellTexts: sd.Text[];
  decimal: sd.Math;
}

function makeRow(opts: {
  labelLatex: string;
  bits: number[];
  decimal: number;
  cy: number;
  hasArrow: boolean;
}): Row {
  const leftLabel = new sd.Math({
    targetNode: svg, text: opts.labelLatex,
    cx: LEFT_LABEL_X, cy: opts.cy - 1,
    fontSize: 14, fill: NEUTRAL, opacity: 0,
  });
  leftLabel.setMaxX(ARROW_X - 12);

  const arrow = opts.hasArrow
    ? new sd.Text({
        targetNode: svg, text: "→",
        cx: ARROW_X, cy: opts.cy - 1,
        fontSize: 14, fill: NEUTRAL, opacity: 0,
      })
    : null;

  const cellBgs: sd.Rect[] = [];
  const cellTexts: sd.Text[] = [];
  for (let i = 0; i < 4; i++) {
    const bit = 3 - i;
    const cx = bitX(bit);
    cellBgs.push(new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2, y: opts.cy - CELL_H / 2,
      width: CELL_W, height: CELL_H,
      fill: C.white, stroke: FAINT, strokeWidth: 1,
      rx: 3, ry: 3, opacity: 0,
    }));
    cellTexts.push(new sd.Text({
      targetNode: svg,
      text: String(opts.bits[i]), cx, cy: opts.cy - 1,
      fontSize: 13, fill: NEUTRAL, opacity: 0,
    }));
  }

  const decimal = new sd.Math({
    targetNode: svg, text: `= ${opts.decimal}`,
    cx: DECIMAL_X, cy: opts.cy - 1,
    fontSize: 14, fill: NEUTRAL, opacity: 0,
  });

  return { leftLabel, arrow, cellBgs, cellTexts, decimal };
}

const inputs: Row[] = [
  makeRow({ labelLatex: "\\vec{a}_1", bits: [0, 0, 1, 1], decimal: 3, cy: INPUT_Y[0], hasArrow: false }),
  makeRow({ labelLatex: "\\vec{a}_2", bits: [0, 1, 0, 1], decimal: 5, cy: INPUT_Y[1], hasArrow: false }),
];

const subsets: Row[] = [
  makeRow({ labelLatex: "\\emptyset",                  bits: [0, 0, 0, 0], decimal: 0, cy: ROW_Y[0], hasArrow: true }),
  makeRow({ labelLatex: "\\{ \\vec{a}_1 \\}",           bits: [0, 0, 1, 1], decimal: 3, cy: ROW_Y[1], hasArrow: true }),
  makeRow({ labelLatex: "\\{ \\vec{a}_2 \\}",           bits: [0, 1, 0, 1], decimal: 5, cy: ROW_Y[2], hasArrow: true }),
  makeRow({ labelLatex: "\\{ \\vec{a}_1, \\vec{a}_2 \\}", bits: [0, 1, 1, 0], decimal: 6, cy: ROW_Y[3], hasArrow: true }),
];

const conclusion = new sd.Math({
  targetNode: svg,
  text: "S = \\{0,\\ 3,\\ 5,\\ 6\\}",
  cx: 0, cy: -125,
  fontSize: 17, fill: ACCENT, opacity: 0,
});

const DUR = 280;

function showRow(r: Row, delay = 0) {
  const els: Array<sd.Math | sd.Text | sd.Rect> = [
    r.leftLabel,
    ...(r.arrow ? [r.arrow] : []),
    ...r.cellBgs, ...r.cellTexts, r.decimal,
  ];
  for (let i = 0; i < els.length; i++) {
    els[i].startAnimate({ delay: delay + i * 25, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
}

sd.main(async () => {
  // p1: input set {a_1 = 3, a_2 = 5}.
  showRow(inputs[0]);
  showRow(inputs[1], 240);
  await sd.pause();

  // p2: empty subset (∅ → 0).
  showRow(subsets[0]);
  await sd.pause();

  // p3: single-element subsets.
  showRow(subsets[1]);
  showRow(subsets[2], 260);
  await sd.pause();

  // p4: combined subset {a_1, a_2}.
  showRow(subsets[3]);
  await sd.pause();

  // p5: result set S = {0, 3, 5, 6} — all four decimals turn orange.
  conclusion.startAnimate({ duration: 400, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  for (let i = 0; i < subsets.length; i++) {
    subsets[i].decimal
      .startAnimate({ delay: 100 + i * 80, duration: 280, easing: E.easeOut })
      .setFill(ACCENT).endAnimate();
  }
  await sd.pause();
});
