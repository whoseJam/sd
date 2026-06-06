import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Treat a 4-bit F_2 vector as a typeset math object, not a UI widget:
// MathJax renders the whole row (bold label + brackets + bits) as one
// expression, so it reads as "this is a vector" rather than "these are
// four cells that happen to hold bits".
//
// a = [0 1 0 1] ; b = [0 0 1 1] ; a ⊕ b = [0 1 1 0].

const ROW_A_Y = 75;
const ROW_B_Y = 18;
const LINE_Y = -30;
const ROW_R_Y = -75;

const FONT = 24;
const NEUTRAL = C.darkButtonGrey;
const ACCENT = C.darkOrange;

const aMath = new sd.Math({
  targetNode: svg,
  text: "\\mathbf{a} = \\begin{bmatrix} 0 & 1 & 0 & 1 \\end{bmatrix}",
  cx: 0, cy: ROW_A_Y,
  fontSize: FONT, fill: NEUTRAL, opacity: 0,
});

const bMath = new sd.Math({
  targetNode: svg,
  text: "\\oplus\\ \\ \\mathbf{b} = \\begin{bmatrix} 0 & 0 & 1 & 1 \\end{bmatrix}",
  cx: 0, cy: ROW_B_Y,
  fontSize: FONT, fill: NEUTRAL, opacity: 0,
});

const rMath = new sd.Math({
  targetNode: svg,
  text: "\\mathbf{a} \\oplus \\mathbf{b} = \\begin{bmatrix} 0 & 1 & 1 & 0 \\end{bmatrix}",
  cx: 0, cy: ROW_R_Y,
  fontSize: FONT, fill: ACCENT, opacity: 0,
});

const sumLine = new sd.Line({
  targetNode: svg,
  x1: -140, y1: LINE_Y,
  x2: 140, y2: LINE_Y,
  stroke: NEUTRAL, strokeWidth: 1.4, opacity: 0,
});

sd.main(async () => {
  // p1: vector a — bracket notation establishes "this is one math object".
  aMath.startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();

  // p2: vector b stacks under, with ⊕ aligned at the front.
  bMath.startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();

  // p3: horizontal sum line + result vector.
  sumLine.startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  rMath.startAnimate({ delay: 220, duration: 380, easing: E.easeOut })
    .setOpacity(1).endAnimate();
  await sd.pause();
});
