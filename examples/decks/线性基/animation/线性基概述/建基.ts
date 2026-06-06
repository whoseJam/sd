import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Ledger on the left chronologically logs every step of insertion;
// basis grid on the right fills in tandem.
//
// 7 = 0111: bit 2 empty           → b[2] = 0111
// 5 = 0101: bit 2 ⊕ b[2] = 0010   → b[1] = 0010
// 3 = 0011: bit 1 ⊕ b[1] = 0001   → b[0] = 0001

// ─── ledger (left half) ──────────────────────────────────────────

interface LedgerLine { text: string; y: number; color: sd.SDColor; }

const INSERT_COLOR = C.darkButtonGrey;
const XOR_COLOR = C.steelBlue;
const PLACE_COLOR = C.darkOrange;

const LEDGER_LINES: LedgerLine[] = [
  { text: "insert  7  =  0111",     y:  90, color: INSERT_COLOR },
  { text: "→  b[2]  =  0111",       y:  72, color: PLACE_COLOR },
  { text: "insert  5  =  0101",     y:  44, color: INSERT_COLOR },
  { text: "⊕ b[2]:  0101 ⊕ 0111",   y:  26, color: XOR_COLOR },
  { text: "      =  0010",          y:   8, color: XOR_COLOR },
  { text: "→  b[1]  =  0010",       y: -10, color: PLACE_COLOR },
  { text: "insert  3  =  0011",     y: -38, color: INSERT_COLOR },
  { text: "⊕ b[1]:  0011 ⊕ 0010",   y: -56, color: XOR_COLOR },
  { text: "      =  0001",          y: -74, color: XOR_COLOR },
  { text: "→  b[0]  =  0001",       y: -92, color: PLACE_COLOR },
];

const LEDGER_X = -76;

const ledgerTexts: sd.Text[] = LEDGER_LINES.map((line) =>
  new sd.Text({
    targetNode: svg,
    text: line.text,
    cx: LEDGER_X, cy: line.y - 1,
    fontSize: 11,
    fill: line.color,
    opacity: 0,
  }),
);

// ─── basis grid (right half) ─────────────────────────────────────

const DIM = 4;
const CELL_W = 22;
const CELL_H = 22;
const CELL_GAP = 3;
const BASIS_X_CENTER = 85;
const BASIS_TOTAL_W = DIM * CELL_W + (DIM - 1) * CELL_GAP;

function bitX(bit: number): number {
  const x0 = BASIS_X_CENTER - BASIS_TOTAL_W / 2 + CELL_W / 2;
  return x0 + (DIM - 1 - bit) * (CELL_W + CELL_GAP);
}

const SLOT_Y = [60, 20, -20, -60]; // slot 3, 2, 1, 0

const PLACED_FILL = "#fdecd9";
const PLACED_STROKE = C.darkOrange;

interface Cell { bg: sd.Rect; text: sd.Text; }
const basis: Cell[][] = []; // basis[slot][col]
const slotLabels: sd.Text[] = [];

for (let slot = DIM - 1; slot >= 0; slot--) {
  const cy = SLOT_Y[DIM - 1 - slot];
  const row: Cell[] = [];
  for (let i = 0; i < DIM; i++) {
    const cx = bitX(DIM - 1 - i);
    row.push({
      bg: new sd.Rect({
        targetNode: svg,
        x: cx - CELL_W / 2, y: cy - CELL_H / 2,
        width: CELL_W, height: CELL_H,
        fill: C.white,
        stroke: C.silver,
        strokeWidth: 0.8,
        rx: 3, ry: 3,
        opacity: 0,
      }),
      text: new sd.Text({
        targetNode: svg,
        text: "0",
        cx, cy: cy - 1,
        fontSize: 12,
        fill: C.silver,
        opacity: 0,
      }),
    });
  }
  basis.push(row);
  slotLabels.push(
    new sd.Text({
      targetNode: svg,
      text: `b[${slot}]`,
      cx: BASIS_X_CENTER - BASIS_TOTAL_W / 2 - 18,
      cy: cy - 1,
      fontSize: 11,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}
basis.reverse();
slotLabels.reverse();

// ─── helpers ─────────────────────────────────────────────────────

const DUR = 280;

function showLedger(idx: number, delay = 0) {
  ledgerTexts[idx]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
}

function placeBasis(slot: number, bits: number[], delay = 0) {
  for (let i = 0; i < DIM; i++) {
    const cell = basis[slot][i];
    cell.bg
      .startAnimate({ delay: delay + i * 50, duration: DUR, easing: E.easeOut })
      .setFill(PLACED_FILL).setStroke(PLACED_STROKE).setStrokeWidth(1.4)
      .endAnimate();
    cell.text
      .startAnimate({ delay: delay + i * 50, duration: DUR, easing: E.easeOut })
      .setText(String(bits[i])).setFill(PLACED_STROKE).endAnimate();
  }
}

function pulseBasis(slot: number, delay = 0) {
  for (let i = 0; i < DIM; i++) {
    basis[slot][i].bg
      .startAnimate({ delay, duration: 200, easing: E.easeOut })
      .setStrokeWidth(2.6).endAnimate();
    basis[slot][i].bg
      .startAnimate({ delay: delay + 380, duration: 220, easing: E.easeOut })
      .setStrokeWidth(1.4).endAnimate();
  }
}

// ─── main ────────────────────────────────────────────────────────

sd.main(async () => {
  // p1: empty basis grid fades in (bottom-up).
  for (let slot = 0; slot < DIM; slot++) {
    const d = (DIM - 1 - slot) * 80;
    slotLabels[slot]
      .startAnimate({ delay: d, duration: DUR, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    for (let i = 0; i < DIM; i++) {
      basis[slot][i].bg
        .startAnimate({ delay: d + i * 30, duration: DUR, easing: E.easeOut })
        .setOpacity(1).endAnimate();
      basis[slot][i].text
        .startAnimate({ delay: d + i * 30 + 40, duration: DUR, easing: E.easeOut })
        .setOpacity(1).endAnimate();
    }
  }
  await sd.pause();

  // p2: insert 7
  showLedger(0);
  await sd.pause();

  // p3: → b[2]
  showLedger(1);
  placeBasis(2, [0, 1, 1, 1], 80);
  await sd.pause();

  // p4: insert 5
  showLedger(2);
  await sd.pause();

  // p5: ⊕ b[2] line 1 (5 ⊕ 7)
  showLedger(3);
  pulseBasis(2);
  await sd.pause();

  // p6: ⊕ b[2] line 2 (= 0010)
  showLedger(4);
  await sd.pause();

  // p7: → b[1]
  showLedger(5);
  placeBasis(1, [0, 0, 1, 0], 80);
  await sd.pause();

  // p8: insert 3
  showLedger(6);
  await sd.pause();

  // p9: ⊕ b[1] line 1
  showLedger(7);
  pulseBasis(1);
  await sd.pause();

  // p10: ⊕ b[1] line 2 (= 0001)
  showLedger(8);
  await sd.pause();

  // p11: → b[0]
  showLedger(9);
  placeBasis(0, [0, 0, 0, 1], 80);
  await sd.pause();
});
