import * as sd from "@/sd";

import { CharRow } from "./char-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const sStr = "AAAAABAA";
const tStr = "AAAB";

const SIZE = 32;
const ROW_GAP = 22;

const TOTAL_W = sStr.length * SIZE;
const X0 = -TOTAL_W / 2;

const T_Y = 0;
const S_Y = T_Y + SIZE + ROW_GAP;
const BRACE_GAP = 8;
const BRACE_TICK = 6;
const LABEL_GAP = 12;

const s = new CharRow({
  targetNode: svg,
  text: sStr,
  size: SIZE,
  x: X0,
  y: S_Y,
  label: "s",
});
const t = new CharRow({
  targetNode: svg,
  text: tStr,
  size: SIZE,
  x: X0 + ((sStr.length - tStr.length) * SIZE) / 2,
  y: T_Y,
  label: "t",
});

// Brace sits ABOVE s. End-ticks point down at the spanned cells, center
// tick points up at the H_i label. Keeping the whole annotation above s
// avoids colliding with the t row below.
const span = tStr.length * SIZE;
const braceY = s.top() + BRACE_GAP;
const braceGroup = new sd.Group({ targetNode: svg, opacity: 0 });
new sd.Line({
  targetNode: braceGroup,
  x1: X0,
  y1: braceY,
  x2: X0 + span,
  y2: braceY,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});
new sd.Line({
  targetNode: braceGroup,
  x1: X0,
  y1: braceY,
  x2: X0,
  y2: braceY - BRACE_TICK,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});
new sd.Line({
  targetNode: braceGroup,
  x1: X0 + span,
  y1: braceY,
  x2: X0 + span,
  y2: braceY - BRACE_TICK,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});
new sd.Line({
  targetNode: braceGroup,
  x1: X0 + span / 2,
  y1: braceY,
  x2: X0 + span / 2,
  y2: braceY + BRACE_TICK,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});
const hLabel = new sd.Text({
  targetNode: braceGroup,
  text: "H 1",
  cx: X0 + span / 2,
  cy: braceY + BRACE_TICK + LABEL_GAP,
  fontSize: 18,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  s.fadeIn({ delay: 0 });
  t.fadeIn({ delay: 140 });
  braceGroup
    .startAnimate({ delay: 380, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  const STEP_DUR = 360;
  const maxStart = sStr.length - tStr.length + 1;
  for (let i = 2; i <= maxStart; i++) {
    braceGroup
      .startAnimate({ duration: STEP_DUR, easing: E.easeInOut })
      .setTranslate((i - 1) * SIZE, 0)
      .endAnimate();
    hLabel
      .startAnimate({ delay: STEP_DUR / 2, duration: 220, easing: E.easeOut })
      .setText(`H ${i}`, { H: "H" })
      .endAnimate();
    await sd.pause();
  }
});
