import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Establish the visual vocabulary for the rest of the deck:
//   a vector in F_2^n is rendered as a row of bit cells.
//   addition (⊕) is rendered as stacking + summing column-by-column.
// Concrete example: a = 0101, b = 0011, a ⊕ b = 0110.

const CELL_W = 36;
const CELL_H = 28;
const CELL_GAP = 4;
const TOTAL_W = 4 * CELL_W + 3 * CELL_GAP;

function bitX(bit: number): number {
  return -TOTAL_W / 2 + CELL_W / 2 + (3 - bit) * (CELL_W + CELL_GAP);
}

const ROW_A_Y = 60;
const ROW_B_Y = 5;
const ROW_R_Y = -65;
const LINE_Y = -30;
const LABEL_X = -TOTAL_W / 2 - CELL_W / 2 - 22;

const NEUTRAL = C.darkButtonGrey;
const FAINT = C.silver;
const ACCENT = C.darkOrange;

const A_BITS = [0, 1, 0, 1]; // bit 3..0 → 5
const B_BITS = [0, 0, 1, 1]; // bit 3..0 → 3
const R_BITS = [0, 1, 1, 0]; // bit 3..0 → 6

interface Cell { bg: sd.Rect; text: sd.Text; }
function makeRow(bits: number[], cy: number): Cell[] {
  const out: Cell[] = [];
  for (let bit = 3; bit >= 0; bit--) {
    const idx = 3 - bit;
    const cx = bitX(bit);
    out.push({
      bg: new sd.Rect({
        targetNode: svg, x: cx - CELL_W / 2, y: cy - CELL_H / 2,
        width: CELL_W, height: CELL_H,
        fill: C.white, stroke: FAINT, strokeWidth: 1,
        rx: 4, ry: 4, opacity: 0,
      }),
      text: new sd.Text({
        targetNode: svg, text: String(bits[idx]),
        cx, cy: cy - 1, fontSize: 14, fill: NEUTRAL, opacity: 0,
      }),
    });
  }
  return out;
}

const aRow = makeRow(A_BITS, ROW_A_Y);
const bRow = makeRow(B_BITS, ROW_B_Y);
const rRow = makeRow(R_BITS, ROW_R_Y);

const aLabel = new sd.Math({
  targetNode: svg, text: "\\mathbf{a}",
  cx: LABEL_X, cy: ROW_A_Y - 1, fontSize: 16,
  fill: NEUTRAL, opacity: 0,
});
const bLabel = new sd.Math({
  targetNode: svg, text: "\\mathbf{b}",
  cx: LABEL_X, cy: ROW_B_Y - 1, fontSize: 16,
  fill: NEUTRAL, opacity: 0,
});
const oplusLabel = new sd.Math({
  targetNode: svg, text: "\\oplus",
  cx: LABEL_X - 22, cy: ROW_B_Y - 1, fontSize: 14,
  fill: NEUTRAL, opacity: 0,
});
const rLabel = new sd.Math({
  targetNode: svg, text: "\\mathbf{a} \\oplus \\mathbf{b}",
  cx: LABEL_X - 10, cy: ROW_R_Y - 1, fontSize: 16,
  fill: ACCENT, opacity: 0,
});

const sumLine = new sd.Line({
  targetNode: svg,
  x1: bitX(3) - CELL_W / 2 - 4, y1: LINE_Y,
  x2: bitX(0) + CELL_W / 2 + 4, y2: LINE_Y,
  stroke: NEUTRAL, strokeWidth: 1.4, opacity: 0,
});

const DUR = 320;

function fadeInRow(row: Cell[], delay = 0) {
  for (let i = 0; i < row.length; i++) {
    row[i].bg.startAnimate({ delay: delay + i * 70, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    row[i].text.startAnimate({ delay: delay + i * 70 + 60, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
}

sd.main(async () => {
  // p1: vector a appears — establishes "vector = row of bits".
  aLabel.startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  fadeInRow(aRow, 100);
  await sd.pause();

  // p2: vector b stacks below with ⊕ — "add by column-XOR".
  bLabel.startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  oplusLabel.startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  fadeInRow(bRow, 100);
  await sd.pause();

  // p3: horizontal line + result row → a ⊕ b.
  sumLine.startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  rLabel.startAnimate({ delay: 200, duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  // For each result bit, briefly highlight the column above to suggest
  // "this bit is computed from those two".
  for (let bit = 3; bit >= 0; bit--) {
    const idx = 3 - bit;
    const d = 280 + idx * 100;
    const colHi = (cell: Cell) => {
      cell.bg.startAnimate({ delay: d, duration: 200, easing: E.easeOut })
        .setStroke(ACCENT).setStrokeWidth(1.6).endAnimate();
      cell.bg.startAnimate({ delay: d + 320, duration: 240, easing: E.easeOut })
        .setStroke(FAINT).setStrokeWidth(1).endAnimate();
    };
    colHi(aRow[idx]);
    colHi(bRow[idx]);
    rRow[idx].bg.startAnimate({ delay: d + 80, duration: 240, easing: E.easeOut })
      .setOpacity(1).setStroke(ACCENT).setStrokeWidth(1.4).endAnimate();
    rRow[idx].text.startAnimate({ delay: d + 140, duration: 240, easing: E.easeOut })
      .setOpacity(1).setFill(ACCENT).endAnimate();
  }
  await sd.pause();
});
