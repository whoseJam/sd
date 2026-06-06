import * as sd from "@/sd";

import { CharRow } from "../lib/char-row";
import { Trie } from "../trie";

// Fail-chain marking: at each step, mark every node on the fail chain
// from the current AC state up to the root. With patterns
// {aba, ba, aa, bb, b} and text "abaa", every pattern that actually
// appears in the text gets marked (b and ba both end up tagged via the
// fail chain).

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const text = "abaa";
const trie = new Trie(svg, {
  patterns: ["aba", "ba", "aa", "bb", "b"],
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

for (let i = 1; i < trie.nodes.length; i++) {
  if (trie.nodes[i].isEnd)
    trie.nodes[i].circle.setStroke(C.darkGreen).setStrokeWidth(2.2);
}

const MARK_FILL = "#cfead0";
const MARK_STROKE = C.darkGreen;
const visited = new Set<number>();

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  row.fadeIn({ delay: 200 });
  await sd.pause();

  for (const step of trie.walk(text)) {
    row.paintCell(step.i, MARK_FILL, MARK_STROKE);
    // Mark the entire fail chain. Skip nodes already painted so the
    // same circle's fill doesn't get a second action in the same beat.
    for (const node of trie.failChain(step.to)) {
      if (node === 0) continue;
      if (visited.has(node)) continue;
      visited.add(node);
      trie.paintNode(node, MARK_FILL, MARK_STROKE);
    }
    await sd.pause();
  }

  void E;
});
