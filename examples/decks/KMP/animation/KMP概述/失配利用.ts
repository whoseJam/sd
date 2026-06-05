import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Schematic — not a real KMP run. j = matched prefix length, len = its
// longest border. Each "cell" maps to one visual unit, so the geometry
// stays readable and the "slide by (j - len)" reads as a clean translation.

const J = 8;
const LEN = 3;
const UNIT = 36;
const BAR_H = 26;
const BAR_W = J * UNIT;

const X0 = -((J + 1.5) * UNIT) / 2;
const T_Y = 0;
const ROW_GAP = 24;
const S_Y = T_Y + BAR_H + ROW_GAP;

const MAIN_FILL = "#cfead0";
const MAIN_STROKE = C.darkGreen;
const FAIL_FILL = "#f4cfcf";
const FAIL_STROKE = C.darkRed;
const BORDER_FILL = "#dde6ef";
const BORDER_STROKE = C.steelBlue;
const TEXT_FILL = C.darkButtonGrey;

function bar(group: sd.Group, y: number, label: string, labelCx: number) {
  // Matched prefix (length J).
  const main = new sd.Rect({
    targetNode: group,
    x: X0,
    y,
    width: BAR_W,
    height: BAR_H,
    fill: MAIN_FILL,
    stroke: MAIN_STROKE,
    strokeWidth: 1.2,
  });
  // Left border highlight (first LEN cells).
  const prefix = new sd.Rect({
    targetNode: group,
    x: X0,
    y,
    width: LEN * UNIT,
    height: BAR_H,
    fill: BORDER_FILL,
    stroke: BORDER_STROKE,
    strokeWidth: 1.4,
    opacity: 0,
  });
  // Right border highlight (last LEN cells).
  const suffix = new sd.Rect({
    targetNode: group,
    x: X0 + (J - LEN) * UNIT,
    y,
    width: LEN * UNIT,
    height: BAR_H,
    fill: BORDER_FILL,
    stroke: BORDER_STROKE,
    strokeWidth: 1.4,
    opacity: 0,
  });
  // The j+1 cell that failed to match.
  const fail = new sd.Rect({
    targetNode: group,
    x: X0 + J * UNIT,
    y,
    width: UNIT,
    height: BAR_H,
    fill: FAIL_FILL,
    stroke: FAIL_STROKE,
    strokeWidth: 1.2,
    opacity: 0,
  });
  const labelText = new sd.Text({
    targetNode: group,
    text: label,
    cx: labelCx,
    cy: y + BAR_H / 2,
    fontSize: 20,
    fill: TEXT_FILL,
  });
  return { main, prefix, suffix, fail, labelText };
}

const sGroup = new sd.Group({ targetNode: svg, opacity: 0 });
const tGroup = new sd.Group({ targetNode: svg, opacity: 0 });

const sBar = bar(sGroup, S_Y, "s", X0 - UNIT * 0.7);
const tBar = bar(tGroup, T_Y, "t", X0 - UNIT * 0.7);

// Brace bracket under the t bar showing the prefix len. Appears at the very
// end as the takeaway annotation.
const braceY = T_Y - 10;
const braceGroup = new sd.Group({ targetNode: svg, opacity: 0 });
new sd.Line({
  targetNode: braceGroup,
  x1: X0,
  y1: braceY,
  x2: X0 + LEN * UNIT,
  y2: braceY,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});
new sd.Line({
  targetNode: braceGroup,
  x1: X0,
  y1: braceY,
  x2: X0,
  y2: braceY + 5,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});
new sd.Line({
  targetNode: braceGroup,
  x1: X0 + LEN * UNIT,
  y1: braceY,
  x2: X0 + LEN * UNIT,
  y2: braceY + 5,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
});
new sd.Math({
  targetNode: braceGroup,
  text: "len_j",
  cx: X0 + (LEN * UNIT) / 2,
  cy: braceY - 14,
  fontSize: 16,
  fill: C.darkButtonGrey,
});

// "?" callout that appears once t slides to its new alignment.
const queryX = X0 + J * UNIT;
const queryY = T_Y + BAR_H + 6;
const queryText = new sd.Text({
  targetNode: svg,
  text: "?",
  cx: queryX + UNIT / 2,
  cy: queryY + 10,
  fontSize: 24,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  sGroup.startAnimate({ duration: 400, easing: E.easeOut }).setOpacity(1).endAnimate();
  tGroup
    .startAnimate({ delay: 150, duration: 400, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  // Reveal the j+1 mismatch on both bars.
  sBar.fail.startAnimate({ duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  tBar.fail
    .startAnimate({ delay: 80, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  // Highlight prefix and suffix on t: they are equal substrings of length len.
  tBar.suffix.startAnimate({ duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  tBar.prefix
    .startAnimate({ delay: 160, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  // Same regions on s also coincide with t — that's the whole point.
  sBar.suffix.startAnimate({ duration: 320, easing: E.easeOut }).setOpacity(1).endAnimate();
  sBar.prefix
    .startAnimate({ delay: 160, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  // Slide t right by (J - LEN) cells so its prefix lands on s's suffix.
  tGroup
    .startAnimate({ duration: 520, easing: E.easeInOut })
    .setTranslate((J - LEN) * UNIT, 0)
    .endAnimate();
  await sd.pause();

  // The j+1 cell of t is now over a new s cell — does it match?
  queryText
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  // Surface the takeaway: the shift was exactly len_j.
  braceGroup
    .startAnimate({ duration: 360, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
