import * as sd from "@/sd";

// for(int i=n; i<=n*2; i++) ans += (i - n + 1) ↔ \sum_{i=n}^{2n} (i-n+1)

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
  text: "for(int i=n; i<=n*2; i++) ans += (i - n + 1);",
  cx: 280,
  cy: 0,
  fontSize: 20,
  fill: C.darkButtonGrey,
});

const STEP = 240;

sd.main(async () => {
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("i=n", C.orange).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=n}")
    .setCy(0)
    .setSubtextFill("i=n", C.orange)
    .endAnimate();
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("i<=n*2", C.textBlue).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=n}^{2n}")
    .setCy(0)
    .setSubtextFill("2n", C.textBlue)
    .endAnimate();
  await sd.pause();
  codeNode.startAnimate({ duration: STEP, easing: E.easeOut }).setSubtextFill("ans += (i - n + 1)", C.red).endAnimate();
  await sd.pause();
  sumNode
    .startAnimate({ duration: STEP, easing: E.easeOut })
    .setText("\\sum_{i=n}^{2n}(i-n+1)")
    .setCy(0)
    .setSubtextFill("(i-n+1)", C.red)
    .endAnimate();
  await sd.pause();
});
