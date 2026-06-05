import * as sd from "@/sd";

import { NumRow } from "../lib/num-row";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// For different mx, show how many segments greedy yields.
const data = [4, 2, 4, 5, 1, 6, 4, 5, 9, 4];
const N = data.length;
const SIZE = 38;
const X0 = -(N * SIZE) / 2;

const row = new NumRow({
  targetNode: svg, values: data, size: SIZE,
  x: X0, y: 0,
});

const mxLabel = new sd.Math({
  targetNode: svg,
  text: "mx = ?",
  cx: 0, cy: row.top() + 30,
  fontSize: 16, fill: C.darkButtonGrey,
  opacity: 0,
});
const segLabel = new sd.Math({
  targetNode: svg,
  text: "segments = ?",
  cx: 0, cy: row.top() + 54,
  fontSize: 14, fill: C.darkOrange,
  opacity: 0,
});

function segmentCount(limit: number): number[] {
  const cuts: number[] = [];
  let s = 0;
  for (let i = 0; i < N; i++) {
    if (data[i] > limit) return [-1];
    if (s + data[i] > limit) { cuts.push(i); s = data[i]; }
    else s += data[i];
  }
  return cuts;
}

const tries = [7, 9, 11];

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  mxLabel.startAnimate({ delay: 400, duration: 240, easing: E.easeOut }).setOpacity(1).endAnimate();
  segLabel.startAnimate({ delay: 400, duration: 240, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();

  for (const limit of tries) {
    mxLabel.startAnimate({ duration: 200 }).setText(`mx = ${limit}`).endAnimate();
    const cuts = segmentCount(limit);
    const lines: sd.Line[] = [];
    for (let k = 0; k < cuts.length; k++) {
      const cx = row.cellLeft(cuts[k] + 1);
      const ln = new sd.Line({
        targetNode: svg,
        x1: cx, y1: row.bottom() - 6,
        x2: cx, y2: row.top() + 6,
        stroke: C.darkOrange, strokeWidth: 2.2, opacity: 0,
      });
      ln.startAnimate({ delay: k * 60, duration: 220, easing: E.easeOut }).setOpacity(1).endAnimate();
      lines.push(ln);
    }
    segLabel.startAnimate({ delay: 200, duration: 200 }).setText(`segments = ${cuts.length + 1}`).endAnimate();
    await sd.pause();
    for (const ln of lines) ln.startAnimate({ duration: 180 }).setOpacity(0).endAnimate();
  }
});
