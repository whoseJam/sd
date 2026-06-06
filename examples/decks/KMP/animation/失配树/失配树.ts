import * as sd from "@/sd";

import { FailTree } from "../fail-tree";

// LCA-query visualization. Two query nodes (i, j) walk up their ancestor
// chains; the first shared node is the LCA — by definition the longest
// common border of t[1..i] and t[1..j].

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const pattern = "aaaabbabbaa";
const QUERY_I = 4;
const QUERY_J = 11;

const Q_COLORS: Record<string, { fill: sd.SDColor; stroke: sd.SDColor }> = {
  i: { fill: "#cfead0", stroke: C.darkGreen },
  j: { fill: "#f4cfcf", stroke: C.darkRed },
  lca: { fill: "#fce4a0", stroke: C.darkOrange },
};

const tree = new FailTree(svg, {
  pattern,
  x: -((pattern.length + 1) * 50) / 2 + 25,
  y: 0,
  layerWidth: 90,
  nodeRadius: 18,
  nodeGap: 50,
  rootLabel: "ε",
});

// Query label readout in the corner.
const queryLabel = new sd.Text({
  targetNode: svg,
  text: `LCA(${QUERY_I}, ${QUERY_J}) = ?`,
  cx: 0,
  cy: -((pattern.length + 1) * 50) / 2 - 30,
  fontSize: 18,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  tree.fadeIn({ delay: 0, stagger: 90, duration: 300 });
  queryLabel
    .startAnimate({ delay: 800, duration: 300, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  // Spotlight the two query nodes.
  tree.paintNode(QUERY_I, Q_COLORS.i.fill, Q_COLORS.i.stroke);
  tree.paintNode(QUERY_J, Q_COLORS.j.fill, Q_COLORS.j.stroke);
  await sd.pause();

  // Walk path from QUERY_I upward.
  const pathI = tree.ancestors(QUERY_I, 0);
  for (let k = 1; k < pathI.length; k++) {
    const idx = pathI[k];
    tree.paintEdge(pathI[k - 1], Q_COLORS.i.stroke, { delay: k * 160 });
    tree.paintNode(idx, Q_COLORS.i.fill, Q_COLORS.i.stroke, {
      delay: k * 160 + 40,
    });
  }
  await sd.pause();

  // Walk path from QUERY_J upward; the first node already painted in
  // pathI is the LCA. Paint shared edges in the j color first; the LCA
  // itself then gets the merged "LCA" colour after the next beat.
  const pathJ = tree.ancestors(QUERY_J, 0);
  const onPathI = new Set(pathI);
  let lcaIdx = -1;
  for (let k = 1; k < pathJ.length; k++) {
    const idx = pathJ[k];
    tree.paintEdge(pathJ[k - 1], Q_COLORS.j.stroke, { delay: k * 160 });
    if (lcaIdx === -1 && onPathI.has(idx)) {
      lcaIdx = idx;
    }
    if (lcaIdx === -1 || idx !== lcaIdx) {
      tree.paintNode(idx, Q_COLORS.j.fill, Q_COLORS.j.stroke, {
        delay: k * 160 + 40,
      });
    }
  }
  await sd.pause();

  // Crown the LCA.
  if (lcaIdx >= 0) {
    tree.paintNode(lcaIdx, Q_COLORS.lca.fill, Q_COLORS.lca.stroke, {
      duration: 360,
      strokeWidth: 3,
    });
    queryLabel
      .startAnimate({ delay: 200, duration: 320, easing: E.easeOut })
      .setText(`LCA(${QUERY_I}, ${QUERY_J}) = ${lcaIdx}`, {
        [`LCA(${QUERY_I}, ${QUERY_J}) = `]: `LCA(${QUERY_I}, ${QUERY_J}) = `,
      })
      .endAnimate();
  }
  await sd.pause();
});
