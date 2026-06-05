import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const b = 142;
const bits = b.toString(2).split("").map(Number).reverse(); // bit 0 first
const N = bits.length;
const SIZE = 44;
const X0 = -(N * SIZE) / 2;

// Display: MSB on the left.
const display = bits.slice().reverse();
const row = new NumRow({
  targetNode: svg, values: display, size: SIZE,
  x: X0, y: 30, label: `${b}_{(2)}`,
  labelGap: 40,
});

const expr = new sd.Math({
  targetNode: svg, text: "ans = 1",
  cx: 0, cy: -50,
  fontSize: 16, fill: C.darkGreen,
});

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  await sd.pause();

  let curExpr = "ans = 1";
  let mi = 1;
  for (let i = 0; i < N; i++) {
    const colIdx = N - i; // 1-based index from left
    if (bits[i] === 1) {
      curExpr = `${curExpr} \\cdot a^{${mi}}`;
      expr.startAnimate({ duration: 240, easing: E.easeOut }).setText(curExpr).endAnimate();
      row.paintCell(colIdx, "#e8f5e9", C.darkGreen, { duration: 200 });
    } else {
      row.paintCell(colIdx, "#f0f0f0", C.darkButtonGrey, { duration: 200 });
    }
    mi *= 2;
    await sd.pause();
  }
});
