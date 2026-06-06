import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Greedy max-XOR walkthrough.
// Basis: b_3 = 1101, b_2 = 0110, b_1 = 0011 (matching 建基 demo example).
// ans = 0000.
//   bit 3: ans's bit 3 = 0 → XOR b_3.  ans = 1101.
//   bit 2: ans's bit 2 = 1 → skip b_2.
//   bit 1: ans's bit 1 = 0 → XOR b_1.  ans = 1110 = 14.

const DIM = 4;
const CELL_W = 30;
const CELL_H = 26;
const CELL_GAP = 5;
const TOTAL_W = DIM * CELL_W + (DIM - 1) * CELL_GAP;

function bitX(bit: number): number {
  return -TOTAL_W / 2 + CELL_W / 2 + (DIM - 1 - bit) * (CELL_W + CELL_GAP);
}

const ANS_Y = 80;
const BASIS_Y = [10, -28, -66]; // b_3, b_2, b_1
const LABEL_X = -TOTAL_W / 2 - CELL_W / 2 - 14;

const NEUTRAL = C.darkButtonGrey;
const FAINT = C.silver;
const ACCENT = C.darkOrange;
const LEAD = "#d34d2e";      // red for leading bit
const SKIP = "#cccccc";
const PROBE = C.steelBlue;

interface Cell { bg: sd.Rect; text: sd.Text; }
function makeCell(cx: number, cy: number, txt: string, fill: sd.SDColor, stroke: sd.SDColor, textFill: sd.SDColor): Cell {
  return {
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2, y: cy - CELL_H / 2,
      width: CELL_W, height: CELL_H,
      fill, stroke, strokeWidth: 1.2,
      rx: 3, ry: 3, opacity: 0,
    }),
    text: new sd.Text({
      targetNode: svg,
      text: txt, cx, cy: cy - 1,
      fontSize: 13, fill: textFill, opacity: 0,
    }),
  };
}

// ans row (initial values 0000)
const ansCells: Cell[] = [];
for (let bit = 0; bit <= 3; bit++) {
  ansCells[bit] = makeCell(bitX(bit), ANS_Y, "0", C.white, NEUTRAL, NEUTRAL);
}
const ansLabel = new sd.Math({
  targetNode: svg, text: "\\text{ans}",
  cx: LABEL_X, cy: ANS_Y - 1,
  fontSize: 14, fill: NEUTRAL, opacity: 0,
});

// basis rows
// b_3 = 1101, b_2 = 0110, b_1 = 0011
// stored MSB-first: BASIS_BITS[slotIdx][i] where i=0 is MSB
const BASIS_DEFS = [
  { slot: 3, bits: [1, 1, 0, 1], value: 13 },
  { slot: 2, bits: [0, 1, 1, 0], value: 6 },
  { slot: 1, bits: [0, 0, 1, 1], value: 3 },
];

interface BasisRow { cells: Cell[]; label: sd.Math; slot: number; bits: number[]; }
const basis: BasisRow[] = [];
for (let i = 0; i < BASIS_DEFS.length; i++) {
  const def = BASIS_DEFS[i];
  const cy = BASIS_Y[i];
  const cells: Cell[] = [];
  for (let bit = 0; bit <= 3; bit++) {
    const idx = 3 - bit;
    const v = String(def.bits[idx]);
    // Leading bit cell gets a red text/border to flag "this row owns bit i".
    const isLead = bit === def.slot;
    cells[bit] = makeCell(
      bitX(bit),
      cy,
      v,
      C.white,
      isLead ? LEAD : FAINT,
      isLead ? LEAD : NEUTRAL,
    );
  }
  const label = new sd.Math({
    targetNode: svg, text: `b_${def.slot}`,
    cx: LABEL_X, cy: cy - 1,
    fontSize: 14, fill: NEUTRAL, opacity: 0,
  });
  basis.push({ cells, label, slot: def.slot, bits: def.bits });
}

// Probe beam: vertical dashed line from ans bit i down to basis row's bit i.
const probe = new sd.Line({
  targetNode: svg,
  x1: bitX(0), y1: ANS_Y - CELL_H / 2,
  x2: bitX(0), y2: BASIS_Y[0] + CELL_H / 2,
  stroke: PROBE, strokeWidth: 1.8,
  strokeDashArray: [5, 4], opacity: 0,
});

const DUR = 280;

function fadeIn(el: sd.Rect | sd.Text | sd.Math | sd.Line, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
}

function probeTo(bit: number, slotIdx: number, delay = 0) {
  probe.startAnimate({ delay, duration: 1, easing: E.easeOut })
    .setX1(bitX(bit)).setX2(bitX(bit))
    .setY2(BASIS_Y[slotIdx] + CELL_H / 2)
    .endAnimate();
  probe.startAnimate({ delay: delay + 4, duration: 320, easing: E.easeOut })
    .setOpacity(1).endAnimate();
}

function fadeProbe(delay = 0) {
  probe.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(0).endAnimate();
}

// Update ans's bits to new values (MSB first).
function setAns(bits: number[], delay = 0) {
  for (let i = 0; i < 4; i++) {
    const bit = 3 - i;
    ansCells[bit].text
      .startAnimate({ delay, duration: 220, easing: E.easeOut })
      .setText(String(bits[i])).setFill(ACCENT).endAnimate();
    ansCells[bit].bg
      .startAnimate({ delay, duration: 220, easing: E.easeOut })
      .setStroke(ACCENT).endAnimate();
  }
}

function dimBasisRow(slotIdx: number, delay = 0) {
  const row = basis[slotIdx];
  for (const c of row.cells) {
    c.bg.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setStroke(SKIP).endAnimate();
    c.text.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setFill(SKIP).endAnimate();
  }
  row.label.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(SKIP).endAnimate();
}

function pickBasisRow(slotIdx: number, delay = 0) {
  const row = basis[slotIdx];
  for (const c of row.cells) {
    c.bg.startAnimate({ delay, duration: DUR, easing: E.easeOut })
      .setStroke(ACCENT).endAnimate();
  }
  row.label.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(ACCENT).endAnimate();
}

// ─── main ────────────────────────────────────────────────────────

sd.main(async () => {
  // p1: setup. ans + basis appear. Leading bits already red.
  fadeIn(ansLabel);
  for (let i = 0; i < 4; i++) {
    fadeIn(ansCells[i].bg, i * 50);
    fadeIn(ansCells[i].text, i * 50 + 40);
  }
  for (let i = 0; i < basis.length; i++) {
    const d = 250 + i * 200;
    fadeIn(basis[i].label, d);
    for (let bit = 0; bit <= 3; bit++) {
      fadeIn(basis[i].cells[bit].bg, d + (3 - bit) * 40);
      fadeIn(basis[i].cells[bit].text, d + (3 - bit) * 40 + 40);
    }
  }
  await sd.pause();

  // p2: process bit 3 — probe b_3. ans bit 3 is 0, XOR'ing flips to 1 → pick.
  probeTo(3, 0);
  pickBasisRow(0, 360);
  setAns([1, 1, 0, 1], 700); // ans becomes 0000 ^ 1101 = 1101
  fadeProbe(1000);
  await sd.pause();

  // p3: process bit 2 — probe b_2. ans bit 2 is already 1, would flip to 0 → skip.
  probeTo(2, 1);
  dimBasisRow(1, 360);
  fadeProbe(800);
  await sd.pause();

  // p4: process bit 1 — probe b_1. ans bit 1 is 0, XOR'ing flips to 1 → pick.
  probeTo(1, 2);
  pickBasisRow(2, 360);
  setAns([1, 1, 1, 0], 700); // ans becomes 1101 ^ 0011 = 1110
  fadeProbe(1000);
  await sd.pause();

  // p5: final — show ans = 14.
  const final = new sd.Math({
    targetNode: svg,
    text: "\\text{ans} = (1110)_2 = 14",
    cx: 0, cy: -110,
    fontSize: 16, fill: ACCENT, opacity: 0,
  });
  fadeIn(final);
  await sd.pause();
});
