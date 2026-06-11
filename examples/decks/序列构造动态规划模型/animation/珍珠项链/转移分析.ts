import * as sd from "@/sd";

import {
  ACCENT,
  ACCENT_FILL,
  ACCENT_TEXT,
  fadeIn,
  fadeOpacity,
  NEUTRAL,
  setFill,
} from "../common/style";
import { fadeInVector, makeVector, V_CELL_W } from "../common/vector";

const svg = sd.svg();

const K = 5;
const N = K + 1;
const LEFT_CX = -110;
const RIGHT_CX = 110;

const left = makeVector(svg, {
  n: N,
  cx: LEFT_CX,
  labelTeX: "f_i",
  indexSide: "l",
});
const right = makeVector(svg, {
  n: N,
  cx: RIGHT_CX,
  labelTeX: "f_{i+1}",
  indexSide: "r",
});

sd.main(async () => {
  fadeInVector(left, 0);
  fadeInVector(right, 120);
  await sd.pause();

  const allArrows: sd.Path[] = [];
  let prevLabels: sd.Math[] = [];
  let prevTarget: number | null = null;

  for (let k = 0; k <= K; k++) {
    if (prevTarget !== null) {
      setFill(right.cells[prevTarget].bg, "#fdecd9", 0);
      setFill(right.cells[prevTarget].index, NEUTRAL, 0);
    }
    for (const l of prevLabels) fadeOpacity(l, 0);

    setFill(right.cells[k].bg, ACCENT_FILL, 60);
    setFill(right.cells[k].index, ACCENT_TEXT, 100);

    const labels: sd.Math[] = [];
    const drawArrow = (j: number, weight: string) => {
      const x1 = LEFT_CX + V_CELL_W / 2;
      const y1 = left.cyOf(j);
      const x2 = RIGHT_CX - V_CELL_W / 2;
      const y2 = right.cyOf(k);
      const path = new sd.Path({
        targetNode: svg,
        d: `M ${x1} ${y1} L ${x2} ${y2}`,
        stroke: ACCENT,
        strokeWidth: 1.4,
        fill: "none",
        opacity: 0,
      });
      const midX = x1 + (x2 - x1) * 0.55;
      const midY = y1 + (y2 - y1) * 0.55;
      const label = new sd.Math({
        targetNode: svg,
        text: weight,
        cx: midX,
        cy: midY - 10,
        fontSize: 13,
        fill: ACCENT,
        opacity: 0,
      });
      fadeIn(path);
      fadeIn(label, 60);
      allArrows.push(path);
      labels.push(label);
    };

    drawArrow(k, String(k));
    if (k > 0) drawArrow(k - 1, `${K}-${k - 1}`);

    prevLabels = labels;
    prevTarget = k;
    await sd.pause();
  }

  for (const a of allArrows) fadeOpacity(a, 0.18);
  for (const l of prevLabels) fadeOpacity(l, 0);
  setFill(right.cells[prevTarget!].bg, "#fdecd9", 0);
  setFill(right.cells[prevTarget!].index, NEUTRAL, 0);
  await sd.pause();
});
