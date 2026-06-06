import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";
import { Trie } from "../trie";

// Pattern-count variant. Trie {aba, ba, aab, abab}. At each step we
// land on a node and increment its visit count via paint intensity;
// final per-pattern count comes from the fail subtree sum, shown in
// the slide narrative.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const text = "ababaab";
const trie = new Trie(svg, {
  patterns: ["aba", "ba", "aab", "abab"],
  cx: 0,
  topY: 110,
  layerHeight: 50,
  nodeRadius: 14,
});
trie.buildFail();

const FAIL_INK = "#c08fbf";
for (let i = 1; i < trie.nodes.length; i++) {
  trie
    .failLink(i, trie.fail[i], { stroke: FAIL_INK, bending: 0.3 })
    .setOpacity(1);
}

const SIZE = 28;
const row = new CharRow({
  targetNode: svg,
  text,
  size: SIZE,
  x: -(text.length * SIZE) / 2,
  y: -80,
  label: "s",
});

const ACTIVE_FILL = "#dde6ef";
const ACTIVE_STROKE = C.steelBlue;

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  row.fadeIn({ delay: 200 });
  await sd.pause();

  for (const step of trie.walk(text)) {
    trie.paintNode(step.to, ACTIVE_FILL, ACTIVE_STROKE);
    row.paintCell(step.i, ACTIVE_FILL, ACTIVE_STROKE);
    await sd.pause();
  }

  void E;
});
