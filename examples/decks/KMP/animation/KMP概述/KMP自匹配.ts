import * as sd from "@/sd";

import { CharRow } from "../char-row";
import { buildLen } from "../kmp";
import { Pointer } from "../pointer";

// t self-matching: scan t against itself, j-indexed pointer starts at the
// same string offset by 1. Each cemented (mis)match writes into the len row.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const tStr = "ABABCABAA";

const SIZE = 32;
const LEN_SIZE = 24;
const ROW_GAP = 18;
// Leave clearance for pt (height 10) which lives in the gap above the len row.
const LEN_GAP = 16;

const TOTAL_W = (tStr.length + 2) * SIZE;
const X0 = -TOTAL_W / 2 + SIZE;
const LEN_Y = 0;
const T_Y = LEN_Y + LEN_SIZE + LEN_GAP;
const S_Y = T_Y + SIZE + ROW_GAP;

const MATCH_FILL = "#cfead0";
const MATCH_STROKE = C.darkGreen;
const FAIL_FILL = "#f4cfcf";
const FAIL_STROKE = C.darkRed;
const BORDER_INK = C.steelBlue;

const tPadded = " " + tStr;
const lenArr = buildLen(tPadded);

const s = new CharRow({
  targetNode: svg,
  text: tStr,
  size: SIZE,
  x: X0,
  y: S_Y,
  label: "t",
});

const t = new CharRow({
  targetNode: svg,
  text: tStr,
  size: SIZE,
  x: X0,
  y: T_Y,
  label: "t",
});

// len row sits under t and slides with it. Initially every value is shown
// as a faint dot so the cells read as "unknown" rather than as zeros.
const lenRow = new CharRow({
  targetNode: t.group,
  text: "·".repeat(tStr.length),
  size: LEN_SIZE,
  x: X0 + (SIZE - LEN_SIZE) / 2,
  y: LEN_Y,
  cellFill: C.buttonGrey,
  cellStroke: C.silver,
  textFill: C.silver,
});

const ps = new Pointer({
  targetNode: s.group,
  cx: s.cellCx(2),
  topY: S_Y,
  size: 9,
});
const pt = new Pointer({
  targetNode: t.group,
  cx: t.cellCx(1),
  topY: T_Y,
});

const sBracket = new sd.Line({
  targetNode: svg,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  stroke: BORDER_INK,
  strokeWidth: 1.8,
  opacity: 0,
});
const tBracket = new sd.Line({
  targetNode: t.group,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  stroke: BORDER_INK,
  strokeWidth: 1.8,
  opacity: 0,
});

const STEP_DUR = 240;
const COLOR_DUR = 260;
const SLIDE_DUR = 420;
const BRACKET_DUR = 280;

function movePtr(p: Pointer, cx: number, dur = STEP_DUR) {
  p.tri
    .startAnimate({ duration: dur, easing: E.easeOut })
    .setTranslate(p.dxTo(cx), 0)
    .endAnimate();
}

function writeLen(i: number, value: number, delay: number, dur = COLOR_DUR) {
  lenRow.glyphs[i - 1]
    .startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setText(String(value))
    .setFill(C.darkButtonGrey)
    .endAnimate();
}

function flashBracket(line: sd.Line, x1: number, x2: number, y: number) {
  line.setX1(x1).setX2(x2).setY1(y).setY2(y);
  line
    .startAnimate({ duration: BRACKET_DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function hideBracket(line: sd.Line, delay = 0) {
  line
    .startAnimate({ delay, duration: BRACKET_DUR, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
}

sd.main(async () => {
  s.fadeIn({ delay: 0 });
  t.fadeIn({ delay: 140 });
  lenRow.fadeIn({ delay: 220 });
  ps.tri
    .startAnimate({ delay: 380, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  pt.tri
    .startAnimate({ delay: 460, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  // t starts shifted right by 1: cell 1 of t aligns under cell 2 of s.
  // len[1] = 0 is fixed and not part of the self-match scan.
  t.group
    .startAnimate({ delay: 200, duration: 360, easing: E.easeOut })
    .setTranslate(SIZE, 0)
    .endAnimate();
  writeLen(1, 0, 240);
  await sd.pause();

  let j = 0;
  let tShift = 1;
  let needSResetAt = -1;

  for (let i = 2; i <= tStr.length; i++) {
    let ptDur = STEP_DUR;
    if (needSResetAt >= 1) {
      s.clearCell(needSResetAt);
      t.group
        .startAnimate({ duration: SLIDE_DUR, easing: E.easeInOut })
        .setTranslate(tShift * SIZE, 0)
        .endAnimate();
      ptDur = SLIDE_DUR;
      needSResetAt = -1;
    }
    movePtr(ps, s.cellCx(i));
    movePtr(pt, t.cellCx(j + 1), ptDur);

    const sCh = tStr[i - 1];

    if (tStr[j] === sCh) {
      j++;
      s.paintCell(i, MATCH_FILL, MATCH_STROKE, { delay: STEP_DUR - 80 });
      t.paintCell(j, MATCH_FILL, MATCH_STROKE, { delay: STEP_DUR - 80 });
      writeLen(i, j, STEP_DUR - 60);
      await sd.pause();
      continue;
    }

    s.paintCell(i, FAIL_FILL, FAIL_STROKE, { delay: STEP_DUR - 80 });
    t.paintCell(j + 1, FAIL_FILL, FAIL_STROKE, { delay: STEP_DUR - 80 });
    await sd.pause();

    while (j > 0 && tStr[j] !== sCh) {
      const jNext = lenArr[j];

      flashBracket(
        sBracket,
        s.cellLeft(i - j),
        s.cellLeft(i - j + jNext),
        s.top() + 6,
      );
      flashBracket(tBracket, t.cellLeft(1), t.cellLeft(1 + jNext), t.top() + 6);
      await sd.pause();

      hideBracket(sBracket);
      hideBracket(tBracket);

      for (let k = jNext + 1; k <= j + 1; k++) t.clearCell(k);
      for (let k = i - j; k <= i - jNext - 1; k++) s.clearCell(k);
      s.clearCell(i);

      tShift += j - jNext;
      t.group
        .startAnimate({ duration: SLIDE_DUR, easing: E.easeInOut })
        .setTranslate(tShift * SIZE, 0)
        .endAnimate();
      movePtr(pt, t.cellCx(jNext + 1), SLIDE_DUR);

      j = jNext;
      const matched = tStr[j] === sCh;
      const f = matched ? MATCH_FILL : FAIL_FILL;
      const k = matched ? MATCH_STROKE : FAIL_STROKE;
      s.paintCell(i, f, k, { delay: SLIDE_DUR - 60 });
      t.paintCell(j + 1, f, k, { delay: SLIDE_DUR - 60 });

      await sd.pause();
      if (matched) {
        j++;
        writeLen(i, j, 0);
        break;
      }
    }

    if (j === 0 && tStr[0] !== sCh) {
      needSResetAt = i;
      tShift += 1;
      writeLen(i, 0, 0);
    }
  }
});
