import * as sd from "@/sd";

import {
  braceD,
  braceLabelCy,
  CELL_H,
  CELL_W,
  makeBrace,
  makePointer,
  makeStrip,
} from "../common/strip";
import {
  ACCENT,
  ACCENT_FILL,
  ACCENT_TEXT,
  fadeIn,
  fadeOpacity,
  NEUTRAL,
  setStroke,
} from "../common/style";

const svg = sd.svg();
const E = sd.easing();

const N = 7;
const P = 5;
const CY = 12;
const strip = makeStrip(svg, { n: N + 1, cy: CY, emptyCells: true });

const slot = new sd.Text({
  targetNode: svg,
  text: "?",
  cx: strip.cxOf(N),
  cy: CY,
  fontSize: 18,
  fill: ACCENT_TEXT,
  opacity: 0,
});

const POINTER_Y = CY + CELL_H / 2 + 8;
const pointerI = makePointer(svg, strip, {
  idx: N - 1,
  cy: POINTER_Y,
  label: "i",
});
const pointerIPlus1 = makePointer(svg, strip, {
  idx: N,
  cy: POINTER_Y,
  label: "i+1",
});

const BRACE_Y = CY - CELL_H / 2;
const brace = makeBrace(svg, strip, {
  from: 0,
  to: N - 1,
  cy: BRACE_Y,
  label: "a_1+a_2+\\cdots+a_i\\equiv j",
  labelFontSize: 14,
});

const RESIDUE_Y = braceLabelCy(BRACE_Y) - 24;
const residueNoteConcrete = new sd.Math({
  targetNode: svg,
  text: "k\\equiv 1\\ (\\bmod\\ " + P + ")",
  cx: strip.cxOf(N),
  cy: RESIDUE_Y,
  fontSize: 14,
  fill: ACCENT,
  opacity: 0,
});
const residueNoteGeneric = new sd.Math({
  targetNode: svg,
  text: "k\\equiv r\\ (\\bmod\\ " + P + ")",
  cx: strip.cxOf(N),
  cy: RESIDUE_Y,
  fontSize: 14,
  fill: ACCENT,
  opacity: 0,
});

const lastBg = strip.cells[N].bg;

sd.main(async () => {
  for (let i = 0; i < N; i++) fadeIn(strip.cells[i].bg, i * 30);
  fadeIn(brace.path, 300);
  fadeIn(brace.label!, 380);
  fadeIn(pointerI.arrow, 300);
  fadeIn(pointerI.label, 380);
  await sd.pause();

  setStroke(lastBg, ACCENT, 0);
  lastBg
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setFill(ACCENT_FILL)
    .setOpacity(1)
    .endAnimate();
  fadeIn(slot, 60);

  const newLeft = strip.cxOf(0) - CELL_W / 2;
  const newRight = strip.cxOf(N) + CELL_W / 2;
  const newCenter = (newLeft + newRight) / 2;
  brace.path
    .startAnimate({ duration: 380, easing: E.easeInOut })
    .setD(braceD(newLeft, newRight, BRACE_Y))
    .endAnimate();
  brace
    .label!.startAnimate({ delay: 80, duration: 320, easing: E.easeInOut })
    .setCx(newCenter)
    .endAnimate();

  fadeOpacity(pointerI.arrow, 0);
  fadeOpacity(pointerI.label, 0);
  fadeIn(pointerIPlus1.arrow, 80);
  fadeIn(pointerIPlus1.label, 160);
  await sd.pause();

  slot
    .startAnimate({ duration: 200, easing: E.easeOut })
    .setText("1")
    .endAnimate();
  fadeIn(residueNoteConcrete, 100);
  await sd.pause();

  for (let i = 1; i <= 5; i++) {
    slot
      .startAnimate({ duration: 200, easing: E.easeOut })
      .setText(String(1 + i * P))
      .endAnimate();
    await sd.pause();
  }

  slot
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setText("r")
    .setFill(NEUTRAL)
    .endAnimate();
  residueNoteConcrete
    .startAnimate({ duration: 240, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
  fadeIn(residueNoteGeneric, 80);
  await sd.pause();
});
