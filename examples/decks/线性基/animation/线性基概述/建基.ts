import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Hybrid: bmatrix-style typography (label + [ + bits + ]) from 异或线性空间
// page, but each piece is its own sd.Math element so we can highlight
// individual bits and aim a beam at a specific bit's column.
//
// Algorithm walkthrough builds a 4-bit basis from {7, 5, 3}:
//   insert 7 → b_2 empty → place
//   insert 5 → b_2 occupied → XOR → b_1 empty → place
//   insert 3 → b_1 occupied → XOR → b_0 empty → place

const FONT = 22;
const PITCH = 24;
const OPEN_RIGHT_X = -30;          // right edge of [, shared across rows
const BIT_3_X = OPEN_RIGHT_X + 14; // leftmost bit cx
const CLOSE_LEFT_X = BIT_3_X + 3 * PITCH + 12; // left edge of ]
const LABEL_RIGHT_X = OPEN_RIGHT_X - 12;       // right edge of label "= "

const bitX = (bit: number) => BIT_3_X + (3 - bit) * PITCH;

const WR_Y = 95;
const SLOT_Y = [20, -15, -50, -85];
const basisCy = (slot: number) => SLOT_Y[3 - slot];

const NEUTRAL = C.darkButtonGrey;
const FAINT = C.silver;
const PLACED = C.darkOrange;
const HIGHLIGHT = C.steelBlue;

interface Row {
  label: sd.Math;
  open: sd.Math;
  bits: sd.Math[]; // bits[bit]
  close: sd.Math;
}

function makeRow(labelLatex: string, bitValues: number[], cy: number, color: sd.SDColor): Row {
  // \phantom{_3} reserves subscript-height even on rows without one, so
  // every label's vertical bounding box matches → brackets line up.
  const label = new sd.Math({
    targetNode: svg, text: labelLatex,
    cy, fontSize: FONT, fill: color, opacity: 0,
  });
  label.setMaxX(LABEL_RIGHT_X);

  const open = new sd.Math({
    targetNode: svg, text: "[",
    cy, fontSize: FONT, fill: color, opacity: 0,
  });
  open.setMaxX(OPEN_RIGHT_X);

  const bits: sd.Math[] = [];
  for (let bit = 0; bit <= 3; bit++) {
    bits[bit] = new sd.Math({
      targetNode: svg, text: String(bitValues[bit]),
      cx: bitX(bit), cy,
      fontSize: FONT, fill: color, opacity: 0,
    });
  }

  const close = new sd.Math({
    targetNode: svg, text: "]",
    cy, fontSize: FONT, fill: color, opacity: 0,
  });
  close.setX(CLOSE_LEFT_X);

  return { label, open, bits, close };
}

// xRow has phantom subscript so its label height matches b_i rows.
const xRow = makeRow("\\mathbf{x}\\phantom{_3} =", [0, 0, 0, 0], WR_Y, NEUTRAL);

const basisRows: Row[] = [];
for (let slot = 3; slot >= 0; slot--) {
  basisRows.push(makeRow(`\\mathbf{b}_${slot} =`, [0, 0, 0, 0], basisCy(slot), FAINT));
}
basisRows.reverse(); // basisRows[slot]

const beam = new sd.Line({
  targetNode: svg,
  x1: bitX(0), y1: WR_Y - 14,
  x2: bitX(0), y2: basisCy(0) + 14,
  stroke: HIGHLIGHT, strokeWidth: 1.8,
  strokeDashArray: [5, 4], opacity: 0,
});

// ─── helpers ─────────────────────────────────────────────────────

const DUR = 280;
const rowParts = (r: Row): Array<sd.Math> => [r.label, r.open, ...r.bits, r.close];

function showRow(r: Row, delay = 0) {
  for (const el of rowParts(r)) {
    el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
}

function hideRow(r: Row, delay = 0) {
  for (const el of rowParts(r)) {
    el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setOpacity(0).endAnimate();
  }
}

function setRowColor(r: Row, color: sd.SDColor, delay = 0) {
  for (const el of rowParts(r)) {
    el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setFill(color).endAnimate();
  }
}

// values is MSB-first: values[0] → bit 3 (leftmost), values[3] → bit 0.
function setBits(r: Row, values: number[], delay = 0) {
  for (let i = 0; i <= 3; i++) {
    const bit = 3 - i;
    r.bits[bit].startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setText(String(values[i])).endAnimate();
  }
}

// Color the leading bit; reset others to NEUTRAL.
function highlightLeading(r: Row, bit: number, delay = 0) {
  for (let b = 0; b <= 3; b++) {
    r.bits[b].startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setFill(b === bit ? HIGHLIGHT : NEUTRAL).endAnimate();
  }
}

function beamTo(bit: number, slot: number, delay = 0) {
  beam.startAnimate({ delay, duration: 1, easing: E.easeOut })
    .setX1(bitX(bit)).setX2(bitX(bit))
    .setY2(basisCy(slot) + 14).endAnimate();
  beam.startAnimate({ delay: delay + 4, duration: 320, easing: E.easeOut })
    .setOpacity(1).endAnimate();
}

function fadeBeam(delay = 0) {
  beam.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(0).endAnimate();
}

// Brief HIGHLIGHT pulse on a basis row's bits, return to FAINT.
function pulseRow(slot: number, delay = 0) {
  for (let bit = 0; bit <= 3; bit++) {
    basisRows[slot].bits[bit]
      .startAnimate({ delay, duration: 200, easing: E.easeOut })
      .setFill(HIGHLIGHT).endAnimate();
    basisRows[slot].bits[bit]
      .startAnimate({ delay: delay + 380, duration: 220, easing: E.easeOut })
      .setFill(FAINT).endAnimate();
  }
}

// newValues is MSB-first like setBits. newLeading is a bit number.
function xorAndRehighlight(newValues: number[], newLeading: number, delay = 0) {
  for (let i = 0; i <= 3; i++) {
    const bit = 3 - i;
    // flash
    xRow.bits[bit].startAnimate({ delay, duration: 200, easing: E.easeOut })
      .setFill(HIGHLIGHT).endAnimate();
    // text change
    xRow.bits[bit].startAnimate({ delay: delay + 220, duration: 200, easing: E.easeOut })
      .setText(String(newValues[i])).endAnimate();
    // settle into new leading-bit colors
    xRow.bits[bit].startAnimate({ delay: delay + 460, duration: 240, easing: E.easeOut })
      .setFill(bit === newLeading ? HIGHLIGHT : NEUTRAL).endAnimate();
  }
}

// values is MSB-first.
function placeBasis(slot: number, values: number[], delay = 0) {
  for (let i = 0; i <= 3; i++) {
    const bit = 3 - i;
    const stagger = i * 60;
    basisRows[slot].bits[bit]
      .startAnimate({ delay: delay + stagger, duration: DUR, easing: E.easeOut })
      .setText(String(values[i])).setFill(PLACED).endAnimate();
  }
  // Also paint label and brackets in PLACED color.
  for (const el of [basisRows[slot].label, basisRows[slot].open, basisRows[slot].close]) {
    el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setFill(PLACED).endAnimate();
  }
}

// ─── main ───────────────────────────────────────────────────────

sd.main(async () => {
  // p1: empty basis appears (faint).
  for (let slot = 0; slot <= 3; slot++) {
    showRow(basisRows[slot], (3 - slot) * 90);
  }
  await sd.pause();

  // p2: insert 7 → x = [0 1 1 1], leading bit 2.
  setBits(xRow, [0, 1, 1, 1]);
  showRow(xRow);
  highlightLeading(xRow, 2, 320);
  await sd.pause();

  // p3: beam to b_2 (empty) → place 0111.
  beamTo(2, 2);
  pulseRow(2, 360);
  placeBasis(2, [0, 1, 1, 1], 1000);
  hideRow(xRow, 1320);
  fadeBeam(1500);
  await sd.pause();

  // p4: insert 5 → x = [0 1 0 1], leading bit 2.
  setBits(xRow, [0, 1, 0, 1]);
  showRow(xRow);
  highlightLeading(xRow, 2, 320);
  await sd.pause();

  // p5: beam to b_2 (occupied) → XOR. x → [0 0 1 0], leading bit 1.
  beamTo(2, 2);
  pulseRow(2, 360);
  xorAndRehighlight([0, 0, 1, 0], 1, 700);
  fadeBeam(1300);
  await sd.pause();

  // p6: beam to b_1 (empty) → place 0010.
  beamTo(1, 1);
  pulseRow(1, 360);
  placeBasis(1, [0, 0, 1, 0], 1000);
  hideRow(xRow, 1320);
  fadeBeam(1500);
  await sd.pause();

  // p7: insert 3 → x = [0 0 1 1], leading bit 1.
  setBits(xRow, [0, 0, 1, 1]);
  showRow(xRow);
  highlightLeading(xRow, 1, 320);
  await sd.pause();

  // p8: beam to b_1 (occupied) → XOR. x → [0 0 0 1], leading bit 0.
  beamTo(1, 1);
  pulseRow(1, 360);
  xorAndRehighlight([0, 0, 0, 1], 0, 700);
  fadeBeam(1300);
  await sd.pause();

  // p9: beam to b_0 (empty) → place 0001.
  beamTo(0, 0);
  pulseRow(0, 360);
  placeBasis(0, [0, 0, 0, 1], 1000);
  hideRow(xRow, 1320);
  fadeBeam(1500);
  await sd.pause();
});
