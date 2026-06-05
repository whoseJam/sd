import * as sd from "@/sd";

import { CharRow } from "../char-row";
import { Pointer } from "../pointer";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const sStr = "AAAAABAA";
const tStr = "AAAB";

const SIZE = 32;
const ROW_GAP = 22;

const TOTAL_W = (sStr.length + tStr.length) * SIZE;
const X0 = -TOTAL_W / 2 + SIZE * 1.6;

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

const ps = new Pointer({
  targetNode: s.group,
  cx: s.cellCx(1),
  topY: S_Y,
  size: 9,
});
const pt = new Pointer({
  targetNode: t.group,
  cx: t.cellCx(1),
  topY: T_Y,
});

sd.main(async () => {
  s.fadeIn({ delay: 0 });
  t.fadeIn({ delay: 140 });
  ps.tri
    .startAnimate({ delay: 360, duration: 260, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  pt.tri
    .startAnimate({ delay: 440, duration: 260, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();

  await sd.pause();

  const STEP_DUR = 220;
  const SLIDE_DUR = 320;

  let dirtyS: number[] = [];
  let dirtyT: number[] = [];

  const maxStart = sStr.length - tStr.length + 1;
  for (let i = 1; i <= maxStart; i++) {
    if (i > 1) {
      for (const k of dirtyS) s.clearCell(k);
      for (const k of dirtyT) t.clearCell(k);
      dirtyS = [];
      dirtyT = [];

      t.group
        .startAnimate({ duration: SLIDE_DUR, easing: E.easeInOut })
        .setTranslate((i - 1) * SIZE, 0)
        .endAnimate();
      await sd.pause();
    }

    for (let j = 1; j <= tStr.length; j++) {
      const sIdx = i + j - 1;

      ps.tri
        .startAnimate({ duration: STEP_DUR, easing: E.easeOut })
        .setTranslate(ps.dxTo(s.cellCx(sIdx)), 0)
        .endAnimate();
      pt.tri
        .startAnimate({ duration: STEP_DUR, easing: E.easeOut })
        .setTranslate(pt.dxTo(t.cellCx(j)), 0)
        .endAnimate();

      const isMatch = sStr[sIdx - 1] === tStr[j - 1];
      const fill = isMatch ? MATCH_FILL : FAIL_FILL;
      const stroke = isMatch ? MATCH_STROKE : FAIL_STROKE;

      s.paintCell(sIdx, fill, stroke, { delay: STEP_DUR - 60 });
      t.paintCell(j, fill, stroke, { delay: STEP_DUR - 60 });

      dirtyS.push(sIdx);
      dirtyT.push(j);

      await sd.pause();

      if (!isMatch) break;
    }
  }
});
