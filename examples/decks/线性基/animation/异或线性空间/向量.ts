import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Same design language as 建基: a vector = a row of 4 bit cells, the
// label uses \vec{} for the arrow-on-top convention.
//   \vec{a}            [0 1 0 1]
//   ⊕  \vec{b}         [0 0 1 1]
//   ─────────────────
//   \vec{a} ⊕ \vec{b}  [0 1 1 0]

const CELL_W = 30;
const CELL_H = 24;
const CELL_GAP = 4;
const TOTAL_W = 4 * CELL_W + 3 * CELL_GAP;

// MSB on the left (bit 3 leftmost), LSB on the right (bit 0).
const bitX = (bit: number) =>
  -TOTAL_W / 2 + CELL_W / 2 + (3 - bit) * (CELL_W + CELL_GAP);

const ROW_A_Y = 70;
const ROW_B_Y = 15;
const LINE_Y = -22;
const ROW_R_Y = -60;
const LABEL_X = -TOTAL_W / 2 - CELL_W / 2 - 16;
const OPLUS_X = LABEL_X - 22;

const NEUTRAL = C.darkButtonGrey;
const FAINT = C.silver;
const ACCENT = C.darkOrange;

// MSB first: bits[0] → bit 3 (leftmost), bits[3] → bit 0 (rightmost).
const A_BITS = [0, 1, 0, 1];
const B_BITS = [0, 0, 1, 1];
const R_BITS = [0, 1, 1, 0];

interface Cell { bg: sd.Rect; text: sd.Text; }
function makeCell(cx: number, cy: number, txt: string, color: sd.SDColor): Cell {
  return {
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2, y: cy - CELL_H / 2,
      width: CELL_W, height: CELL_H,
      fill: C.white, stroke: FAINT, strokeWidth: 1,
      rx: 3, ry: 3, opacity: 0,
    }),
    text: new sd.Text({
      targetNode: svg,
      text: txt, cx, cy: cy - 1,
      fontSize: 13, fill: color, opacity: 0,
    }),
  };
}

function makeRow(bits: number[], cy: number, color: sd.SDColor): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < 4; i++) {
    const bit = 3 - i;
    cells.push(makeCell(bitX(bit), cy, String(bits[i]), color));
  }
  return cells;
}

const aRow = makeRow(A_BITS, ROW_A_Y, NEUTRAL);
const bRow = makeRow(B_BITS, ROW_B_Y, NEUTRAL);
const rRow = makeRow(R_BITS, ROW_R_Y, ACCENT);

const aLabel = new sd.Math({
  targetNode: svg, text: "\\vec{a}",
  cx: LABEL_X, cy: ROW_A_Y - 1, fontSize: 15,
  fill: NEUTRAL, opacity: 0,
});
const bLabel = new sd.Math({
  targetNode: svg, text: "\\vec{b}",
  cx: LABEL_X, cy: ROW_B_Y - 1, fontSize: 15,
  fill: NEUTRAL, opacity: 0,
});
const oplusLabel = new sd.Math({
  targetNode: svg, text: "\\oplus",
  cx: OPLUS_X, cy: ROW_B_Y - 1, fontSize: 14,
  fill: NEUTRAL, opacity: 0,
});
const rLabel = new sd.Math({
  targetNode: svg, text: "\\vec{a} \\oplus \\vec{b}",
  cx: LABEL_X - 16, cy: ROW_R_Y - 1, fontSize: 15,
  fill: ACCENT, opacity: 0,
});

const sumLine = new sd.Line({
  targetNode: svg,
  x1: -TOTAL_W / 2 - 4, y1: LINE_Y,
  x2: TOTAL_W / 2 + 4, y2: LINE_Y,
  stroke: NEUTRAL, strokeWidth: 1.4, opacity: 0,
});

const DUR = 300;

function fadeInRow(row: Cell[], delay = 0) {
  for (let i = 0; i < row.length; i++) {
    row[i].bg.startAnimate({ delay: delay + i * 70, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    row[i].text.startAnimate({ delay: delay + i * 70 + 50, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
}

sd.main(async () => {
  // p1: vector a — establishes "vector = row of bit cells, label has →".
  aLabel.startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  fadeInRow(aRow, 80);
  await sd.pause();

  // p2: vector b stacks below with ⊕ at the front.
  bLabel.startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  oplusLabel.startAnimate({ delay: 60, duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  fadeInRow(bRow, 80);
  await sd.pause();

  // p3: horizontal line + result row computed column-by-column.
  sumLine.startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  rLabel.startAnimate({ delay: 200, duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  for (let i = 0; i < 4; i++) {
    const d = 320 + i * 140;
    // pulse the source columns
    aRow[i].bg.startAnimate({ delay: d, duration: 180, easing: E.easeOut })
      .setStroke(ACCENT).setStrokeWidth(1.6).endAnimate();
    aRow[i].bg.startAnimate({ delay: d + 380, duration: 220, easing: E.easeOut })
      .setStroke(FAINT).setStrokeWidth(1).endAnimate();
    bRow[i].bg.startAnimate({ delay: d, duration: 180, easing: E.easeOut })
      .setStroke(ACCENT).setStrokeWidth(1.6).endAnimate();
    bRow[i].bg.startAnimate({ delay: d + 380, duration: 220, easing: E.easeOut })
      .setStroke(FAINT).setStrokeWidth(1).endAnimate();
    // result cell lands
    rRow[i].bg.startAnimate({ delay: d + 120, duration: DUR, easing: E.easeOut })
      .setOpacity(1).setStroke(ACCENT).setStrokeWidth(1.4).endAnimate();
    rRow[i].text.startAnimate({ delay: d + 180, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();
});
