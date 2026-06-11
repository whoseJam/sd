import * as sd from "@/sd";

import {
  ACCENT,
  ACCENT_FILL,
  ACCENT_TEXT,
  fadeIn,
  fadeOpacity,
  NEUTRAL,
  NEUTRAL_FILL,
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

  const allArrows: sd.Path[] = [];

  for (let k = 0; k < P; k++) {
    setFill(right.cells[k].bg, ACCENT_FILL, 0);
    setFill(right.cells[k].index, ACCENT_TEXT, 40);

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
      const t = 0.18 + r * 0.045;
      const labelX = x1 + (x2 - x1) * t;
      const labelY = y1 + (y2 - y1) * t - 8;
      const label = new sd.Math({
        targetNode: svg,
        text: `S_${r}`,
        cx: labelX,
        cy: labelY,
        fontSize: 13,
        fill: ACCENT,
        opacity: 0,
      });
      fadeIn(path, r * 25);
      fadeIn(label, r * 25 + 40);
      arrows.push(path);
      labels.push(label);
    }
    await sd.pause();

    setFill(right.cells[k].bg, NEUTRAL_FILL, 0);
    setFill(right.cells[k].index, NEUTRAL, 40);
    for (const a of arrows) fadeOpacity(a, 0.16);
    for (const l of labels) fadeOpacity(l, 0);
    allArrows.push(...arrows);
    await sd.pause();
  }
});
