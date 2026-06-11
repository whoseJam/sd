import * as sd from "@/sd";

import { fadeIn, INVALID, NEUTRAL_STROKE, setFill } from "../common/style";

const svg = sd.svg();

const N = 3;
const CELL = 24;
const GAP = 2;
const GROUP_GAP = 16;
const STEP_INSIDE = CELL + GAP;
const GROUP_W = N * CELL + (N - 1) * GAP;

const total = 1 << N;
const cyGood = 22;
const cyBad = -22;

function isValid(S: number): boolean {
  return (S & (S >> 1)) === 0;
}

const states = Array.from({ length: total }, (_, S) => S);
const validList = states.filter(isValid);
const invalidList = states.filter((S) => !isValid(S));

interface BitGroup {
  cells: sd.Rect[];
  texts: sd.Text[];
  cross: sd.Path | null;
  cx: number;
}

function makeGroup(S: number, cx: number, cy: number, bad: boolean): BitGroup {
  const cells: sd.Rect[] = [];
  const texts: sd.Text[] = [];
  for (let i = 0; i < N; i++) {
    const bit = (S >> (N - 1 - i)) & 1;
    const xc = cx + (i - (N - 1) / 2) * STEP_INSIDE;
    cells.push(
      new sd.Rect({
        targetNode: svg,
        x: xc - CELL / 2,
        y: cy - CELL / 2,
        width: CELL,
        height: CELL,
        fill: "#fdecd9",
        stroke: NEUTRAL_STROKE,
        strokeWidth: 1.1,
        opacity: 0,
      }),
    );
    texts.push(
      new sd.Text({
        targetNode: svg,
        text: String(bit),
        cx: xc,
        cy,
        fontSize: 13,
        fill: NEUTRAL_STROKE,
        opacity: 0,
      }),
    );
  }
  let cross: sd.Path | null = null;
  if (bad) {
    const halfW = GROUP_W / 2;
    cross = new sd.Path({
      targetNode: svg,
      d: `M ${cx - halfW} ${cy} L ${cx + halfW} ${cy}`,
      stroke: INVALID,
      strokeWidth: 2,
      fill: "none",
      opacity: 0,
    });
  }
  return { cells, texts, cross, cx };
}

const slotStep = GROUP_W + GROUP_GAP;
const validStartX = -((validList.length - 1) / 2) * slotStep;
const invalidStartX = -((invalidList.length - 1) / 2) * slotStep;

const goodGroups = validList.map((S, i) =>
  makeGroup(S, validStartX + i * slotStep, cyGood, false),
);
const badGroups = invalidList.map((S, i) =>
  makeGroup(S, invalidStartX + i * slotStep, cyBad, true),
);

const goodLabel = new sd.Math({
  targetNode: svg,
  text: "\\text{合法}",
  cx: validStartX - slotStep * 0.7,
  cy: cyGood,
  fontSize: 14,
  fill: NEUTRAL_STROKE,
  opacity: 0,
});
const badLabel = new sd.Math({
  targetNode: svg,
  text: "\\text{非法}",
  cx: invalidStartX - slotStep * 0.7,
  cy: cyBad,
  fontSize: 14,
  fill: INVALID,
  opacity: 0,
});

sd.main(async () => {
  fadeIn(goodLabel);
  fadeIn(badLabel);
  for (let i = 0; i < goodGroups.length; i++) {
    const g = goodGroups[i];
    for (let k = 0; k < N; k++) {
      fadeIn(g.cells[k], 60 + i * 80 + k * 25);
      fadeIn(g.texts[k], 90 + i * 80 + k * 25);
    }
  }
  for (let i = 0; i < badGroups.length; i++) {
    const g = badGroups[i];
    for (let k = 0; k < N; k++) {
      fadeIn(g.cells[k], 60 + i * 80 + k * 25);
      fadeIn(g.texts[k], 90 + i * 80 + k * 25);
    }
  }
  await sd.pause();

  for (let i = 0; i < badGroups.length; i++) {
    const g = badGroups[i];
    fadeIn(g.cross!, i * 120);
    for (const t of g.texts) setFill(t, INVALID, i * 120);
  }
  await sd.pause();
});
