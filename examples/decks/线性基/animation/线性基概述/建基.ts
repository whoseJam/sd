import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Same visual language as the 异或线性空间 page: every "row" is one
// sd.Math expression of the form  label = [b3 b2 b1 b0]  with all
// rows right-aligned to a shared maxX. The bmatrix has constant width
// regardless of bit values, so setMaxX once at construction is enough.
//
// Layout:
//   ─── scratchpad ───────────────  (current insertion + optional XOR)
//      x        = [...]
//      ⊕ b_i    = [...]
//      ────────────
//      x  becomes = [...]            (orange — new x after XOR)
//   ─── basis ────────────────────  (accumulating)
//      b_3, b_2, b_1, b_0

const SHARED_MAX_X = 130;
const FONT = 22;

const SCRATCH_X_Y = 130;
const SCRATCH_XOR_Y = 95;
const SCRATCH_LINE_Y = 73;
const SCRATCH_RES_Y = 52;

const BASIS_TOP_Y = -10;
const BASIS_GAP_Y = 36;
const basisY = (slot: number) => BASIS_TOP_Y - (3 - slot) * BASIS_GAP_Y;

const NEUTRAL = C.darkButtonGrey;
const ACCENT = C.darkOrange;
const EMPTY = C.silver;
const XOR_COLOR = C.steelBlue;

const bmatrixLatex = (bits: number[]) =>
  `\\begin{bmatrix} ${bits.join(" & ")} \\end{bmatrix}`;
const xLatex = (bits: number[]) => `\\mathbf{x} = ${bmatrixLatex(bits)}`;
const xorTermLatex = (slot: number, bits: number[]) =>
  `\\oplus\\ \\mathbf{b}_${slot} = ${bmatrixLatex(bits)}`;
const resultLatex = (bits: number[]) => `= ${bmatrixLatex(bits)}`;
const basisLatex = (slot: number, bits: number[]) =>
  `\\mathbf{b}_${slot} = ${bmatrixLatex(bits)}`;

// ─── scratchpad ──────────────────────────────────────────────────

const ZEROS = [0, 0, 0, 0];

const xMath = new sd.Math({
  targetNode: svg, text: xLatex(ZEROS),
  cy: SCRATCH_X_Y, fontSize: FONT, fill: NEUTRAL, opacity: 0,
});
xMath.setMaxX(SHARED_MAX_X);

const xorTermMath = new sd.Math({
  targetNode: svg, text: xorTermLatex(0, ZEROS),
  cy: SCRATCH_XOR_Y, fontSize: FONT, fill: XOR_COLOR, opacity: 0,
});
xorTermMath.setMaxX(SHARED_MAX_X);

const scratchLine = new sd.Line({
  targetNode: svg,
  x1: 24, y1: SCRATCH_LINE_Y,
  x2: SHARED_MAX_X + 4, y2: SCRATCH_LINE_Y,
  stroke: NEUTRAL, strokeWidth: 1.2, opacity: 0,
});

const resultMath = new sd.Math({
  targetNode: svg, text: resultLatex(ZEROS),
  cy: SCRATCH_RES_Y, fontSize: FONT, fill: ACCENT, opacity: 0,
});
resultMath.setMaxX(SHARED_MAX_X);

// ─── basis (always present, faint until placed) ──────────────────

const basis: sd.Math[] = [];
for (let slot = 3; slot >= 0; slot--) {
  const m = new sd.Math({
    targetNode: svg, text: basisLatex(slot, ZEROS),
    cy: basisY(slot), fontSize: FONT, fill: EMPTY, opacity: 0,
  });
  m.setMaxX(SHARED_MAX_X);
  basis.push(m);
}
basis.reverse(); // basis[slot]

// ─── helpers ─────────────────────────────────────────────────────

const DUR = 320;

function show(m: sd.Math | sd.Line, delay = 0) {
  m.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1).endAnimate();
}

function hide(m: sd.Math | sd.Line, delay = 0) {
  m.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(0).endAnimate();
}

function morph(m: sd.Math, latex: string, delay = 0) {
  m.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setText(latex).endAnimate();
}

function place(slot: number, bits: number[], delay = 0) {
  morph(basis[slot], basisLatex(slot, bits), delay);
  basis[slot]
    .startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(ACCENT).endAnimate();
}

function clearScratch(delay = 0) {
  hide(xMath, delay);
  hide(xorTermMath, delay);
  hide(resultMath, delay);
  hide(scratchLine, delay);
}

// ─── main ────────────────────────────────────────────────────────

sd.main(async () => {
  // p1: basis appears, all faint zeros.
  for (let slot = 3; slot >= 0; slot--) {
    show(basis[slot], (3 - slot) * 100);
  }
  await sd.pause();

  // p2: insert 7. x = [0 1 1 1].
  morph(xMath, xLatex([0, 1, 1, 1]));
  show(xMath);
  await sd.pause();

  // p3: b_2 empty → place. x fades.
  place(2, [0, 1, 1, 1]);
  hide(xMath, 400);
  await sd.pause();

  // p4: insert 5. x = [0 1 0 1].
  morph(xMath, xLatex([0, 1, 0, 1]));
  show(xMath);
  await sd.pause();

  // p5: XOR with b_2.  ⊕ b_2 = [0 1 1 1], line, result = [0 0 1 0].
  morph(xorTermMath, xorTermLatex(2, [0, 1, 1, 1]));
  show(xorTermMath);
  show(scratchLine, 200);
  morph(resultMath, resultLatex([0, 0, 1, 0]), 400);
  show(resultMath, 400);
  await sd.pause();

  // p6: place result → b_1. Scratchpad clears.
  place(1, [0, 0, 1, 0]);
  clearScratch(300);
  await sd.pause();

  // p7: insert 3. x = [0 0 1 1].
  morph(xMath, xLatex([0, 0, 1, 1]));
  show(xMath);
  await sd.pause();

  // p8: XOR with b_1. ⊕ b_1 = [0 0 1 0], line, result = [0 0 0 1].
  morph(xorTermMath, xorTermLatex(1, [0, 0, 1, 0]));
  show(xorTermMath);
  show(scratchLine, 200);
  morph(resultMath, resultLatex([0, 0, 0, 1]), 400);
  show(resultMath, 400);
  await sd.pause();

  // p9: place result → b_0. Scratchpad clears.
  place(0, [0, 0, 0, 1]);
  clearScratch(300);
  await sd.pause();
});
