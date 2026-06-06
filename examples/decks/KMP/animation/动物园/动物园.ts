import * as sd from "@/sd";

import { FailTree } from "../fail-tree";

// num(i) = #borders of t[1..i] of length <= i/2. Geometrically: climb
// the failure tree from node i; the first ancestor whose length already
// fits (length <= i/2) gives num(i) = depth(ancestor) + 1 (the ancestor
// plus all of its further ancestors up to root, all of which are even
// shorter and so also valid).

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const pattern = "abcababc";
const QUERY = 8;
const HALF = Math.floor(QUERY / 2);

const SKIP_FILL = "#eeeeee";
const SKIP_STROKE = C.silver;
const KEEP_FILL = "#cfead0";
const KEEP_STROKE = C.darkGreen;
const QUERY_FILL = "#dde6ef";
const QUERY_STROKE = C.steelBlue;
const INK = C.darkButtonGrey;

const tree = new FailTree(svg, {
  pattern,
  x: -((pattern.length + 1) * 60) / 2 + 20,
  y: 0,
  layerWidth: 100,
  nodeRadius: 18,
  nodeGap: 56,
  rootLabel: "ε",
});

const cutoffLabel = new sd.Text({
  targetNode: svg,
  text: `i = ${QUERY},  i / 2 = ${HALF}`,
  cx: 0,
  cy: -180,
  fontSize: 18,
  fill: INK,
  opacity: 0,
});
const numLabel = new sd.Text({
  targetNode: svg,
  text: `num(${QUERY}) = ?`,
  cx: 0,
  cy: -210,
  fontSize: 18,
  fill: INK,
  opacity: 0,
});

sd.main(async () => {
  tree.fadeIn({ delay: 0, stagger: 80, duration: 300 });
  cutoffLabel
    .startAnimate({ delay: 700, duration: 300, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  numLabel
    .startAnimate({ delay: 800, duration: 300, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  tree.paintNode(QUERY, QUERY_FILL, QUERY_STROKE);
  await sd.pause();

  // Climb ancestors. For each step:
  //  - length > HALF  -> too long, skipped (greyed)
  //  - length <= HALF -> the answer; depth+1 is num(QUERY)
  const path = tree.ancestors(QUERY, 0);
  let result = -1;
  for (let k = 1; k < path.length; k++) {
    const idx = path[k];
    const isValid = idx <= HALF;
    tree.paintEdge(path[k - 1], isValid ? KEEP_STROKE : SKIP_STROKE, {
      delay: k * 220,
    });
    tree.paintNode(
      idx,
      isValid ? KEEP_FILL : SKIP_FILL,
      isValid ? KEEP_STROKE : SKIP_STROKE,
      {
        delay: k * 220 + 60,
        strokeWidth: isValid ? 2.6 : 1.2,
      },
    );
    if (isValid && result === -1) result = tree.nodes[idx].depth + 1;
  }
  await sd.pause();

  numLabel
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setText(`num(${QUERY}) = ${result}`, {
      [`num(${QUERY}) = `]: `num(${QUERY}) = `,
    })
    .endAnimate();
  await sd.pause();
});
