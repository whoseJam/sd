import * as sd from "@/sd";

// Divisor sum: n%i==0 ↔ i | n. Last beat compresses to \sum_{i | n} i.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const sumNode = new sd.Math({
  targetNode: svg,
  text: "\\sum",
  x: 0,
  y: 0,
  fontSize: 28,
  fill: C.darkButtonGrey,
});
const codeNode = new sd.Text({
  targetNode: svg,
  text: "for(int i=1; i<=n; i++) if(n%i==0) ans += i;",
  x: 160,
  y: 0,
  fontSize: 18,
  fill: C.darkButtonGrey,
});

const STEP = 240;

sd.main(async () => {
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("i=1", C.orange).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=1}")
    .setSubtextFill("i=1", C.orange)
    .endAnimate();
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("i<=n", C.textBlue).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=1}^n")
    .setSubtextFill("n", C.textBlue)
    .endAnimate();
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("ans += i", C.red).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=1}^n i")
    .setSubtextFill("i", C.red, 1)
    .endAnimate();
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("n%i==0", C.green).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=1}^n i\\, [i \\mid n]")
    .setSubtextFill("[i \\mid n]", C.green)
    .endAnimate();
  await sd.pause();
  // Compressed form.
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i \\mid n} i")
    .endAnimate();
  await sd.pause();
});
