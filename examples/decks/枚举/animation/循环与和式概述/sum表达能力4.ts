import * as sd from "@/sd";

// Same as sum表达能力3 but with isPrime(i) as the inner predicate.

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
  text: "for(int i=1; i<=n; i++) if(isPrime(i)) ans += i;",
  cx: 280,
  cy: 0,
  fontSize: 18,
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
    .setSubtextFill("ans += i", C.red)
    .endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=1}^n i")
    .setCy(0)
    .setSubtextFill("i", C.red, 1)
    .endAnimate();
  await sd.pause();
  codeNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setSubtextFill("i=1", C.darkButtonGrey)
    .setSubtextFill("i<=n", C.darkButtonGrey)
    .setSubtextFill("ans += i", C.darkButtonGrey)
    .setSubtextFill("isPrime(i)", C.darkOrange)
    .endAnimate();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=1}^n i\\, [i\\text{ is prime}]")
    .setCy(0)
    .setSubtextFill("i=1", C.darkButtonGrey)
    .setSubtextFill("n", C.darkButtonGrey)
    .setSubtextFill("i", C.darkButtonGrey, 1)
    .setSubtextFill("[i\\text{ is prime}]", C.darkOrange)
    .endAnimate();
  await sd.pause();
});
