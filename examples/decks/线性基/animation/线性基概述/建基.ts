import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// 4-bit basis built from {7, 5, 3}:
//   insert 7 (0111): bit 2 empty → b[2] = 0111
//   insert 5 (0101): b[2] = 0111 → 5 ^ 7 = 2 (0010), bit 1 empty → b[1] = 0010
//   insert 3 (0011): b[1] = 0010 → 3 ^ 2 = 1 (0001), bit 0 empty → b[0] = 0001
const DIM = 4;
const ROW_Y = [60, 20, -20, -60]; // index i = b[DIM - 1 - i] so row 0 is b[3]
const CELL_W = 24;
const CELL_H = 22;
const CELL_GAP = 2;

function rowY(slot: number): number {
  // slot 3 → row 0 (top), slot 0 → row 3 (bottom)
  return ROW_Y[DIM - 1 - slot];
}

function cellCx(bit: number): number {
  // bit DIM-1 leftmost, bit 0 rightmost
  const total = DIM * CELL_W + (DIM - 1) * CELL_GAP;
  const x0 = -total / 2 + CELL_W / 2;
  return x0 + (DIM - 1 - bit) * (CELL_W + CELL_GAP);
}

const FILLED_FILL = "#fdecd9";
const FILLED_STROKE = C.darkOrange;

interface Cell { bg: sd.Rect; text: sd.Text; }
const cells: Cell[][] = [];

for (let slot = DIM - 1; slot >= 0; slot--) {
  const row: Cell[] = [];
  const cy = rowY(slot);
  for (let bit = DIM - 1; bit >= 0; bit--) {
    const cx = cellCx(bit);
    const bg = new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2, y: cy - CELL_H / 2,
      width: CELL_W, height: CELL_H,
      fill: C.white,
      stroke: C.silver,
      strokeWidth: 0.8,
      rx: 3, ry: 3,
      opacity: 0,
    });
    const text = new sd.Text({
      targetNode: svg,
      text: "0",
      cx, cy: cy - 1,
      fontSize: 12,
      fill: C.silver,
      opacity: 0,
    });
    row.push({ bg, text });
  }
  cells.push(row);
}
cells.reverse(); // index 0 = slot 0 (b[0], bottom row)

// Slot labels on the left.
const slotLabels: sd.Text[] = [];
for (let slot = 0; slot < DIM; slot++) {
  slotLabels.push(
    new sd.Text({
      targetNode: svg,
      text: `b[${slot}]`,
      cx: cellCx(DIM - 1) - CELL_W / 2 - 20,
      cy: rowY(slot) - 1,
      fontSize: 11,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

interface Step {
  captionText: string;
  slot: number;
  bits: [number, number, number, number]; // bit3, bit2, bit1, bit0
}
const STEPS: Step[] = [
  { captionText: "7 = 0111  →  b[2]", slot: 2, bits: [0, 1, 1, 1] },
  { captionText: "5 ⊕ 7 = 0010  →  b[1]", slot: 1, bits: [0, 0, 1, 0] },
  { captionText: "3 ⊕ 2 = 0001  →  b[0]", slot: 0, bits: [0, 0, 0, 1] },
];

const captions = STEPS.map((s) => new sd.Text({
  targetNode: svg,
  text: s.captionText,
  cx: 0, cy: 100,
  fontSize: 13,
  fill: C.darkOrange,
  opacity: 0,
}));

sd.main(async () => {
  // p1: empty grid + slot labels
  for (let slot = 0; slot < DIM; slot++) {
    const d = (DIM - 1 - slot) * 80;
    slotLabels[slot]
      .startAnimate({ delay: d, duration: 260, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    for (let bit = 0; bit < DIM; bit++) {
      cells[slot][bit].bg
        .startAnimate({ delay: d + bit * 40, duration: 240, easing: E.easeOut })
        .setOpacity(1).endAnimate();
      cells[slot][bit].text
        .startAnimate({ delay: d + bit * 40 + 40, duration: 240, easing: E.easeOut })
        .setOpacity(1).endAnimate();
    }
  }
  await sd.pause();

  // p2..p4: insertion steps
  for (let si = 0; si < STEPS.length; si++) {
    const step = STEPS[si];
    // Fade out the previous caption, fade in the current one.
    if (si > 0) {
      captions[si - 1]
        .startAnimate({ duration: 260, easing: E.easeOut })
        .setOpacity(0).endAnimate();
    }
    captions[si]
      .startAnimate({ duration: 320, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    const slotIdx = step.slot;
    for (let bit = 0; bit < DIM; bit++) {
      const b = step.bits[DIM - 1 - bit]; // bits stored MSB first
      const cell = cells[slotIdx][bit];
      const d = 220 + (DIM - 1 - bit) * 90;
      cell.bg
        .startAnimate({ delay: d, duration: 280, easing: E.easeOut })
        .setFill(FILLED_FILL).setStroke(FILLED_STROKE).setStrokeWidth(1.2)
        .endAnimate();
      cell.text
        .startAnimate({ delay: d, duration: 280, easing: E.easeOut })
        .setText(String(b)).setFill(FILLED_STROKE).endAnimate();
    }
    await sd.pause();
  }
});
