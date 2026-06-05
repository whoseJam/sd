import * as sd from "@/sd";

// Read off the three structural pieces of a for-loop (init / bound /
// body) by colour-syncing them with the matching pieces of the
// equivalent ∑ — orange for the lower bound, blue for the upper
// bound, red for the body.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Math width isn't known at construction (MathJax lays out async), so
// nodes get explicit fixed x. sum on the left, code on the right of a
// fat gap that fits any reasonable LaTeX expression we use in this deck.
const sumNode = new sd.Math({
  targetNode: svg,
  text: "\\sum_{i=1}^n i",
  x: 0,
  y: 0,
  fontSize: 28,
  fill: C.darkButtonGrey,
});
const codeNode = new sd.Text({
  targetNode: svg,
  text: "for(int i=1; i<=n; i++) ans += i;",
  x: 160,
  y: 0,
  fontSize: 20,
  fill: C.darkButtonGrey,
});

const STEP = 240;

sd.main(async () => {
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("i=1", C.orange)
    .endAnimate();
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("i=1", C.orange)
    .endAnimate();
  await sd.pause();

  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("n", C.textBlue)
    .endAnimate();
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("i<=n", C.textBlue)
    .endAnimate();
  await sd.pause();

  // Last "i" in "\sum_{i=1}^n i" is the summand — occurrence index 1.
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("i", C.red, 1)
    .endAnimate();
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("ans += i", C.red)
    .endAnimate();
  await sd.pause();
});
