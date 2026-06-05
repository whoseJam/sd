import * as sd from "@/sd";

import { CharRow } from "../../../KMP/animation/char-row";

// Manacher on "abacaba": for each center i, paint the cells inside the
// palindrome of radius p[i] and print p[i] below the cell. The
// "mirror trick" beat highlights position 5 reusing position 3's p
// because i < currentRight.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const text = "abacaba";

// Compute Manacher radii (1-indexed): p[i] = longest odd palindrome
// centered at i has half-length p[i] - 1.
function manacher(s: string): number[] {
  const n = s.length;
  const p = new Array<number>(n + 2).fill(0);
  let center = 0;
  let right = 0;
  for (let i = 1; i <= n; i++) {
    if (i < right) p[i] = Math.min(p[2 * center - i] || 0, right - i);
    else p[i] = 1;
    while (
      i - p[i] >= 1 &&
      i + p[i] <= n &&
      s[i - p[i] - 1] === s[i + p[i] - 1]
    ) p[i]++;
    if (i + p[i] > right) {
      right = i + p[i];
      center = i;
    }
  }
  return p.slice(1, n + 1);
}

const p = manacher(text);

const SIZE = 38;
const row = new CharRow({
  targetNode: svg,
  text,
  size: SIZE,
  x: -(text.length * SIZE) / 2,
  y: 0,
  label: "s",
});

// p[i] readouts below each cell.
const pLabels: sd.Text[] = [];
for (let i = 1; i <= text.length; i++) {
  pLabels.push(
    new sd.Text({
      targetNode: svg,
      text: "·",
      cx: row.cellCx(i),
      cy: -22,
      fontSize: 16,
      fill: C.silver,
      opacity: 0,
    }),
  );
}

const PALI_FILL = "#cfead0";
const PALI_STROKE = C.darkGreen;
const CENTER_FILL = "#fce4a0";
const CENTER_STROKE = C.darkOrange;

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  for (let i = 0; i < pLabels.length; i++) {
    pLabels[i]
      .startAnimate({ delay: 80 + i * 30, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  // For each center i, paint [i-p[i]+1, i+p[i]-1] green except the
  // center which goes orange, and update the p[i] readout.
  for (let i = 1; i <= text.length; i++) {
    const radius = p[i - 1];
    for (let k = i - radius + 1; k <= i + radius - 1; k++) {
      if (k === i) continue;
      row.paintCell(k, PALI_FILL, PALI_STROKE, { delay: (k - (i - radius + 1)) * 60 });
    }
    row.paintCell(i, CENTER_FILL, CENTER_STROKE);
    pLabels[i - 1]
      .startAnimate({ duration: 260, easing: E.easeOut })
      .setText(String(radius))
      .setFill(C.darkOrange)
      .endAnimate();
    await sd.pause();
    // Clear repaint before next iteration would conflict per-cell;
    // leave colors so the viewer sees the cumulative coverage. The
    // center label updates on each beat and that's the takeaway.
  }
});
