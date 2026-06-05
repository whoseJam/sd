import * as sd from "@/sd";

// Bug 3 repro: chain setSubtextFill on Math+Text together (like
// 循环与和式概述/sum拆解 does). Path NaN warnings were observed there
// during initial verification. Try to reproduce.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const m = new sd.Math({
  targetNode: svg,
  text: "\\sum_{i=1}^n i",
  x: 0,
  y: 0,
  fontSize: 28,
  fill: C.darkButtonGrey,
});
const t = new sd.Text({
  targetNode: svg,
  text: "for(int i=1; i<=n; i++) ans += i;",
  x: 160,
  y: 0,
  fontSize: 20,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  await sd.pause();
  m.startAnimate({ duration: 400, easing: E.easeOut }).setSubtextFill("i=1", C.orange).endAnimate();
  t.startAnimate({ duration: 400, easing: E.easeOut }).setSubtextFill("i=1", C.orange).endAnimate();
  await sd.pause();
  m.startAnimate({ duration: 400, easing: E.easeOut }).setSubtextFill("n", C.textBlue).endAnimate();
  t.startAnimate({ duration: 400, easing: E.easeOut }).setSubtextFill("i<=n", C.textBlue).endAnimate();
  await sd.pause();
  m.startAnimate({ duration: 400, easing: E.easeOut }).setSubtextFill("i", C.red, 1).endAnimate();
  t.startAnimate({ duration: 400, easing: E.easeOut }).setSubtextFill("ans += i", C.red).endAnimate();
  await sd.pause();
});
