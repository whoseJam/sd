import * as sd from "@/sd";

import {
  CORN,
  fadeIn,
  FERTILE,
  NEUTRAL,
  NEUTRAL_STROKE,
} from "../common/style";

const svg = sd.svg();

const N = 5;
const CELL = 40;
const GAP = 3;
const STEP = CELL + GAP;

const planted: (0 | 1)[] = [1, 0, 0, 1, 0];
const cells: sd.Rect[] = [];
const stars: (sd.Text | null)[] = [];
const bits: sd.Text[] = [];

for (let i = 0; i < N; i++) {
  const cx = (i - (N - 1) / 2) * STEP;
  const cy = 22;
  cells.push(
    new sd.Rect({
      targetNode: svg,
      x: cx - CELL / 2,
      y: cy - CELL / 2,
      width: CELL,
      height: CELL,
      fill: FERTILE,
      stroke: NEUTRAL_STROKE,
      strokeWidth: 1.2,
      opacity: 0,
    }),
  );
  stars.push(
    planted[i] === 1
      ? new sd.Text({
          targetNode: svg,
          text: "★",
          cx,
          cy,
          fontSize: 22,
          fill: CORN,
          opacity: 0,
        })
      : null,
  );
  bits.push(
    new sd.Text({
      targetNode: svg,
      text: String(planted[i]),
      cx,
      cy: -28,
      fontSize: 20,
      fill: NEUTRAL,
      opacity: 0,
    }),
  );
}

const stateLabel = new sd.Math({
  targetNode: svg,
  text: "S",
  cx: -((N + 1) / 2) * STEP,
  cy: -28,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});

sd.main(async () => {
  for (let i = 0; i < N; i++) fadeIn(cells[i], i * 35);
  for (let i = 0; i < N; i++) {
    if (stars[i]) fadeIn(stars[i]!, i * 35 + 100);
  }
  await sd.pause();

  fadeIn(stateLabel);
  for (let i = 0; i < N; i++) fadeIn(bits[i], i * 60 + 100);
  await sd.pause();
});
