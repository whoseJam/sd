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

const WR_Y = 70;
const WR_DIVIDER_Y = 38; // thin line separating x register from basis
const SLOT_Y = [10, -25, -60, -95]; // slot 3, 2, 1, 0 (top to bottom)
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

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
function makeCell(
  cx: number,
  cy: number,
  txt: string,
  txtFill: sd.SDColor,
): Cell {
  return {
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: cy - CELL_H / 2,
      width: CELL_W,
      height: CELL_H,
      fill: C.white,
      stroke: FAINT,
      strokeWidth: 1,
      rx: 3,
      ry: 3,
      opacity: 0,
    }),
    text: new sd.Text({
      targetNode: svg,
      text: txt,
      cx,
      cy: cy - 1,
      fontSize: 13,
      fill: txtFill,
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
  targetNode: svg,
  text: "\\vec{x}",
  cx: LABEL_X,
  cy: WR_Y - 1,
  fontSize: 15,
  fill: NEUTRAL,
  opacity: 0,
});

// Beam: vertical line from x bottom to a basis row top. Endpoints animated.
const beam = new sd.Line({
  targetNode: svg,
  x1: bitX(0),
  y1: WR_Y - CELL_H / 2,
  x2: bitX(0),
  y2: basisCy(0) + CELL_H / 2,
  stroke: ACTIVE_STROKE,
  strokeWidth: 1.8,
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
  slotLabels.push(
    new sd.Math({
      targetNode: svg,
      text: `\\vec{b}_${slot}`,
      cx: LABEL_X,
      cy: cy - 1,
      fontSize: 14,
      fill: NEUTRAL,
      opacity: 0,
    }),
  );
}
basis.reverse();
slotLabels.reverse();

// Input queue: shows what comes in and what's already been processed.
// Walks every case: direct place (13), one-XOR place (11), one-XOR place
// at a different slot (14), multi-XOR reducing to 0 = redundant (8).
const INPUTS = [13, 11, 14, 8];
const INPUT_X = -170;
const INPUT_Y_BASE = 90;
const INPUT_Y_STEP = 30;
const inputLabels: sd.Math[] = INPUTS.map(
  (val, i) =>
    new sd.Math({
      targetNode: svg,
      text: `\\vec{a}_${i + 1} = ${val}`,
      cx: INPUT_X,
      by: INPUT_Y_BASE - i * INPUT_Y_STEP - 1,
      fontSize: 14,
      fill: FAINT,
      opacity: 0,
    }),
);

function activateInput(idx: number, delay = 0) {
  inputLabels[idx]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(ACTIVE_STROKE)
    .endAnimate();
}

function completeInput(idx: number, delay = 0) {
  inputLabels[idx]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(PLACED_STROKE)
    .endAnimate();
}

function rejectInput(idx: number, delay = 0) {
  // 冗余：x XOR 化简到 0，没有进任何 slot。Label 维持 FAINT 灰色。
  inputLabels[idx]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(FAINT)
    .endAnimate();
}

// Pointer: a small filled dot on the left of the queue that moves vertically
// to mark which input we're currently processing.
const POINTER_X = INPUT_X - 28;
const pointer = new sd.Circle({
  targetNode: svg,
  cx: POINTER_X,
  cy: INPUT_Y_BASE,
  r: 4,
  fill: ACTIVE_STROKE,
  stroke: "none",
  opacity: 0,
});

function pointerTo(idx: number, delay = 0) {
  const cy = INPUT_Y_BASE - idx * INPUT_Y_STEP;
  pointer
    .startAnimate({ delay, duration: 320, easing: E.easeOut })
    .setCy(cy)
    .setOpacity(1)
    .endAnimate();
}

function hidePointer(delay = 0) {
  pointer
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
}

// Badges: small marker placed to the right of each input label showing
// where the input ended up (→ b_j) or that it was redundant (×).
const BADGE_X = INPUT_X + 40;
const BADGE_TEXTS = [
  "\\to \\vec{b}_3",
  "\\to \\vec{b}_2",
  "\\to \\vec{b}_1",
  "\\times",
];
const BADGE_FILLS = [PLACED_STROKE, PLACED_STROKE, PLACED_STROKE, FAINT];
const inputBadges: sd.Math[] = INPUTS.map(
  (_, i) =>
    new sd.Math({
      targetNode: svg,
      text: BADGE_TEXTS[i],
      cx: BADGE_X,
      by: inputLabels[i].getBaselineY(),
      fontSize: 14,
      fill: BADGE_FILLS[i],
      opacity: 0,
    }),
);

function showBadge(idx: number, delay = 0) {
  inputBadges[idx]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

// ─── helpers ─────────────────────────────────────────────────────

const DUR = 280;

function showX(value: number, delay = 0) {
  for (let bit = 0; bit <= 3; bit++) {
    const v = (value >> bit) & 1;
    // Set text/fill/stroke instantly while invisible so they don't
    // animate during the opacity transition (no text morph).
    xCells[bit].bg
      .startAnimate({ delay, duration: 1, easing: E.easeOut })
      .setFill(C.white)
      .setStroke(FAINT)
      .setStrokeWidth(1)
      .endAnimate();
    xCells[bit].text
      .startAnimate({ delay, duration: 1, easing: E.easeOut })
      .setText(String(v))
      .setFill(NEUTRAL)
      .endAnimate();
    // Then fade opacity in cleanly.
    xCells[bit].bg
      .startAnimate({ delay: delay + 4, duration: DUR, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    xCells[bit].text
      .startAnimate({ delay: delay + 4, duration: DUR, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
}

function hideX(delay = 0) {
  for (const c of xCells) {
    c.bg
      .startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setOpacity(0)
      .endAnimate();
    c.text
      .startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setOpacity(0)
      .endAnimate();
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
  beam
    .startAnimate({ delay, duration: 1, easing: E.easeOut })
    .setX1(bitX(bit))
    .setX2(bitX(bit))
    .setY2(basisCy(slot) + CELL_H / 2)
    .endAnimate();
  beam
    .startAnimate({ delay: delay + 4, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function fadeBeam(delay = 0) {
  beam
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
}

function pulseRow(slot: number, delay = 0) {
  for (let bit = 0; bit <= 3; bit++) {
    basis[slot][bit].bg
      .startAnimate({ delay, duration: 200, easing: E.easeOut })
      .setStrokeWidth(2.6)
      .endAnimate();
    basis[slot][bit].bg
      .startAnimate({ delay: delay + 380, duration: 220, easing: E.easeOut })
      .setStrokeWidth(1.4)
      .endAnimate();
  }
}

// Flash x cells and morph their bit values to a new XOR'd state.
function xorXBits(newValue: number, delay = 0) {
  for (let bit = 0; bit <= 3; bit++) {
    const v = (newValue >> bit) & 1;
    xCells[bit].bg
      .startAnimate({ delay, duration: 220, easing: E.easeOut })
      .setFill(ACTIVE_FILL)
      .endAnimate();
    xCells[bit].text
      .startAnimate({ delay: delay + 120, duration: 220, easing: E.easeOut })
      .setText(String(v))
      .endAnimate();
    xCells[bit].bg
      .startAnimate({ delay: delay + 360, duration: 220, easing: E.easeOut })
      .setFill(C.white)
      .endAnimate();
  }
}

function placeBasis(slot: number, value: number, delay = 0) {
  for (let bit = 0; bit <= 3; bit++) {
    const v = (value >> bit) & 1;
    const stagger = (3 - bit) * 70;
    basis[slot][bit].bg
      .startAnimate({
        delay: delay + stagger,
        duration: DUR,
        easing: E.easeOut,
      })
      .setFill(PLACED_FILL)
      .setStroke(PLACED_STROKE)
      .setStrokeWidth(1.4)
      .endAnimate();
    basis[slot][bit].text
      .startAnimate({
        delay: delay + stagger,
        duration: DUR,
        easing: E.easeOut,
      })
      .setText(String(v))
      .setFill(PLACED_STROKE)
      .endAnimate();
  }
}

// ─── main ────────────────────────────────────────────────────────

sd.main(async () => {
  // p1: empty basis + labels.
  for (let slot = 0; slot <= 3; slot++) {
    const d = (3 - slot) * 80;
    slotLabels[slot]
      .startAnimate({ delay: d, duration: DUR, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    for (let bit = 0; bit <= 3; bit++) {
      basis[slot][bit].bg
        .startAnimate({
          delay: d + (3 - bit) * 30,
          duration: DUR,
          easing: E.easeOut,
        })
        .setOpacity(1)
        .endAnimate();
      basis[slot][bit].text
        .startAnimate({
          delay: d + (3 - bit) * 30 + 40,
          duration: DUR,
          easing: E.easeOut,
        })
        .setOpacity(1)
        .endAnimate();
    }
  }
  xLabel
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  for (let i = 0; i < inputLabels.length; i++) {
    inputLabels[i]
      .startAnimate({ delay: 200 + i * 120, duration: DUR, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  // ─── insert 13 = 1101 (case A: direct place to b[3]) ─────────────
  activateInput(0);
  pointerTo(0);
  showX(0b1101);
  highlightLeadingBit(3, 320);
  await sd.pause();

  beamTo(3, 3);
  pulseRow(3, 360);
  await sd.pause();

  placeBasis(3, 0b1101);
  hideX(300);
  fadeBeam(500);
  completeInput(0);
  showBadge(0, 400);
  await sd.pause();

  // ─── insert 11 = 1011 (case B: 1 XOR → place b[2]) ───────────────
  activateInput(1);
  pointerTo(1);
  showX(0b1011);
  highlightLeadingBit(3, 320);
  await sd.pause();

  beamTo(3, 3);
  pulseRow(3, 360);
  await sd.pause();

  xorXBits(0b0110); // 11 ^ 13 = 6
  highlightLeadingBit(2, 380);
  fadeBeam(500);
  await sd.pause();

  beamTo(2, 2);
  pulseRow(2, 360);
  await sd.pause();

  placeBasis(2, 0b0110);
  hideX(300);
  fadeBeam(500);
  completeInput(1);
  showBadge(1, 400);
  await sd.pause();

  // ─── insert 14 = 1110 (case B again: 1 XOR → place b[1]) ─────────
  activateInput(2);
  pointerTo(2);
  showX(0b1110);
  highlightLeadingBit(3, 320);
  await sd.pause();

  beamTo(3, 3);
  pulseRow(3, 360);
  await sd.pause();

  xorXBits(0b0011); // 14 ^ 13 = 3
  highlightLeadingBit(1, 380);
  fadeBeam(500);
  await sd.pause();

  beamTo(1, 1);
  pulseRow(1, 360);
  await sd.pause();

  placeBasis(1, 0b0011);
  hideX(300);
  fadeBeam(500);
  completeInput(2);
  showBadge(2, 400);
  await sd.pause();

  // ─── insert 8 = 1000 (case C+D: 3 XORs → 0, redundant) ──────────
  activateInput(3);
  pointerTo(3);
  showX(0b1000);
  highlightLeadingBit(3, 320);
  await sd.pause();

  beamTo(3, 3);
  pulseRow(3, 360);
  await sd.pause();

  xorXBits(0b0101); // 8 ^ 13 = 5
  highlightLeadingBit(2, 380);
  fadeBeam(500);
  await sd.pause();

  beamTo(2, 2);
  pulseRow(2, 360);
  await sd.pause();

  xorXBits(0b0011); // 5 ^ 6 = 3
  highlightLeadingBit(1, 380);
  fadeBeam(500);
  await sd.pause();

  beamTo(1, 1);
  pulseRow(1, 360);
  await sd.pause();

  // 3 ^ 3 = 0. x bits all clear; no leading bit, no slot to fill — redundant.
  xorXBits(0b0000);
  // Clear highlights (no leading bit anymore).
  for (let b = 0; b <= 3; b++) {
    xCells[b].bg
      .startAnimate({ delay: 380, duration: DUR, easing: E.easeOut })
      .setStroke(FAINT)
      .setStrokeWidth(1)
      .endAnimate();
  }
  hideX(700);
  fadeBeam(700);
  rejectInput(3, 500);
  showBadge(3, 500);
  hidePointer(700);
  await sd.pause();
});
