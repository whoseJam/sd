import * as sd from "@/sd";

import { CharRow } from "../../../KMP/animation/char-row";
import { FailTree } from "../../../KMP/animation/fail-tree";

// Single-string KMP fail tree: string row up top, fail tree below.
// Mirrors the AC trie+fail layout on the other half of the slide so
// the contrast reads at a glance.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const pattern = "abbabaab";
const SIZE = 28;
const ROW_X = -((pattern.length + 0) * SIZE) / 2;
const ROW_Y = 110;

const row = new CharRow({
  targetNode: svg,
  text: pattern,
  size: SIZE,
  x: ROW_X,
  y: ROW_Y,
  label: "s",
});

const indexLabels: sd.Text[] = [];
for (let i = 1; i <= pattern.length; i++) {
  indexLabels.push(
    new sd.Text({
      targetNode: row.group,
      text: String(i),
      cx: row.cellCx(i),
      cy: ROW_Y + SIZE + 10,
      fontSize: 11,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

const tree = new FailTree(svg, {
  pattern,
  x: -((pattern.length + 1) * 36) / 2 + 20,
  y: -30,
  layerWidth: 50,
  nodeRadius: 13,
  nodeGap: 30,
  rootLabel: "ε",
});

sd.main(async () => {
  row.fadeIn({ delay: 0 });
  for (let i = 0; i < indexLabels.length; i++) {
    indexLabels[i]
      .startAnimate({ delay: 40 + i * 20, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  tree.fadeIn({ delay: 360, stagger: 100, duration: 280 });
  await sd.pause();
});
