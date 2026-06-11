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

const P = 6;
const LEFT_CX = -110;
const RIGHT_CX = 110;

const left = makeVector(svg, {
  n: P,
  cx: LEFT_CX,
  labelTeX: "f_i",
  indexSide: "l",
});
const right = makeVector(svg, {
  n: P,
  cx: RIGHT_CX,
  labelTeX: "f_{i+1}",
  indexSide: "r",
});

sd.main(async () => {
  fadeInVector(left, 0);
  fadeInVector(right, 120);
  await sd.pause();

  let prevArrows: sd.Path[] = [];
  let prevLabels: sd.Math[] = [];
  let prevTarget: number | null = null;

  for (let k = 0; k < P; k++) {
    if (prevTarget !== null) {
      setFill(right.cells[prevTarget].bg, "#fdecd9", 0);
      setFill(right.cells[prevTarget].index, NEUTRAL, 0);
    }
    for (const a of prevArrows) fadeOpacity(a, 0.18);
    for (const l of prevLabels) fadeOpacity(l, 0.0);

    setFill(right.cells[k].bg, ACCENT_FILL, 60);
    setFill(right.cells[k].index, ACCENT_TEXT, 100);

    const arrows: sd.Path[] = [];
    const labels: sd.Math[] = [];
    for (let r = 0; r < P; r++) {
      const j = (k - r + P) % P;
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
      const t = 0.5 + r * 0.04;
      const midX = x1 + (x2 - x1) * t;
      const midY = y1 + (y2 - y1) * t;
      const label = new sd.Math({
        targetNode: svg,
        text: `S_${r}`,
        cx: midX,
        cy: midY - 8,
        fontSize: 13,
        fill: ACCENT,
        opacity: 0,
      });
      fadeIn(path, r * 30);
      fadeIn(label, r * 30 + 60);
      arrows.push(path);
      labels.push(label);
    }

    prevArrows = [...prevArrows, ...arrows];
    prevLabels = labels;
    prevTarget = k;
    await sd.pause();
  }

  for (const a of prevArrows) fadeOpacity(a, 0.18);
  for (const l of prevLabels) fadeOpacity(l, 0);
  setFill(right.cells[prevTarget!].bg, "#fdecd9", 0);
  setFill(right.cells[prevTarget!].index, NEUTRAL, 0);
  await sd.pause();
});
