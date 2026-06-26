import * as sd from "@/sd";

// Generic function body G(i): for(int i=1; i<=n; i++) ans += G(i);
// ↔ \sum_{i=1}^n G(i). Three slots, no extra predicate.

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
  text: "for(int i=1; i<=n; i++) ans += G(i);",
  cx: 280,
  cy: 0,
  fontSize: 20,
  fontFamily: "Consolas",
  fill: C.darkButtonGrey,
});

const STEP = 240;

sd.main(async () => {
  await sd.pause();
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("i=1", C.orange)
    .endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=1}")
    .setCy(0)
    .setSubtextFill("i=1", C.orange)
    .endAnimate();
  await sd.pause();
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("i<=n", C.textBlue)
    .endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=1}^n")
    .setCy(0)
    .setSubtextFill("n", C.textBlue)
    .endAnimate();
  await sd.pause();
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("ans += G(i)", C.red)
    .endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=1}^n G(i)")
    .setCy(0)
    .setSubtextFill("G(i)", C.red)
    .endAnimate();
  await sd.pause();
});
