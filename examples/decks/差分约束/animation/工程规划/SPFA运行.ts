import * as sd from "@/sd";

import { Dag } from "../common/dag";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NODE_R = 18;

const nodes = [
  { id: 1, cx: -150, cy: 40, label: "1" },
  { id: 2, cx: -20, cy: 95, label: "2" },
  { id: 3, cx: -20, cy: -15, label: "3" },
  { id: 4, cx: 130, cy: 40, label: "4" },
];
const edges: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
];
const edgeWeights: Record<string, number> = {
  "1-2": 3,
  "1-3": 4,
  "2-4": 4,
  "3-4": 5,
};
const edgeWeightPos: Record<string, { cx: number; cy: number }> = {
  "1-2": { cx: -82, cy: 78 },
  "1-3": { cx: -82, cy: 4 },
  "2-4": { cx: 60, cy: 78 },
  "3-4": { cx: 60, cy: 4 },
};

const dag = new Dag({ targetNode: svg, nodes, edges, radius: NODE_R });

const weightMaths: Record<string, sd.Math> = {};
for (const [u, v] of edges) {
  const key = `${u}-${v}`;
  const p = edgeWeightPos[key];
  weightMaths[key] = new sd.Math({
    targetNode: svg,
    text: String(edgeWeights[key]),
    cx: p.cx,
    cy: p.cy,
    fontSize: 13,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
}

const CELL_W = 38;
const CELL_H = 28;
const GAP = 4;
const ROW_CY = -90;
const ROW_LEFT = -((4 * CELL_W + 3 * GAP) / 2) + CELL_W / 2;

interface DisCell {
  rect: sd.Rect;
  label: sd.Math;
  value: sd.Math;
  idx: number;
}

function makeCell(idx: number, init: string): DisCell {
  const cx = ROW_LEFT + idx * (CELL_W + GAP);
  const rect = new sd.Rect({
    targetNode: svg,
    cx,
    cy: ROW_CY,
    width: CELL_W,
    height: CELL_H,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1,
    opacity: 0,
  });
  const label = new sd.Math({
    targetNode: svg,
    text: `\\text{dis}_{${idx + 1}}`,
    cx,
    cy: ROW_CY - CELL_H / 2 - 12,
    fontSize: 11,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  const value = new sd.Math({
    targetNode: svg,
    text: init,
    cx,
    cy: ROW_CY,
    fontSize: 14,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  return { rect, label, value, idx };
}

const cells = [
  makeCell(0, "0"),
  makeCell(1, "-\\infty"),
  makeCell(2, "-\\infty"),
  makeCell(3, "-\\infty"),
];

function fade(el: sd.SDNode, delay: number, dur = 260) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function highlightNode(id: number, delay: number) {
  dag.paint(id, C.darkOrange, C.darkOrange, { delay });
}

function unhighlightNode(id: number, delay: number) {
  dag.paint(id, C.white, C.darkButtonGrey, { delay });
}

function updateCell(idx: number, text: string, delay: number) {
  const cell = cells[idx];
  cell.rect
    .startAnimate({ delay, duration: 220, easing: E.easeOut })
    .setFill("#fdecd9")
    .setStroke(C.darkOrange)
    .endAnimate();
  cell.value
    .startAnimate({ delay: delay + 80, duration: 200 })
    .setOpacity(0)
    .endAnimate();
  cell.value
    .startAnimate({ delay: delay + 280, duration: 220, easing: E.easeOut })
    .setText(text)
    .setFill(C.darkOrange)
    .setCx(ROW_LEFT + idx * (CELL_W + GAP))
    .setCy(ROW_CY)
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  dag.fadeIn({ delay: 0, stagger: 50 });
  let d = 320;
  for (const k of Object.keys(weightMaths)) {
    fade(weightMaths[k], d);
    d += 50;
  }
  for (const c of cells) {
    fade(c.rect, d);
    fade(c.label, d + 60);
    fade(c.value, d + 120);
    d += 50;
  }
  await sd.pause();

  highlightNode(1, 0);
  dag.paintEdge(1, 2, C.steelBlue, { delay: 220 });
  updateCell(1, "3", 320);
  dag.paintEdge(1, 3, C.steelBlue, { delay: 540 });
  updateCell(2, "4", 640);
  await sd.pause();

  unhighlightNode(1, 0);
  highlightNode(2, 0);
  dag.paintEdge(2, 4, C.steelBlue, { delay: 220 });
  updateCell(3, "7", 320);
  await sd.pause();

  unhighlightNode(2, 0);
  highlightNode(3, 0);
  dag.paintEdge(3, 4, C.steelBlue, { delay: 220 });
  updateCell(3, "9", 320);
  await sd.pause();

  unhighlightNode(3, 0);
  highlightNode(4, 0);
  await sd.pause();
});
