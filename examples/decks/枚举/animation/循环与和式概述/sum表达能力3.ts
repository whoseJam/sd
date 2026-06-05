import * as sd from "@/sd";

// Step-by-2 loop: for(int i=2; i<=n; i+=2) ans += i;
// ↔ \sum_{i=2}^n i [i is even]. The trailing beat shows the same
// constraint folded into the ∑'s lower bracket via \begin{aligned}.

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
  text: "for(int i=2; i<=n; i+=2) ans += i;",
  x: 160,
  y: 0,
  fontSize: 20,
  fill: C.darkButtonGrey,
});

const STEP = 240;

sd.main(async () => {
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("i=2", C.orange).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=2}")
    .setSubtextFill("i=2", C.orange)
    .endAnimate();
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("i<=n", C.textBlue).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=2}^n")
    .setSubtextFill("n", C.textBlue)
    .endAnimate();
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("ans += i", C.red).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=2}^n i")
    .setSubtextFill("i", C.red, 1)
    .endAnimate();
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("i+=2", C.green).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=2}^n i\\, [i\\text{ is even}]")
    .setSubtextFill("[i\\text{ is even}]", C.green)
    .endAnimate();
  await sd.pause();
});
