import * as sd from "@/sd";

import { AXIS_COLOR } from "../common/coord";

const svg = sd.svg();
const C = sd.color();
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
  initialText: sd.Math;
  finalText: sd.Math;
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
  const initialText = new sd.Math({
    targetNode: svg,
    text: `a_{${origIdx}}`,
    cx,
    cy,
    fontSize: 12,
    opacity: 0,
  });
  const finalText = new sd.Math({
    targetNode: svg,
    text: `y^{(${level})}_{${origIdx}}`,
    cx,
    cy,
    fontSize: 11,
    fill: C.darkOrange,
    opacity: 0,
  });
  return { rect, initialText, finalText };
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

const cellsByLevel: Cell[][] = LEVELS.map((blocks, level) => {
  const totalCount = blocks.reduce((s, b) => s + b.length, 0);
  const totalWidth = blockWidth(totalCount) + (blocks.length - 1) * 18;
  const startX = -totalWidth / 2;
  const result: Cell[] = [];
  let x = startX;
  for (const block of blocks) {
    const w = blockWidth(block.length);
    const center = x + w / 2;
    result.push(...placeBlock(center, LEVEL_CY[level], block, level));
    x += w + 18;
  }
  return result;
});

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

function fadeOut(
  node: sd.SDNode,
  opts: { delay?: number; duration?: number } = {},
) {
  node
    .startAnimate({
      delay: opts.delay ?? 0,
      duration: opts.duration ?? 200,
      easing: E.easeOut,
    })
    .setOpacity(0)
    .endAnimate();
}

function showLevel(level: number) {
  const cells = cellsByLevel[level];
  for (let i = 0; i < cells.length; i++) {
    fadeIn(cells[i].rect, { delay: i * 30 });
    fadeIn(cells[i].initialText, { delay: i * 30 + 60 });
  }
}

function relabelAll() {
  for (let level = 0; level < cellsByLevel.length; level++) {
    const cells = cellsByLevel[level];
    for (let i = 0; i < cells.length; i++) {
      const d = level * 80 + i * 25;
      fadeOut(cells[i].initialText, { delay: d });
      fadeIn(cells[i].finalText, { delay: d + 150 });
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
