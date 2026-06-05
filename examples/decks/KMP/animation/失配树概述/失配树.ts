import * as sd from "@/sd";

import { CharRow } from "../char-row";
import { FailTree } from "../fail-tree";

// Intro: lay out the pattern as an indexed row, then below it the failure
// tree. Final beat highlights a single node's ancestor chain to read out
// "ancestors of i = borders of t[1..i]".

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const pattern = "abbabaabbabb";
const HIGHLIGHT = 12;

const CELL_SIZE = 30;
const ROW_X = -(pattern.length * CELL_SIZE) / 2;
const ROW_Y = 170;

const ROW_FILL = "#cfead0";
const ROW_STROKE = C.darkGreen;
const TREE_HL_FILL = "#cfead0";
const TREE_HL_STROKE = C.darkGreen;
const TREE_EDGE_HL = C.darkGreen;
const INK = C.darkButtonGrey;

const row = new CharRow({
  targetNode: svg,
  text: pattern,
  size: CELL_SIZE,
  x: ROW_X,
  y: ROW_Y,
  label: "t",
});

// Index labels above each cell (1..n).
const indexLabels: sd.Text[] = [];
for (let i = 1; i <= pattern.length; i++) {
  indexLabels.push(
    new sd.Text({
      targetNode: row.group,
      text: String(i),
      cx: row.cellCx(i),
      cy: ROW_Y + CELL_SIZE + 12,
      fontSize: 12,
      fill: INK,
      opacity: 0,
    }),
  );
}

const tree = new FailTree(svg, {
  pattern,
  x: -((pattern.length + 1) * 40) / 2 + 20,
  y: -40,
  layerWidth: 60,
  nodeRadius: 16,
  nodeGap: 36,
  rootLabel: "ε",
});

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  for (let i = 0; i < indexLabels.length; i++) {
    indexLabels[i]
      .startAnimate({ delay: 40 + i * 22, duration: 300, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  // Tree builds out layer by layer in the same beat — the slide's quiet
  // initial state already shows row + tree, so the viewer reads the
  // structure before any key press.
  tree.fadeIn({ delay: 360, stagger: 120, duration: 320 });
  await sd.pause();

  // Spotlight: ancestor chain from HIGHLIGHT to root reads off all the
  // borders of t[1..HIGHLIGHT]. Paint nodes and edges along the path.
  const path = tree.ancestors(HIGHLIGHT, 0);
  for (let k = 0; k < path.length; k++) {
    const idx = path[k];
    tree.paintNode(idx, TREE_HL_FILL, TREE_HL_STROKE, { delay: k * 200 });
    if (k > 0) {
      // The edge from path[k-1] up to path[k] (child = path[k-1]).
      tree.paintEdge(path[k - 1], TREE_EDGE_HL, { delay: k * 200 });
    }
    // Same prefix highlighted in the string row.
    if (idx > 0) row.paintCell(idx, ROW_FILL, ROW_STROKE, { delay: k * 200 });
  }
  await sd.pause();
});
