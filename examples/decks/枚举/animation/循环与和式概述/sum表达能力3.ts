import * as sd from "@/sd";

// Step-by-2 loop: for(int i=2; i<=n; i+=2) ans += i;
// ↔ \sum_{i=2}^n i [i is even]. The first three beats line up
// (lower, upper, summand) in three colors. The predicate beat then
// fades those structural highlights back to grey and lifts the new
// constraint in darkOrange — single-color conclusion frame.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const sumNode = new sd.Math({
  targetNode: svg,
  text: "\\sum",
  cx: 30,
  cy: 0,
  fontSize: 28,
  fill: C.darkButtonGrey,
});
const codeNode = new sd.Text({
  targetNode: svg,
  text: "for(int i=2; i<=n; i+=2) ans += i;",
  cx: 280,
  cy: 0,
  fontSize: 20,
  fill: C.darkButtonGrey,
});

const STEP = 240;

sd.main(async () => {
  await sd.pause();
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("i=2", C.orange)
    .endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=2}")
    .setCy(0)
    .setSubtextFill("i=2", C.orange)
    .endAnimate();
  await sd.pause();
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("i<=n", C.textBlue)
    .endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=2}^n")
    .setCy(0)
    .setSubtextFill("n", C.textBlue)
    .endAnimate();
  await sd.pause();
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("ans += i", C.red)
    .endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=2}^n i")
    .setCy(0)
    .setSubtextFill("i", C.red, 1)
    .endAnimate();
  await sd.pause();
  // Predicate beat: settle the structural correspondence (back to grey)
  // and lift the new constraint as the lone darkOrange highlight.
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("i=2", C.darkButtonGrey)
    .setSubtextFill("i<=n", C.darkButtonGrey)
    .setSubtextFill("ans += i", C.darkButtonGrey)
    .setSubtextFill("i+=2", C.darkOrange)
    .endAnimate();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=2}^n i\\, [i\\text{ is even}]")
    .setCy(0)
    .setSubtextFill("i=2", C.darkButtonGrey)
    .setSubtextFill("n", C.darkButtonGrey)
    .setSubtextFill("i", C.darkButtonGrey, 1)
    .setSubtextFill("[i\\text{ is even}]", C.darkOrange)
    .endAnimate();
  await sd.pause();
});
