import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// All-animation walkthrough of building a 4-bit basis from {7, 5, 3}.
// Each insert:
//   1. x appears at the top with its 4 bits
//   2. leading bit highlights
//   3. a beam reaches down to b[i] at that slot
//   4. if b[i] is occupied: pulse, then x's bits flip (XOR effect),
//      leading bit moves; beam fades and the loop continues
//   5. if b[i] is empty: pulse, b[i] fills with x's bits, x fades

const CELL_W = 30;
const CELL_H = 24;
const CELL_GAP = 4;
const TOTAL_W = 4 * CELL_W + 3 * CELL_GAP;

// MSB on the left (bit 3 leftmost), LSB on the right (bit 0).
function bitX(bit: number): number {
  return -TOTAL_W / 2 + CELL_W / 2 + (3 - bit) * (CELL_W + CELL_GAP);
}

const WR_Y = 95;
const SLOT_Y = [20, -15, -50, -85]; // slot 3, 2, 1, 0 (top to bottom)
function basisCy(slot: number): number {
  return SLOT_Y[3 - slot];
}

const LABEL_X = -TOTAL_W / 2 - CELL_W / 2 - 14;

const PLACED_FILL = "#fdecd9";
const PLACED_STROKE = C.darkOrange;
const ACTIVE_FILL = "#e3f2fd";
const ACTIVE_STROKE = C.steelBlue;
const NEUTRAL = C.darkButtonGrey;
const FAINT = C.silver;

interface Cell { bg: sd.Rect; text: sd.Text; }
function makeCell(cx: number, cy: number, txt: string, txtFill: sd.SDColor): Cell {
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
      fontSize: 13, fill: txtFill,
      opacity: 0,
    }),
  };
}

// x register (xCells[bit] indexed by bit value).
const xCells: Cell[] = [];
for (let bit = 0; bit <= 3; bit++) {
  xCells[bit] = makeCell(bitX(bit), WR_Y, "0", NEUTRAL);
}

const xLabel = new sd.Math({
  targetNode: svg, text: "\\vec{x}",
  cx: LABEL_X, cy: WR_Y - 1,
  fontSize: 15, fill: NEUTRAL, opacity: 0,
});

// Beam: vertical line from x bottom to a basis row top. Endpoints animated.
const beam = new sd.Line({
  targetNode: svg,
  x1: bitX(0), y1: WR_Y - CELL_H / 2,
  x2: bitX(0), y2: basisCy(0) + CELL_H / 2,
  stroke: ACTIVE_STROKE, strokeWidth: 1.8,
  strokeDashArray: [5, 4],
  opacity: 0,
});

// Basis grid (basis[slot][bit]).
const basis: Cell[][] = [];
const slotLabels: sd.Math[] = [];
for (let slot = 3; slot >= 0; slot--) {
  const cy = basisCy(slot);
  const row: Cell[] = [];
  for (let bit = 0; bit <= 3; bit++) {
    row[bit] = makeCell(bitX(bit), cy, "0", FAINT);
  }
  basis.push(row);
  slotLabels.push(new sd.Math({
    targetNode: svg, text: `\\vec{b}_${slot}`,
    cx: LABEL_X, cy: cy - 1,
    fontSize: 14, fill: NEUTRAL, opacity: 0,
  }));
}
basis.reverse();
slotLabels.reverse();

// Input queue: x_1, x_2, x_3 listed on the left so the viewer can see
// what's coming and what's been processed.
const INPUTS = [7, 5, 3];
const INPUT_X = -170;
const INPUT_Y_BASE = 80;
const INPUT_Y_STEP = 36;
const inputLabels: sd.Math[] = INPUTS.map((val, i) =>
  new sd.Math({
    targetNode: svg,
    text: `\\vec{x}_${i + 1} = ${val}`,
    cx: INPUT_X, cy: INPUT_Y_BASE - i * INPUT_Y_STEP - 1,
    fontSize: 14, fill: FAINT, opacity: 0,
  }),
);

function activateInput(idx: number, delay = 0) {
  inputLabels[idx]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(ACTIVE_STROKE).endAnimate();
}

function completeInput(idx: number, delay = 0) {
  inputLabels[idx]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(PLACED_STROKE).endAnimate();
}

// ─── helpers ─────────────────────────────────────────────────────

const DUR = 280;

function showX(value: number, delay = 0) {
  for (let bit = 0; bit <= 3; bit++) {
    const v = (value >> bit) & 1;
    xCells[bit].bg
      .startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setOpacity(1).setFill(C.white).setStroke(FAINT).setStrokeWidth(1)
      .endAnimate();
    xCells[bit].text
      .startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setOpacity(1).setText(String(v)).setFill(NEUTRAL).endAnimate();
  }
}

function hideX(delay = 0) {
  for (const c of xCells) {
    c.bg.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setOpacity(0).endAnimate();
    c.text.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setOpacity(0).endAnimate();
  }
}

// Highlight a single x cell with a thicker blue stroke; un-highlight others.
function highlightLeadingBit(bit: number, delay = 0) {
  for (let b = 0; b <= 3; b++) {
    const isLead = b === bit;
    xCells[b].bg
      .startAnimate({ delay, duration: 280, easing: E.easeOut })
      .setStroke(isLead ? ACTIVE_STROKE : FAINT)
      .setStrokeWidth(isLead ? 2.4 : 1)
      .endAnimate();
  }
}

function beamTo(bit: number, slot: number, delay = 0, dur = 320) {
  // Snap endpoints into position while invisible, then fade in. Avoids
  // the "drifting from a previous endpoint" look.
  beam.startAnimate({ delay, duration: 1, easing: E.easeOut })
    .setX1(bitX(bit)).setX2(bitX(bit))
    .setY2(basisCy(slot) + CELL_H / 2)
    .endAnimate();
  beam.startAnimate({ delay: delay + 4, duration: dur, easing: E.easeOut })
    .setOpacity(1).endAnimate();
}

function fadeBeam(delay = 0) {
  beam.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(0).endAnimate();
}

function pulseRow(slot: number, delay = 0) {
  for (let bit = 0; bit <= 3; bit++) {
    basis[slot][bit].bg
      .startAnimate({ delay, duration: 200, easing: E.easeOut })
      .setStrokeWidth(2.6).endAnimate();
    basis[slot][bit].bg
      .startAnimate({ delay: delay + 380, duration: 220, easing: E.easeOut })
      .setStrokeWidth(1.4).endAnimate();
  }
}

// Flash x cells and morph their bit values to a new XOR'd state.
function xorXBits(newValue: number, delay = 0) {
  for (let bit = 0; bit <= 3; bit++) {
    const v = (newValue >> bit) & 1;
    xCells[bit].bg
      .startAnimate({ delay, duration: 220, easing: E.easeOut })
      .setFill(ACTIVE_FILL).endAnimate();
    xCells[bit].text
      .startAnimate({ delay: delay + 120, duration: 220, easing: E.easeOut })
      .setText(String(v)).endAnimate();
    xCells[bit].bg
      .startAnimate({ delay: delay + 360, duration: 220, easing: E.easeOut })
      .setFill(C.white).endAnimate();
  }
}

function placeBasis(slot: number, value: number, delay = 0) {
  for (let bit = 0; bit <= 3; bit++) {
    const v = (value >> bit) & 1;
    const stagger = (3 - bit) * 70;
    basis[slot][bit].bg
      .startAnimate({ delay: delay + stagger, duration: DUR, easing: E.easeOut })
      .setFill(PLACED_FILL).setStroke(PLACED_STROKE).setStrokeWidth(1.4)
      .endAnimate();
    basis[slot][bit].text
      .startAnimate({ delay: delay + stagger, duration: DUR, easing: E.easeOut })
      .setText(String(v)).setFill(PLACED_STROKE).endAnimate();
  }
}

// ─── main ────────────────────────────────────────────────────────

sd.main(async () => {
  // p1: empty basis + labels.
  for (let slot = 0; slot <= 3; slot++) {
    const d = (3 - slot) * 80;
    slotLabels[slot].startAnimate({ delay: d, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    for (let bit = 0; bit <= 3; bit++) {
      basis[slot][bit].bg
        .startAnimate({ delay: d + (3 - bit) * 30, duration: DUR, easing: E.easeOut })
        .setOpacity(1).endAnimate();
      basis[slot][bit].text
        .startAnimate({ delay: d + (3 - bit) * 30 + 40, duration: DUR, easing: E.easeOut })
        .setOpacity(1).endAnimate();
    }
  }
  xLabel.startAnimate({ duration: DUR, easing: E.easeOut }).setOpacity(1).endAnimate();
  for (let i = 0; i < inputLabels.length; i++) {
    inputLabels[i].startAnimate({ delay: 200 + i * 120, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();

  // p2: x = 7 (0111), highlight bit 2.
  activateInput(0);
  showX(0b0111);
  highlightLeadingBit(2, 320);
  await sd.pause();

  // p3: beam → b[2] (empty) → place 0111.
  beamTo(2, 2);
  pulseRow(2, 360);
  placeBasis(2, 0b0111, 1000);
  hideX(1300);
  fadeBeam(1500);
  completeInput(0, 1000);
  await sd.pause();

  // p4: x = 5 (0101), highlight bit 2.
  activateInput(1);
  showX(0b0101);
  highlightLeadingBit(2, 320);
  await sd.pause();

  // p5: beam → b[2] (occupied) → XOR; x becomes 0010, leading bit now 1.
  beamTo(2, 2);
  pulseRow(2, 360);
  xorXBits(0b0010, 700);
  highlightLeadingBit(1, 1080);
  fadeBeam(1200);
  await sd.pause();

  // p6: beam → b[1] (empty) → place 0010.
  beamTo(1, 1);
  pulseRow(1, 360);
  placeBasis(1, 0b0010, 1000);
  hideX(1300);
  fadeBeam(1500);
  completeInput(1, 1000);
  await sd.pause();

  // p7: x = 3 (0011), highlight bit 1.
  activateInput(2);
  showX(0b0011);
  highlightLeadingBit(1, 320);
  await sd.pause();

  // p8: beam → b[1] (occupied) → XOR; x becomes 0001, leading bit now 0.
  beamTo(1, 1);
  pulseRow(1, 360);
  xorXBits(0b0001, 700);
  highlightLeadingBit(0, 1080);
  fadeBeam(1200);
  await sd.pause();

  // p9: beam → b[0] (empty) → place 0001.
  beamTo(0, 0);
  pulseRow(0, 360);
  placeBasis(0, 0b0001, 1000);
  hideX(1300);
  fadeBeam(1500);
  completeInput(2, 1000);
  await sd.pause();
});
