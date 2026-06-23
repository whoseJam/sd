import * as sd from "@/sd";

import { AXIS_COLOR } from "../common/coord";

const svg = sd.svg();
const E = sd.easing();

const CELL_W = 36;
const CELL_H = 26;
const GAP = 3;

const LEVELS: number[][][] = [
  [[0, 1, 2, 3, 4, 5, 6, 7]],
  [
    [0, 2, 4, 6],
    [1, 3, 5, 7],
  ],
  [
    [0, 4],
    [2, 6],
    [1, 5],
    [3, 7],
  ],
  [[0], [4], [2], [6], [1], [5], [3], [7]],
];

const LEVEL_CY = [150, 70, -10, -90];

interface Cell {
  rect: sd.Rect;
  text: sd.Math;
  origIdx: number;
  level: number;
}

function makeCell(
  cx: number,
  cy: number,
  origIdx: number,
  level: number,
): Cell {
  const rect = new sd.Rect({
    targetNode: svg,
    cx,
    cy,
    width: CELL_W,
    height: CELL_H,
    fill: "none",
    stroke: AXIS_COLOR,
    strokeWidth: 1.1,
    opacity: 0,
  });
  const text = new sd.Math({
    targetNode: svg,
    text: `a_{${origIdx}}`,
    cx,
    cy,
    fontSize: 12,
    opacity: 0,
  });
  return { rect, text, origIdx, level };
}

function blockWidth(count: number): number {
  return count * CELL_W + (count - 1) * GAP;
}

function placeBlock(
  centerX: number,
  centerY: number,
  origIndices: number[],
  level: number,
): Cell[] {
  const w = blockWidth(origIndices.length);
  const x0 = centerX - w / 2 + CELL_W / 2;
  return origIndices.map((origIdx, i) =>
    makeCell(x0 + i * (CELL_W + GAP), centerY, origIdx, level),
  );
}

const cellsByLevel: Cell[][] = [];
const blockCentersByLevel: number[][] = [];

for (let level = 0; level < LEVELS.length; level++) {
  const blocks = LEVELS[level];
  const totalCount = blocks.reduce((s, b) => s + b.length, 0);
  const totalWidth = blockWidth(totalCount) + (blocks.length - 1) * 18;
  const startX = -totalWidth / 2;
  const cells: Cell[] = [];
  const centers: number[] = [];
  let x = startX;
  for (const block of blocks) {
    const w = blockWidth(block.length);
    const center = x + w / 2;
    centers.push(center);
    cells.push(...placeBlock(center, LEVEL_CY[level], block, level));
    x += w + 18;
  }
  cellsByLevel.push(cells);
  blockCentersByLevel.push(centers);
}

// Thin grey connectors from each parent block center to its two children.
// Pre-creating them as faint lines (revealed alongside each child level)
// makes the divide-and-conquer split visible without adding visual noise.
const connectors: sd.Line[][] = [];
for (let level = 1; level < LEVELS.length; level++) {
  const parentCenters = blockCentersByLevel[level - 1];
  const childCenters = blockCentersByLevel[level];
  const parentCy = LEVEL_CY[level - 1] - CELL_H / 2;
  const childCy = LEVEL_CY[level] + CELL_H / 2;
  const lines: sd.Line[] = [];
  for (let c = 0; c < childCenters.length; c++) {
    const parentIdx = Math.floor(c / 2);
    lines.push(
      new sd.Line({
        targetNode: svg,
        x1: parentCenters[parentIdx],
        y1: parentCy,
        x2: childCenters[c],
        y2: childCy,
        stroke: AXIS_COLOR,
        strokeWidth: 0.7,
        opacity: 0,
      }),
    );
  }
  connectors.push(lines);
}

function fadeIn(
  node: sd.SDNode,
  opts: { delay?: number; duration?: number } = {},
) {
  node
    .startAnimate({
      delay: opts.delay ?? 0,
      duration: opts.duration ?? 240,
      easing: E.easeOut,
    })
    .setOpacity(1)
    .endAnimate();
}

function showLevel(level: number) {
  if (level > 0) {
    const lines = connectors[level - 1];
    for (let i = 0; i < lines.length; i++) {
      fadeIn(lines[i], { delay: i * 20, duration: 200 });
    }
  }
  const cells = cellsByLevel[level];
  for (let i = 0; i < cells.length; i++) {
    fadeIn(cells[i].rect, { delay: i * 30 });
    fadeIn(cells[i].text, { delay: i * 30 + 60 });
  }
}

// Morph every cell's a_{i} text into its y^{(level)}_{i} form via setText
// on the same Math node — no second node to fade in over a faded-out
// first node.
function relabelAll() {
  for (let level = 0; level < cellsByLevel.length; level++) {
    const cells = cellsByLevel[level];
    for (let i = 0; i < cells.length; i++) {
      const d = level * 80 + i * 25;
      cells[i].text
        .startAnimate({ delay: d, duration: 320, easing: E.easeOut })
        .setText(`y^{(${cells[i].level})}_{${cells[i].origIdx}}`)
        .endAnimate();
    }
  }
}

sd.main(async () => {
  await sd.pause();
  showLevel(0);
  await sd.pause();
  showLevel(1);
  await sd.pause();
  showLevel(2);
  await sd.pause();
  showLevel(3);
  await sd.pause();
  relabelAll();
  await sd.pause();
});
