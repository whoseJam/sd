import * as sd from "@/sd";

import { Trie } from "../trie";

// Background motivation: AC matching has to walk fail edges when the
// current node has no child for the next char. Pre-computing those
// "what next" answers is the whole trie-graph idea. This anim sets the
// scene with a single mismatch beat.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const trie = new Trie(svg, {
  patterns: ["abab", "babb"],
  cx: 0,
  topY: 0,
  layerHeight: 60,
  nodeRadius: 14,
});
trie.buildFail();

const FAIL_INK = "#c08fbf";
for (let i = 1; i < trie.nodes.length; i++) {
  trie
    .failLink(i, trie.fail[i], { stroke: FAIL_INK, bending: 0.3 })
    .setOpacity(1);
}

// Pick a node and a missing-char scenario for illustration: node "abab"
// has no 'a' child; on input 'a' we have to fail-jump.
const TARGET = trie.nodes.findIndex((n) => n.prefix === "abab");
const NEXT = trie.fail[TARGET];
const HL_FILL = "#dde6ef";
const HL_STROKE = C.steelBlue;
const TARGET_FILL = "#fce4a0";
const TARGET_STROKE = C.darkOrange;

sd.main(async () => {
  trie.fadeIn({ delay: 0 });
  await sd.pause();

  trie.paintNode(TARGET, TARGET_FILL, TARGET_STROKE);
  await sd.pause();

  trie.paintNode(NEXT, HL_FILL, HL_STROKE);
  await sd.pause();

  void E;
});
