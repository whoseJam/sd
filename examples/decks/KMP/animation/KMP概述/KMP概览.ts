import * as sd from "@/sd";

import { CharRow } from "../char-row";
import { buildLen } from "../kmp";
import { Pointer } from "../pointer";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const sStr = "ABABACBABC";
const tStr = "ABABC";

const SIZE = 32;
const ROW_GAP = 22;
const TOTAL_W = (sStr.length + 2) * SIZE;
const X0 = -TOTAL_W / 2 + SIZE;
const T_Y = 0;
const S_Y = T_Y + SIZE + ROW_GAP;

const MATCH_FILL = "#cfead0";
const MATCH_STROKE = C.darkGreen;
const FAIL_FILL = "#f4cfcf";
const FAIL_STROKE = C.darkRed;

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
  x: X0,
  y: T_Y,
  label: "t",
});

const ps = new Pointer({ targetNode: s.group, cx: s.cellCx(1), topY: S_Y, size: 9 });
const pt = new Pointer({ targetNode: t.group, cx: t.cellCx(1), topY: T_Y });

const tPadded = " " + tStr;
const lenArr = buildLen(tPadded);

const STEP_DUR = 240;
const SLIDE_DUR = 360;

function movePtr(p: Pointer, cx: number, dur = STEP_DUR) {
  p.tri
    .startAnimate({ duration: dur, easing: E.easeOut })
    .setTranslate(p.dxTo(cx), 0)
    .endAnimate();
}

sd.main(async () => {
  s.fadeIn({ delay: 0 });
  t.fadeIn({ delay: 140 });
  ps.tri
    .startAnimate({ delay: 380, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  pt.tri
    .startAnimate({ delay: 460, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  await sd.pause();

  let j = 0;
  let tShift = 0;
  let needSResetAt = -1;

  for (let i = 1; i <= sStr.length; i++) {
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

    const sCh = sStr[i - 1];

    if (tStr[j] === sCh) {
      j++;
      s.paintCell(i, MATCH_FILL, MATCH_STROKE, { delay: STEP_DUR - 80 });
      t.paintCell(j, MATCH_FILL, MATCH_STROKE, { delay: STEP_DUR - 80 });
      await sd.pause();
      continue;
    }

    s.paintCell(i, FAIL_FILL, FAIL_STROKE, { delay: STEP_DUR - 80 });
    t.paintCell(j + 1, FAIL_FILL, FAIL_STROKE, { delay: STEP_DUR - 80 });
    await sd.pause();

    while (j > 0 && tStr[j] !== sCh) {
      const jNext = lenArr[j];

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
        break;
      }
    }

    if (j === 0 && tStr[0] !== sCh) {
      needSResetAt = i;
      tShift += 1;
    }
  }
});
