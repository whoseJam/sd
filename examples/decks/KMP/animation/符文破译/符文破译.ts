import * as sd from "@/sd";

import { CharRow } from "../char-row";
import { FailTree } from "../fail-tree";

// Decomposition view. Each greedy segment of S is one T-prefix; on the
// failure tree, picking that prefix means selecting the ancestor chain
// from node i down to root. The animation paints each segment of S, the
// matching cell range in T, and the corresponding ancestor chain in the
// tree, beat by beat.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const tStr = "ababc";
const sStr = "ababcababcab";

// Greedy decomposition: each entry is (sStart, sEnd, prefixLen of T).
const segments: Array<{ s0: number; s1: number; tLen: number }> = [
  { s0: 1, s1: 5, tLen: 5 },
  { s0: 6, s1: 10, tLen: 5 },
  { s0: 11, s1: 12, tLen: 2 },
];

const PALETTE: Array<{ fill: sd.SDColor; stroke: sd.SDColor }> = [
  { fill: "#cfead0", stroke: C.darkGreen },
  { fill: "#dde6ef", stroke: C.steelBlue },
  { fill: "#fce4a0", stroke: C.darkOrange },
];

const T_SIZE = 30;
const S_SIZE = 26;
const T_X = -(tStr.length * T_SIZE) / 2;
const S_X = -(sStr.length * S_SIZE) / 2;
const T_Y = 100;
const S_Y = -130;

const tRow = new CharRow({
  targetNode: svg,
  text: tStr,
  size: T_SIZE,
  x: T_X,
  y: T_Y,
  label: "T",
});

const sRow = new CharRow({
  targetNode: svg,
  text: sStr,
  size: S_SIZE,
  x: S_X,
  y: S_Y,
  label: "S",
});

const tree = new FailTree(svg, {
  pattern: tStr,
  x: -((tStr.length + 1) * 60) / 2 + 20,
  y: -10,
  layerWidth: 80,
  nodeRadius: 16,
  nodeGap: 40,
  rootLabel: "ε",
});

const countLabel = new sd.Text({
  targetNode: svg,
  text: "segments: 0",
  cx: S_X + (sStr.length * S_SIZE) / 2,
  cy: S_Y - 30,
  fontSize: 16,
  fill: C.darkButtonGrey,
  opacity: 0,
});

sd.main(async () => {
  tRow.fadeIn({ delay: 0 });
  tree.fadeIn({ delay: 220, stagger: 70, duration: 280 });
  sRow.fadeIn({ delay: 400 });
  countLabel
    .startAnimate({ delay: 700, duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();

  for (let segIdx = 0; segIdx < segments.length; segIdx++) {
    const seg = segments[segIdx];
    const colour = PALETTE[segIdx % PALETTE.length];

    // S cells of this segment.
    for (let k = seg.s0; k <= seg.s1; k++) {
      sRow.paintCell(k, colour.fill, colour.stroke, {
        delay: (k - seg.s0) * 40,
      });
    }
    // T cells that match this prefix.
    for (let k = 1; k <= seg.tLen; k++) {
      tRow.paintCell(k, colour.fill, colour.stroke, { delay: (k - 1) * 40 });
    }
    // Tree ancestor chain for the prefix node.
    const chain = tree.ancestors(seg.tLen, 0);
    for (let k = 0; k < chain.length; k++) {
      const u = chain[k];
      tree.paintNode(u, colour.fill, colour.stroke, { delay: k * 100 });
      if (k > 0)
        tree.paintEdge(chain[k - 1], colour.stroke, { delay: k * 100 });
    }
    countLabel
      .startAnimate({ delay: 160, duration: 280, easing: E.easeOut })
      .setText(`segments: ${segIdx + 1}`, { "segments: ": "segments: " })
      .endAnimate();
    await sd.pause();
  }
});
